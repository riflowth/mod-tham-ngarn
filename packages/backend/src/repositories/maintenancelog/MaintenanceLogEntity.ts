import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class MaintenanceLogEntity implements DatabaseEntity {

  private maintenanceId: number;
  private machineId: number;
  private reporterId: number;
  private maintainerId: number;
  private reportDate: Date;
  private maintenaceDate: Date;
  private reason: string;
  private status: string;

  public getPrimaryKey(): number {
    return this.maintenanceId;
  }

  public getMaintenaceId(): number {
    return this.maintenanceId;
  }

  public getmachineId(): number {
    return this.machineId;
  }

  public getReporterId(): number {
    return this.reporterId;
  }

  public getMaintainerId(): number {
    return this.maintainerId;
  }

  public getReportDate(): Date {
    return this.reportDate;
  }

  public getMaintenaceDate(): Date {
    return this.maintenaceDate;
  }

  public getReason(): string {
    return this.reason;
  }

  public getStatus(): string {
    return this.status;
  }

  public setPrimaryKey(maintenanceId: number): MaintenanceLogEntity {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setMaintenanceId(maintenanceId: number): MaintenanceLogEntity {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setMachineId(machineId: number): MaintenanceLogEntity {
    this.machineId = machineId;
    return this;
  }

  public setReporterId(reporterId: number): MaintenanceLogEntity {
    this.reporterId = reporterId;
    return this;
  }

  public setMaintainerId(maintainerId: number): MaintenanceLogEntity {
    this.maintainerId = maintainerId;
    return this;
  }

  public setReportDate(reportDate: Date): MaintenanceLogEntity {
    this.reportDate = reportDate;
    return this;
  }

  public setMaintenaceDate(maintenacedate:Date): MaintenanceLogEntity {
    return this;
  }

  public setReason(reason: string): MaintenanceLogEntity {
    this.reason = reason;
    return this;
  }

  public setStatus(status: string): MaintenanceLogEntity {
    this.status = status;
    return this;
  }

}
