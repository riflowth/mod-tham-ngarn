import { AuthService } from '@/services/AuthService';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import {
  Controller,
  ControllerMapping,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/auth')
export class AuthController extends Controller {

  private readonly cookieProvider: CookieProvider;
  private readonly authService: AuthService;

  public constructor(cookieProvider: CookieProvider, authService: AuthService) {
    super();
    this.cookieProvider = cookieProvider;
    this.authService = authService;
  }

  @RouteMapping('/login', Methods.POST)
  @RequestBody('username', 'password')
  private async loginRoute(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const cookie = await this.authService.login(username, password);

    if (cookie) {
      this.cookieProvider.setSignedCookie(res, cookie);
      res.status(200).json({
        message: 'Logged in successfully',
      });
    }
  }

  @RouteMapping('/logout', Methods.GET)
  private async logoutRoute(req: Request, res: Response): Promise<void> {
    const sessionId = this.cookieProvider.getSignedCookie(req, 'sid');
    await this.authService.logout(sessionId);
    res.status(200).json({
      message: 'Logged out successfully',
    });
  }

}
