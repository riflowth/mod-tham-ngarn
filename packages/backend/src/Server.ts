import 'reflect-metadata';
import http from 'http';
import express, { Application } from 'express';
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
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { DefaultAddressRepository } from '@/repositories/address/DefaultAddressRepository';
import { DefaultBillRepository } from '@/repositories/bill/DefaultBillRepository';
import { DefaultBranchRepository } from '@/repositories/branch/DefaultBranchRepository';
import { DefaultMachineRepository } from '@/repositories/machine/DefaultMachineRepository';
import { DefaultMachinePartRepository } from '@/repositories/machinepart/DefaultMachinePartRepository';
import { DefaultMaintenanceLogRepository } from '@/repositories/maintenancelog/DefaultMaintenanceLogRepository';
import { DefaultMaintenancePartRepository } from '@/repositories/maintenancepart/DefaultMaintenancePartRepository';
import { DefaultOrderRepository } from '@/repositories/order/DefaultOrderRepository';
import { DefaultStaffRepository } from '@/repositories/staff/DefaultStaffRepository';
import { DefaultZoneRepository } from '@/repositories/zone/DefaultZoneRepository';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { DefaultSessionRepository } from '@/repositories/session/DefaultSessionRepository';
import { StaffController } from '@/controllers/StaffController';
import { ZoneService } from '@/services/ZoneService';
import { ZoneController } from '@/controllers/ZoneController';
import { BranchService } from '@/services/BranchService';
import { BranchController } from '@/controllers/BranchController';
import { MachineService } from '@/services/MachineService';
import { MachineController } from '@/controllers/MachineController';
import { StaffService } from '@/services/StaffService';
import { AddressService } from '@/services/AddressService';
import { AddressController } from '@/controllers/AddressController';
import { MaintenanceLogService } from '@/services/MaintenanceLogService';
import { MaintenanceLogController } from '@/controllers/MaintenanceLogController';
import { MaintenancePartService } from '@/services/MaintenancePartService';
import { MaintenancePartController } from '@/controllers/MaintenancePartController';
import { OrderService } from '@/services/OrderService';
import { OrderController } from '@/controllers/OrderController';
import { BillService } from '@/services/BillService';
import { BillController } from '@/controllers/BillController';
import { MachinePartService } from '@/services/MachinePartService';
import { MachinePartController } from '@/controllers/MachinePartController';

export class Server {

  private readonly app: Application;
  private readonly port: number;

  private databaseConnector: DatabaseConnector;
  private controllerRegistry: ControllerRegistry;
  private cookieProvider: CookieProvider;

  private addressRepository: AddressRepository;
  private billRepository: BillRepository;
  private branchRepository: BranchRepository;
  private machineRepository: MachineRepository;
  private machinePartRepository: MachinePartRepository;
  private maintenanceLogRepository: MaintenanceLogRepository;
  private maintenancePartRepository: MaintenancePartRepository;
  private orderRepository: OrderRepository;
  private sessionRepository: SessionRepository;
  private staffRepository: StaffRepository;
  private zoneRepository: ZoneRepository;

  private authService: AuthService;
  private addressService: AddressService;
  private billService: BillService;
  private branchService: BranchService;
  private machinePartService: MachinePartService;
  private maintenanceLogService: MaintenanceLogService;
  private maintenancePartService: MaintenancePartService;
  private zoneService: ZoneService;
  private machineService: MachineService;
  private orderService: OrderService;
  private staffService: StaffService;

  public constructor(port: number) {
    this.app = express();
    this.port = port;
    this.databaseConnector = new DatabaseConnector();
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
    const defaultDb = await this.databaseConnector.getDefaultDatabase();
    const cachingDb = await this.databaseConnector.getCachingDatabase();

    this.addressRepository = new DefaultAddressRepository(defaultDb, cachingDb);
    this.billRepository = new DefaultBillRepository(defaultDb, cachingDb);
    this.branchRepository = new DefaultBranchRepository(defaultDb, cachingDb);
    this.machineRepository = new DefaultMachineRepository(defaultDb, cachingDb);
    this.machinePartRepository = new DefaultMachinePartRepository(defaultDb, cachingDb);
    this.maintenanceLogRepository = new DefaultMaintenanceLogRepository(defaultDb, cachingDb);
    this.maintenancePartRepository = new DefaultMaintenancePartRepository(defaultDb, cachingDb);
    this.orderRepository = new DefaultOrderRepository(defaultDb, cachingDb);
    this.sessionRepository = new DefaultSessionRepository(defaultDb, cachingDb);
    this.staffRepository = new DefaultStaffRepository(defaultDb, cachingDb);
    this.zoneRepository = new DefaultZoneRepository(defaultDb, cachingDb);
  }

  private async registerServices(): Promise<void> {
    this.addressService = new AddressService(
      this.addressRepository,
      this.branchRepository,
    );
    this.authService = new AuthService(this.staffRepository, this.sessionRepository);
    this.branchService = new BranchService(
      this.addressRepository,
      this.branchRepository,
      this.zoneRepository,
    );
    this.maintenanceLogService = new MaintenanceLogService(
      this.machineRepository,
      this.maintenanceLogRepository,
      this.maintenancePartRepository,
    );
    this.maintenancePartService = new MaintenancePartService(
      this.machinePartRepository,
      this.maintenanceLogRepository,
      this.maintenancePartRepository,
      this.orderRepository,
    );
    this.zoneService = new ZoneService(
      this.branchRepository,
      this.machineRepository,
      this.zoneRepository,
      this.staffRepository,
    );
    this.machineService = new MachineService(
      this.machineRepository,
      this.machinePartRepository,
      this.maintenanceLogRepository,
      this.orderRepository,
      this.staffRepository,
      this.zoneRepository,
    );
    this.orderService = new OrderService(
      this.billRepository,
      this.machineRepository,
      this.machinePartRepository,
      this.maintenancePartRepository,
      this.orderRepository,
    );
    this.staffService = new StaffService(
      this.staffRepository,
      this.zoneRepository,
      this.branchRepository,
      this.maintenanceLogRepository,
      this.billRepository,
    );
    this.billService = new BillService(
      this.billRepository,
      this.staffRepository,
      this.orderRepository,
    );
    this.machinePartService = new MachinePartService(
      this.machineRepository,
      this.machinePartRepository,
      this.orderRepository,
      this.maintenancePartRepository,
    );
  }

  private async loadControllers(): Promise<void> {
    this.cookieProvider = new CookieProvider('this-is-the-secret-just-keep-it');

    this.controllerRegistry = new ControllerRegistry(
      this.app,
      this.cookieProvider,
      this.sessionRepository,
      this.staffRepository,
    );

    this.controllerRegistry.loadControllers([
      new AddressController(this.addressService),
      new AuthController(this.cookieProvider, this.authService),
      new BillController(this.billService),
      new BranchController(this.branchService),
      new MaintenanceLogController(this.maintenanceLogService),
      new MaintenancePartController(this.maintenancePartService),
      new MachinePartController(this.machinePartService),
      new OrderController(this.orderService),
      new StaffController(this.staffService),
      new ZoneController(this.zoneService),
      new MachineController(this.machineService),
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
