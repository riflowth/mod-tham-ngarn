export interface DatabaseEntity {

  getPrimaryKey(): unknown;
  setPrimaryKey(primaryKey: unknown): DatabaseEntity;

}
