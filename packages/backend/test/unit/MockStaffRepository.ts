import bcrypt from 'bcrypt';
import { StaffEntity } from '@/repositories/staff/StaffEntity';
import { StaffRepository } from '@/repositories/staff/StaffRepository';

export class MockStaffRepository implements StaffRepository {

  private readonly staffs: StaffEntity[] = [];

  public async intialize() {
    const mockStaffEntity = new StaffEntity()
      .setStaffId(123456789)
      .setPassword(await bcrypt.hash('this_is_valid_password', 10));
    this.staffs.push(mockStaffEntity);
  }

  public async create(staff: StaffEntity): Promise<StaffEntity> {
    throw new Error('Method not implemented.');
  }

  public async read(staff: StaffEntity): Promise<StaffEntity[]> {
    return [this.staffs.find((_staff) => _staff.getStaffId() === staff.getStaffId())];
  }

  public async update(source: StaffEntity, destination: StaffEntity): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async delete(staff: StaffEntity): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
