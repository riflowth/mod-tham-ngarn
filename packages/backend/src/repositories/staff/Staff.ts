export class Staff {

  private readonly staffId: number;
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

  public setFullName(fullName: string): Staff {
    this.fullName = fullName;
    return this;
  }

  public setBranchId(branchId: number): Staff {
    this.branchId = branchId;
    return this;
  }

  public setZoneId(zoneId: number): Staff {
    this.zoneId = zoneId;
    return this;
  }

  public setTelNo(telNo: string): Staff {
    this.telNo = telNo;
    return this;
  }

  public setSalary(salary: number): Staff {
    this.salary = salary;
    return this;
  }

  public setPosition(position: string): Staff {
    this.position = position;
    return this;
  }

  public setDateOfBirth(dateOfBirth: Date): Staff {
    this.dateOfBirth = dateOfBirth;
    return this;
  }

}
