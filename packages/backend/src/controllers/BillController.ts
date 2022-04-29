import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Bill } from '@/entities/Bill';
import { ForbiddenException } from '@/exceptions/ForbiddenException';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { BillService } from '@/services/BillService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';

@ControllerMapping('/bill')
export class BillController extends Controller {

  private readonly billService: BillService;

  public constructor(billService: BillService) {
    super();
    this.billService = billService;
  }

  @Authentication(Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllBills(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const bills = await this.billService.getAllBills(readOptions);
    res.status(200).json({ data: bills });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/branch/:branchId', Methods.GET)
  private async getBillsByBranchId(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);
    if (parseBranchId !== req.session.branchId && req.session.role !== 'CEO') {
      throw new ForbiddenException('This is not your branch');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const bills = await this.billService.getBillsByBranchId(parseBranchId, readOptions);

    res.status(200).json({ data: bills });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/', Methods.POST)
  @RequestBody('storeName', 'orderDate', 'orderBy')
  private async addBill(req: Request, res: Response): Promise<void> {
    const { storeName, orderDate, orderBy } = req.body;

    const parseOrderBy = NumberUtils.parsePositiveInteger(orderBy);
    if (parseOrderBy !== req.session.staffId) {
      throw new InvalidRequestException('You are not who you say you are');
    }

    const newBill = new Bill()
      .setStoreName(storeName)
      .setOrderDate(new Date(orderDate))
      .setOrderBy(parseOrderBy);
    const createdField = await this.billService.addBill(newBill);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/:billId', Methods.PUT)
  @RequestBody('?storeName', '?orderDate', '?orderBy')
  private async editBillByBillId(req: Request, res: Response): Promise<void> {
    const parseBillId = NumberUtils.parsePositiveInteger(req.params.billId);

    if (Object.keys(req.body).length === 0) {
      throw new InvalidRequestException('No provided data to update');
    }

    const { storeName, orderDate, orderBy } = req.body;

    let parseOrderBy: number;
    if (orderBy !== undefined) {
      parseOrderBy = NumberUtils.parsePositiveInteger(orderBy);
    }

    const newBill = new Bill()
      .setStoreName(storeName)
      .setOrderDate(orderDate ? new Date(orderDate) : undefined)
      .setOrderBy(parseOrderBy);
    const updatedField = await this.billService.editBill(parseBillId, newBill, req.session.staffId);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/:billId', Methods.DELETE)
  private async deleteBillByBillId(req: Request, res: Response): Promise<void> {
    const parseBillId = NumberUtils.parsePositiveInteger(req.params.billId);
    const deletedField = await this.billService.deleteBill(parseBillId, req.session.staffId);
    res.status(200).json({ data: { deletedField } });
  }

}
