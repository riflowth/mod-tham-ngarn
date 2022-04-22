import { createPool, Pool } from 'mysql2/promise';

export class MySqlConnector {

  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly password: string;
  private readonly database: string;

  private connection: Pool;

  public constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
  ) {
    this.host = host;
    this.user = user;
    this.port = port;
    this.password = password;
    this.database = database;
  }

  public async getConnection(): Promise<Pool> | never {
    if (!this.connection) {
      this.connection = createPool({
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password,
        database: this.database,
      });
    }

    return this.connection;
  }

}
