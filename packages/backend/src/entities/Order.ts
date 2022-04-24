import { Entity } from '@/entities/Entity';

export class Order implements Entity<Order, number> {

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

  public setPrimaryKey(orderId: number): Order {
    this.orderId = orderId;
    return this;
  }

  public setOrderId(orderId: number): Order {
    this.orderId = orderId;
    return this;
  }

  public setMachineId(machineId: number): Order {
    this.machineId = machineId;
    return this;
  }

  public setPartId(partId: number): Order {
    this.partId = partId;
    return this;
  }

  public setBillId(billId: number): Order {
    this.billId = billId;
    return this;
  }

  public setPrice(price: number): Order {
    this.price = price;
    return this;
  }

  public setArrivalDate(arrivalDate: Date): Order {
    this.arrivalDate = arrivalDate;
    return this;
  }

  public setStatus(status: string): Order {
    this.status = status;
    return this;
  }

}
