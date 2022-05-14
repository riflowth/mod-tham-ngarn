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

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/machine/:machineId', Methods.GET)
  private async getMaintenanceByMachineId(req: Request, res: Response): Promise<void> {
    const { limit, offset } = req.query;
    const { machineId } = req.params;
    const { zoneId: staffZoneIdToValidate, role: staffRoleToValidate } = req.session;

    const readOptions: ReadOptions = {
      limit: Number(limit),
      offset: Number(offset),
    };

    const maintenanceLogs = await this.maintenanceLogService.getMaintenanceLogsByMachineId(
      Number(machineId),
      staffZoneIdToValidate,
      staffRoleToValidate,
      readOptions,
    );

    res.status(200).json({ data: maintenanceLogs });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/branch/:branchId', Methods.GET)
  private async getMaintenanceByBranchId(req: Request, res: Response): Promise<void> {
    const { status, limit, offset } = req.query;
    const { branchId } = req.params;
    const { branchId: staffBranchIdToValidate, role: staffRoleToValidate } = req.session;

    const readOptions: ReadOptions = {
      limit: Number(limit),
      offset: Number(offset),
    };

    const maintenanceLogs = await this.maintenanceLogService.getMaintenanceLogByBranchId(
      Number(branchId),
      staffBranchIdToValidate,
      staffRoleToValidate,
      String(status),
      readOptions,
    );

    res.status(200).json({ data: maintenanceLogs });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('machineId', '?reason')
  private async addMaintenanceLog(req: Request, res: Response): Promise<void> {
    const { machineId, reason } = req.body;
    const {
      staffId: reporterId,
      role: reporterRoleToValidate,
      zoneId: reporterZoneIdToValidate,
    } = req.session;

    const newMaintenanceLog = new MaintenanceLog()
      .setMachineId(machineId)
      .setReporterId(reporterId)
      .setReason(reason);
    const createdField = await this.maintenanceLogService
      .addMaintenanceLog(newMaintenanceLog, reporterZoneIdToValidate, reporterRoleToValidate);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId', Methods.PUT)
  @RequestBody('reason')
  private async editMaintenanceLog(req: Request, res: Response): Promise<void> {
    const {
      staffId: reporterId,
      role: reporterRoleToValidate,
    } = req.session;
    const { maintenanceId } = req.params;
    const { reason } = req.body;

    const newMaintenanceLog = new MaintenanceLog()
      .setReason(reason);
    const updatedField = await this.maintenanceLogService.editMaintenanceLog(
      Number(maintenanceId),
      newMaintenanceLog,
      reporterId,
      reporterRoleToValidate,
    );

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/status', Methods.PUT)
  @RequestBody('status')
  private async updateMaintenanceLogStatus(req: Request, res: Response): Promise<void> {
    const {
      staffId: maintainerIdToValidate,
      role: maintainerRoleToValidate,
    } = req.session;
    const { maintenanceId } = req.params;
    const { status } = req.body;

    const updatedField = await this.maintenanceLogService.updateMaintenanceLogStatus(
      Number(maintenanceId),
      status,
      maintainerIdToValidate,
      maintainerRoleToValidate,
    );

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/claim', Methods.GET)
  private async claimMaintenance(req: Request, res: Response): Promise<void> {
    const {
      staffId: claimerIdToValidate,
      role: claimerRoleToValidate,
    } = req.session;
    const { maintenanceId } = req.params;

    const updatedField = await this.maintenanceLogService.claimMaintenanceLog(
      Number(maintenanceId),
      claimerIdToValidate,
      claimerRoleToValidate,
    );

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId/unclaim', Methods.GET)
  private async unclaimMaintenance(req: Request, res: Response): Promise<void> {
    const { staffId: reporterId } = req.session;
    const { maintenanceId } = req.params;
    const updatedField = await this.maintenanceLogService
      .unclaimMaintenanceLog(Number(maintenanceId), reporterId);
    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:maintenanceId', Methods.DELETE)
  private async deleteMaintenance(req: Request, res: Response): Promise<void> {
    const { maintenanceId } = req.params;
    const { staffId, role } = req.session;
    const deletedField = await this.maintenanceLogService
      .deleteMaintenanceLog(Number(maintenanceId), staffId, role);
    res.status(200).json({ data: { deletedField } });
  }

}
