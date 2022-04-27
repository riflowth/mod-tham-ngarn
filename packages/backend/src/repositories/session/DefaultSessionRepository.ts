import { Session } from '@/entities/Session';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';
import { ReadOptions } from '@/repositories/ReadOptions';
import { RequestSession } from '@/controllers/Route';

export class DefaultSessionRepository extends Database implements SessionRepository {

  public async create(session: Session): Promise<Session> {
    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    try {
      await this.getSqlBuilder().insert('Session', parameter);
      return session;
    } catch (e) {
      return null;
    }
  }

  public async cacheSession(sesionId: string, session: RequestSession): Promise<void> {
    await this.setCache(sesionId, JSON.stringify(session));
  }

  public async read(session: Session, readOptions?: ReadOptions): Promise<Session[]> {
    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    const results: any = await this.getSqlBuilder().read('Session', parameter, readOptions);

    const sessions = results[0].map((result) => {
      return new Session()
        .setSessionId(result.session_id)
        .setStaffId(result.staff_id)
        .setExpiryDate(DateUtil.formatFromSQL(result.expiry_date));
    });

    return sessions;
  }

  public async getCachedSession(sessionId: string): Promise<RequestSession> {
    const session = await this.getCache(sessionId);

    if (session) {
      const parsedSession: RequestSession = JSON.parse(session);
      return { ...parsedSession };
    }

    return null;
  }

  public async update(source: Session, destination: Session): Promise<number> {
    const sourceParameter = {
      staff_id: source.getStaffId(),
      expiry_date: DateUtil.formatToSQL(source.getExpiryDate()),
    };

    const destinationParameter = {
      session_id: destination.getSessionId(),
      staff_id: destination.getStaffId(),
      expiry_date: DateUtil.formatToSQL(destination.getExpiryDate()),
    };

    const result: any = await this.getSqlBuilder().update('Session', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(session: Session): Promise<number> {
    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    const result: any = await this.getSqlBuilder().delete('Session', parameter);

    return result[0].affectedRows;
  }

  public async removeCachedSession(sessionId: string): Promise<void> {
    await this.removeCache(sessionId);
  }

}
