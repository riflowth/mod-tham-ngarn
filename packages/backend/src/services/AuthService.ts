import crypto from 'crypto';
import { LoginException } from '@/exceptions/service/LoginException';
import { RegexUtil } from '@/utils/RegexUtil';
import { Cookie } from '@/utils/cookie/Cookie';

export class AuthService {

  public async login(username: string, password: string): Promise<Cookie> {
    if (!RegexUtil.DIGIT_ONLY.test(username)) {
      throw new LoginException('Username must be contain only numbers (staff id)');
    }

    if (password.length < 8) {
      throw new LoginException('Password must be at least 8 characters');
    }

    const sessionId = crypto.randomUUID();
    const cookie = new Cookie('sid', sessionId)
      .setMaxAge(1000 * 60 * 60 * 24 * 15)
      .setHttpOnly(true);

    return cookie;
  }

}
