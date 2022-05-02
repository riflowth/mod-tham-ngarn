import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { Zone } from '@/entities/Zone';
import { ReadOptions } from '@/repositories/ReadOptions';
import { ZoneService } from '@/services/ZoneService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';
import {
  Controller,
  ControllerMapping,
  Methods,
  RequestBody,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/zone')
export class ZoneController extends Controller {

  private readonly zoneService: ZoneService;

  public constructor(zoneService: ZoneService) {
    super();
    this.zoneService = zoneService;
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllZones(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const zones = await this.zoneService.getAllZones(readOptions);
    res.status(200).json({ data: zones });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/me', Methods.GET)
  private async getZoneByRequester(req: Request, res: Response): Promise<void> {
    const {
      role: roleToValidate,
      zoneId: zoneIdToValidate,
      branchId: branchIdToValidate,
    } = req.session;
    const zone = await this.zoneService
      .getZoneByZoneId(req.session.zoneId, roleToValidate, zoneIdToValidate, branchIdToValidate);
    res.status(200).json({ data: zone });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.GET)
  private async getZoneByZoneId(req: Request, res: Response): Promise<void> {
    const {
      role: roleToValidate,
      zoneId: zoneIdToValidate,
      branchId: branchIdToValidate,
    } = req.session;

    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    const zone = await this.zoneService
      .getZoneByZoneId(parseZoneId, roleToValidate, zoneIdToValidate, branchIdToValidate);

    res.status(200).json({ data: zone });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('branchId', '?timeToStart', '?timeToEnd')
  private async addZone(req: Request, res: Response): Promise<void> {
    const { timeToStart, timeToEnd, branchId } = req.body;
    const {
      role: roleToValidate,
      branchId: branchIdToValidate,
    } = req.session;

    const parseBranchId = NumberUtils.parsePositiveInteger(branchId);

    const newZone = new Zone()
      .setBranchId(parseBranchId)
      .setTimeToStart(timeToStart)
      .setTimeToEnd(timeToEnd);
    const createdField = await this.zoneService
      .addZone(newZone, roleToValidate, branchIdToValidate);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.PUT)
  @RequestBody('?branchId', '?timeToStart', '?timeToEnd')
  private async editZoneByZoneId(req: Request, res: Response): Promise<void> {
    const { timeToStart, timeToEnd, branchId } = req.body;
    const { zoneId } = req.params;
    const {
      role: roleToValidate,
      branchId: branchIdToValidate,
    } = req.session;

    const parseZoneId = NumberUtils.parsePositiveInteger(zoneId);
    const parseBranchId = NumberUtils.parsePositiveInteger(branchId);

    const newZone = new Zone()
      .setBranchId(parseBranchId)
      .setTimeToStart(timeToStart)
      .setTimeToEnd(timeToEnd);
    const updatedField = await this.zoneService
      .editZone(parseZoneId, newZone, roleToValidate, branchIdToValidate);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.DELETE)
  public async deleteZoneByZoneId(req: Request, res: Response): Promise<void> {
    const {
      role: roleToValidate,
      branchId: branchIdToValidate,
    } = req.session;

    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);
    const deletedField = await this.zoneService
      .deleteZone(parseZoneId, roleToValidate, branchIdToValidate);

    res.status(200).json({ data: { deletedField } });
  }

}
