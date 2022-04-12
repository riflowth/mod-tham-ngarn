import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { IndexController } from '@/controllers/IndexController';
import { ControllerRegistry } from '@/controllers/ControllerRegistry';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { AuthController } from '@/controllers/AuthController';

export class Server {

  private readonly app: Application;
  private readonly port: number;
  private readonly controllerRegistry: ControllerRegistry;
  private readonly cookieProvider: CookieProvider;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.controllerRegistry = new ControllerRegistry(this.app);
    this.cookieProvider = new CookieProvider('this-is-the-secret');
  }

  public run(): http.Server {
    this.controllerRegistry.loadControllers([
      new IndexController(),
      new AuthController(this.cookieProvider),
    ]);

    this.app.disable('x-powered-by');

    const controllerCount = this.controllerRegistry.size();
    console.log(`Registered ${controllerCount} controller${controllerCount > 1 ? 's' : ''}`);

    return this.app.listen(this.port, this.onStartup.bind(this));
  }

  private onStartup(): void {
    console.log(`Listening on http://localhost:${this.port}/`);
  }

}
