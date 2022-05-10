import {
  Controller,
  ControllerMapping,
  Methods,
  Request,
  Response,
  RouteMapping,
} from 'springpress';

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
