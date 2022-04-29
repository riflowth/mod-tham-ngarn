import { Request, Response } from 'express';
import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';

@ControllerMapping('/')
export class IndexController extends Controller {

  @RouteMapping('/', Methods.GET)
  private async index(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      name: 'Mod Tham Ngarn API',
      version: '1.0.0',
      repository: 'https://github.com/CPE34-KMUTT/mod-tham-ngarn/',
    });
  }

}
