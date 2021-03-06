import { Entity } from '@/entities/Entity';

export class MachinePart implements Entity<MachinePart, number> {

  private partId: number;
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

  public setPrimaryKey(partId: number): MachinePart {
    this.partId = partId;
    return this;
  }

  public setPartId(partId: number): MachinePart {
    this.partId = partId;
    return this;
  }

  public setMachineId(machineId: number): MachinePart {
    this.machineId = machineId;
    return this;
  }

  public setPartName(partName: string): MachinePart {
    this.partName = partName;
    return this;
  }

  public setStatus(status: string): MachinePart {
    this.status = status;
    return this;
  }

}
