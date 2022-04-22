import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { LoginException } from '@/exceptions/service/LoginException';
import { RegexUtil } from '@/utils/RegexUtil';
import { Cookie } from '@/utils/cookie/Cookie';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { StaffEntity } from '@/repositories/staff/StaffEntity';

export class AuthService {

  private readonly staffRepository: StaffRepository;

  public constructor(staffRepository: StaffRepository) {
    this.staffRepository = staffRepository;
  }

  public async login(username: string, password: string): Promise<Cookie> {
    if (!RegexUtil.DIGIT_ONLY.test(username)) {
      throw new LoginException('Username must be contain only numbers (staff id)');
    }

    if (password.length < 8) {
      throw new LoginException('Password must be at least 8 characters');
    }

    const expectedStaff = new StaffEntity()
      .setStaffId(Number(username));
    const [staff] = await this.staffRepository.read(expectedStaff);

    if (staff) {
      const isCorrectPassword = await bcrypt.compare(password, staff.getPassword());
      if (isCorrectPassword) {
        const sessionId = crypto.randomUUID();
        const cookie = new Cookie('sid', sessionId)
          .setMaxAge(1000 * 60 * 60 * 24 * 15)
          .setHttpOnly(true);
        return cookie;
      }
    }

    throw new LoginException('Username or password is incorrect');
  }

}
