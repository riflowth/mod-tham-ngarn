import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class OrderEntity implements DatabaseEntity {

  private orderId: number;
  private machineId: number;
  private partId: number;
  private billId: number;
  private price: number;
  private arrivalDate: Date;
  private status: string;

  public getPrimaryKey(): number {
    return this.orderId;
  }

  public getOrderId(): number {
    return this.orderId;
  }

  public getMachineId(): number {
    return this.machineId;
  }

  public getPartId(): number {
    return this.partId;
  }

  public getBillId(): number {
    return this.billId;
  }

  public getPrice(): number {
    return this.price;
  }

  public getArrivalDate(): Date {
    return this.arrivalDate;
  }

  public getStatus(): string {
    return this.status;
  }

  public setPrimaryKey(orderId: number): OrderEntity {
    this.orderId = orderId;
    return this;
  }

  public setOrderId(orderId: number): OrderEntity {
    this.orderId = orderId;
    return this;
  }

  public setMachineId(machineId: number): OrderEntity {
    this.machineId = machineId;
    return this;
  }

  public setPartId(partId: number): OrderEntity {
    this.partId = partId;
    return this;
  }

  public setBillId(billId: number): OrderEntity {
    this.billId = billId;
    return this;
  }

  public setPrice(price: number): OrderEntity {
    this.price = price;
    return this;
  }

  public setArrivalDate(arrivalDate: Date): OrderEntity {
    this.arrivalDate = arrivalDate;
    return this;
  }

  public setStatus(status: string): OrderEntity {
    this.status = status;
    return this;
  }

}
