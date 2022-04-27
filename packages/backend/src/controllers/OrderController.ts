import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { OrderService } from '@/services/OrderService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';

@ControllerMapping('/bill')
export class OrderController extends Controller {

  private readonly orderService: OrderService;

  public constructor(orderService: OrderService) {
    super();
    this.orderService = orderService;
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:billId/order', Methods.GET)
  private async getOrdersByBillId(req: Request, res: Response): Promise<void> {
    const { billId } = req.params;
    const parseBillId = NumberUtils.parsePositiveInteger(billId);

    if (!parseBillId) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    const orders = await this.orderService.getOrdersByBillId(parseBillId, readOptions);

    res.status(200).json({ data: orders });
  }

  @Authentication(Role.PURCHASING)
  @RouteMapping('/:billId/order', Methods.POST)
  @RequestBody('?machineId', '?partId', '?price')
  private async addOrder(req: Request, res: Response): Promise<void> {
    const { staffId: ordererId, zoneId: ordererZoneId } = req.session;
    const { machineId, partId, price } = req.body;
    const { billId } = req.params;

    const parseBillId = NumberUtils.parsePositiveInteger(billId);
    if (!parseBillId) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    const parseMachineId = NumberUtils.parsePositiveInteger(machineId);
    if (machineId && !parseMachineId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const parseMachinePartId = NumberUtils.parsePositiveInteger(partId);
    if (partId && !parseMachinePartId) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    const parsePrice = NumberUtils.parseNonNegativeNumber(price);
    if (price && !parsePrice) {
      throw new InvalidRequestException('Price must be a non-negative number');
    }

    const newOrder = new Order()
      .setBillId(parseBillId)
      .setMachineId(parseMachineId)
      .setPartId(parseMachinePartId)
      .setPrice(parsePrice);

    const createdFields = await this.orderService.addOrder(newOrder, ordererId, ordererZoneId);

    res.status(200).json({ createdFields });
  }

  @Authentication(Role.PURCHASING)
  @RouteMapping('/:billId/order', Methods.PUT)
  @RequestBody('orderId', '?machineId', '?partId', '?price')
  private async editOrder(req: Request, res: Response): Promise<void> {
    const { staffId: ordererId } = req.session;
    const {
      orderId,
      machineId,
      partId,
      price,
    } = req.body;
    const { billId } = req.params;

    const parseBillId = NumberUtils.parsePositiveInteger(billId);
    if (!parseBillId) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    const parseOrderId = NumberUtils.parsePositiveInteger(orderId);
    if (!parseOrderId) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    const parseMachineId = NumberUtils.parsePositiveInteger(machineId);
    if (machineId && !parseMachineId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const parseMachinePartId = NumberUtils.parsePositiveInteger(partId);
    if (partId && !parseMachinePartId) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    const parsePrice = NumberUtils.parseNonNegativeNumber(price);
    if (price && !parsePrice) {
      throw new InvalidRequestException('Price must be a non-negative number');
    }

    const newOrder = new Order()
      .setPrice(parsePrice);

    const updatedField = await this.orderService
      .editOrder(parseOrderId, newOrder, ordererId);

    res.status(200).json({ updatedField });
  }

  @Authentication(Role.PURCHASING)
  @RouteMapping('/:billId/order', Methods.DELETE)
  @RequestBody('orderId')
  private async deleteOrder(req: Request, res: Response): Promise<void> {
    const { staffId: ordererId } = req.session;
    const { orderId } = req.body;
    const { billId } = req.params;

    const parseBillId = NumberUtils.parsePositiveInteger(billId);
    if (!parseBillId) {
      throw new InvalidRequestException('BillId must be a positive integer');
    }

    const parseOrderId = NumberUtils.parsePositiveInteger(orderId);
    if (!parseOrderId) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    const deletedField = await this.orderService.deleteOrder(parseOrderId, ordererId);

    res.status(200).json({ deletedField });
  }

}
