import { Entity } from './Entity';

export interface Machine extends Entity {

  machineId: number;
  zoneId: number;
  name: string;
  serial: string;
  manufacturer: string;
  registrationDate: Date;
  retiredDate: Date;

}
