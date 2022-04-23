import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { Request, Response } from 'express';
import { RequestBody } from '@/decorators/RequestDecorator';
import { AuthService } from '@/services/AuthService';

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
      this.cookieProvider.setCookie(res, cookie);

      res.status(200).json({
        message: 'logged in successfully',
      });
    }
  }

  @RouteMapping('/logout', Methods.GET)
  private async logoutRoute(req: Request, res: Response): Promise<void> {
    const sessionId = this.cookieProvider.getCookie(req, 'sid');

    await this.authService.logout(sessionId);

    res.status(200).json({
      message: 'logged out successfully',
    });
  }

}
