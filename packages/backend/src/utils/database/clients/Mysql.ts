import { createPool, Pool } from 'mysql2/promise';

type Secrets = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export class Mysql {

  private readonly secrets: Secrets;
  private connection: any;

  public constructor() {
    this.secrets = this.getSecrets();
    this.validateEnvironments();
    this.createConnection();
  }

  private getSecrets(): Secrets {
    const secrets: Secrets = {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    };

    return secrets;
  }

  private validateEnvironments(): void {
    const {
      host,
      port,
      user,
      password,
      database,
    } = this.secrets;

    if (!host) {
      throw new Error('MYSQL_HOST is not defined');
    }

    if (!port) {
      throw new Error('MYSQL_PORT is not defined');
    }

    if (!user) {
      throw new Error('MYSQL_USER is not defined');
    }

    if (!password) {
      throw new Error('MYSQL_ROOT_PASSWORD is not defined');
    }

    if (!database) {
      throw new Error('MYSQL_DATABASE is not defined');
    }
  }

  public createConnection(): void {
    const connection = createPool({
      ...this.secrets,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.connection = connection;
  }

  public getConnection(): Pool {
    return this.connection;
  }

}
