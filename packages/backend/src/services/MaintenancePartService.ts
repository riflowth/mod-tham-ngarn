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
import { MaintenanceLogStatus } from './MaintenanceLogService';

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
    const expectedPartToMaintain = new MachinePart().setMachineId(newMaintenancePart.getPartId());
    const [machinePartToMaintain] = await this.machinePartRepository
      .read(expectedPartToMaintain);

    if (!machinePartToMaintain) {
      throw new InvalidRequestException('Machine part to maintain not found');
    }

    const expectedMaintenanceLogToBind = new MaintenanceLog()
      .setMaintenanceId(newMaintenancePart.getMaintenanceId());

    const [targetMaintenanceLogToBind] = await this.maintenanceLogRepository
      .read(expectedMaintenanceLogToBind);

    if (!targetMaintenanceLogToBind) {
      throw new InvalidRequestException('Maintenance log not found');
    }

    if (targetMaintenanceLogToBind.getMachineId() !== machinePartToMaintain.getMachineId()) {
      throw new InvalidRequestException('Machine part to maintain is not related to maintenance log');
    }

    if (targetMaintenanceLogToBind.getMaintainerId() !== maintainerId) {
      throw new InvalidRequestException('You cannot add the maintenance that not belong to you');
    }

    if (
      targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
      || targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
    ) {
      throw new InvalidRequestException('Cannot add maintenance part to finished maintenance log');
    }

    if (targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.OPENED) {
      throw new InvalidRequestException('Cannot add maintenance part to maintenance log that don\t have maintainer');
    }

    const relatedOrderId = newMaintenancePart.getOrderId();
    if (relatedOrderId) {
      await this.validateOrder(relatedOrderId);
    }

    const expectedExistedMaintenancePart = new MaintenancePart()
      .setMaintenanceId(newMaintenancePart.getMaintenanceId())
      .setPartId(newMaintenancePart.getPartId());

    const [existedMaintenancePart] = await this.maintenancePartRepository
      .read(expectedExistedMaintenancePart);

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
    const expectedMaintenancePart = new MaintenancePart().setPrimaryKey(primaryKey);

    const [targetMaintenancePart] = await this.maintenancePartRepository
      .read(expectedMaintenancePart);

    if (!targetMaintenancePart) {
      throw new InvalidRequestException('Maintenance part to edit not found');
    }

    const relatedPartId = newMaintenancePart.getPartId();
    if (relatedPartId) {
      const expectedMachineToValidate = new MachinePart().setPartId(relatedPartId);
      const [machineToValidate] = await this.machinePartRepository.read(expectedMachineToValidate);
      const machineIdToValidate = machineToValidate.getMachineId();

      const expectedMaintenanceLog = new MaintenanceLog()
        .setMaintenanceId(newMaintenancePart.getMaintenanceId());

      const [targetMaintenanceLogToBind] = await this.maintenanceLogRepository
        .read(expectedMaintenanceLog);

      if (!targetMaintenanceLogToBind) {
        throw new InvalidRequestException('Maintenance log not found');
      }

      if (targetMaintenanceLogToBind.getMachineId() !== machineIdToValidate) {
        throw new InvalidRequestException('Machine part to maintain is not related to maintenance log');
      }

      if (targetMaintenanceLogToBind.getMaintainerId() !== maintainerId) {
        throw new InvalidRequestException('You cannot edit the maintenance that not belong to you');
      }

      if (
        targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
        || targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.SUCCESS
      ) {
        throw new InvalidRequestException('Cannot edit maintenance part to finished maintenance log');
      }

      if (targetMaintenanceLogToBind.getStatus() === MaintenanceLogStatus.OPENED) {
        throw new InvalidRequestException('Cannot edit maintenance part to maintenance log that don\t have maintainer');
      }
    }

    const relatedOrderId = newMaintenancePart.getOrderId();
    if (relatedOrderId) {
      await this.validateOrder(relatedOrderId);
    }

    const affectedRowsAmount = await this.maintenancePartRepository
      .update(newMaintenancePart, expectedMaintenancePart);

    return affectedRowsAmount === 1 ? newMaintenancePart.setPrimaryKey(primaryKey) : null;
  }

  public async deleteMaintenancePart(primaryKey: [number, number]): Promise<MaintenancePart> {
    const expectedMaintenancePart = new MaintenancePart().setPrimaryKey(primaryKey);
    const [targetMaintenancePart] = await this.maintenancePartRepository
      .read(expectedMaintenancePart);

    if (!targetMaintenancePart) {
      throw new InvalidRequestException('Maintenance part to delete not found');
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

}
