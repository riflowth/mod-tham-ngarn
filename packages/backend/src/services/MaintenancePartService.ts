import { Role } from '@/decorators/AuthenticationDecorator';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { Order } from '@/entities/Order';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenanceLogStatus, MaintenancePartStatus } from '@/services/MaintenanceLogService';
import { OrderStatus } from '@/services/OrderService';
import { NumberUtils } from '@/utils/NumberUtils';
import { BadRequestException } from 'springpress';

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
    this.validatePositiveInteger(maintenanceId, 'maintenanceId');

    const expectedMaintenancePart = new MaintenancePart().setMaintenanceId(maintenanceId);
    return this.maintenancePartRepository.read(expectedMaintenancePart, readOptions);
  }

  public async addMaintenancePart(
    newMaintenancePart: MaintenancePart,
    maintainerIdToValidate: number,
    maintainerRoleToValidate: string,
  ): Promise<MaintenancePart> {
    const newMaintenanceId = newMaintenancePart.getMaintenanceId();
    const newPartId = newMaintenancePart.getPartId();
    const newType = newMaintenancePart.getType();
    const newOrderId = newMaintenancePart.getOrderId();
    const newStatus = newMaintenancePart.getStatus();

    this.validatePositiveInteger(newPartId, 'newPartId');
    if (newMaintenanceId) this.validatePositiveInteger(newMaintenanceId, 'newMaintenanceId');
    if (newOrderId) this.validatePositiveInteger(newOrderId, 'newOrderId');
    if (newType) this.validateNonEmptyString(newType, 'newType');

    if (newStatus) {
      throw new BadRequestException('newStatus must be null');
    }

    const machinePartToMaintain = await this.machinePartRepository.readByPartId(newPartId);

    if (!machinePartToMaintain) {
      throw new BadRequestException('Machine part to maintain not found');
    }

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(newMaintenanceId);

    this.validateChangeMaintenanceLogData(
      maintenanceLogToValidate,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    this.validateMachinePartRelation(
      machinePartToMaintain.getMachineId(),
      maintenanceLogToValidate,
    );

    if (newOrderId) {
      const orderToValidate = await this.orderRepository.readByOrderId(newOrderId);
      this.validateOrderRelation(orderToValidate);

      const maintenancePart = await this.maintenancePartRepository
        .readByOrderId(orderToValidate.getOrderId());

      this.validateMaintenancePartRelation(maintenancePart);
    }

    const existedMaintenancePart = await this.maintenancePartRepository
      .readByPrimaryKey(newMaintenanceId, newPartId);

    if (existedMaintenancePart) {
      throw new BadRequestException('Maintenance part already exists');
    }

    return this.maintenancePartRepository.create(
      newMaintenancePart.setStatus(MaintenancePartStatus.MAINTAINING),
    );
  }

  public async editMaintenancePart(
    primaryKey: [number, number],
    newMaintenancePart: MaintenancePart,
    maintainerIdToValidate: number,
    maintainerRoleToValidate: string,
  ): Promise<MaintenancePart> {
    const maintenanceIdToSet = primaryKey[0];
    const partIdToSet = primaryKey[1];

    const newType = newMaintenancePart.getType();
    const newOrderId = newMaintenancePart.getOrderId();
    const newStatus = newMaintenancePart.getStatus();
    const newMaintenanceId = newMaintenancePart.getMaintenanceId();
    const newPartId = newMaintenancePart.getPartId();

    this.validatePositiveInteger(maintenanceIdToSet, 'maintenanceIdToSet');
    this.validatePositiveInteger(partIdToSet, 'partIdToSet');
    if (newType) this.validateNonEmptyString(newType, 'newType');
    if (newOrderId) this.validatePositiveInteger(newOrderId, 'newOrderId');
    if (newPartId) this.validatePositiveInteger(newPartId, 'newPartId');

    if (newMaintenanceId || newPartId || newStatus) {
      throw new BadRequestException('newMaintenanceId and newPartId must be null');
    }

    if (!newOrderId && !newType) {
      throw new BadRequestException('No provide data');
    }

    const targetMaintenancePart = await this.maintenancePartRepository
      .readByPrimaryKey(maintenanceIdToSet, partIdToSet);

    if (!targetMaintenancePart) {
      throw new BadRequestException('Maintenance part to edit not found');
    }

    this.validateChangeMaintenancePartData(targetMaintenancePart);

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(targetMaintenancePart.getMaintenanceId());

    this.validateChangeMaintenanceLogData(
      maintenanceLogToValidate,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    if (newPartId) {
      const machinePartToValidate = await this.machinePartRepository.readByPartId(newPartId);
      this.validateMachinePartRelation(
        machinePartToValidate.getMachineId(),
        maintenanceLogToValidate,
      );
    }

    if (newOrderId) {
      const orderToValidate = await this.orderRepository.readByOrderId(newOrderId);
      this.validateOrderRelation(orderToValidate);

      const maintenancePart = await this.maintenancePartRepository
        .readByOrderId(orderToValidate.getOrderId());

      this.validateMaintenancePartRelation(maintenancePart);
    }

    const expectedMaintenancePartToEdit = new MaintenancePart()
      .setPrimaryKey([maintenanceIdToSet, partIdToSet]);

    const affectedRowsAmount = await this.maintenancePartRepository
      .update(newMaintenancePart, expectedMaintenancePartToEdit);

    return affectedRowsAmount === 1 ? newMaintenancePart.setPrimaryKey(primaryKey) : null;
  }

  public async updateMaintenancePartStatus(
    primaryKey: [number, number],
    newStatus: string,
    maintainerIdToValidate: number,
    maintainerRoleToValidate: string,
  ): Promise<MaintenancePart> {
    const maintenanceIdToSet = primaryKey[0];
    const partIdToSet = primaryKey[1];
    this.validatePositiveInteger(maintenanceIdToSet, 'maintenanceIdToSet');
    this.validatePositiveInteger(partIdToSet, 'partIdToSet');
    this.validateNonEmptyString(newStatus, 'newStatus');
    this.validatePositiveInteger(maintainerIdToValidate, 'maintainerId');

    const maintenancePartToValidate = await this.maintenancePartRepository
      .readByPrimaryKey(maintenanceIdToSet, partIdToSet);

    this.validateChangeMaintenancePartStatus(maintenancePartToValidate.getStatus(), newStatus);

    const orderRelatedToMaintenancePart = await this.orderRepository
      .readByOrderId(maintenancePartToValidate.getOrderId());

    this.validateOrderProgress(orderRelatedToMaintenancePart);

    const maintenanceRelatedToMaintenancePart = await this.maintenanceLogRepository
      .readByMaintenanceId(maintenanceIdToSet);

    this.validateChangeMaintenanceLogData(
      maintenanceRelatedToMaintenancePart,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    const expectedMaintenancePartToEdit = new MaintenancePart()
      .setPrimaryKey([maintenanceIdToSet, partIdToSet]);

    const newMaintenancePart = new MaintenancePart().setStatus(newStatus);

    const affectedRowsAmount = await this.maintenancePartRepository
      .update(newMaintenancePart, expectedMaintenancePartToEdit);

    return affectedRowsAmount === 1 ? newMaintenancePart.setPrimaryKey(primaryKey) : null;
  }

  public async deleteMaintenancePart(
    primaryKey: [number, number],
    maintainerIdToValidate: number,
    maintainerRoleToValidate: string,
  ): Promise<MaintenancePart> {
    const maintenanceIdToDelete = primaryKey[0];
    const partIdToDelete = primaryKey[1];

    this.validatePositiveInteger(maintenanceIdToDelete, 'maintenanceIdToDelete');
    this.validatePositiveInteger(partIdToDelete, 'partIdToDelete');

    const targetMaintenancePart = await this.maintenancePartRepository
      .readByPrimaryKey(maintenanceIdToDelete, partIdToDelete);

    if (!targetMaintenancePart) {
      throw new BadRequestException('MaintenanceId or partId to delete not found');
    }

    this.validateChangeMaintenancePartData(targetMaintenancePart);

    const maintenanceLogToValidate = await this.maintenanceLogRepository
      .readByMaintenanceId(targetMaintenancePart.getMaintenanceId());

    this.validateChangeMaintenanceLogData(
      maintenanceLogToValidate,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    const expectedMaintenancePart = new MaintenancePart()
      .setPrimaryKey([maintenanceIdToDelete, partIdToDelete]);

    const affectedRowsAmount = await this.maintenancePartRepository.delete(expectedMaintenancePart);

    return affectedRowsAmount === 1 ? targetMaintenancePart : null;
  }

  private validatePositiveInteger(
    numberToValidate: number,
    name: string,
  ): void {
    if (!NumberUtils.isPositiveInteger(Number(numberToValidate))) {
      throw new BadRequestException(`${name} must be a positive integer and cannot be null`);
    }
  }

  private validateNonEmptyString(
    stringToValidate: string,
    name: string,
  ): void {
    if (stringToValidate === '') {
      throw new BadRequestException(`${name} must be a non empty string and cannot be null`);
    }
  }

  private validateOrderRelation(orderToValidate: Order): void {
    if (!orderToValidate) {
      throw new BadRequestException('Order related to maintenance part does not existed');
    }
  }

  private validateMaintenancePartRelation(maintenancePart: MaintenancePart): void {
    if (maintenancePart) {
      throw new BadRequestException('Order related to maintenance part has other maintenance part to bind');
    }
  }

  private validateChangeMaintenanceLogData(
    maintenanceLogToValidate: MaintenanceLog,
    maintainerId: number,
    maintainerRole: string,
  ): void {
    if (!maintenanceLogToValidate) {
      throw new BadRequestException('Maintenance log not found');
    }

    if (
      maintainerRole !== Role.CEO
      && maintainerRole !== Role.MANAGER
      && maintenanceLogToValidate.getMaintainerId() !== maintainerId
    ) {
      throw new BadRequestException('You cannot edit/add/delete the maintenance that not belong to you');
    }

    if (
      maintenanceLogToValidate.getStatus() === MaintenanceLogStatus.SUCCESS
      || maintenanceLogToValidate.getStatus() === MaintenanceLogStatus.FAILED
    ) {
      throw new BadRequestException('Cannot edit/add/delete maintenance part to finished maintenance log');
    }

    if (maintenanceLogToValidate.getStatus() === MaintenanceLogStatus.OPENED) {
      throw new BadRequestException('Cannot edit/add/delete maintenance part to maintenance log that don\t have maintainer');
    }
  }

  private validateMachinePartRelation(machineId: number, maintenanceLog: MaintenanceLog): void {
    if (maintenanceLog.getMachineId() !== machineId) {
      throw new BadRequestException('Machine part to maintain is not belong in machine');
    }
  }

  private validateChangeMaintenancePartData(maintenancePart: MaintenancePart): void {
    if (
      maintenancePart.getStatus() === MaintenancePartStatus.SUCCESS
      || maintenancePart.getStatus() === MaintenancePartStatus.FAILED
    ) {
      throw new BadRequestException('Cannot edit/add maintenance part to finished maintenance log');
    }
  }

  private validateChangeMaintenancePartStatus(fromStatus: string, toStatus: string): void {
    if (fromStatus === toStatus) {
      throw new BadRequestException('Cannot change maintenance part status to the same status');
    }

    if (
      fromStatus === MaintenancePartStatus.ORDERING
      && toStatus !== MaintenancePartStatus.MAINTAINING
    ) {
      throw new BadRequestException('Cannot change maintenance part status from ordering to other status');
    }

    if (
      fromStatus === MaintenancePartStatus.SUCCESS
      || fromStatus === MaintenancePartStatus.FAILED
    ) {
      throw new BadRequestException('Cannot change maintenance part status from finished status');
    }
  }

  private validateOrderProgress(orderRelatedToMaintenancePart: Order): void {
    if (orderRelatedToMaintenancePart.getStatus() === OrderStatus.SHIPPING) {
      throw new BadRequestException('Order is shipping so it cannot change');
    }
  }

}
