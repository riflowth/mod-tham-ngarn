import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export class RedisConnector {

  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly password: string;

  private connection: RedisClient;

  public constructor(
    host: string,
    port: number,
    user: string,
    password: string,
  ) {
    this.host = host;
    this.user = user;
    this.port = port;
    this.password = password;
  }

  public async getConnection(): Promise<RedisClient> | never {
    if (!this.connection) {
      const client: RedisClient = createClient({
        url: `redis://${this.user}:${this.password}@${this.host}:${this.port}`,
      });

      await client.connect();
      this.connection = client;
    }

    return this.connection;
  }

}
