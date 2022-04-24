import { Database } from '@/utils/database/Database';
import { Staff } from '@/entities/Staff';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { DateUtil } from '@/utils/DateUtil';
import { ReadOptions } from '@/repositories/ReadOptions';

export class DefaultStaffRepository extends Database implements StaffRepository {

  public async create(staff: Staff): Promise<Staff> {
    const parameter = {
      password: staff.getPassword(),
      full_name: staff.getFullName(),
      branch_id: staff.getBranchId(),
      zone_id: staff.getZoneId(),
      tel_no: staff.getTelNo(),
      salary: staff.getSalary(),
      position: staff.getPosition(),
      dob: DateUtil.formatToSQL(staff.getDateOfBirth()),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('Staff', parameter);
      return staff.setStaffId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(staff: Staff, readOptions?: ReadOptions): Promise<Staff[]> {
    const parameter = {
      password: staff.getPassword(),
      staff_id: staff.getStaffId(),
      full_name: staff.getFullName(),
      branch_id: staff.getBranchId(),
      zone_id: staff.getZoneId(),
      tel_no: staff.getTelNo(),
      salary: staff.getSalary(),
      position: staff.getPosition(),
      dob: staff.getDateOfBirth(),
    };

    const results: any = await this.getSqlBuilder().read('Staff', parameter, readOptions);

    const staffs = results[0].map((result) => {
      return new Staff()
        .setStaffId(result.staff_id)
        .setPassword(result.password)
        .setFullName(result.full_name)
        .setBranchId(result.branch_id)
        .setZoneId(result.zone_id)
        .setTelNo(result.tel_no)
        .setSalary(result.salary)
        .setPosition(result.position)
        .setDateOfBirth(DateUtil.formatFromSQL(result.dob));
    });

    return staffs;
  }

  public async update(source: Staff, destination: Staff): Promise<number> {
    const sourceParameter = {
      password: source.getPassword(),
      full_name: source.getFullName(),
      branch_id: source.getBranchId(),
      zone_id: source.getZoneId(),
      tel_no: source.getTelNo(),
      salary: source.getSalary(),
      position: source.getPosition(),
      dob: source.getDateOfBirth(),
    };

    const destinationParameter = {
      staff_id: destination.getStaffId(),
      full_name: destination.getFullName(),
      branch_id: destination.getBranchId(),
      zone_id: destination.getZoneId(),
      tel_no: destination.getTelNo(),
      salary: destination.getSalary(),
      position: destination.getPosition(),
      dob: destination.getDateOfBirth(),
    };

    const result: any = await this.getSqlBuilder().update('Staff', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(staff: Staff): Promise<number> {
    const parameter = {
      staff_id: staff.getStaffId(),
      full_name: staff.getFullName(),
      branch_id: staff.getBranchId(),
      zone_id: staff.getZoneId(),
      tel_no: staff.getTelNo(),
      salary: staff.getSalary(),
      position: staff.getPosition(),
      dob: staff.getDateOfBirth(),
    };

    const result: any = await this.getSqlBuilder().delete('Staff', parameter);

    return result[0].affectedRows;
  }

}
