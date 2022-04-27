import { Machine } from '@/entities/Machine';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export enum MaintainerAction {
  ACCEPT,
  UNACCEPT,
  UPDATE_STATUS,
}

export enum MaintenanceLogStatus {
  OPENED = 'OPENED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class MaintenanceLogService {

  private readonly machineRepository: MachineRepository;
  private readonly maintenanceLogRepository: MaintenanceLogRepository;
  private readonly maintenancePartRepository: MaintenancePartRepository;

  public constructor(
    machineRepository: MachineRepository,
    maintenanceLogRepository: MaintenanceLogRepository,
    maintenancePartRepository: MaintenancePartRepository,
  ) {
    this.machineRepository = machineRepository;
    this.maintenanceLogRepository = maintenanceLogRepository;
    this.maintenancePartRepository = maintenancePartRepository;
  }

  public async getAllMaintenanceLogs(readOptions?: ReadOptions): Promise<MaintenanceLog[]> {
    const expectedMaintenanceLog = new MaintenanceLog();
    return this.maintenanceLogRepository.read(expectedMaintenanceLog, readOptions);
  }

  public async getMaintenanceLogsByMachineId(
    machineId: number,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    const expectedMaintenanceLog = new MaintenanceLog().setMachineId(machineId);
    return this.maintenanceLogRepository.read(expectedMaintenanceLog, readOptions);
  }

  public async getMaintenanceLogByBranchId(
    branchId: number,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    throw new Error('Method not implemented.');
  }

  public async addMaintenanceLog(
    newMaintenanceLog: MaintenanceLog,
    reporterZoneId: number,
  ): Promise<MaintenanceLog> {
    const expectedMachine = new Machine().setMachineId(newMaintenanceLog.getMachineId());
    const [targetMachine] = await this.machineRepository.read(expectedMachine);

    if (targetMachine.getZoneId() !== reporterZoneId) {
      throw new InvalidRequestException('Machine to report is not in your zone');
    }

    const expectedOpenedMaintenance = new MaintenanceLog()
      .setMachineId(newMaintenanceLog.getMachineId())
      .setStatus(MaintenanceLogStatus.OPENED);

    const openedMaintenance = await this.maintenanceLogRepository.read(expectedOpenedMaintenance);

    if (openedMaintenance.length > 0) {
      throw new InvalidRequestException('Machine is already waiting for a technician');
    }

    const expectedPendingMaintenance = new MaintenanceLog()
      .setMachineId(newMaintenanceLog.getMachineId())
      .setStatus(MaintenanceLogStatus.PENDING);

    const pendingMaintenances = await this.maintenanceLogRepository
      .read(expectedPendingMaintenance);

    if (pendingMaintenances.length > 0) {
      throw new InvalidRequestException('Machine is already under maintenance');
    }

    return this.maintenanceLogRepository.create(newMaintenanceLog);
  }

  public async editMaintenanceLog(
    maintenanceLogId: number,
    newMaintenanceLog: MaintenanceLog,
    reporterId: number,
  ): Promise<MaintenanceLog> {
    const expectedMaintenance = new MaintenanceLog().setMaintenanceId(maintenanceLogId);
    const [targetMaintenance] = await this.maintenanceLogRepository.read(expectedMaintenance);

    if (!targetMaintenance) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (targetMaintenance.getReporterId() !== reporterId) {
      throw new InvalidRequestException('You are not the reporter of this maintenance log');
    }

    if (targetMaintenance.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('You can only edit an opened maintenance log');
    }

    const affectedRowsAmount = await this.maintenanceLogRepository
      .update(newMaintenanceLog, expectedMaintenance);

    return affectedRowsAmount === 1 ? newMaintenanceLog.setPrimaryKey(maintenanceLogId) : null;

  }

  public async deleteMaintenanceLog(
    maintenanceLogId: number,
    staffId: number,
  ): Promise<MaintenanceLog> {
    const expectedMaintenance = new MaintenanceLog().setMaintenanceId(maintenanceLogId);
    const [targetMaintenance] = await this.maintenanceLogRepository.read(expectedMaintenance);

    if (!targetMaintenance) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (targetMaintenance.getReporterId() !== staffId) {
      throw new InvalidRequestException('You are not the reporter of this maintenance log');
    }

    if (targetMaintenance.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('You can only delete an opened maintenance log');
    }

    const affectedRowsAmount = await this.maintenanceLogRepository.delete(expectedMaintenance);

    return affectedRowsAmount === 1 ? targetMaintenance : null;
  }

  public async actionMaintenance(
    maintainerId: number,
    maintenanceId: number,
    maintenanceAction: MaintainerAction,
  ): Promise<MaintenanceLog> {
    throw new Error('Method not implemented.');
  }

}
