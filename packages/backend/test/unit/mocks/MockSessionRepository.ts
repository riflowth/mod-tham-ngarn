import { RequestSession } from '@/controllers/Route';
import { Session } from '@/entities/Session';
import { ReadOptions } from '@/repositories/ReadOptions';
import { SessionRepository } from '@/repositories/session/SessionRepository';

export class MockSessionRepository implements SessionRepository {

  private readonly session: Session[] = [];
  private readonly cache: Map<string, string> = new Map();

  public async create(entity: Session): Promise<Session> {
    this.session.push(entity);
    return entity;
  }

  public async cacheSession(sessionId: string, session: RequestSession): Promise<void> {
    this.cache.set(sessionId, JSON.stringify(session));
  }

  public async read(entity: Session, readOptions?: ReadOptions): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }

  public async getCachedSession(sessionId: string): Promise<RequestSession> {
    return JSON.parse(this.cache.get(sessionId));
  }

  public async update(source: Session, destination: Session): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async delete(entity: Session): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async removeCachedSession(sessionId: string): Promise<void> {
    this.cache.delete(sessionId);
  }

}
