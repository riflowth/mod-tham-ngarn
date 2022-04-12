import crypto from 'crypto';
import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { NextFunction, Request, Response } from 'express';
import { Cookie } from '@/utils/cookie/Cookie';
import { NotFoundException } from '@/exceptions/NotFoundException';

@ControllerMapping('/auth')
export class AuthController extends Controller {

  private cookieProvider: CookieProvider;

  public constructor(cookieProvider: CookieProvider) {
    super();
    this.cookieProvider = cookieProvider;
  }

  @RouteMapping('/set', Methods.GET)
  private async setSessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const sessionId = crypto.randomUUID();
    const cookie = new Cookie('sid', sessionId)
      .setHttpOnly(true);

    this.cookieProvider.setCookie(res, cookie);

    res.status(200).json({
      session_id: sessionId,
    });
  }

  @RouteMapping('/get', Methods.GET)
  private async getSessionId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const sessionId = this.cookieProvider.getCookie(req, 'sid');

    if (!sessionId) {
      throw new NotFoundException('can not get session id');
    }

    res.status(200).json({
      session_id: sessionId,
    });
  }

}
