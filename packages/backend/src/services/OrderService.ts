import { Bill } from '@/entities/Bill';
import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { EnumUtils } from '@/utils/EnumUtils';
import { NumberUtils } from '@/utils/NumberUtils';

export enum OrderStatus {
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export class OrderService {

  private readonly billRepository: BillRepository;
  private readonly machineRepository: MachineRepository;
  private readonly machinePartRepository: MachinePartRepository;
  private readonly maintenancePartRepository: MaintenancePartRepository;
  private readonly orderRepository: OrderRepository;

  public constructor(
    billRepository: BillRepository,
    machineRepository: MachineRepository,
    machinePartRepository: MachinePartRepository,
    maintenancePartRepository: MaintenancePartRepository,
    orderRepository: OrderRepository,
  ) {
    this.billRepository = billRepository;
    this.machineRepository = machineRepository;
    this.machinePartRepository = machinePartRepository;
    this.maintenancePartRepository = maintenancePartRepository;
    this.orderRepository = orderRepository;
  }

  public async getOrdersByBillId(billId: number, readOptions?: ReadOptions): Promise<Order[]> {
    this.validatePositiveInteger(billId, 'BillId');

    const expectedOrders = new Order().setBillId(billId);
    return this.orderRepository.read(expectedOrders, readOptions);
  }

  public async addOrder(
    newOrder: Order,
    ordererIdToValidate: number,
    ordererZoneIdToValidate: number,
  ): Promise<Order> {
    const newMachineId = newOrder.getMachineId();
    const newPartId = newOrder.getPartId();
    const newBillId = newOrder.getBillId();
    const newPrice = newOrder.getPrice();
    const newOrderId = newOrder.getOrderId();
    const newArrivalDate = newOrder.getArrivalDate();
    const newStatus = newOrder.getStatus();

    this.validatePositiveInteger(ordererIdToValidate, 'OrdererId');
    if (newMachineId) this.validatePositiveInteger(newMachineId, 'MachineId');
    if (newPartId) this.validatePositiveInteger(newPartId, 'PartId');
    if (newBillId) this.validatePositiveInteger(newBillId, 'BillId');
    if (newPrice) this.validatePositiveInteger(newPrice, 'Price');

    if (newOrderId || newArrivalDate || newStatus) {
      throw new InvalidRequestException('OrderId, ArrivalDate and Status must not be set');
    }

    if (newMachineId && newPartId) {
      throw new InvalidRequestException('You can only order a machine or a machinePart, not both');
    }

    if (!newMachineId && !newPartId) {
      throw new InvalidRequestException('You must order at least machine or a machinePart');
    }

    if (newBillId) {
      const billToValidate = await this.billRepository.readByBillId(newBillId);
      this.validateBillRelation(billToValidate, ordererIdToValidate);
    }

    if (newMachineId) {
      const machineToValidate = await this.machineRepository.readByMachineId(newMachineId);
      this.validateMachineRelation(machineToValidate, ordererZoneIdToValidate);
    }

    if (newPartId) {
      const partToValidate = await this.machinePartRepository.readByPartId(newPartId);
      this.validateMachinePartRelation(partToValidate);

      const machineByPartToValidate = await this.machineRepository
        .readByMachineId(partToValidate.getMachineId());

      this.validateMachineRelation(machineByPartToValidate, ordererZoneIdToValidate);
    }

    return this.orderRepository.create(newOrder.setStatus(OrderStatus.SHIPPING));
  }

  public async editOrder(
    orderIdToEdit: number,
    newOrder: Order,
    billIdToValidate: number,
    ordererIdToValidate: number,
  ): Promise<Order> {
    const newStatus = newOrder.getStatus();
    const newMachineId = newOrder.getMachineId();
    const newPartId = newOrder.getPartId();
    const newPrice = newOrder.getPrice();
    const newOrderId = newOrder.getOrderId();
    const newBillId = newOrder.getBillId();
    const newArrivalDate = newOrder.getArrivalDate();

    this.validatePositiveInteger(orderIdToEdit, 'OrderId');
    this.validatePositiveInteger(ordererIdToValidate, 'OrdererId');
    if (newMachineId) this.validatePositiveInteger(newMachineId, 'MachineId');
    if (newPartId) this.validatePositiveInteger(newPartId, 'PartId');
    if (newPrice) this.validatePositiveInteger(newPrice, 'Price');

    if (newOrderId || newBillId || newArrivalDate || newStatus) {
      throw new InvalidRequestException('You cannot edit orderId, billId or arrivalDate');
    }

    const orderToValidate = await this.orderRepository.readByOrderId(orderIdToEdit);
    this.validateOrderRelation(orderToValidate);
    this.validateChangeOrderData(orderToValidate);

    if (billIdToValidate !== orderToValidate.getBillId()) {
      throw new InvalidRequestException('Bill not relate to order');
    }

    const billToValidate = await this.billRepository.readByBillId(orderToValidate.getBillId());
    this.validateBillRelation(billToValidate, ordererIdToValidate);

    const expectedOrderToEdit = new Order().setOrderId(orderIdToEdit);

    const affectedRowsAmount = await this.orderRepository.update(newOrder, expectedOrderToEdit);

    return affectedRowsAmount === 1 ? newOrder.setPrimaryKey(orderIdToEdit) : null;
  }

  public async updateOrderStatus(
    orderIdToEdit: number,
    statusToUpdate: string,
    billIdToValidate: number,
    ordererIdToValidate: number,
  ): Promise<Order> {
    this.validatePositiveInteger(orderIdToEdit, 'OrderId');
    this.validatePositiveInteger(ordererIdToValidate, 'OrdererId');

    if (!EnumUtils.isIncludesInEnum(statusToUpdate, OrderStatus)) {
      throw new InvalidRequestException('Status must be one of the following: SHIPPING, DELIVERED, CANCELED');
    }

    const orderToValidate = await this.orderRepository.readByOrderId(orderIdToEdit);
    this.validateOrderRelation(orderToValidate);

    if (billIdToValidate !== orderToValidate.getBillId()) {
      throw new InvalidRequestException('Bill not relate to order');
    }

    const billToValidate = await this.billRepository.readByBillId(orderToValidate.getBillId());
    this.validateBillRelation(billToValidate, ordererIdToValidate);

    switch (statusToUpdate) {
      case OrderStatus.SHIPPING:
        this.validateChangeOrderStatusToShipping(orderToValidate);
        break;
      case OrderStatus.DELIVERED:
        this.validateChangeOrderStatusToDelivered(orderToValidate);
        break;
      case OrderStatus.CANCELED:
        this.validateChangeOrderStatusToCanceled(orderToValidate);
        break;
      default:
        throw new InvalidRequestException('Status to updated must be a SHIPPING, DELIVERED or CANCELLED');
    }

    const expectedOrderToEdit = new Order().setOrderId(orderIdToEdit);
    const newOrder = new Order().setStatus(statusToUpdate);

    const affectedRowsAmount = await this.orderRepository.update(newOrder, expectedOrderToEdit);

    return affectedRowsAmount === 1 ? newOrder.setPrimaryKey(orderIdToEdit) : null;
  }

  public async deleteOrder(
    orderIdToDelete: number,
    billIdToValidate: number,
    ordererIdToValidate: number,
  ): Promise<Order> {
    this.validatePositiveInteger(orderIdToDelete, 'OrderId');
    this.validatePositiveInteger(ordererIdToValidate, 'OrdererId');

    const orderToValidate = await this.orderRepository.readByOrderId(orderIdToDelete);
    this.validateOrderRelation(orderToValidate);
    this.validateChangeOrderData(orderToValidate);

    if (billIdToValidate !== orderToValidate.getBillId()) {
      throw new InvalidRequestException('Bill not relate to order');
    }

    const billToValidate = await this.billRepository.readByBillId(orderToValidate.getBillId());
    this.validateBillRelation(billToValidate, ordererIdToValidate);

    const expectedOrderToDelete = new Order().setOrderId(orderIdToDelete);

    const relatedMaintenancePart = await this.maintenancePartRepository
      .readByOrderId(orderIdToDelete);

    if (relatedMaintenancePart) {
      throw new InvalidRequestException('Order has related maintenance part');
    }

    const affectedRowsAmount = await this.orderRepository.delete(expectedOrderToDelete);

    return affectedRowsAmount === 1 ? new Order().setPrimaryKey(orderIdToDelete) : null;
  }

  private validatePositiveInteger(
    numberToValidate: number,
    name: string,
  ): void {
    if (!NumberUtils.isPositiveInteger(Number(numberToValidate))) {
      throw new InvalidRequestException(`${name} must be a positive integer and cannot be null`);
    }
  }

  private validateMachineRelation(
    machineToValidate: Machine,
    ordererZoneId: number,
  ): void {
    if (!machineToValidate) {
      throw new InvalidRequestException('Machine does not exist');
    }

    if (machineToValidate.getZoneId() !== ordererZoneId) {
      throw new InvalidRequestException('Machine does not belong to your zone');
    }
  }

  private validateMachinePartRelation(
    partToValidate: MachinePart,
  ): void {
    if (!partToValidate) {
      throw new InvalidRequestException('Part does not exist');
    }
  }

  private validateOrderRelation(orderToValidate: Order): void {
    if (!orderToValidate) {
      throw new InvalidRequestException('Order does not exist');
    }
  }

  private validateBillRelation(billToValidate: Bill, ordererId: number): void {
    if (!billToValidate) {
      throw new InvalidRequestException('Bill does not exist');
    }

    if (billToValidate.getOrderBy() !== ordererId) {
      throw new InvalidRequestException('Bill does not belong to the current user');
    }
  }

  private validateChangeOrderData(orderToValidate: Order): void {
    if (
      orderToValidate.getStatus() === OrderStatus.DELIVERED
      || orderToValidate.getStatus() === OrderStatus.CANCELED
    ) {
      throw new InvalidRequestException('You cannot delete/edit order that finished');
    }
  }

  private validateChangeOrderStatusToShipping(orderToUpdate: Order): void {
    if (orderToUpdate.getStatus() === OrderStatus.SHIPPING) {
      throw new InvalidRequestException('Order status is already shipping');
    } else {
      throw new InvalidRequestException('Other status cannot be changed to shipping');
    }
  }

  private validateChangeOrderStatusToDelivered(orderToUpdate: Order): void {
    if (orderToUpdate.getStatus() !== OrderStatus.SHIPPING) {
      throw new InvalidRequestException('Order status must be shipping to be changed to delivered');
    }
  }

  private validateChangeOrderStatusToCanceled(orderToUpdate: Order): void {
    if (orderToUpdate.getStatus() !== OrderStatus.SHIPPING) {
      throw new InvalidRequestException('Order status must be shipping to be changed to canceled');
    }
  }

}
