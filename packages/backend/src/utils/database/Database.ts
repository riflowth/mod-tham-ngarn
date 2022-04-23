import { RedisClient } from '@/utils/database/connectors/RedisConnector';
import { Pool } from 'mysql2/promise';

export class Database {

  private readonly defaultDatabase: Pool;
  private readonly cachingDatabase: RedisClient;

  public constructor(defaultDatabase: Pool, cachingDatabase) {
    this.defaultDatabase = defaultDatabase;
    this.cachingDatabase = cachingDatabase;
  }

  public query(sql: string, values: any) {
    return this.defaultDatabase.query(sql, values);
  }

  public execute(sql: string, values: any) {
    return this.defaultDatabase.execute(sql, values);
  }

}
