import { Session } from '@/entities/Session';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';
import { ReadOptions } from '@/repositories/ReadOptions';

export class DefaultSessionRepository extends Database implements SessionRepository {

  public async create(session: Session): Promise<Session> {
    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    try {
      await this.query('INSERT INTO Session SET ?', [parameter]);
      return session;
    } catch (e) {
      return null;
    }
  }

  public async read(session: Session, readOptions?: ReadOptions): Promise<Session[]> {
    const { limit, offset } = readOptions || {};

    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Session WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const sessions = results[0].map((result) => {
      return new Session()
        .setSessionId(result.session_id)
        .setStaffId(result.staff_id)
        .setExpiryDate(DateUtil.formatFromSQL(result.expiry_date));
    });

    return sessions;
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

    const query = [
      'UPDATE Session SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(session: Session): Promise<number> {
    const parameter = {
      session_id: session.getSessionId(),
      staff_id: session.getStaffId(),
      expiry_date: DateUtil.formatToSQL(session.getExpiryDate()),
    };

    const query = [
      'DELETE FROM Session WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
