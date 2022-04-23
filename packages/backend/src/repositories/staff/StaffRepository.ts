import { Staff } from '@/entities/Staff';

export interface StaffRepository {

  create(staff: Staff): Promise<Staff>;

  read(staff: Staff): Promise<Staff[]>;

  update(source: Staff, destination: Staff): Promise<boolean>;

  delete(staff: Staff): Promise<boolean>;

}
