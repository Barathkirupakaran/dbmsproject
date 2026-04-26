import { NextRequest, NextResponse } from "next/server";

import { dbAll, dbRun } from "@/lib/db";
import { buildUpdatePayload, decodePrimaryKey } from "@/lib/records";
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
  context: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const params = await context.params;
    const entity = findEntityOrError(params.entity);
    const primaryValues = decodePrimaryKey(entity, params.id);
    const whereClause = entity.primaryKey.map((column) => `"${column}" = ?`).join(" AND ");

    const rows = await dbAll(
      `SELECT * FROM "${entity.table}" WHERE ${whereClause} LIMIT 1`,
      primaryValues
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch record";
    const status = message === "Entity not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const params = await context.params;
    const entity = findEntityOrError(params.entity);
    const primaryValues = decodePrimaryKey(entity, params.id);
    const body = (await request.json()) as Record<string, unknown>;
    const { columns, values } = buildUpdatePayload(entity, body);

    if (!columns.length) {
      return NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
    }

    const setClause = columns.map((column) => `"${column}" = ?`).join(", ");
    const whereClause = entity.primaryKey.map((column) => `"${column}" = ?`).join(" AND ");

    await dbRun(`UPDATE "${entity.table}" SET ${setClause} WHERE ${whereClause}`, [...values, ...primaryValues]);

    const rows = await dbAll(
      `SELECT * FROM "${entity.table}" WHERE ${whereClause} LIMIT 1`,
      primaryValues
    );

    return NextResponse.json({ data: rows[0] ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update record";
    const status = message === "Entity not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const params = await context.params;
    const entity = findEntityOrError(params.entity);
    const primaryValues = decodePrimaryKey(entity, params.id);
    const whereClause = entity.primaryKey.map((column) => `"${column}" = ?`).join(" AND ");

    await dbRun(`DELETE FROM "${entity.table}" WHERE ${whereClause}`, primaryValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete record";
    const status = message === "Entity not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
