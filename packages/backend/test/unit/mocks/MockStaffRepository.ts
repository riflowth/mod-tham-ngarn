import bcrypt from 'bcrypt';
import { Staff } from '@/entities/Staff';
import { StaffRepository } from '@/repositories/staff/StaffRepository';

export class MockStaffRepository implements StaffRepository {

  private readonly staffs: Staff[] = [];

  public async initialize() {
    const mockStaff = new Staff()
      .setStaffId(123456789)
      .setPassword(await bcrypt.hash('this_is_valid_password', 10));
    this.staffs.push(mockStaff);
  }

  public async create(staff: Staff): Promise<Staff> {
    throw new Error('Method not implemented.');
  }

  public async read(staff: Staff): Promise<Staff[]> {
    return [this.staffs.find((_staff) => _staff.getStaffId() === staff.getStaffId())];
  }

  public async update(source: Staff, destination: Staff): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async delete(staff: Staff): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async readByStaffId(staffId: number): Promise<Staff> {
    throw new Error('Method not implemented.');
  }

}
