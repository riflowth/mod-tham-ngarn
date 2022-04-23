import { DatabaseException } from '@/exceptions/DatabaseException';
import { MySqlConnector } from '@/utils/database/connectors/MySqlConnector';
import { RedisClient, RedisConnector } from '@/utils/database/connectors/RedisConnector';
import { Pool } from 'mysql2/promise';

export class DatabaseConnector {

  private defaultConnector: MySqlConnector;
  private cachingConnector: RedisConnector;

  public async connect(): Promise<boolean> | never {
    const expectedVariables = [
      'MYSQL_HOST',
      'MYSQL_PORT',
      'MYSQL_USER',
      'MYSQL_PASSWORD',
      'MYSQL_DATABASE',
      'REDIS_HOST',
      'REDIS_PORT',
    ];

    expectedVariables.forEach((variable) => {
      if (!process.env[variable]) {
        throw new DatabaseException(`Please define ${variable} in .env`);
      }
    });

    const {
      MYSQL_HOST,
      MYSQL_PORT,
      MYSQL_USER,
      MYSQL_PASSWORD,
      MYSQL_DATABASE,
      REDIS_HOST,
      REDIS_PORT,
      REDIS_USER,
      REDIS_PASSWORD,
    } = process.env;

    this.defaultConnector = new MySqlConnector(
      MYSQL_HOST,
      Number(MYSQL_PORT),
      MYSQL_USER,
      MYSQL_PASSWORD,
      MYSQL_DATABASE,
    );
    this.cachingConnector = new RedisConnector(
      REDIS_HOST,
      Number(REDIS_PORT),
      REDIS_USER,
      REDIS_PASSWORD,
    );

    await Promise.all([
      this.defaultConnector.getConnection(),
      this.cachingConnector.getConnection(),
    ]);

    return true;
  }

  public async getDefaultDatabase(): Promise<Pool> {
    return this.defaultConnector.getConnection();
  }

  public async getCachingDatabase(): Promise<RedisClient> {
    return this.cachingConnector.getConnection();
  }

}
