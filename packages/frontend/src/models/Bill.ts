import { Entity } from './Entity';

export interface Bill extends Entity {

  billId: number;
  storeName: string;
  orderDate: Date;
  orderBy: number;

}
