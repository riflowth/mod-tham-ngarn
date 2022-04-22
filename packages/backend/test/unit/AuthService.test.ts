import { LoginException } from '@/exceptions/service/LoginException';
import { AuthService } from '@/services/AuthService';
import { Cookie } from '@/utils/cookie/Cookie';

describe('Test implementation of Auth Service', () => {
  const authService = new AuthService();

  const validUsername = '123456789';
  const validPassword = 'this_is_valid_password';
  const invalidUsername = 'this_is_invalid_username';
  const invalidPassword = 'short';

  it('should throw LoginException with username requirement not match', async () => {
    await expect(authService.login(invalidUsername, validPassword))
      .rejects
      .toThrow(LoginException);
  });

  it('should throw LoginException with password requirement not match', async () => {
    await expect(authService.login(validUsername, invalidPassword))
      .rejects
      .toThrow(LoginException);
  });

  it('should return cookie', async () => {
    await expect(authService.login(validUsername, validPassword))
      .resolves
      .toBeInstanceOf(Cookie);
  });
});
