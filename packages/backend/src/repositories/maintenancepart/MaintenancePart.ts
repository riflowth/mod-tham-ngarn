import { DatabaseEntity } from '../DatabaseEntity';

export class MaintenancePart implements DatabaseEntity {

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

  public setPrimaryKey(primaryKey: [number, number]): MaintenancePart {
    [this.maintenanceId, this.partId] = primaryKey;
    return this;
  }

  public setMaintenanceId(maintenanceId: number): MaintenancePart {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setPartId(partId: number): MaintenancePart {
    this.partId = partId;
    return this;
  }

  public setType(type: string): MaintenancePart {
    this.type = type;
    return this;
  }

  public setStatus(status: string): MaintenancePart {
    this.status = status;
    return this;
  }

  public setOrderId(orderId: number): MaintenancePart {
    this.orderId = orderId;
    return this;
  }

}
