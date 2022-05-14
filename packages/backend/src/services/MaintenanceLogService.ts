import { Role } from '@/decorators/AuthenticationDecorator';
import { Machine } from '@/entities/Machine';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { EnumUtils } from '@/utils/EnumUtils';
import { NumberUtils } from '@/utils/NumberUtils';
import { BadRequestException } from 'springpress';

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

  private readonly branchRepository: BranchRepository;
  private readonly machineRepository: MachineRepository;
  private readonly maintenanceLogRepository: MaintenanceLogRepository;
  private readonly maintenancePartRepository: MaintenancePartRepository;

  public constructor(
    branchRepository: BranchRepository,
    machineRepository: MachineRepository,
    maintenanceLogRepository: MaintenanceLogRepository,
    maintenancePartRepository: MaintenancePartRepository,
  ) {
    this.branchRepository = branchRepository;
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
    staffRoleToValidate: string,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    this.validatePositiveInteger(machineId, 'Machine id');

    const machineToValidate = await this.machineRepository.readByMachineId(machineId);
    this.validateMachineRelation(machineToValidate, staffZoneIdToValidate, staffRoleToValidate);

    const expectedMaintenanceLog = new MaintenanceLog().setMachineId(machineId);

    return this.maintenanceLogRepository.read(expectedMaintenanceLog, readOptions);
  }

  public async getMaintenanceLogByBranchId(
    branchId: number,
    staffBranchIdToValidate: number,
    staffRoleToValidate: string,
    expectedStatus?: string[],
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    this.validatePositiveInteger(branchId, 'Branch Id');

    const branchToValidate = await this.branchRepository.readByBranchId(branchId);

    if (!branchToValidate) {
      throw new BadRequestException('Branch not found');
    }

    if (
      expectedStatus.length !== 0
      && expectedStatus.some((s) => !EnumUtils.isIncludesInEnum(s, MaintenanceLogStatus))) {
      throw new BadRequestException('accepted status only OPENED, PENDING, SUCCESS, FAILED');
    }

    if (
      staffRoleToValidate !== Role.CEO
      && staffRoleToValidate !== Role.MANAGER
      && staffBranchIdToValidate !== branchId
    ) {
      throw new BadRequestException('You are not in your branch');
    }

    const expectedMaintenanceLog = this.maintenanceLogRepository
      .readByStatusByBranchId(branchId, expectedStatus, readOptions);

    return expectedMaintenanceLog;
  }

  public async getMaintenanceLogById(
    maintenanceId: number,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceId, 'Maintenance Id');

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceId);

    if (!maintenanceLogToValidate) {
      throw new BadRequestException('Maintenance log not found');
    }

    return maintenanceLogToValidate;
  }

  public async addMaintenanceLog(
    newMaintenanceLog: MaintenanceLog,
    reporterZoneIdToValidate: number,
    reporterRoleToValidate: string,
  ): Promise<MaintenanceLog> {
    const newMachineId = newMaintenanceLog.getMachineId();
    const newReporterId = newMaintenanceLog.getReporterId();
    const newReason = newMaintenanceLog.getReason();

    const newMaintenanceId = newMaintenanceLog.getMaintenanceId();
    const newMaintainerId = newMaintenanceLog.getMaintainerId();
    const newReportDate = newMaintenanceLog.getReportDate();
    const newMaintenanceDate = newMaintenanceLog.getMaintenanceDate();
    const newStatus = newMaintenanceLog.getStatus();

    this.validatePositiveInteger(newMachineId, 'Machine id');
    this.validatePositiveInteger(newReporterId, 'reporter id');
    if (newReason) this.validateNonEmptyString(newReason, 'reason');

    if (newMaintenanceId || newMaintainerId || newReportDate || newMaintenanceDate || newStatus) {
      throw new BadRequestException('You cannot add maintenance log with this data');
    }

    if (newMachineId) {
      const machineToValidate = await this.machineRepository.readByMachineId(newMachineId);

      if (!machineToValidate) {
        throw new BadRequestException('Machine not found');
      }

      if (
        reporterRoleToValidate !== Role.CEO
        && reporterRoleToValidate !== Role.MANAGER
        && machineToValidate.getZoneId() !== reporterZoneIdToValidate
      ) {
        throw new BadRequestException('Machine is not in your zone.');
      }

      const inprogressMaintenanceLog = await this.maintenanceLogRepository
        .readInprogressMaintenanceByMachineId(newMachineId);

      this.validateInprogressMaintenanceLog(inprogressMaintenanceLog);

      if (inprogressMaintenanceLog) {
        throw new BadRequestException('Machine has an inprogress maintenance.');
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
    reporterRoleToValidate: string,
  ): Promise<MaintenanceLog> {
    const newReason = newMaintenanceLog.getReason();
    const newStatus = newMaintenanceLog.getStatus();
    const newMaintenanceId = newMaintenanceLog.getMaintenanceId();
    const newMachineId = newMaintenanceLog.getMachineId();
    const newReporterId = newMaintenanceLog.getReporterId();
    const newMaintainerId = newMaintenanceLog.getMaintainerId();
    const newReportDate = newMaintenanceLog.getReportDate();
    const newMaintenanceDate = newMaintenanceLog.getMaintenanceDate();

    this.validateNonEmptyString(newReason, 'reason');

    if (
      newMaintenanceId
      || newMachineId
      || newReporterId
      || newMaintainerId
      || newReportDate
      || newMaintenanceDate
      || newStatus
    ) {
      throw new BadRequestException('You cannot edit maintenance log with this data');
    }

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToEdit);

    this.validateMaintenanceLogRelation(
      maintenanceLogToValidate,
      reporterIdToValidate,
      reporterRoleToValidate,
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
    maintainerRoleToValidate: string,
  ): Promise<MaintenanceLog> {
    this.validatePositiveInteger(maintenanceLogIdToEdit, 'Maintenance log id');
    this.validatePositiveInteger(maintainerIdToValidate, 'Reporter id');

    if (!EnumUtils.isIncludesInEnum(statusToUpdate, MaintenanceLogStatus)) {
      throw new BadRequestException('Invalid status');
    }

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToEdit);

    this.validateMaintenanceLogRelation(
      maintenanceLogToValidate,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    const fromStatus = maintenanceLogToValidate.getStatus();
    const toStatus = statusToUpdate;

    if (fromStatus === MaintenanceLogStatus.SUCCESS || fromStatus === MaintenanceLogStatus.FAILED) {
      throw new BadRequestException('You cannot change status from success or failed');
    }

    if (fromStatus === MaintenanceLogStatus.OPENED) {
      if (toStatus !== MaintenanceLogStatus.PENDING) {
        throw new BadRequestException('You cannot change status from opened to other than pending');
      }
    }

    if (fromStatus === MaintenanceLogStatus.PENDING) {
      if (toStatus !== MaintenanceLogStatus.SUCCESS && toStatus !== MaintenanceLogStatus.FAILED) {
        throw new BadRequestException('You cannot change status from pending to other than success or failed');
      }
    }

    if (toStatus === MaintenanceLogStatus.OPENED) {
      throw new BadRequestException('You cannot change other status to opened');
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
    this.validatePositiveInteger(maintenanceLogIdToClaim, 'Maintenance log id');
    this.validatePositiveInteger(claimerMaintainerId, 'Maintainer id');

    if (
      claimerMaintainerRoleToValidate === Role.OFFICER
      || claimerMaintainerRoleToValidate === Role.PURCHASING
    ) {
      throw new BadRequestException('You cannot claim maintenance log with this data');
    }
    console.log(maintenanceLogIdToClaim);
    const maintenanceLogToClaim = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToClaim);

    if (!maintenanceLogToClaim) {
      throw new BadRequestException('Maintenance log not found');
    }

    if (maintenanceLogToClaim.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new BadRequestException('This maintenance is already claimed');
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
    this.validatePositiveInteger(maintenanceLogIdToUnclaim, 'Maintenance log id');
    this.validatePositiveInteger(unclaimerMaintainerId, 'Maintainer id');

    const maintenanceLogToUnclaim = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToUnclaim);

    const expectedMaintenanceToEdit = new MaintenanceLog()
      .setMaintenanceId(maintenanceLogIdToUnclaim);

    this.validateChangeMaintenanceData(maintenanceLogToUnclaim);

    const relatedMaintenanceParts = await this.maintenancePartRepository
      .readByMaintenanceId(maintenanceLogIdToUnclaim);

    if (relatedMaintenanceParts.length > 0) {
      throw new BadRequestException('You cannot unclaim maintenance log with related maintenance parts');
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
    this.validatePositiveInteger(maintenanceLogIdToDelete, 'maintenanceLogId');
    this.validatePositiveInteger(staffIdToValidate, 'staffId');

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceLogIdToDelete);

    if (!maintenanceLogToValidate) {
      throw new BadRequestException('Maintenance log not found');
    }

    if (maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.OPENED) {
      throw new BadRequestException('Cannot delete claimed or finished maintenance');
    }

    this.validateMaintenanceLogRelation(
      maintenanceLogToValidate,
      staffIdToValidate,
      maintainerRoleToValidate,
    );

    const relatedMaintenanceParts = await this.maintenancePartRepository
      .readByMaintenanceId(maintenanceLogIdToDelete);

    if (relatedMaintenanceParts.length > 0) {
      throw new BadRequestException('You cannot delete maintenance log with related maintenance parts');
    }

    const expectedMaintenanceLog = new MaintenanceLog().setMaintenanceId(maintenanceLogIdToDelete);

    const affectedRowsAmount = await this.maintenanceLogRepository.delete(expectedMaintenanceLog);

    return affectedRowsAmount === 1 ? new MaintenanceLog()
      .setPrimaryKey(maintenanceLogIdToDelete) : null;
  }

  private validatePositiveInteger(
    numberToValidate: number,
    name: string,
  ): void {
    if (!NumberUtils.isPositiveInteger(Number(numberToValidate))) {
      throw new BadRequestException(`${name} must be a positive integer and cannot be null`);
    }
  }

  private validateNonEmptyString(
    stringToValidate: string,
    name: string,
  ): void {
    if (stringToValidate === '') {
      throw new BadRequestException(`${name} must be a non empty string and cannot be null`);
    }
  }

  private validateMachineRelation(
    machineToValidate: Machine,
    reporterZoneId: number,
    reporterRole: string,
  ): void {
    if (!machineToValidate) {
      throw new BadRequestException('Machine not found');
    }

    if (
      reporterRole !== Role.CEO
      && reporterRole !== Role.MANAGER
      && machineToValidate.getZoneId() !== reporterZoneId
    ) {
      throw new BadRequestException('Machine is not in your zone.');
    }
  }

  private validateInprogressMaintenanceLog(maintenanceLogToValidate: MaintenanceLog): void {
    if (maintenanceLogToValidate) {
      throw new BadRequestException('Machine has an inprogress maintenance.');
    }
  }

  private validateMaintenanceLogRelation(
    maintenanceLogToValidate: MaintenanceLog,
    staffId: number,
    reporterRole: string,
  ): void {
    if (!maintenanceLogToValidate) {
      throw new BadRequestException('Maintenance log not found');
    }

    if (
      reporterRole !== Role.CEO
      && reporterRole !== Role.MANAGER
      && maintenanceLogToValidate.getReporterId() !== staffId
      && maintenanceLogToValidate.getMaintainerId() !== staffId
    ) {
      throw new BadRequestException('This maintenance Log is not yours');
    }
  }

  private validateChangeMaintenanceData(maintenanceLogToValidate: MaintenanceLog): void {
    if (!maintenanceLogToValidate) {
      throw new BadRequestException('Maintenance log not found');
    }

    if (
      maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.OPENED
      && maintenanceLogToValidate.getStatus() !== MaintenanceLogStatus.PENDING
    ) {
      throw new BadRequestException('You cannot delete/edit maintenance that finished');
    }
  }

  private validMaintenancePartProgress(
    maintenanceParts: MaintenancePart[],
    newStatus: string,
  ): void {
    if (newStatus === MaintenanceLogStatus.SUCCESS) {
      if (!this.isAllMaintenancePartSuccess(maintenanceParts)) {
        throw new BadRequestException('All maintenance parts must be success');
      }
    } else if (newStatus === MaintenanceLogStatus.FAILED) {
      if (!this.isAllMaintenancePartFinished(maintenanceParts)) {
        throw new BadRequestException('All maintenance parts must be failed');
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
