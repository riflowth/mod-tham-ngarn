import { Bill } from '@/entities/Bill';
import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
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
    if (!NumberUtils.isPositiveInteger(billId)) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    const expectedOrders = new Order().setBillId(billId);
    return this.orderRepository.read(expectedOrders, readOptions);
  }

  public async addOrder(newOrder: Order, ordererId: number, ordererZoneId: number): Promise<Order> {
    const machineId = newOrder.getMachineId();
    const partId = newOrder.getPartId();
    const billId = newOrder.getBillId();
    const price = newOrder.getPrice();

    const orderId = newOrder.getOrderId();
    const arrivalDate = newOrder.getArrivalDate();
    const status = newOrder.getStatus();

    if (orderId || arrivalDate || status) {
      throw new InvalidRequestException('OrderId, ArrivalDate and Status must not be set');
    }

    if (!NumberUtils.isPositiveInteger(ordererId)) {
      throw new InvalidRequestException('OrdererId must be a non-negative number');
    }

    if (machineId && !NumberUtils.isPositiveInteger(machineId)) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    if (partId && !NumberUtils.isPositiveInteger(partId)) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    if (billId && !NumberUtils.isPositiveInteger(billId)) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    if (price && !NumberUtils.isPositiveInteger(price)) {
      throw new InvalidRequestException('Price must be a non-negative number');
    }

    if (machineId && partId) {
      throw new InvalidRequestException('You can only order a machine or a machinePart, not both');
    }

    if (!machineId && !partId) {
      throw new InvalidRequestException('You must order at least machine or a machinePart');
    }

    if (billId) {
      const billToValidate = await this.billRepository.readByBillId(billId);
      this.validateBillRelation(billToValidate, ordererId);
    }

    if (machineId) {
      const machineToValidate = await this.machineRepository.readByMachineId(machineId);
      this.validateMachineRelation(machineToValidate, ordererZoneId);
    }

    if (partId) {
      const partToValidate = await this.machinePartRepository.readByPartId(partId);
      this.validateMachinePartRelation(partToValidate);

      const machineByPartToValidate = await this.machineRepository
        .readByMachineId(partToValidate.getMachineId());

      this.validateMachineRelation(machineByPartToValidate, ordererZoneId);
    }

    return this.orderRepository.create(newOrder.setStatus(OrderStatus.SHIPPING));
  }

  public async editOrder(
    orderId: number,
    newOrder: Order,
    billId: number,
    ordererId: number,
  ): Promise<Order> {
    const newStatus = newOrder.getStatus();
    const newMachineId = newOrder.getMachineId();
    const newPartId = newOrder.getPartId();
    const newPrice = newOrder.getPrice();

    const newOrderId = newOrder.getOrderId();
    const newBIllId = newOrder.getBillId();
    const newArrivalDate = newOrder.getArrivalDate();

    if (newOrderId || newBIllId || newArrivalDate) {
      throw new InvalidRequestException('You cannot edit orderId, billId or arrivalDate');
    }

    if (!NumberUtils.parsePositiveInteger(orderId)) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    if (!NumberUtils.parsePositiveInteger(billId)) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    if (!NumberUtils.parsePositiveInteger(ordererId)) {
      throw new InvalidRequestException('OrdererId must be a positive integer');
    }

    if (newStatus && (newMachineId || newPartId || newPrice)) {
      throw new InvalidRequestException('You can only update status or machineId, partId or price, not all');
    }

    if (newMachineId && !NumberUtils.isPositiveInteger(newMachineId)) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    if (newPartId && !NumberUtils.isPositiveInteger(newPartId)) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    if (newPrice && !NumberUtils.isPositiveInteger(newPrice)) {
      throw new InvalidRequestException('Price must be a non-negative number');
    }

    if (!EnumUtils.isIncludesInEnum(newStatus, OrderStatus)) {
      throw new InvalidRequestException('Status to updated must be a SHIPPING, DELIVERED or CANCELLED');
    }

    const orderToValidate = await this.orderRepository.readByOrderId(orderId);
    this.validateOrderRelation(orderToValidate, ordererId);

    const billToValidate = await this.billRepository.readByBillId(orderToValidate.getBillId());
    this.validateBillRelation(billToValidate, ordererId);

    switch (newStatus) {
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
        this.validateChangeOrderData(orderToValidate);
    }

    const expectedOrderToEdit = new Order().setOrderId(orderId);

    const affectedRowsAmount = await this.orderRepository.update(newOrder, expectedOrderToEdit);

    return affectedRowsAmount === 1 ? newOrder.setPrimaryKey(orderId) : null;
  }

  public async deleteOrder(orderId: number, billId: number, ordererId: number): Promise<Order> {
    if (!NumberUtils.isPositiveInteger(orderId)) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    if (!NumberUtils.isPositiveInteger(billId)) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    if (!NumberUtils.isPositiveInteger(ordererId)) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    const orderToValidate = await this.orderRepository.readByOrderId(orderId);
    this.validateOrderRelation(orderToValidate, ordererId);

    const billToValidate = await this.billRepository.readByBillId(orderToValidate.getBillId());
    this.validateBillRelation(billToValidate, ordererId);

    this.validateChangeOrderData(orderToValidate);

    const expectedOrderToDelete = new Order().setOrderId(orderId);

    const relatedMaintenancePart = await this.maintenancePartRepository
      .readByOrderId(orderId);

    if (relatedMaintenancePart) {
      throw new InvalidRequestException('Order has related maintenance part');
    }

    const affectedRowsAmount = await this.orderRepository.delete(expectedOrderToDelete);

    return affectedRowsAmount === 1 ? new Order().setPrimaryKey(orderId) : null;
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

  private validateOrderRelation(orderToValidate: Order, ordererId: number): void {
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
