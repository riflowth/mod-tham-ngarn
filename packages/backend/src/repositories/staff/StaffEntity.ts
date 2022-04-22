import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class StaffEntity implements DatabaseEntity {

  private staffId: number;
  private password: string;
  private fullName: string;
  private branchId: number;
  private zoneId: number;
  private telNo: string;
  private salary: number;
  private position: string;
  private dateOfBirth: Date;

  public getPrimaryKey(): number {
    return this.staffId;
  }

  public getStaffId(): number {
    return this.staffId;
  }

  public getPassword(): string {
    return this.password;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getBranchId(): number {
    return this.branchId;
  }

  public getZoneId(): number {
    return this.zoneId;
  }

  public getTelNo(): string {
    return this.telNo;
  }

  public getSalary(): number {
    return this.salary;
  }

  public getPosition(): string {
    return this.position;
  }

  public getDateOfBirth(): Date {
    return this.dateOfBirth;
  }

  public setPrimaryKey(staffId: number): StaffEntity {
    this.staffId = staffId;
    return this;
  }

  public setStaffId(staffId: number): StaffEntity {
    this.staffId = staffId;
    return this;
  }

  public setPassword(password: string): StaffEntity {
    this.password = password;
    return this;
  }

  public setFullName(fullName: string): StaffEntity {
    this.fullName = fullName;
    return this;
  }

  public setBranchId(branchId: number): StaffEntity {
    this.branchId = branchId;
    return this;
  }

  public setZoneId(zoneId: number): StaffEntity {
    this.zoneId = zoneId;
    return this;
  }

  public setTelNo(telNo: string): StaffEntity {
    this.telNo = telNo;
    return this;
  }

  public setSalary(salary: number): StaffEntity {
    this.salary = salary;
    return this;
  }

  public setPosition(position: string): StaffEntity {
    this.position = position;
    return this;
  }

  public setDateOfBirth(dateOfBirth: Date): StaffEntity {
    this.dateOfBirth = dateOfBirth;
    return this;
  }

}
