import { Route } from '@/controllers/Route';

export class Controller {

  /**
   * Injected with {@link ControllerDecorator} on class declaration
   */
  private readonly path: string;
  private readonly hasAvailable: boolean;

  /**
   * Gets the modular router path of the controller instance
   * @returns a modular router path
   */
  public getPath(): string {
    return this.path;
  }

  /**
   * @returns true if the controller specified {@link ControllerMapping}
   */
  public isAvailable(): boolean {
    return this.hasAvailable;
  }

  /**
   * Returns the router structure with handler and metadata of the controller
   * for converting to the modular express router
   * @returns The router structure (array of {@link Route})
   */
  public getRouter(): Route[] {
    const routes = Reflect.getMetadataKeys(this);

    const router: Route[] = routes.map((route) => {
      return {
        handler: this[route].bind(this),
        metadata: Reflect.getMetadata(route, this),
      };
    });

    return router;
  }

}
