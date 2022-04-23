import { Database } from '@/utils/database/Database';
import { Staff } from '@/entities/Staff';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ReadOptions } from '@/repositories/types/ReadOptions';
import { DateUtil } from '@/utils/DateUtil';

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
      const result: any = await this.query('INSERT INTO Staff SET ?', [parameter]);
      return staff.setStaffId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(staff: Staff, readOptions?: ReadOptions): Promise<Staff[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      password: staff.getPassword(),
      staff_id: staff.getStaffId(),
      full_name: staff.getFullName(),
      branch_id: staff.getBranchId(),
      zone_id: staff.getZoneId(),
      tel_no: staff.getTelNo(),
      salary: staff.getSalary(),
      position: staff.getPosition(),
      dob: staff.getDateOfBirth(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Staff WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

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

  public async update(source: Staff, destination: Staff): Promise<boolean> {
    const sourceParameter = JSON.parse(JSON.stringify({
      password: source.getPassword(),
      full_name: source.getFullName(),
      branch_id: source.getBranchId(),
      zone_id: source.getZoneId(),
      tel_no: source.getTelNo(),
      salary: source.getSalary(),
      position: source.getPosition(),
      dob: source.getDateOfBirth(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      staff_id: destination.getStaffId(),
      full_name: destination.getFullName(),
      branch_id: destination.getBranchId(),
      zone_id: destination.getZoneId(),
      tel_no: destination.getTelNo(),
      salary: destination.getSalary(),
      position: destination.getPosition(),
      dob: destination.getDateOfBirth(),
    }));

    const query = [
      'UPDATE Staff SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(staff: Staff): Promise<boolean> {
    const parameter = JSON.parse(JSON.stringify({
      staff_id: staff.getStaffId(),
      full_name: staff.getFullName(),
      branch_id: staff.getBranchId(),
      zone_id: staff.getZoneId(),
      tel_no: staff.getTelNo(),
      salary: staff.getSalary(),
      position: staff.getPosition(),
      dob: staff.getDateOfBirth(),
    }));

    const query = [
      'DELETE FROM Staff WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
