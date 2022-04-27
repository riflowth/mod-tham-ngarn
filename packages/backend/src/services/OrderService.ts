import { Bill } from '@/entities/Bill';
import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

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
    const expectedOrders = new Order().setBillId(billId);
    return this.orderRepository.read(expectedOrders, readOptions);
  }

  public async addOrder(newOrder: Order, ordererId: number, ordererZoneId: number): Promise<Order> {
    const machineId = newOrder.getMachineId();
    const partId = newOrder.getPartId();
    if (machineId && partId) {
      throw new InvalidRequestException('You can only order a machine or a machinePart, not both');
    }

    if (!machineId && !partId) {
      throw new InvalidRequestException('You must order at least machine or a machinePart');
    }

    const billId = newOrder.getBillId();
    if (billId) {
      const billToValidate = await this.getBillById(billId);
      await this.validateBill(billToValidate, ordererId);
    }

    if (machineId) {
      const machineToValidate = await this.getMachineById(machineId);
      await this.validateMachine(machineToValidate, ordererZoneId);
    }

    if (partId) {
      const partToValidate = await this.getMachinePartById(partId);
      await this.validateMachinePart(partToValidate, ordererZoneId);

      const machineByPartToValidate = await this.getMachineById(partToValidate.getMachineId());
      await this.validateMachine(machineByPartToValidate, ordererZoneId);
    }

    return this.orderRepository.create(newOrder);
  }

  public async editOrder(
    orderId: number,
    newOrder: Order,
    ordererId: number,
  ): Promise<Order> {
    const orderToValidate = await this.getOrderById(orderId);
    await this.validateOrder(orderToValidate, ordererId);

    const expectedOrderToEdit = new Order().setOrderId(orderId);

    const affectedRowsAmount = await this.orderRepository.update(newOrder, expectedOrderToEdit);

    return affectedRowsAmount === 1 ? newOrder.setPrimaryKey(orderId) : null;

  }

  public async deleteOrder(orderId: number, ordererId: number): Promise<Order> {
    const orderToValidate = await this.getOrderById(orderId);
    await this.validateOrder(orderToValidate, ordererId);

    const expectedOrderToDelete = new Order().setOrderId(orderId);

    const relatedMaintenancePart = await this.getMaintenancePartByOrderId(orderId);

    if (relatedMaintenancePart) {
      throw new InvalidRequestException('Order has related maintenance part');
    }

    const affectedRowsAmount = await this.orderRepository.delete(expectedOrderToDelete);

    return affectedRowsAmount === 1 ? new Order().setPrimaryKey(orderId) : null;
  }

  private async getOrderById(orderId: number): Promise<Order> {
    const expectedOrder = new Order().setOrderId(orderId);
    const [order] = await this.orderRepository.read(expectedOrder);

    return order;
  }

  private async getBillById(billId: number): Promise<Bill> {
    const expectedBill = new Bill().setBillId(billId);
    const [bill] = await this.billRepository.read(expectedBill);

    return bill;
  }

  private async getMachineById(machineId: number): Promise<Machine> {
    const expectedMachine = new Machine().setMachineId(machineId);
    const [machine] = await this.machineRepository.read(expectedMachine);

    return machine;
  }

  private async getMachinePartById(partId: number): Promise<MachinePart> {
    const expectedPart = new MachinePart().setPartId(partId);
    const [part] = await this.machinePartRepository.read(expectedPart);

    return part;
  }

  private async getMaintenancePartByOrderId(orderId: number): Promise<MaintenancePart> {
    const expectedPart = new MaintenancePart().setOrderId(orderId);
    const [part] = await this.maintenancePartRepository.read(expectedPart);

    return part;
  }

  private async validateBill(billToValidate: Bill, ordererId: number): Promise<void> {
    if (!billToValidate) {
      throw new InvalidRequestException('Bill does not exist');
    }

    if (billToValidate.getOrderBy() !== ordererId) {
      throw new InvalidRequestException('Bill does not belong to the current user');
    }
  }

  private async validateMachine(
    machineToValidate: Machine,
    ordererZoneId: number,
  ): Promise<void> {
    if (!machineToValidate) {
      throw new InvalidRequestException('Machine does not exist');
    }

    if (machineToValidate.getZoneId() !== ordererZoneId) {
      throw new InvalidRequestException('Machine does not belong to your zone');
    }
  }

  private async validateMachinePart(
    partToValidate: MachinePart,
    ordererZoneId: number,
  ): Promise<void> {
    if (!partToValidate) {
      throw new InvalidRequestException('Part does not exist');
    }
  }

  private async validateOrder(orderToValidate: Order, ordererId: number): Promise<void> {
    if (!orderToValidate) {
      throw new InvalidRequestException('Order does not exist');
    }

    const relatedBill = await this.getBillById(orderToValidate.getBillId());
    if (relatedBill.getBillId() !== orderToValidate.getBillId()) {
      throw new InvalidRequestException('Order does not belong to the bill');
    }

    if (relatedBill.getOrderBy() !== ordererId) {
      throw new InvalidRequestException('Order does not belong to the current user');
    }

    if (
      orderToValidate.getStatus() === OrderStatus.DELIVERED
      || orderToValidate.getStatus() === OrderStatus.CANCELED
    ) {
      throw new InvalidRequestException('You cannot delete/edit order that finished');
    }
  }

}
