import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class MaintenancePartEntity implements DatabaseEntity {

  private maintenanceId: number;
  private partId: number;
  private type : string;
  private status : string;
  private orderId: number;

  public getPrimaryKey(): [number, number] {
    return [this.maintenanceId, this.partId];
  }

  public getMaintenanceId(): number {
    return this.maintenanceId;
  }

  public getPartId(): number {
    return this.partId;
  }

  public getType(): string {
    return this.type;
  }

  public getStatus(): string {
    return this.status;
  }

  public getOrderId(): number {
    return this.orderId;
  }

  public setPrimaryKey(primaryKey: [number, number]): MaintenancePartEntity {
    [this.maintenanceId, this.partId] = primaryKey;
    return this;
  }

  public setMaintenanceId(maintenanceId: number): MaintenancePartEntity {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setPartId(partId: number): MaintenancePartEntity {
    this.partId = partId;
    return this;
  }

  public setType(type: string): MaintenancePartEntity {
    this.type = type;
    return this;
  }

  public setStatus(status: string): MaintenancePartEntity {
    this.status = status;
    return this;
  }

  public setOrderId(orderId: number): MaintenancePartEntity {
    this.orderId = orderId;
    return this;
  }

}
