import { MySqlClient } from '@/utils/database/connectors/MySqlConnector';
import { RedisClient } from '@/utils/database/connectors/RedisConnector';
import { SqlBuilder } from '@/utils/SqlBuilder';

export class Database {

  private readonly defaultDatabase: MySqlClient;
  private readonly cachingDatabase: RedisClient;
  private readonly sqlBuilder: SqlBuilder;

  public constructor(defaultDatabase: MySqlClient, cachingDatabase: RedisClient) {
    this.defaultDatabase = defaultDatabase;
    this.cachingDatabase = cachingDatabase;
    this.sqlBuilder = new SqlBuilder(defaultDatabase);
  }

  public async setCache(key: string, value: string): Promise<void> {
    await this.cachingDatabase.set(key, value);
  }

  public async getCache(key: string): Promise<string> {
    return this.cachingDatabase.get(key);
  }

  public query(sql: string, values: any) {
    return this.defaultDatabase.query(sql, values);
  }

  public execute(sql: string, values: any) {
    return this.defaultDatabase.execute(sql, values);
  }

  public getSqlBuilder(): SqlBuilder {
    return this.sqlBuilder;
  }

}
