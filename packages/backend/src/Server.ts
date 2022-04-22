import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { IndexController } from '@/controllers/IndexController';
import { ControllerRegistry } from '@/controllers/ControllerRegistry';
import { Database } from '@/utils/database/Database';
import { DatabaseException } from '@/exceptions/DatabaseException';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { AuthController } from '@/controllers/AuthController';
import { AuthService } from '@/services/AuthService';

export class Server {

  private readonly app: Application;
  private readonly port: number;

  private readonly database: Database;
  private readonly controllerRegistry: ControllerRegistry;
  private readonly cookieProvider: CookieProvider;

  private authService: AuthService;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.database = new Database();
    this.controllerRegistry = new ControllerRegistry(this.app);
    this.cookieProvider = new CookieProvider('this-is-the-secret');
  }

  public async run(): Promise<http.Server> {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.disable('x-powered-by');

    // await this.connectDatabase();
    await this.registerServices();
    await this.loadControllers();

    return this.app.listen(this.port, this.onStartup.bind(this));
  }

  private onStartup(): void {
    console.log(`Listening on http://localhost:${this.port}/`);
  }

  private async registerServices(): Promise<void> {
    this.authService = new AuthService();
  }

  private async loadControllers(): Promise<void> {
    this.controllerRegistry.loadControllers([
      new IndexController(),
      new AuthController(this.cookieProvider, this.authService),
    ]);

    const controllerCount = this.controllerRegistry.size();
    console.log(`Registered ${controllerCount} controller${controllerCount > 1 ? 's' : ''}`);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await this.database.connect();
    } catch (error: unknown) {
      if (error instanceof DatabaseException) {
        console.log(error.message);
      }
      process.exit(1);
    }
  }

}
