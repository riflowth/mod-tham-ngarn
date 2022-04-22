import { Pool } from 'mysql2/promise';

export abstract class DefaultRepository {

  protected readonly pool: Pool;

  public constructor(pool: Pool) {
    this.pool = pool;
  }

}
