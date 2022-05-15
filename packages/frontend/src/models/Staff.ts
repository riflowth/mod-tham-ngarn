import { Entity } from './Entity';

export interface Staff extends Entity {

  staffId: number;
  password: string;
  fullName: string;
  branchId: number;
  zoneId: number;
  telNo: string;
  salary: number;
  position: string;
  dateOfBirth: Date;

}
