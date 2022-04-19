import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class BranchEntity implements DatabaseEntity {

  private branchId: number;
  private address: string;
  private postalCode: string;
  private telNo: string;

  public getPrimaryKey(): number {
    return this.branchId;
  }

  public getBranchId(): number {
    return this.branchId;
  }

  public getAddress(): string {
    return this.address;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public getTelNo(): string {
    return this.telNo;
  }

  public setPrimaryKey(branchId: number): BranchEntity {
    this.branchId = branchId;
    return this;
  }

  public setBranchId(branchId: number): BranchEntity {
    this.branchId = branchId;
    return this;
  }

  public setAddress(address: string): BranchEntity {
    this.address = address;
    return this;
  }

  public setPostalCode(postalCode: string): BranchEntity {
    this.postalCode = postalCode;
    return this;
  }

  public setTelNo(telNo: string): BranchEntity {
    this.telNo = telNo;
    return this;
  }

}
