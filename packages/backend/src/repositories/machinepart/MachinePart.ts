export class MachinePart {

  private readonly partId: number;
  private readonly machineId: number;
  private partName: string;
  private status: string;

  public getPartId(): number {
    return this.partId;
  }

  public getMachineId(): number {
    return this.machineId;
  }

  public getPartName(): string {
    return this.partName;
  }

  public getStatus(): string {
    return this.status;
  }

  public setPartName(partname: string): MachinePart {
    this.partName = partname;
    return this;
  }

  public setStatus(status: string): MachinePart {
    this.status = status;
    return this;
  }

}
