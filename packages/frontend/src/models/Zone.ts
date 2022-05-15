import { Entity } from './Entity';

export interface Zone extends Entity {

  zoneId: number;
  timeToStart: Date;
  timeToEnd: Date;
  branchId: number;

}
