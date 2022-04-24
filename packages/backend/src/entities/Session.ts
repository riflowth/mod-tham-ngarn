import { Entity } from '@/entities/Entity';

export class Session implements Entity<Session, string> {

  private sessionId: string;
  private staffId: number;
  private expiryDate: Date;

  public getPrimaryKey(): string {
    return this.sessionId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getStaffId(): number {
    return this.staffId;
  }

  public getExpiryDate(): Date {
    return this.expiryDate;
  }

  public setPrimaryKey(sessionId: string): Session {
    this.sessionId = sessionId;
    return this;
  }

  public setSessionId(sessionId: string): Session {
    this.sessionId = sessionId;
    return this;
  }

  public setStaffId(staffId: number): Session {
    this.staffId = staffId;
    return this;
  }

  public setExpiryDate(expiryDate: Date): Session {
    this.expiryDate = expiryDate;
    return this;
  }

}
