export type FieldType =
  | "string"
  | "text"
  | "email"
  | "password"
  | "number"
  | "decimal"
  | "date"
  | "datetime";

export interface ColumnDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  autoIncrement?: boolean;
}

export interface EntityDefinition {
  key: string;
  table: string;
  label: string;
  primaryKey: string[];
  defaultSort?: string;
  columns: ColumnDefinition[];
}
