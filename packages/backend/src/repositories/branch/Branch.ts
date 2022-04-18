import { DatabaseEntity } from '../DatabaseEntity';

export default class Branch implements DatabaseEntity {

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

  public setPrimaryKey(branchId: number): Branch {
    this.branchId = branchId;
    return this;
  }

  public setBranchId(branchId: number): Branch {
    this.branchId = branchId;
    return this;
  }

  public setAddress(address: string): Branch {
    this.address = address;
    return this;
  }

  public setPostalCode(postalCode: string): Branch {
    this.postalCode = postalCode;
    return this;
  }

  public setTelNo(telNo: string): Branch {
    this.telNo = telNo;
    return this;
  }

}
