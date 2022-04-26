import { RequestSession } from '@/controllers/Route';
import { Session } from '@/entities/Session';
import { Repository } from '@/repositories/Repository';

export interface SessionRepository extends Repository<Session> {

  cacheSession(sesionId: string, session: RequestSession): Promise<void>;

  getCachedSession(sessionId: string): Promise<RequestSession>;

}
