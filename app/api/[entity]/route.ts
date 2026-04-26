import { NextRequest, NextResponse } from "next/server";

import { dbAll, dbRun } from "@/lib/db";
import { getPrimaryColumn, getPrimaryKeyValuesFromBody, buildInsertPayload } from "@/lib/records";
import { getEntity } from "@/lib/schema";

const findEntityOrError = (entityKey: string) => {
  const entity = getEntity(entityKey);
  if (!entity) {
    throw new Error("Entity not found");
  }
  return entity;
};

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ entity: string }> }
) {
  try {
    const params = await context.params;
    const entity = findEntityOrError(params.entity);
    const sortColumn = entity.defaultSort ?? entity.primaryKey[0];

    const rows = await dbAll(`SELECT * FROM "${entity.table}" ORDER BY "${sortColumn}" DESC LIMIT 500`);

    return NextResponse.json({ data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch records";
    const status = message === "Entity not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ entity: string }> }
) {
  try {
    const params = await context.params;
    const entity = findEntityOrError(params.entity);
    const body = (await request.json()) as Record<string, unknown>;
    const { columns, values } = buildInsertPayload(entity, body);

    if (columns.length === 0) {
      return NextResponse.json({ error: "No values provided for insert" }, { status: 400 });
    }

    const insertColumns = columns.map((column) => `"${column}"`).join(", ");
    const placeholders = columns.map(() => "?").join(", ");

    const insertResult = await dbRun(
      `INSERT INTO "${entity.table}" (${insertColumns}) VALUES (${placeholders})`,
      values
    );

    let primaryKeyValues: unknown[];

    if (entity.primaryKey.length === 1) {
      const primaryKeyName = entity.primaryKey[0];
      const primaryColumn = getPrimaryColumn(entity, primaryKeyName);
      const fromBody = body[primaryKeyName];

      if (primaryColumn.autoIncrement && (fromBody === undefined || fromBody === null || fromBody === "")) {
        primaryKeyValues = [insertResult.lastInsertRowid];
      } else {
        primaryKeyValues = getPrimaryKeyValuesFromBody(entity, body);
      }
    } else {
      primaryKeyValues = getPrimaryKeyValuesFromBody(entity, body);
    }

    const whereClause = entity.primaryKey.map((column) => `"${column}" = ?`).join(" AND ");
    const rows = await dbAll(
      `SELECT * FROM "${entity.table}" WHERE ${whereClause} LIMIT 1`,
      primaryKeyValues
    );

    return NextResponse.json({ data: rows[0] ?? null }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create record";
    const status = message === "Entity not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
