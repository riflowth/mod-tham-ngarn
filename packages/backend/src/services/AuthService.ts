import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RegexUtil } from '@/utils/RegexUtil';
import { Cookie } from '@/utils/cookie/Cookie';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { Staff } from '@/entities/Staff';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { Session } from '@/entities/Session';
import { BadRequestException } from 'springpress';

export class AuthService {

  private readonly staffRepository: StaffRepository;
  private readonly sessionRepository: SessionRepository;

  public constructor(staffRepository: StaffRepository, sessionRepository: SessionRepository) {
    this.staffRepository = staffRepository;
    this.sessionRepository = sessionRepository;
  }

  public async login(username: string, password: string): Promise<Cookie> {
    if (!RegexUtil.DIGIT_ONLY.test(username)) {
      throw new BadRequestException('Username must be contain only numbers (staff id)');
    }

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const expectedStaff = new Staff().setStaffId(Number(username));
    const [staff] = await this.staffRepository.read(expectedStaff);

    if (!staff) {
      throw new BadRequestException('Username or password is incorrect');
    }

    const isCorrectPassword = await bcrypt.compare(password, staff.getPassword());
    if (!isCorrectPassword) {
      throw new BadRequestException('Username or password is incorrect');
    }

    const sessionId = crypto.randomUUID();
    const cookie = new Cookie('sid', sessionId)
      .setMaxAge(1000 * 60 * 60 * 24 * 15)
      .setPath('/')
      .setHttpOnly(true);
    const session = new Session()
      .setSessionId(sessionId)
      .setStaffId(Number(username))
      .setExpiryDate(cookie.getExpiryDate());

    await this.sessionRepository.create(session);
    await this.sessionRepository.cacheSession(sessionId, {
      sessionId,
      staffId: Number(username),
      role: staff.getPosition(),
      zoneId: staff.getZoneId(),
      branchId: staff.getBranchId(),
    });

    return cookie;
  }

  public async logout(sessionId: string): Promise<void> {
    const expectedSession = new Session().setSessionId(sessionId);
    await this.sessionRepository.delete(expectedSession);
    await this.sessionRepository.removeCachedSession(sessionId);
  }

}
