import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintainerAction, MaintenanceLogService, MaintenanceLogStatus } from '@/services/MaintenanceLogService';
import { EnumUtils } from '@/utils/EnumUtils';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';
import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';

@ControllerMapping('/maintenance')
export class MaintenanceLogController extends Controller {

  private readonly maintenanceLogService: MaintenanceLogService;

  public constructor(maintenanceLogService: MaintenanceLogService) {
    super();
    this.maintenanceLogService = maintenanceLogService;
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/', Methods.GET)
  private async getMaintenanceLogsByQuery(req: Request, res: Response): Promise<void> {
    const { machineId } = req.query;

    const parseMachineId = NumberUtils.parsePositiveInteger(machineId);
    if (!parseMachineId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const maintenanceLogs = await this.maintenanceLogService
      .getMaintenanceLogsByMachineId(parseMachineId, readOptions);

    res.status(200).json({ data: maintenanceLogs });
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/', Methods.POST)
  @RequestBody('machineId', '?reason')
  private async addMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { machineId, reason } = req.body;
    const { staffId: reporterId, zoneId: reporterZoneId } = req.session;

    const parseMachineId = NumberUtils.parsePositiveInteger(machineId);
    if (!parseMachineId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const newMaintenanceLog = new MaintenanceLog()
      .setMachineId(parseMachineId)
      .setReporterId(reporterId)
      .setReason(reason)
      .setStatus(MaintenanceLogStatus.OPENED)
      .setReportDate(new Date());
    const createdField = await this.maintenanceLogService
      .addMaintenanceLog(newMaintenanceLog, reporterZoneId);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/:maintenanceId', Methods.PUT)
  @RequestBody('reason')
  private async editMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { staffId: reporterId } = req.session;
    const { maintenanceId } = req.params;
    const { reason } = req.body;

    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);
    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const newMaintenanceLog = new MaintenanceLog().setReason(reason);
    const updatedField = await this.maintenanceLogService
      .editMaintenanceLog(parseMaintenanceId, newMaintenanceLog, reporterId);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/:maintenanceId', Methods.DELETE)
  private async deleteMaintenance(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { staffId } = req.session;

    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);
    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const deletedField = await this.maintenanceLogService
      .deleteMaintenanceLog(parseMaintenanceId, staffId);

    res.status(200).json({ data: { deletedField } });
  }

  @RouteMapping('/action', Methods.POST)
  @Authentication(Role.TECHNICIAN)
  @RequestBody('maintenanceId', 'action')
  private async actionMaintenance(req: Request, res: Response): Promise<void> {
    const { maintenanceId, action } = req.body;

    const parseMaintenanceId = NumberUtils.parsePositiveInteger(maintenanceId);
    if (!parseMaintenanceId) {
      throw new InvalidRequestException('MaintenanceId must be a positive integer');
    }

    const isValidAction = EnumUtils.isIncludesInEnum(action, MaintainerAction);
    if (!isValidAction) {
      throw new InvalidRequestException('Action type is not valid');
    }

    res.status(200).json({ data: { maintenanceId, action } });

  }

}
