import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class MachinePartEntity implements DatabaseEntity {

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

  public setPrimaryKey(partId: number): MachinePartEntity {
    this.partId = partId;
    return this;
  }

  public setPartId(partId: number): MachinePartEntity {
    this.partId = partId;
    return this;
  }

  public setMachineId(machineId: number): MachinePartEntity {
    this.machineId = machineId;
    return this;
  }

  public setPartName(partname: string): MachinePartEntity {
    this.partName = partname;
    return this;
  }

  public setStatus(status: string): MachinePartEntity {
    this.status = status;
    return this;
  }

}
