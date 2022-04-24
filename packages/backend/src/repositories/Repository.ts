import { ReadOptions } from '@/repositories/ReadOptions';

export interface Repository<T> {

  create(entity: T): Promise<T>;

  read(entity: T, readOptions?: ReadOptions): Promise<T[]>;

  update(source: T, destination: T): Promise<number>;

  delete(entity: T): Promise<number>;

}
