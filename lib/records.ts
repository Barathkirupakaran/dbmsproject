import type { EntityDefinition, ColumnDefinition } from "@/lib/types";

const isEmpty = (value: unknown): boolean =>
  value === undefined || value === null || (typeof value === "string" && value.trim() === "");

const getColumn = (entity: EntityDefinition, columnName: string): ColumnDefinition => {
  const column = entity.columns.find((item) => item.name === columnName);
  if (!column) {
    throw new Error(`Unknown column '${columnName}' for ${entity.label}`);
  }
  return column;
};

export const normalizeValue = (column: ColumnDefinition, value: unknown): unknown => {
  if (value === undefined) {
    return undefined;
  }

  if (isEmpty(value)) {
    return null;
  }

  switch (column.type) {
    case "number": {
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        throw new Error(`${column.label} must be a number`);
      }
      return Math.trunc(numericValue);
    }
    case "decimal": {
      const decimalValue = Number(value);
      if (Number.isNaN(decimalValue)) {
        throw new Error(`${column.label} must be a decimal number`);
      }
      return decimalValue;
    }
    case "date":
      return String(value).slice(0, 10);
    case "datetime":
      return String(value).replace("T", " ").slice(0, 19);
    case "email":
    case "password":
    case "string":
    case "text":
    default:
      return String(value);
  }
};

export const buildInsertPayload = (
  entity: EntityDefinition,
  payload: Record<string, unknown>
): { columns: string[]; values: unknown[] } => {
  const columns: string[] = [];
  const values: unknown[] = [];

  for (const column of entity.columns) {
    const rawValue = payload[column.name];

    if (column.autoIncrement && isEmpty(rawValue)) {
      continue;
    }

    const normalized = normalizeValue(column, rawValue);

    if (column.required && (normalized === undefined || normalized === null)) {
      throw new Error(`${column.label} is required`);
    }

    if (normalized !== undefined) {
      columns.push(column.name);
      values.push(normalized);
    }
  }

  return { columns, values };
};

export const buildUpdatePayload = (
  entity: EntityDefinition,
  payload: Record<string, unknown>
): { columns: string[]; values: unknown[] } => {
  const columns: string[] = [];
  const values: unknown[] = [];

  for (const column of entity.columns) {
    if (entity.primaryKey.includes(column.name)) {
      continue;
    }

    if (!(column.name in payload)) {
      continue;
    }

    const normalized = normalizeValue(column, payload[column.name]);

    if (column.required && (normalized === null || normalized === undefined)) {
      throw new Error(`${column.label} is required`);
    }

    columns.push(column.name);
    values.push(normalized);
  }

  return { columns, values };
};

export const decodePrimaryKey = (entity: EntityDefinition, encodedId: string): unknown[] => {
  const parts = encodedId.split("~").map((part) => decodeURIComponent(part));

  if (parts.length !== entity.primaryKey.length) {
    throw new Error(
      `Invalid primary key format for ${entity.label}. Expected ${entity.primaryKey.length} value(s).`
    );
  }

  return entity.primaryKey.map((primaryKeyColumn, index) => {
    const column = getColumn(entity, primaryKeyColumn);
    return normalizeValue(column, parts[index]);
  });
};

export const getPrimaryKeyValuesFromBody = (
  entity: EntityDefinition,
  payload: Record<string, unknown>
): unknown[] =>
  entity.primaryKey.map((columnName) => {
    const column = getColumn(entity, columnName);
    const normalized = normalizeValue(column, payload[columnName]);
    if (normalized === undefined || normalized === null) {
      throw new Error(`${column.label} is required to identify this record`);
    }
    return normalized;
  });

export const getPrimaryColumn = (entity: EntityDefinition, columnName: string): ColumnDefinition =>
  getColumn(entity, columnName);
