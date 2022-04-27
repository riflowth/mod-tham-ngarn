import { MachinePart } from '@/entities/MachinePart';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenanceLogStatus } from '@/services/MaintenanceLogService';

export enum MaintenancePartStatus {
  ORDERING = 'ORDERING',
  MAINTAINING = 'MAINTAINING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class MaintenancePartService {

  private readonly machinePartRepository: MachinePartRepository;
  private readonly maintenanceLogRepository: MaintenanceLogRepository;
  private readonly maintenancePartRepository: MaintenancePartRepository;
  private readonly orderRepository: OrderRepository;

  public constructor(
    machinePartRepository: MachinePartRepository,
    maintenanceLogRepository: MaintenanceLogRepository,
    maintenancePartRepository: MaintenancePartRepository,
    orderRepository: OrderRepository,
  ) {
    this.machinePartRepository = machinePartRepository;
    this.maintenanceLogRepository = maintenanceLogRepository;
    this.maintenancePartRepository = maintenancePartRepository;
    this.orderRepository = orderRepository;
  }

  public async getMaintenancePartsByMaintenanceId(
    maintenanceId: number,
    readOptions?: ReadOptions,
  ): Promise<MaintenancePart[]> {
    const expectedMaintenancePart = new MaintenancePart().setMaintenanceId(maintenanceId);
    return this.maintenancePartRepository.read(expectedMaintenancePart, readOptions);
  }

  public async addMaintenancePart(
    newMaintenancePart: MaintenancePart,
    maintainerId: number,
  ): Promise<MaintenancePart> {
    const machinePartToMaintain = await this.getMachinePartById(newMaintenancePart.getPartId());

    if (!machinePartToMaintain) {
      throw new InvalidRequestException('Machine part to maintain not found');
    }

    await this.validateMaintenanceLog(
      newMaintenancePart.getMaintenanceId(),
      machinePartToMaintain.getMachineId(),
      maintainerId,
    );

    const relatedOrderId = newMaintenancePart.getOrderId();
    if (relatedOrderId) {
      await this.validateOrder(relatedOrderId);
    }

    const existedMaintenancePart = await this.getMaintenancePartByPrimaryKey([
      newMaintenancePart.getMaintenanceId(),
      newMaintenancePart.getPartId(),
    ]);

    if (existedMaintenancePart) {
      throw new InvalidRequestException('Maintenance part already exists');
    }

    return this.maintenancePartRepository.create(newMaintenancePart);
  }

  public async editMaintenancePart(
    primaryKey: [number, number],
    newMaintenancePart: MaintenancePart,
    maintainerId: number,
  ): Promise<MaintenancePart> {
    const targetMaintenancePart = await this.getMaintenancePartByPrimaryKey(primaryKey);

    if (!targetMaintenancePart) {
      throw new InvalidRequestException('Maintenance part to edit not found');
    }

    const relatedPartId = newMaintenancePart.getPartId();
    if (relatedPartId) {
      const machineToValidate = await this.getMachinePartById(relatedPartId);

      await this.validateMaintenanceLog(
        newMaintenancePart.getMaintenanceId(),
        machineToValidate.getMachineId(),
        maintainerId,
      );
    }

    const relatedOrderId = newMaintenancePart.getOrderId();
    if (relatedOrderId) {
      await this.validateOrder(relatedOrderId);
    }

    const expectedMaintenancePartToEdit = new MaintenancePart().setPrimaryKey(primaryKey);

    const affectedRowsAmount = await this.maintenancePartRepository
      .update(newMaintenancePart, expectedMaintenancePartToEdit);

    return affectedRowsAmount === 1 ? newMaintenancePart.setPrimaryKey(primaryKey) : null;
  }

  public async deleteMaintenancePart(primaryKey: [number, number]): Promise<MaintenancePart> {
    const expectedMaintenancePart = new MaintenancePart().setPrimaryKey(primaryKey);
    const targetMaintenancePart = await this.getMaintenancePartByPrimaryKey(primaryKey);

    if (!targetMaintenancePart) {
      throw new InvalidRequestException('MaintenanceId or partId to delete not found');
    }

    const affectedRowsAmount = await this.maintenancePartRepository.delete(expectedMaintenancePart);

    return affectedRowsAmount === 1 ? targetMaintenancePart : null;
  }

  private async validateOrder(relatedOrderId: number): Promise<void> {
    const expectedRelatedOrder = new Order().setOrderId(relatedOrderId);

    const [relatedOrder] = await this.orderRepository.read(expectedRelatedOrder);

    if (!relatedOrder) {
      throw new InvalidRequestException('Order related to maintenance part does not existed');
    }

    const expectedMaintenancePartRelatedToOrder = new MaintenancePart()
      .setOrderId(relatedOrder.getOrderId());

    const maintenancePartRelatedToOrder = await this.maintenancePartRepository
      .read(expectedMaintenancePartRelatedToOrder);

    if (maintenancePartRelatedToOrder) {
      throw new InvalidRequestException('Order related to maintenance part has other maintenance part to bind');
    }
  }

  private async validateMaintenanceLog(
    maintenanceId: number,
    machineId: number,
    maintainerId: number,
  ): Promise<void> {
    const maintenanceLogToBind = await this.getMaintenanceLogById(maintenanceId);

    if (!maintenanceLogToBind) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (maintenanceLogToBind.getMachineId() !== machineId) {
      throw new InvalidRequestException('Machine part to maintain is not related to maintenance log');
    }

    if (maintenanceLogToBind.getMaintainerId() !== maintainerId) {
      throw new InvalidRequestException('You cannot edit/add the maintenance that not belong to you');
    }

    if (
      maintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
      || maintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
    ) {
      throw new InvalidRequestException('Cannot edit/add maintenance part to finished maintenance log');
    }

    if (maintenanceLogToBind.getStatus() === MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('Cannot edit/add maintenance part to maintenance log that don\t have maintainer');
    }
  }

  private async getMachinePartById(machinePartId: number): Promise<MachinePart> {
    const expectedMachinePart = new MachinePart().setMachineId(machinePartId);
    const [machinePart] = await this.machinePartRepository.read(expectedMachinePart);

    return machinePart;
  }

  private async getMaintenanceLogById(maintenanceId: number): Promise<MaintenanceLog> {
    const expectedMaintenanceLog = new MaintenanceLog().setMaintenanceId(maintenanceId);
    const [maintenanceLog] = await this.maintenanceLogRepository.read(expectedMaintenanceLog);

    return maintenanceLog;
  }

  private async getMaintenancePartByPrimaryKey(
    primaryKey: [number, number],
  ): Promise<MaintenancePart> {
    const expectedMaintenancePart = new MaintenancePart().setPrimaryKey(primaryKey);
    const [maintenancePart] = await this.maintenancePartRepository.read(expectedMaintenancePart);

    return maintenancePart;
  }

}
