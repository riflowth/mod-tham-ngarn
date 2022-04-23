import { Staff } from '@/entities/Staff';
import { ReadOptions } from '@/repositories/types/ReadOptions';

export interface StaffRepository {

  create(staff: Staff): Promise<Staff>;

  read(staff: Staff, readOptions?: ReadOptions): Promise<Staff[]>;

  update(source: Staff, destination: Staff): Promise<boolean>;

  delete(staff: Staff): Promise<boolean>;

}
