import { Zone } from '@/entities/Zone';
import { ReadOptions } from '@/repositories/types/ReadOptions';

export interface ZoneRepository {

  create (zone: Zone): Promise<Zone>;

  read (zone: Zone, readOptions: ReadOptions): Promise<Zone[]>;

  update (source: Zone, destination: Zone): Promise<boolean>;

  delete(zone: Zone): Promise<boolean>;

}
