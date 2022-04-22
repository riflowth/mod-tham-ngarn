import { Repository } from '@/repositories/Repository';
import { StaffEntity } from '@/repositories/staff/StaffEntity';
import { DateUtil } from '@/utils/DateUtil';

export class StaffRepostitory extends Repository {

  public async create(staff: StaffEntity): Promise<StaffEntity> {
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
      const result: any = await this.pool.query('INSERT INTO Staff SET ?', [parameter]);
      return staff.setStaffId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(staff: StaffEntity): Promise<StaffEntity[]> {
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
      'SELECT * FROM Staff WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const results: any = await this.pool.query(query, Object.values(parameter));

    const staffs = results[0].map((result) => {
      return new StaffEntity()
        .setStaffId(result.staff_id)
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

  public async update(source: StaffEntity, destination: StaffEntity): Promise<boolean> {
    const sourceParameter = JSON.parse(JSON.stringify({
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

    const result: any = await this.pool.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(staff: StaffEntity): Promise<boolean> {
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

    const result: any = await this.pool.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
