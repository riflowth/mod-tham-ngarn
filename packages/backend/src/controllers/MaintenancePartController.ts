import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenancePartService } from '@/services/MaintenancePartService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';
import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';

@ControllerMapping('/maintenance')
export class MaintenancePartController extends Controller {

  private readonly maintenancePartService: MaintenancePartService;

  public constructor(maintenancePartService: MaintenancePartService) {
    super();
    this.maintenancePartService = maintenancePartService;
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/part', Methods.GET)
  private async getMaintenancePartsByMaintenanceId(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);

    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    const maintenanceParts = await this.maintenancePartService
      .getMaintenancePartsByMaintenanceId(parseMaintenanceId, readOptions);

    res.status(200).json({ data: maintenanceParts });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/part', Methods.POST)
  @RequestBody('partId', '?type', '?status', '?orderId')
  private async addMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const {
      partId,
      type,
      status,
      orderId,
    } = req.body;

    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);
    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const parsePartId = NumberUtils.parsePositiveInteger(partId);
    if (!parsePartId) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    const parseOrderId = NumberUtils.parsePositiveInteger(orderId);
    if (orderId && !parseOrderId) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    const newMaintenancePart = new MaintenancePart()
      .setMaintenanceId(parseMaintenanceId)
      .setPartId(parsePartId)
      .setType(type)
      .setStatus(status)
      .setOrderId(parseOrderId);

    const maintenancePart = await this.maintenancePartService
      .addMaintenancePart(newMaintenancePart, req.session.staffId);

    res.status(200).json({ data: maintenancePart });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/part', Methods.PUT)
  @RequestBody('partId', '?type', '?orderId')
  private async editMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { partId, type, orderId } = req.body;
    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);

    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const parsePartId = NumberUtils.parsePositiveInteger(partId);
    if (!parsePartId) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    const parseOrderId = NumberUtils.parsePositiveInteger(orderId);
    if (orderId && !parseOrderId) {
      throw new InvalidRequestException('OrderId must be a positive integer');
    }

    const primaryKeyToUpdate: [number, number] = [parseMaintenanceId, parsePartId];
    const newMaintenancePart = new MaintenancePart()
      .setType(type)
      .setOrderId(parseOrderId);

    const updatedField = await this.maintenancePartService
      .editMaintenancePart(primaryKeyToUpdate, newMaintenancePart, req.session.staffId);

    res.status(200).json({ data: updatedField });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/part', Methods.DELETE)
  @RequestBody('partId')
  private async deleteMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { partId } = req.body;
    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);

    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const parsePartId = NumberUtils.parsePositiveInteger(partId);

    if (!parsePartId) {
      throw new InvalidRequestException('PartId must be a positive integer');
    }

    const primaryKeyToDelete: [number, number] = [parseMaintenanceId, parsePartId];

    const deletedField = await this.maintenancePartService
      .deleteMaintenancePart(primaryKeyToDelete);

    res.status(200).json({ deletedField });
  }

}
