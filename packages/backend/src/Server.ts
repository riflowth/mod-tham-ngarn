import 'reflect-metadata';
import { AddressController } from '@/controllers/AddressController';
import { AuthController } from '@/controllers/AuthController';
import { BillController } from '@/controllers/BillController';
import { BranchController } from '@/controllers/BranchController';
import { IndexController } from '@/controllers/IndexController';
import { MachineController } from '@/controllers/MachineController';
import { MachinePartController } from '@/controllers/MachinePartController';
import { MaintenanceLogController } from '@/controllers/MaintenanceLogController';
import { MaintenancePartController } from '@/controllers/MaintenancePartController';
import { OrderController } from '@/controllers/OrderController';
import { StaffController } from '@/controllers/StaffController';
import { ZoneController } from '@/controllers/ZoneController';
import { DatabaseException } from '@/exceptions/DatabaseException';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { DefaultAddressRepository } from '@/repositories/address/DefaultAddressRepository';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { DefaultBillRepository } from '@/repositories/bill/DefaultBillRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { DefaultBranchRepository } from '@/repositories/branch/DefaultBranchRepository';
import { DefaultMachineRepository } from '@/repositories/machine/DefaultMachineRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { DefaultMachinePartRepository } from '@/repositories/machinepart/DefaultMachinePartRepository';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { DefaultMaintenanceLogRepository } from '@/repositories/maintenancelog/DefaultMaintenanceLogRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { DefaultMaintenancePartRepository } from '@/repositories/maintenancepart/DefaultMaintenancePartRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { DefaultOrderRepository } from '@/repositories/order/DefaultOrderRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { DefaultSessionRepository } from '@/repositories/session/DefaultSessionRepository';
import { SessionRepository } from '@/repositories/session/SessionRepository';
import { DefaultStaffRepository } from '@/repositories/staff/DefaultStaffRepository';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { DefaultZoneRepository } from '@/repositories/zone/DefaultZoneRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { AddressService } from '@/services/AddressService';
import { AuthService } from '@/services/AuthService';
import { BillService } from '@/services/BillService';
import { BranchService } from '@/services/BranchService';
import { MachinePartService } from '@/services/MachinePartService';
import { MachineService } from '@/services/MachineService';
import { MaintenanceLogService } from '@/services/MaintenanceLogService';
import { MaintenancePartService } from '@/services/MaintenancePartService';
import { OrderService } from '@/services/OrderService';
import { StaffService } from '@/services/StaffService';
import { ZoneService } from '@/services/ZoneService';
import { CookieProvider } from '@/utils/cookie/CookieProvider';
import { DatabaseConnector } from '@/utils/database/DatabaseConnector';
import { Springpress } from 'springpress';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';

export class Server extends Springpress {

  private databaseConnector: DatabaseConnector;
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

  public async onStartup(): Promise<void> {
    this.databaseConnector = new DatabaseConnector();
    await this.connectDatabase();
    await this.registerRepository();
    await this.registerServices();
    await this.loadControllers();

    console.log('Starting up ... done!');
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

    const authMiddleware = new AuthMiddleware(
      this.cookieProvider,
      this.sessionRepository,
      this.staffRepository,
    );

    const registry = this.getControllerRegistry();
    registry.register(new IndexController());
    registry.register(new AddressController(this.addressService), authMiddleware);
    registry.register(new AuthController(this.cookieProvider, this.authService), authMiddleware);
    registry.register(new BillController(this.billService), authMiddleware);
    registry.register(new BranchController(this.branchService), authMiddleware);
    registry.register(new MaintenanceLogController(this.maintenanceLogService), authMiddleware);
    registry.register(new MaintenancePartController(this.maintenancePartService), authMiddleware);
    registry.register(new MachinePartController(this.machinePartService), authMiddleware);
    registry.register(new OrderController(this.orderService), authMiddleware);
    registry.register(new StaffController(this.staffService), authMiddleware);
    registry.register(new ZoneController(this.zoneService), authMiddleware);
    registry.register(new MachineController(this.machineService), authMiddleware);
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
