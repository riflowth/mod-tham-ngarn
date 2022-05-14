import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Repository } from '@/repositories/Repository';

export interface MaintenanceLogRepository extends Repository<MaintenanceLog> {

  readByMaintenanceId(maintenanceId: number): Promise<MaintenanceLog>;

  readInprogressMaintenanceByMachineId(machineId: number): Promise<MaintenanceLog>;

  readByStatusByBranchId(
    branchId: number,
    status: string,
    readOptions?: ReadOptions
  ): Promise<MaintenanceLog[]>;

}
