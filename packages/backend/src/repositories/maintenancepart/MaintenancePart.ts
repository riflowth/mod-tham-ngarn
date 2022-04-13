export class MaintenancePart {

  private readonly maintenanceId: number;
  private readonly partId: number;
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
