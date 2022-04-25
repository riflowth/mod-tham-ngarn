import { Controller } from '@/controllers/Controller';
import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Zone } from '@/entities/Zone';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { ZoneService } from '@/services/ZoneService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';
import { Methods } from './Route';

@ControllerMapping('/zone')
export class ZoneController extends Controller {

  private readonly zoneService: ZoneService;

  public constructor(zoneService: ZoneService) {
    super();
    this.zoneService = zoneService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
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
  @RouteMapping('/:zoneId', Methods.GET)
  private async getZoneByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('ZoneId must be a positive integer');
    }

    const zone = await this.zoneService.getZoneByZoneId(parseZoneId);

    res.status(200).json({ data: zone });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('branchId', '?timeToStart', '?timeToEnd')
  private async addZone(req: Request, res: Response): Promise<void> {
    const { timeToStart, timeToEnd, branchId } = req.body;

    const parseBranchId = NumberUtils.parsePositiveInteger(branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('BranchId must be a positive integer');
    }

    const newZone = new Zone()
      .setBranchId(branchId)
      .setTimeToStart(timeToStart)
      .setTimeToEnd(timeToEnd);

    const createdField = await this.zoneService.addZone(newZone);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.PUT)
  @RequestBody('branchId', '?timeToStart', '?timeToEnd')
  private async editZoneByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('ZoneId must be a positive integer');
    }

    const { timeToStart, timeToEnd, branchId } = req.body;

    if (timeToStart === undefined && timeToEnd === undefined && branchId === undefined) {
      throw new InvalidRequestException('No provided data to update');
    }

    const newZone = new Zone()
      .setBranchId(branchId)
      .setTimeToStart(timeToStart)
      .setTimeToEnd(timeToEnd);

    const updatedField = await this.zoneService.editZone(parseZoneId, newZone);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.DELETE)
  public async deleteZoneByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('ZoneId must be a positive integer');
    }

    const deletedField = await this.zoneService.deleteZone(parseZoneId);

    res.status(200).json({ data: { deletedField } });
  }

}
