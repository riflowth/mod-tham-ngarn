import { MaintenancePart } from '@/entities/MaintenancePart';
import { Repository } from '@/repositories/Repository';

export interface MaintenancePartRepository extends Repository<MaintenancePart> {

  readByOrderId(orderId: number): Promise<MaintenancePart>;

  readByPrimaryKey(maintenanceId: number, partId: number): Promise<MaintenancePart>;

  readByMaintenanceId(maintenanceId: number): Promise<MaintenancePart[]>

}
