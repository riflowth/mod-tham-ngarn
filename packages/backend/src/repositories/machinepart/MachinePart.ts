export class MachinePart {

  private readonly partId: number;
  private machineId: number;
  private partName: string;
  private status: string;

  public getPrimaryKey(): number {
    return this.partId;
  }

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

  public setMachineId(machineId: number): MachinePart {
    this.machineId = machineId;
    return this;
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
