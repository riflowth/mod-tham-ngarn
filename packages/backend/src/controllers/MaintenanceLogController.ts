import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenanceLogService } from '@/services/MaintenanceLogService';
import {
  Controller,
  ControllerMapping,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

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
    const { zoneId } = req.session;

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const maintenanceLogs = await this.maintenanceLogService
      .getMaintenanceLogsByMachineId(Number(machineId), zoneId, readOptions);

    res.status(200).json({ data: maintenanceLogs });
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/', Methods.POST)
  @RequestBody('machineId', '?reason')
  private async addMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { machineId, reason } = req.body;
    const { staffId: reporterId, zoneId: reporterZoneId } = req.session;

    const newMaintenanceLog = new MaintenanceLog()
      .setMachineId(machineId)
      .setReporterId(reporterId)
      .setReason(reason);
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

    const newMaintenanceLog = new MaintenanceLog()
      .setReason(reason);
    const updatedField = await this.maintenanceLogService
      .editMaintenanceLog(Number(maintenanceId), newMaintenanceLog, reporterId);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/status', Methods.PUT)
  @RequestBody('status')
  private async updateMaintenanceLogStatus(req: Request, res: Response): Promise<void> {
    const { staffId: reporterId } = req.session;
    const { maintenanceId } = req.params;
    const { status } = req.body;
    const updatedField = await this.maintenanceLogService
      .updateMaintenanceLogStatus(Number(maintenanceId), status, reporterId);
    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/claim', Methods.GET)
  private async claimMaintenance(req: Request, res: Response): Promise<void> {
    const { staffId: reporterId, role } = req.session;
    const { maintenanceId } = req.params;
    const updatedField = await this.maintenanceLogService
      .claimMaintenanceLog(Number(maintenanceId), reporterId, role);
    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN)
  @RouteMapping('/:maintenanceId/unclaim', Methods.GET)
  private async unclaimMaintenance(req: Request, res: Response): Promise<void> {
    const { staffId: reporterId } = req.session;
    const { maintenanceId } = req.params;
    const updatedField = await this.maintenanceLogService
      .unclaimMaintenanceLog(Number(maintenanceId), reporterId);
    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/:maintenanceId', Methods.DELETE)
  private async deleteMaintenance(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { staffId, role } = req.session;
    const deletedField = await this.maintenanceLogService
      .deleteMaintenanceLog(Number(maintenanceId), staffId, role);
    res.status(200).json({ data: { deletedField } });
  }

}
