import fs from "node:fs";
import path from "node:path";

import { createClient } from "@libsql/client";

const projectRoot = process.cwd();

const readLocalEnv = () => {
  const envPath = path.join(projectRoot, ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) {
      continue;
    }
    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

const splitSqlStatements = (sqlText) =>
  sqlText
    .split(/;\s*(?:\r?\n|$)/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

const run = async () => {
  readLocalEnv();

  const dbUrl = process.env.TURSO_DATABASE_URL;
  if (!dbUrl) {
    throw new Error("TURSO_DATABASE_URL is missing. Configure it in .env.local or environment variables.");
  }

  const client = createClient({
    url: dbUrl,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const schemaSql = fs.readFileSync(path.join(projectRoot, "sql", "schema_sqlite.sql"), "utf8");
  const seedSql = fs.readFileSync(path.join(projectRoot, "sql", "seed_sqlite.sql"), "utf8");

  const statements = [...splitSqlStatements(schemaSql), ...splitSqlStatements(seedSql)];

  for (const statement of statements) {
    await client.execute(statement);
  }

  console.log(`Turso database initialized with ${statements.length} statements.`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
