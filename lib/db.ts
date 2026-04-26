import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient, type Client, type InValue } from "@libsql/client";

let cachedClient: Client | null = null;
let fallbackInitPromise: Promise<void> | null = null;
let fallbackReady = false;

const FALLBACK_DB_URL = "file:/tmp/microbusiness.db";

const getConfiguredDatabaseUrl = (): string => process.env.TURSO_DATABASE_URL?.trim() || FALLBACK_DB_URL;

const isUsingFallbackDb = (): boolean => !process.env.TURSO_DATABASE_URL?.trim();

export const getDbMode = (): "turso" | "fallback_sqlite" => (isUsingFallbackDb() ? "fallback_sqlite" : "turso");

const splitSqlStatements = (sqlText: string): string[] =>
  sqlText
    .split(/;\s*(?:\r?\n|$)/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

const createDbClient = (): Client =>
  createClient({
    url: getConfiguredDatabaseUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN
  });

const ensureFallbackInitialized = async (client: Client): Promise<void> => {
  if (!isUsingFallbackDb() || fallbackReady) {
    return;
  }

  if (!fallbackInitPromise) {
    fallbackInitPromise = (async () => {
      const tableCheck = await client.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'entrepreneur'"
      );
      if (tableCheck.rows.length > 0) {
        fallbackReady = true;
        return;
      }

      const projectRoot = process.cwd();
      const [schemaSql, seedSql] = await Promise.all([
        readFile(path.join(projectRoot, "sql", "schema_sqlite.sql"), "utf8"),
        readFile(path.join(projectRoot, "sql", "seed_sqlite.sql"), "utf8")
      ]);

      const statements = [...splitSqlStatements(schemaSql), ...splitSqlStatements(seedSql)];
      for (const statement of statements) {
        await client.execute(statement);
      }

      fallbackReady = true;
    })().finally(() => {
      fallbackInitPromise = null;
    });
  }

  await fallbackInitPromise;
};

export const getClient = async (): Promise<Client> => {
  if (!cachedClient) {
    cachedClient = createDbClient();
  }

  await ensureFallbackInitialized(cachedClient);
  return cachedClient;
};

const toArgs = (params: unknown[]): InValue[] => params as InValue[];

export const dbAll = async (sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> => {
  const client = await getClient();
  const result = await client.execute({
    sql,
    args: toArgs(params)
  });

  return result.rows.map((row) => ({ ...row })) as Record<string, unknown>[];
};

export const dbRun = async (
  sql: string,
  params: unknown[] = []
): Promise<{ rowsAffected: number; lastInsertRowid: number | null }> => {
  const client = await getClient();
  const result = await client.execute({
    sql,
    args: toArgs(params)
  });

  return {
    rowsAffected: Number(result.rowsAffected ?? 0),
    lastInsertRowid:
      result.lastInsertRowid !== undefined && result.lastInsertRowid !== null
        ? Number(result.lastInsertRowid)
        : null
  };
};
