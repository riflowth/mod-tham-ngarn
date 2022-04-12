import { Pool } from 'mysql2/promise';
import { Mysql } from '@/utils/database/clients/Mysql';

export class DatabaseRegistry {

  private readonly mySqlConnection: Pool;

  getMySqlConnection(): Pool {
    return this.mySqlConnection;
  }

  public constructor() {
    this.mySqlConnection = new Mysql().getConnection();
  }

}
