import { Entity } from './Entity';

export interface MachinePart extends Entity {

  partId: number;
  machineId: number;
  partName: string;
  status: string;

}
