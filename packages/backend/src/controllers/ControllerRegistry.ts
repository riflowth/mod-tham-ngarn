import { Controller } from '@/controllers/Controller';
import { DuplicatedControllerException } from '@/exceptions/controller/DuplicatedControllerException';
import { UnavailableControllerException } from '@/exceptions/controller/UnavailableControllerException';
import { ErrorHandler } from '@/exceptions/ErrorHandler';
import { UnauthorizedException } from '@/exceptions/UnauthorizedException';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { SessionProvider } from '@/utils/SessionProvider';
import {
  Application, NextFunction, Request, Response, Router,
} from 'express';

export class ControllerRegistry {

  private readonly controllerByPath: Map<String, Controller> = new Map();
  private readonly app: Application;
  private readonly cookieProvider: CookieProvider;
  private readonly sessionProvider: SessionProvider;

  public constructor(
    app: Application,
    cookieProvider: CookieProvider,
    sessionProvider: SessionProvider,
  ) {
    this.app = app;
    this.cookieProvider = cookieProvider;
    this.sessionProvider = sessionProvider;
  }

  /**
   * Loads all specified available controllers (provided {@link ControllerMapping}
   * not {@link UnavailableController} or doesn't provide any mentioned decorators)
   * into the registry by extract route structures from the controller into the express router
   * with error handler wrapper at the top-level and authentication.
   *
   * @remarks
   * This method should only register an available controller to represent all available routes.
   * It's fine to leave unavailable routes provided {@link UnavailableController} in the source code
   * without registering and HTTP accessibility to prepare for any feature release.
   *
   * @param controllers - The array of available controller to load into the registry.
   *
   * @throws {@link UnavailableControllerException} if some controllers are unavailable
   * @throws {@link DuplicatedControllerException} if some controllers have duplicated route
   */
  public loadControllers(controllers: Array<Controller>): void {
    if (controllers.some((controller) => !controller.isAvailable())) {
      // TODO: list unavailable controller
      throw new UnavailableControllerException('Can not load an unavailable controller');
    }

    if (controllers.length !== new Set(controllers).size) {
      // TODO: list duplicated controller
      throw new DuplicatedControllerException('Some controllers have duplicated route');
    }

    controllers.forEach((controller) => {
      const router = Router();
      const routes = controller.getRouter();

      routes.forEach((route) => {
        const routeMetadata = route.metadata;
        const routeMethod = routeMetadata.method.toLowerCase();
        const routePath = routeMetadata.path;
        const routeHandler = route.handler;

        if (routeMetadata.authentication) {
          router.use(routePath, this.getAuthMiddleware());
        }

        router[routeMethod](routePath, ErrorHandler.wrap(routeHandler));
      });

      this.app.use(controller.getPath(), router);
      this.controllerByPath.set(controller.getPath(), controller);
    });

    this.app.use(ErrorHandler.getHandler());
  }

  /**
   * @returns A count of registered controllers
   */
  public size(): number {
    return this.controllerByPath.size;
  }

  /**
   * Returns the middleware for authentication and populate session id in the request
   * @returns An Authentication middleware
   */
  private getAuthMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const sessionId = this.cookieProvider.getSignedCookie(req, 'sid');

      if (!sessionId) {
        throw new UnauthorizedException('Login required');
      }

      req.session = sessionId;
      next();
    };
  }

}
