import { Pool } from 'mysql2/promise';
import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export abstract class Repository {

  protected pool: Pool;

  public constructor(pool: Pool) {
    this.pool = pool;
  }

  abstract create(entity: DatabaseEntity): Promise<DatabaseEntity>;
  abstract read(entity: DatabaseEntity): Promise<DatabaseEntity[]>;
  abstract update(source: DatabaseEntity, destination: DatabaseEntity): Promise<boolean>;
  abstract delete(entity: DatabaseEntity): Promise<boolean>;

}
