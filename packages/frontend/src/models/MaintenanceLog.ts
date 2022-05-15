import { Entity } from './Entity';

export interface MaintenanceLog extends Entity {

  maintenanceId: number;
  machineId: number;
  reporterId: number;
  maintainerId: number;
  reportDate: Date;
  maintenanceDate: Date;
  reason: string;
  status: string;

}
