import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { IndexController } from '@/controllers/IndexController';
import { ControllerRegistry } from '@/controllers/ControllerRegistry';
import { Database } from '@/utils/database/Database';
import { DatabaseException } from '@/exceptions/DatabaseException';

export class Server {

  private readonly app: Application;
  private readonly port: number;

  private readonly database: Database;
  private readonly controllerRegistry: ControllerRegistry;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.database = new Database();
    this.controllerRegistry = new ControllerRegistry(this.app);
  }

  public async run(): Promise<http.Server> {
    await this.connectDatabase();
    await this.loadControllers();

    this.app.disable('x-powered-by');

    return this.app.listen(this.port, this.onStartup.bind(this));
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

  private async loadControllers(): Promise<void> {
    this.controllerRegistry.loadControllers([
      new IndexController(),
    ]);

    const controllerCount = this.controllerRegistry.size();
    console.log(`Registered ${controllerCount} controller${controllerCount > 1 ? 's' : ''}`);
  }

  private onStartup(): void {
    console.log(`Listening on http://localhost:${this.port}/`);
  }

}
