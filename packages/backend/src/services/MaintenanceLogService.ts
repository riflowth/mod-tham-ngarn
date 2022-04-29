import { Role } from '@/decorators/AuthenticationDecorator';
import { Machine } from '@/entities/Machine';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { EnumUtils } from '@/utils/EnumUtils';
import { NumberUtils } from '@/utils/NumberUtils';

export enum MaintainerAction {
  ACCEPT,
  UNACCEPT,
  UPDATE_STATUS,
}

export enum MaintenancePartStatus {
  ORDERING = 'ORDERING',
  MAINTAINING = 'MAINTAINING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
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
    staffZoneIdToValidate: number,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    this.validatePositiveInteger(machineId, 'Machine id', true);

    const machineToValidate = await this.machineRepository.readByMachineId(machineId);
    this.validateMachineRelation(machineToValidate, staffZoneIdToValidate);

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
    reporterZoneIdToValidate: number,
  ): Promise<MaintenanceLog> {
    const newMachineId = newMaintenanceLog.getMachineId();
    const newReporterId = newMaintenanceLog.getReporterId();
    const newReason = newMaintenanceLog.getReason();

    const newMaintenanceId = newMaintenanceLog.getMaintenanceId();
    const newMaintainerId = newMaintenanceLog.getMaintainerId();
    const newReportDate = newMaintenanceLog.getReportDate();
    const newMaintenanceDate = newMaintenanceLog.getMaintenanceDate();
    const newStatus = newMaintenanceLog.getStatus();

    this.validatePositiveInteger(newMachineId, 'Machine id', true);
    this.validatePositiveInteger(newReporterId, 'reporter id', true);
    this.validateNonEmptyString(newReason, 'reason', false);

    if (newMaintenanceId || newMaintainerId || newReportDate || newMaintenanceDate || newStatus) {
      throw new InvalidRequestException('You cannot add maintenance log with this data');
    }

    if (newMachineId) {
      const machineToValidate = await this.machineRepository.readByMachineId(newMachineId);

      if (!machineToValidate) {
        throw new InvalidRequestException('Machine not found');
      }

      if (machineToValidate.getZoneId() !== reporterZoneIdToValidate) {
        throw new InvalidRequestException('Machine is not in your zone.');
      }

      const inprogressMaintenanceLog = await this.maintenanceLogRepository
        .readInprogressMaintenanceByMachineId(newMachineId);

      this.validateInprogressMaintenanceLog(inprogressMaintenanceLog);

      if (inprogressMaintenanceLog) {
        throw new InvalidRequestException('Machine has an inprogress maintenance.');
      }
    }

    return this.maintenanceLogRepository.create(
      newMaintenanceLog
        .setReportDate(new Date())
        .setStatus(MaintenanceLogStatus.OPENED),
    );
  }

  public async editMaintenanceLog(
    maintenanceLogIdToEdit: number,
    newMaintenanceLog: MaintenanceLog,
    reporterIdToValidate: number,
  ): Promise<MaintenanceLog> {
    const newReason = newMaintenanceLog.getReason();
    const newStatus = newMaintenanceLog.getStatus();
    const newMaintenanceId = newMaintenanceLog.getMaintenanceId();
    const newMachineId = newMaintenanceLog.getMachineId();
    const newReporterId = newMaintenanceLog.getReporterId();
    const newMaintainerId = newMaintenanceLog.getMaintainerId();
    const newReportDate = newMaintenanceLog.getReportDate();
    const newMaintenanceDate = newMaintenanceLog.getMaintenanceDate();

    this.validateNonEmptyString(newReason, 'reason', true);

    if (
      newMaintenanceId
      || newMachineId
      || newReporterId
      || newMaintainerId
      || newReportDate
      || newMaintenanceDate
      || newStatus
    ) {
      throw new InvalidRequestException('You cannot edit maintenance log with this data');
    }

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToEdit);

    this.validateMaintenanceLogRelation(
      maintenanceLogToValidate,
      reporterIdToValidate,
    );
    this.validateChangeMaintenanceData(maintenanceLogToValidate);

    const expectedMaintenanceToEdit = new MaintenanceLog().setMaintenanceId(maintenanceLogIdToEdit);

    const affectedRowsAmount = await this.maintenanceLogRepository
      .update(newMaintenanceLog, expectedMaintenanceToEdit);

    return affectedRowsAmount === 1 ? newMaintenanceLog
      .setPrimaryKey(maintenanceLogIdToEdit) : null;
  }

  public async updateMaintenanceLogStatus(
    maintenanceLogIdToEdit: number,
    statusToUpdate: string,
    maintainerIdToValidate: number,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceLogIdToEdit, 'Maintenance log id', true);
    this.validatePositiveInteger(maintainerIdToValidate, 'Reporter id', true);

    if (!EnumUtils.isIncludesInEnum(statusToUpdate, MaintenanceLogStatus)) {
      throw new InvalidRequestException('Invalid status');
    }

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToEdit);

    this.validateMaintenanceLogRelation(
      maintenanceLogToValidate,
      maintainerIdToValidate,
    );

    const fromStatus = maintenanceLogToValidate.getStatus();
    const toStatus = statusToUpdate;

    if (fromStatus === MaintenanceLogStatus.SUCCESS || fromStatus === MaintenanceLogStatus.FAILED) {
      throw new InvalidRequestException('You cannot change status from success or failed');
    }

    if (fromStatus === MaintenanceLogStatus.OPENED) {
      if (toStatus !== MaintenanceLogStatus.PENDING) {
        throw new InvalidRequestException('You cannot change status from opened to other than pending');
      }
    }

    if (fromStatus === MaintenanceLogStatus.PENDING) {
      if (toStatus !== MaintenanceLogStatus.SUCCESS && toStatus !== MaintenanceLogStatus.FAILED) {
        throw new InvalidRequestException('You cannot change status from pending to other than success or failed');
      }
    }

    if (toStatus === MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('You cannot change other status to opened');
    }

    const relatedMaintenanceParts = await this.maintenancePartRepository
      .readByMaintenanceId(maintenanceLogIdToEdit);

    this.validMaintenancePartProgress(relatedMaintenanceParts, statusToUpdate);

    const expectedMaintenanceToEdit = new MaintenanceLog().setMaintenanceId(maintenanceLogIdToEdit);
    const newMaintenanceLog = new MaintenanceLog().setStatus(statusToUpdate);

    const affectedRowsAmount = await this.maintenanceLogRepository
      .update(newMaintenanceLog, expectedMaintenanceToEdit);

    return affectedRowsAmount === 1 ? newMaintenanceLog
      .setPrimaryKey(maintenanceLogIdToEdit) : null;
  }

  public async claimMaintenanceLog(
    maintenanceLogIdToClaim: number,
    claimerMaintainerId: number,
    claimerMaintainerRoleToValidate: string,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceLogIdToClaim, 'Maintenance log id', true);
    this.validatePositiveInteger(claimerMaintainerId, 'Maintainer id', true);

    if (claimerMaintainerRoleToValidate !== Role.TECHNICIAN) {
      throw new InvalidRequestException('You cannot claim maintenance log with this data');
    }

    const maintenanceLogToClaim = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToClaim);

    if (!maintenanceLogToClaim) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (maintenanceLogToClaim.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('This maintenance is already claimed');
    }

    const expectedMaintenanceToEdit = new MaintenanceLog()
      .setMaintenanceId(maintenanceLogIdToClaim);

    const newMaintenanceLog = new MaintenanceLog()
      .setMaintainerId(claimerMaintainerId)
      .setStatus(MaintenanceLogStatus.PENDING);

    const affectedRowsAmount = await this.maintenanceLogRepository
      .update(newMaintenanceLog, expectedMaintenanceToEdit);

    return affectedRowsAmount === 1 ? newMaintenanceLog
      .setPrimaryKey(maintenanceLogIdToClaim) : null;
  }

  public async unclaimMaintenanceLog(
    maintenanceLogIdToUnclaim: number,
    unclaimerMaintainerId: number,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceLogIdToUnclaim, 'Maintenance log id', true);
    this.validatePositiveInteger(unclaimerMaintainerId, 'Maintainer id', true);

    const maintenanceLogToUnclaim = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToUnclaim);

    const expectedMaintenanceToEdit = new MaintenanceLog()
      .setMaintenanceId(maintenanceLogIdToUnclaim);

    this.validateChangeMaintenanceData(maintenanceLogToUnclaim);

    const relatedMaintenanceParts = await this.maintenancePartRepository
      .readByMaintenanceId(maintenanceLogIdToUnclaim);

    if (relatedMaintenanceParts.length > 0) {
      throw new InvalidRequestException('You cannot unclaim maintenance log with related maintenance parts');
    }

    const newMaintenanceLog = new MaintenanceLog()
      .setMaintainerId(null)
      .setStatus(MaintenanceLogStatus.OPENED);

    const affectedRowsAmount = await this.maintenanceLogRepository
      .update(newMaintenanceLog, expectedMaintenanceToEdit);

    return affectedRowsAmount === 1 ? newMaintenanceLog
      .setPrimaryKey(maintenanceLogIdToUnclaim) : null;
  }

  public async deleteMaintenanceLog(
    maintenanceLogIdToDelete: number,
    staffIdToValidate: number,
    maintainerRoleToValidate: string,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceLogIdToDelete, 'maintenanceLogId', true);
    this.validatePositiveInteger(staffIdToValidate, 'staffId', true);

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToDelete);

    if (!maintenanceLogToValidate) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('Cannot delete claimed or finished maintenance');
    }

    if (maintainerRoleToValidate !== Role.TECHNICIAN) {
      this.validateMaintenanceLogRelation(maintenanceLogToValidate, staffIdToValidate);
    }

    const relatedMaintenanceParts = await this.maintenancePartRepository
      .readByMaintenanceId(maintenanceLogIdToDelete);

    if (relatedMaintenanceParts.length > 0) {
      throw new InvalidRequestException('You cannot delete maintenance log with related maintenance parts');
    }

    const expectedMaintenanceLog = new MaintenanceLog().setMaintenanceId(maintenanceLogIdToDelete);

    const affectedRowsAmount = await this.maintenanceLogRepository.delete(expectedMaintenanceLog);

    return affectedRowsAmount === 1 ? new MaintenanceLog()
      .setPrimaryKey(maintenanceLogIdToDelete) : null;
  }

  private validatePositiveInteger(
    numberToValidate: number,
    name: string,
    isRequired: boolean,
  ): void {
    const parseNumberToValidate = Number(numberToValidate);
    if (isRequired && !NumberUtils.isPositiveInteger(parseNumberToValidate)) {
      throw new InvalidRequestException(`${name} must be a positive integer and cannot be null`);
    } else if (parseNumberToValidate && !NumberUtils.isPositiveInteger(parseNumberToValidate)) {
      throw new InvalidRequestException(`${name} must be a positive integer`);
    }
  }

  private validateNonEmptyString(
    stringToValidate: string,
    name: string,
    isRequired: boolean,
  ): void {
    if (isRequired && stringToValidate === '') {
      throw new InvalidRequestException(`${name} must be a non empty string and cannot be null`);
    } else if (stringToValidate && stringToValidate === '') {
      throw new InvalidRequestException(`${name} must be a non empty string`);
    }
  }

  private validateMachineRelation(machineToValidate: Machine, reporterZoneId: number): void {
    if (!machineToValidate) {
      throw new InvalidRequestException('Machine not found');
    }

    if (machineToValidate.getZoneId() !== reporterZoneId) {
      throw new InvalidRequestException('Machine is not in your zone.');
    }
  }

  private validateInprogressMaintenanceLog(maintenanceLogToValidate: MaintenanceLog): void {
    if (maintenanceLogToValidate) {
      throw new InvalidRequestException('Machine has an inprogress maintenance.');
    }
  }

  private validateMaintenanceLogRelation(
    maintenanceLogToValidate: MaintenanceLog,
    staffId: number,
  ): void {
    if (!maintenanceLogToValidate) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (
      maintenanceLogToValidate.getReporterId() !== staffId
      && maintenanceLogToValidate.getMaintainerId() !== staffId
    ) {
      throw new InvalidRequestException('This maintenance Log is not yours');
    }
  }

  private validateChangeMaintenanceData(maintenanceLogToValidate: MaintenanceLog): void {
    if (!maintenanceLogToValidate) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (
      maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.OPENED
      && maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.PENDING
    ) {
      throw new InvalidRequestException('You cannot delete/edit maintenance that finished');
    }
  }

  private validateChangeMaintenanceLogStatus(fromStatus: string, toStatus: string) {
    if (fromStatus === MaintenanceLogStatus.SUCCESS || fromStatus === MaintenanceLogStatus.FAILED) {
      throw new InvalidRequestException('You cannot change status from success or failed');
    }

    if (fromStatus === MaintenanceLogStatus.OPENED) {
      if (toStatus !== MaintenanceLogStatus.PENDING) {
        throw new InvalidRequestException('You cannot change status from opened to other than pending');
      }
    }

    if (fromStatus === MaintenanceLogStatus.PENDING) {
      if (toStatus !== MaintenanceLogStatus.SUCCESS && toStatus !== MaintenanceLogStatus.FAILED) {
        throw new InvalidRequestException('You cannot change status from pending to other than success or failed');
      }
    }

    if (toStatus === MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('You cannot change other status to opened');
    }
  }

  private validMaintenancePartProgress(
    maintenanceParts: MaintenancePart[],
    newStatus: string,
  ): void {
    if (newStatus === MaintenanceLogStatus.SUCCESS) {
      if (!this.isAllMaintenancePartSuccess(maintenanceParts)) {
        throw new InvalidRequestException('All maintenance parts must be success');
      }
    } else if (newStatus === MaintenanceLogStatus.FAILED) {
      if (!this.isAllMaintenancePartFinished(maintenanceParts)) {
        throw new InvalidRequestException('All maintenance parts must be failed');
      }
    }
  }

  private isAllMaintenancePartSuccess(maintenanceParts: MaintenancePart[]): boolean {
    return maintenanceParts.every((maintenancePart) => {
      return maintenancePart.getStatus() === MaintenancePartStatus.SUCCESS;
    });
  }

  private isAllMaintenancePartFinished(maintenanceParts: MaintenancePart[]): boolean {
    return maintenanceParts.every((maintenancePart) => {
      return maintenancePart.getStatus() === MaintenancePartStatus.FAILED
        || maintenancePart.getStatus() === MaintenancePartStatus.SUCCESS;
    });
  }

}
