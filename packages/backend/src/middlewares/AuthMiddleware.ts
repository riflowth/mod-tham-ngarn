import { Session } from '@/entities/Session';
import { Staff } from '@/entities/Staff';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { Cookie } from '@/utils/cookie/Cookie';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import {
  ForbiddenException,
  Methods,
  Middleware,
  NextFunction,
  Request,
  Response,
  RouteHandler,
  RouteMetadata,
  UnauthorizedException,
} from 'springpress';

export class AuthMiddleware implements Middleware {

  private readonly cookieProvider: CookieProvider;
  private readonly sessionRepository: SessionRepository;
  private readonly staffRepository: StaffRepository;

  public constructor(
    cookieProvider: CookieProvider,
    sessionRepository: SessionRepository,
    staffRepository: StaffRepository,
  ) {
    this.cookieProvider = cookieProvider;
    this.sessionRepository = sessionRepository;
    this.staffRepository = staffRepository;
  }

  public getHandler(routeMetadata: RouteMetadata): RouteHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const acceptedRoles = (routeMetadata as any).authentication;
      const sessionId = this.cookieProvider.getSignedCookie(req, 'sid');

      if (!sessionId) {
        throw new UnauthorizedException('Login required');
      }

      const cachedSession = await this.sessionRepository.getCachedSession(sessionId);
      let session;
      let staff;

      if (cachedSession) {
        session = new Session()
          .setSessionId(cachedSession.sessionId)
          .setStaffId(cachedSession.staffId);
        staff = new Staff()
          .setStaffId(cachedSession.staffId)
          .setFullName(cachedSession.name)
          .setPosition(cachedSession.role)
          .setZoneId(cachedSession.zoneId)
          .setBranchId(cachedSession.branchId);
      } else {
        const expectedSession = new Session().setSessionId(sessionId);
        [session] = await this.sessionRepository.read(expectedSession);

        if (!session) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const removingCookie = new Cookie('sid', 'i-will-destroy-your-cookies')
            .setExpiryDate(yesterday);

          this.cookieProvider.setCookie(res, removingCookie);
          throw new UnauthorizedException('Session expired');
        }

        const expectedStaff = new Staff().setStaffId(session.getStaffId());
        [staff] = await this.staffRepository.read(expectedStaff);

        await this.sessionRepository.cacheSession(sessionId, {
          sessionId,
          staffId: staff.getStaffId(),
          name: staff.getFullName(),
          role: staff.getPosition(),
          zoneId: staff.getZoneId(),
          branchId: staff.getBranchId(),
        });
      }

      const isAuthorized = acceptedRoles.length === 0
        ? true
        : Object.values<string>(acceptedRoles).includes(staff.getPosition());

      if (!isAuthorized) {
        throw new ForbiddenException('Do not have permission to access');
      }

      req.session = {
        sessionId: session.getSessionId(),
        staffId: session.getStaffId(),
        name: staff.getFullName(),
        zoneId: staff.getZoneId(),
        branchId: staff.getBranchId(),
        role: staff.getPosition(),
      };

      next();
    };
  }

  public getRegisterCondition(routeMethod: Methods, routeMetadata: RouteMetadata): boolean {
    return (routeMetadata as any).authentication;
  }

}
