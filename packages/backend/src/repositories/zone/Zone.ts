export class Zone {

  private readonly zoneId: number;
  private timeToStart: Date;
  private timeToEnd: Date;
  private branchId: number;

  public getPrimaryKey(): number {
    return this.zoneId;
  }

  public getZoneId(): number {
    return this.zoneId;
  }

  public getTimeToStart(): Date {
    return this.timeToStart;
  }

  public getTimeToEnd(): Date {
    return this.timeToEnd;
  }

  public getBranchId(): number {
    return this.branchId;
  }

  public setTimeToStart(timeToStart: Date): Zone {
    this.timeToStart = timeToStart;
    return this;
  }

  public setTimeToEnd(timeToEnd: Date): Zone {
    this.timeToEnd = timeToEnd;
    return this;
  }

  public setBranchId(branchId: number): Zone {
    this.branchId = branchId;
    return this;
  }

}
