export class MaintenanceLog {

  private readonly maintenanceId: number;
  private readonly machineId: number;
  private readonly reporterId: number;
  private readonly maintainerId: number;
  private reportDate: Date;
  private maintenaceDate: Date;
  private reason: string;
  private status: string;

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

  public setReportDate(reportDate: Date): MaintenanceLog {
    this.reportDate = reportDate;
    return this;
  }

  public setMaintenaceDate(maintenacedate:Date): MaintenanceLog {
    this.maintenaceDate = maintenacedate;
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
