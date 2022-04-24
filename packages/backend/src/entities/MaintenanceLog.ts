import { Entity } from '@/entities/Entity';

export class MaintenanceLog implements Entity<MaintenanceLog, number> {

  private maintenanceId: number;
  private machineId: number;
  private reporterId: number;
  private maintainerId: number;
  private reportDate: Date;
  private maintenanceDate: Date;
  private reason: string;
  private status: string;

  public getPrimaryKey(): number {
    return this.maintenanceId;
  }

  public getMaintenanceId(): number {
    return this.maintenanceId;
  }

  public getMachineId(): number {
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

  public getMaintenanceDate(): Date {
    return this.maintenanceDate;
  }

  public getReason(): string {
    return this.reason;
  }

  public getStatus(): string {
    return this.status;
  }

  public setPrimaryKey(maintenanceId: number): MaintenanceLog {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setMaintenanceId(maintenanceId: number): MaintenanceLog {
    this.maintenanceId = maintenanceId;
    return this;
  }

  public setMachineId(machineId: number): MaintenanceLog {
    this.machineId = machineId;
    return this;
  }

  public setReporterId(reporterId: number): MaintenanceLog {
    this.reporterId = reporterId;
    return this;
  }

  public setMaintainerId(maintainerId: number): MaintenanceLog {
    this.maintainerId = maintainerId;
    return this;
  }

  public setReportDate(reportDate: Date): MaintenanceLog {
    this.reportDate = reportDate;
    return this;
  }

  public setMaintenanceDate(maintenanceDate: Date): MaintenanceLog {
    return this;
  }

  public setReason(reason: string): MaintenanceLog {
    this.reason = reason;
    return this;
  }

  public setStatus(status: string): MaintenanceLog {
    this.status = status;
    return this;
  }

}
