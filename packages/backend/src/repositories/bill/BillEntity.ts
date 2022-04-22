import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class BillEntity implements DatabaseEntity {

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

  public setPrimaryKey(billId: number): BillEntity {
    this.billId = billId;
    return this;
  }

  public setBillId(billId: number): BillEntity {
    this.billId = billId;
    return this;
  }

  public setStoreName(storeName: string): BillEntity {
    this.storeName = storeName;
    return this;
  }

  public setOrderDate(orderDate: Date): BillEntity {
    this.orderDate = orderDate;
    return this;
  }

  public setOrderBy(orderBy: number): BillEntity {
    this.orderBy = orderBy;
    return this;
  }

}
