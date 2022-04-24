export interface Entity<T, ID> {

  getPrimaryKey(): ID;

  setPrimaryKey(primaryKey: ID): T;

}
