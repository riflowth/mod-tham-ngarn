import { Entity } from '@/entities/Entity';

export class Bill implements Entity<Bill, number> {

  private billId: number;
  private storeName: string;
  private orderDate: Date;
  private orderBy: number;

  public getPrimaryKey(): number {
    return this.billId;
  }

  public getBillId(): number {
    return this.billId;
  }

  public getStoreName(): string {
    return this.storeName;
  }

  public getOrderDate(): Date {
    return this.orderDate;
  }

  public getOrderBy(): number {
    return this.orderBy;
  }

  public setPrimaryKey(billId: number): Bill {
    this.billId = billId;
    return this;
  }

  public setBillId(billId: number): Bill {
    this.billId = billId;
    return this;
  }

  public setStoreName(storeName: string): Bill {
    this.storeName = storeName;
    return this;
  }

  public setOrderDate(orderDate: Date): Bill {
    this.orderDate = orderDate;
    return this;
  }

  public setOrderBy(orderBy: number): Bill {
    this.orderBy = orderBy;
    return this;
  }

}
