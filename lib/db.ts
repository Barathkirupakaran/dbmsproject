import { createClient, type Client, type InValue } from "@libsql/client";

let cachedClient: Client | null = null;

const assertDatabaseUrl = (): string => {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set. Add it in your environment variables.");
  }
  return url;
};

const createDbClient = (): Client =>
  createClient({
    url: assertDatabaseUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN
  });

export const getClient = (): Client => {
  if (!cachedClient) {
    cachedClient = createDbClient();
  }
  return cachedClient;
};

const toArgs = (params: unknown[]): InValue[] => params as InValue[];

export const dbAll = async (sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> => {
  const result = await getClient().execute({
    sql,
    args: toArgs(params)
  });

  return result.rows.map((row) => ({ ...row })) as Record<string, unknown>[];
};

export const dbRun = async (
  sql: string,
  params: unknown[] = []
): Promise<{ rowsAffected: number; lastInsertRowid: number | null }> => {
  const result = await getClient().execute({
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
