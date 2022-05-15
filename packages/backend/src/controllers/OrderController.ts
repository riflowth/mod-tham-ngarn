import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { Order } from '@/entities/Order';
import { ReadOptions } from '@/repositories/ReadOptions';
import { OrderService } from '@/services/OrderService';
import {
  Controller,
  ControllerMapping,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

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

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const orders = await this.orderService.getOrdersByBillId(Number(billId), readOptions);

    res.status(200).json({ data: orders });
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/maintenance/:maintenanceId', Methods.GET)
  private async getOrdersPriceByMaintenanceId(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;

    const price = await this.orderService.getOrdersPriceByMaintenanceId(Number(maintenanceId));

    res.status(200).json({ data: price });
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:billId/order', Methods.POST)
  @RequestBody('?machineId', '?partId', '?price')
  private async addOrder(req: Request, res: Response): Promise<void> {
    const {
      staffId: ordererIdToValidate,
      role: ordererRoleToValidate,
      zoneId: ordererZoneIdToValidate,
    } = req.session;
    const { machineId, partId, price } = req.body;
    const { billId } = req.params;

    const newOrder = new Order()
      .setBillId(Number(billId))
      .setMachineId(machineId)
      .setPartId(partId)
      .setPrice(price);

    const createdFields = await this.orderService.addOrder(
      newOrder,
      ordererIdToValidate,
      ordererRoleToValidate,
      ordererZoneIdToValidate,
    );

    res.status(200).json({ createdFields });
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:billId/order/:orderId', Methods.PUT)
  @RequestBody('?machineId', '?partId', '?price')
  private async editOrder(req: Request, res: Response): Promise<void> {
    const { staffId: ordererIdToValidate, role: ordererRoleToValidate } = req.session;
    const { orderId, billId } = req.params;
    const { machineId, partId, price } = req.body;

    const newOrder = new Order()
      .setMachineId(machineId)
      .setPartId(partId)
      .setPrice(price);

    const updatedField = await this.orderService.editOrder(
      Number(orderId),
      newOrder,
      Number(billId),
      ordererIdToValidate,
      ordererRoleToValidate,
    );

    res.status(200).json({ updatedField });
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:billId/order/:orderId/status', Methods.PUT)
  @RequestBody('status')
  private async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const { staffId: ordererIdToValidate, role: ordererRoleToValidate } = req.session;
    const { orderId, billId } = req.params;
    const { status } = req.body;

    const updatedField = await this.orderService.updateOrderStatus(
      Number(orderId),
      status,
      Number(billId),
      ordererIdToValidate,
      ordererRoleToValidate,
    );

    res.status(200).json({ updatedField });
  }

  @Authentication(Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:billId/order/:orderId', Methods.DELETE)
  private async deleteOrder(req: Request, res: Response): Promise<void> {
    const { staffId: ordererIdToValidate, role: ordererRoleToValidate } = req.session;
    const { orderId, billId } = req.params;

    const deletedField = await this.orderService.deleteOrder(
      Number(orderId),
      Number(billId),
      ordererIdToValidate,
      ordererRoleToValidate,
    );

    res.status(200).json({ deletedField });
  }

}
