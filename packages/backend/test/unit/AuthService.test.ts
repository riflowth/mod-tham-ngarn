import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { AuthService } from '@/services/AuthService';
import { Cookie } from '@/utils/cookie/Cookie';
import { MockSessionRepository } from '@test/unit/mocks/MockSessionRepository';
import { MockStaffRepository } from '@test/unit/mocks/MockStaffRepository';

describe('Test implementation of Auth Service', () => {
  let mockStaffRepository: MockStaffRepository;
  let mockSessionRepository: MockSessionRepository;
  let authService: AuthService;

  beforeAll(async () => {
    mockStaffRepository = new MockStaffRepository();
    mockSessionRepository = new MockSessionRepository();
    await mockStaffRepository.initialize();
    authService = new AuthService(mockStaffRepository, mockSessionRepository);
  });

  const validUsername = '123456789';
  const validPassword = 'this_is_valid_password';
  const incorrectPassword = 'my_time_has_come';
  const invalidUsername = 'this_is_invalid_username';
  const invalidPassword = 'short';

  it('should throw InvalidRequestException with username requirement not match', async () => {
    await expect(authService.login(invalidUsername, validPassword))
      .rejects
      .toThrow(InvalidRequestException);
  });

  it('should throw InvalidRequestException with password requirement not match', async () => {
    await expect(authService.login(validUsername, invalidPassword))
      .rejects
      .toThrow(InvalidRequestException);
  });

  it('should return cookie when username and password are correct', async () => {
    await expect(authService.login(validUsername, validPassword))
      .resolves
      .toBeInstanceOf(Cookie);
  });

  it('should throw InvalidRequestException with username or password is incorrect', async () => {
    await expect(authService.login(validUsername, incorrectPassword))
      .rejects
      .toThrow(InvalidRequestException);
  });
});
