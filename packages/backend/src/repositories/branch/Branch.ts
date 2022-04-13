export default class Branch {

  private readonly branchId: number;
  private address: string;
  private postalCode: string;
  private telNo: string;

  public constructor(branchId: number) {
    this.branchId = branchId;
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
