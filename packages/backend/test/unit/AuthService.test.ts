import { LoginException } from '@/exceptions/service/LoginException';
import { AuthService } from '@/services/AuthService';
import { Cookie } from '@/utils/cookie/Cookie';
import { MockStaffRepository } from '@test/unit/MockStaffRepository';

describe('Test implementation of Auth Service', () => {
  let mockStaffRepository: MockStaffRepository;
  let authService: AuthService;

  beforeAll(async () => {
    mockStaffRepository = new MockStaffRepository();
    await mockStaffRepository.initialize();
    authService = new AuthService(mockStaffRepository);
  });

  const validUsername = '123456789';
  const validPassword = 'this_is_valid_password';
  const incorrectPassword = 'my_time_has_come';
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

  it('should return cookie when username and password are correct', async () => {
    await expect(authService.login(validUsername, validPassword))
      .resolves
      .toBeInstanceOf(Cookie);
  });

  it('should throw LoginException with username or password is incorrect', async () => {
    await expect(authService.login(validUsername, incorrectPassword))
      .rejects
      .toThrow(LoginException);
  });
});
