import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Request, Response } from 'express';

@ControllerMapping('/staff')
export class StaffController extends Controller {

  @Authentication
  @RouteMapping('/', Methods.GET)
  private async getInfo(req: Request, res: Response): Promise<void> {
    console.log('session', req.session);
    res.status(200).json({ message: 'test' });
  }

}
