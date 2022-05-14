import { Entity } from './Entity';

export interface MaintenancePart extends Entity {

  maintenanceId: number;
  partId: number;
  type : string;
  status : string;
  orderId: number;

}
