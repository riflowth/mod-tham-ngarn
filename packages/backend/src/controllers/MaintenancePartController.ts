import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenancePartService } from '@/services/MaintenancePartService';
import { Request, Response } from 'express';
import {
  Controller,
  ControllerMapping,
  Methods,
  RequestBody,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/maintenance')
export class MaintenancePartController extends Controller {

  private readonly maintenancePartService: MaintenancePartService;

  public constructor(maintenancePartService: MaintenancePartService) {
    super();
    this.maintenancePartService = maintenancePartService;
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/part', Methods.GET)
  private async getAllMaintenancePartsByMaintenanceId(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const maintenanceParts = await this.maintenancePartService
      .getMaintenancePartsByMaintenanceId(Number(maintenanceId), readOptions);

    res.status(200).json({ data: maintenanceParts });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/part', Methods.POST)
  @RequestBody('partId', '?type', '?orderId')
  private async addMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { partId, type, orderId } = req.body;

    const newMaintenancePart = new MaintenancePart()
      .setMaintenanceId(Number(maintenanceId))
      .setPartId(partId)
      .setType(type)
      .setOrderId(orderId);
    const maintenancePart = await this.maintenancePartService
      .addMaintenancePart(newMaintenancePart, req.session.staffId);

    res.status(200).json({ data: maintenancePart });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/part/:partId', Methods.PUT)
  @RequestBody('?type', '?orderId')
  private async editMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId, partId } = req.params;
    const { type, orderId } = req.body;
    const { staffId: maintainerId } = req.session;

    const primaryKeyToUpdate: [number, number] = [Number(maintenanceId), Number(partId)];
    const newMaintenancePart = new MaintenancePart()
      .setType(type)
      .setOrderId(orderId);
    const updatedField = await this.maintenancePartService
      .editMaintenancePart(primaryKeyToUpdate, newMaintenancePart, maintainerId);

    res.status(200).json({ data: updatedField });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/part/:partId/status', Methods.PUT)
  @RequestBody('status')
  private async updateMaintenancePartStatus(req: Request, res: Response): Promise<void> {
    const { maintenanceId, partId } = req.params;
    const { status } = req.body;
    const { staffId: maintainerId } = req.session;

    const primaryKeyToUpdate: [number, number] = [Number(maintenanceId), Number(partId)];
    const updatedField = await this.maintenancePartService
      .updateMaintenancePartStatus(primaryKeyToUpdate, status, maintainerId);

    res.status(200).json({ data: updatedField });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/part/:partId', Methods.DELETE)
  private async deleteMaintenancePart(req: Request, res: Response): Promise<void> {
    const { maintenanceId, partId } = req.params;
    const deletedField = await this.maintenancePartService
      .deleteMaintenancePart([Number(maintenanceId), Number(partId)]);
    res.status(200).json({ deletedField });
  }

}
