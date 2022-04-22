import { StaffEntity } from '@/repositories/staff/StaffEntity';

export interface StaffRepository {

  create(staff: StaffEntity): Promise<StaffEntity>;

  read(staff: StaffEntity): Promise<StaffEntity[]>;

  update(source: StaffEntity, destination: StaffEntity): Promise<boolean>;

  delete(staff: StaffEntity): Promise<boolean>;

}
