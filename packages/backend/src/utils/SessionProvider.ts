import { SessionRepository } from '@/repositories/session/SessionRepository';

export class SessionProvider {

  private readonly sessionRepository: SessionRepository;

  public constructor(sessionRepository: SessionRepository) {
    this.sessionRepository = sessionRepository;
  }

}
