import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
import { IndexController } from '@/controllers/IndexController';
import { ControllerRegistry } from '@/controllers/ControllerRegistry';
import { DatabaseConnector } from '@/utils/database/DatabaseConnector';
import { DatabaseException } from '@/exceptions/DatabaseException';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { AuthController } from '@/controllers/AuthController';
import { AuthService } from '@/services/AuthService';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { DefaultAddressRepository } from '@/repositories/address/DefaultAddressRepository';
import { DefaultBillRepository } from '@/repositories/bill/DefaultBillRepository';
import { DefaultBranchRepository } from '@/repositories/branch/DefaultBranchRepository';
import { DefaultMachineRepository } from '@/repositories/machine/DefaultMachineRepository';
import { DefaultMachinePartRepository } from '@/repositories/machinePart/DefaultMachinePartRepository';
import { DefaultMaintenanceLogRepository } from '@/repositories/maintenancelog/DefaultMaintenanceLogRepository';
import { DefaultMaintenancePartRepository } from '@/repositories/maintenancepart/DefaultMaintenancePartRepository';
import { DefaultOrderRepository } from '@/repositories/order/DefaultOrderRepository';
import { DefaultStaffRepository } from '@/repositories/staff/DefaultStaffRepository';
import { DefaultZoneRepository } from '@/repositories/zone/DefaultZoneRepository';

export class Server {

  private readonly app: Application;
  private readonly port: number;

  private readonly databaseConnector: DatabaseConnector;
  private readonly controllerRegistry: ControllerRegistry;
  private readonly cookieProvider: CookieProvider;

  private addressRepository: AddressRepository;
  private billRepository: BillRepository;
  private branchRepository: BranchRepository;
  private machineRepository: MachineRepository;
  private machinePartRepository: MachinePartRepository;
  private maintenanceLogRepository: MaintenanceLogRepository;
  private maintenancePartRepository: MaintenancePartRepository;
  private orderRepository: OrderRepository;
  private staffRepository: StaffRepository;
  private zoneRepository: ZoneRepository;

  private authService: AuthService;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.databaseConnector = new DatabaseConnector();
    this.controllerRegistry = new ControllerRegistry(this.app);
    this.cookieProvider = new CookieProvider('this-is-the-secret');
  }

  public async run(): Promise<http.Server> {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.disable('x-powered-by');

    await this.connectDatabase();
    await this.registerRepository();
    await this.registerServices();
    await this.loadControllers();

    return this.app.listen(this.port, this.onStartup.bind(this));
  }

  private onStartup(): void {
    console.log(`Listening on http://localhost:${this.port}/`);
  }

  private async registerRepository(): Promise<void> {
    const defaultDatabase = await this.databaseConnector.getDefaultDatabase();
    const cachingDatabase = await this.databaseConnector.getCachingDatabase();

    this.addressRepository = new DefaultAddressRepository(defaultDatabase, cachingDatabase);
    this.billRepository = new DefaultBillRepository(defaultDatabase, cachingDatabase);
    this.branchRepository = new DefaultBranchRepository(defaultDatabase, cachingDatabase);
    this.machineRepository = new DefaultMachineRepository(defaultDatabase, cachingDatabase);
    this.machinePartRepository = new DefaultMachinePartRepository(defaultDatabase, cachingDatabase);
    this.maintenanceLogRepository = new DefaultMaintenanceLogRepository(
      defaultDatabase,
      cachingDatabase,
    );
    this.maintenancePartRepository = new DefaultMaintenancePartRepository(
      defaultDatabase,
      cachingDatabase,
    );
    this.orderRepository = new DefaultOrderRepository(defaultDatabase, cachingDatabase);
    this.staffRepository = new DefaultStaffRepository(defaultDatabase, cachingDatabase);
    this.zoneRepository = new DefaultZoneRepository(defaultDatabase, cachingDatabase);
  }

  private async registerServices(): Promise<void> {
    this.authService = new AuthService(this.staffRepository);
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
      await this.databaseConnector.connect();
    } catch (error: unknown) {
      if (error instanceof DatabaseException) {
        console.log(error.message);
      }
      process.exit(1);
    }
  }

}
