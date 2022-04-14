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
        url: this.generateRedisUri(),
      });

      await client.connect();
      this.connection = client;
    }

    return this.connection;
  }

  private generateRedisUri(): string {
    const redisUrlTemplate = 'redis://{{username}}{{colon}}{{password}}{{at}}{{host}}:{{port}}';
    const redisUrl = redisUrlTemplate
      .replace('{{username}}', this.user ?? '')
      .replace('{{colon}}', this.password ? ':' : '')
      .replace('{{password}}', this.password ?? '')
      .replace('{{at}}', (this.password || this.user) ? '@' : '')
      .replace('{{host}}', this.host)
      .replace('{{port}}', String(this.port));

    return redisUrl;
  }

}
