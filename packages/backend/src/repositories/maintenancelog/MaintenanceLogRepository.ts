import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { Repository } from '@/repositories/Repository';

export interface MaintenanceLogRepository extends Repository<MaintenanceLog> {

  readByMaintenanceId(maintenanceId: number): Promise<MaintenanceLog>;

  readInprogressMaintenanceByMachineId(machineId: number): Promise<MaintenanceLog>;

}
