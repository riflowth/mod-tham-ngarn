import { Entity } from './Entity';

export interface Branch extends Entity {

  branchId: number;
  address: string;
  postalCode: string;
  telNo: string;

}
