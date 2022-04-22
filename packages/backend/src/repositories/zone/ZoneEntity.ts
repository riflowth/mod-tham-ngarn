import { DatabaseEntity } from '@/repositories/DatabaseEntity';

export class ZoneEntity implements DatabaseEntity {

  private zoneId: number;
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

  public setPrimaryKey(zoneId: number): ZoneEntity {
    this.zoneId = zoneId;
    return this;
  }

  public setZoneId(zoneId: number): ZoneEntity {
    this.zoneId = zoneId;
    return this;
  }

  public setTimeToStart(timeToStart: Date): ZoneEntity {
    this.timeToStart = timeToStart;
    return this;
  }

  public setTimeToEnd(timeToEnd: Date): ZoneEntity {
    this.timeToEnd = timeToEnd;
    return this;
  }

  public setBranchId(branchId: number): ZoneEntity {
    this.branchId = branchId;
    return this;
  }

}
