export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export interface Timestamped {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
