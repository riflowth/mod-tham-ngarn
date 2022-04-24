import { Session } from '@/entities/Session';
import { ReadOptions } from '@/repositories/ReadOptions';
import { SessionRepository } from '@/repositories/session/SessionRepository';

export class MockSessionRepository implements SessionRepository {

  private readonly session: Session[] = [];

  public async create(entity: Session): Promise<Session> {
    this.session.push(entity);
    return entity;
  }

  public async read(entity: Session, readOptions?: ReadOptions): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }

  public async update(source: Session, destination: Session): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async delete(entity: Session): Promise<number> {
    throw new Error('Method not implemented.');
  }

}
