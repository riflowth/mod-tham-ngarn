import { Entity } from './Entity';

export interface Order extends Entity {

  orderId: number;
  machineId: number;
  partId: number;
  billId: number;
  price: number;
  arrivalDate: Date;
  status: string;

}
