import { LoginException } from '@/exceptions/service/LoginException';
import { RegexUtil } from '@/utils/RegexUtil';

export class AuthService {

  public async login(username: string, password: string): Promise<boolean> {
    if (!RegexUtil.DIGIT_ONLY.test(username)) {
      throw new LoginException('Username must be contain only numbers (staff id)');
    }

    if (password.length < 8) {
      throw new LoginException('Password must be at least 8 characters');
    }

    return true;
  }

}
