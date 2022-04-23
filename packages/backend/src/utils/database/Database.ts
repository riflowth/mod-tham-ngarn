import { MySqlClient } from '@/utils/database/connectors/MySqlConnector';
import { RedisClient } from '@/utils/database/connectors/RedisConnector';

export class Database {

  private readonly defaultDatabase: MySqlClient;
  private readonly cachingDatabase: RedisClient;

  public constructor(defaultDatabase: MySqlClient, cachingDatabase: RedisClient) {
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
