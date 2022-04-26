import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Machine } from '@/entities/Machine';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MachineService } from '@/services/MachineService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';

@ControllerMapping('/machine')
export class MachineController extends Controller {

  private readonly machineService: MachineService;

  public constructor(machineService: MachineService) {
    super();
    this.machineService = machineService;
  }

  @Authentication(Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllMachines(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    const machines = await this.machineService.getAllMachines(readOptions);

    res.status(200).json({ data: machines });
  }

  @RouteMapping('/zone/:zoneId', Methods.GET)
  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN, Role.OFFICER)
  private async getMachinesByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    if (!parseZoneId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const machines = await this.machineService.getMachinesByZoneId(parseZoneId, readOptions);

    res.status(200).json({ data: machines });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.TECHNICIAN)
  @RouteMapping('/branch/:branchId', Methods.GET)
  private async getMachineByBranchId(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    if (!parseBranchId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const machines = await this.machineService.getMachinesByBranchId(parseBranchId, readOptions);

    res.status(200).json({ data: machines });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/', Methods.POST)
  @RequestBody('zoneId', 'name', 'serial', 'manufacturer', 'registrationDate', 'retiredDate')
  private async addMachine(req: Request, res: Response): Promise<void> {
    const {
      zoneId,
      name,
      serial,
      manufacturer,
      registrationDate,
      retiredDate,
    } = req.body;
    const parseZoneId = NumberUtils.parsePositiveInteger(zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const newMachine = new Machine()
      .setZoneId(parseZoneId)
      .setName(name)
      .setSerial(serial)
      .setManufacturer(manufacturer)
      .setRegistrationDate(new Date(registrationDate))
      .setRetiredDate(new Date(retiredDate));

    const createdMachine = await this.machineService.addMachine(newMachine);

    res.status(200).json({ data: { createdMachine } });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/:machineId', Methods.PUT)
  @RequestBody('?zoneId', '?name', '?serial', '?manufacturer', '?registrationDate', '?retiredDate')
  private async editMachineByMachineId(req: Request, res: Response) :Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);

    if (!parseMachineId) {
      throw new InvalidRequestException('MachineId must be a positive integer');
    }

    const {
      zoneId,
      name,
      serial,
      manufacturer,
      registrationDate,
      retiredDate,
    } = req.body;

    if (
      zoneId === undefined
      && name === undefined
      && serial === undefined
      && manufacturer === undefined
      && manufacturer === undefined
      && registrationDate === undefined
      && retiredDate === undefined
    ) {
      throw new InvalidRequestException('No provided data to update');
    }

    const newMachine = new Machine()
      .setZoneId(zoneId)
      .setName(name)
      .setSerial(serial)
      .setManufacturer(manufacturer)
      .setRegistrationDate(!registrationDate ? undefined : new Date(registrationDate))
      .setRetiredDate(!retiredDate ? undefined : new Date(retiredDate));

    const updatedField = await this.machineService.editMachine(parseMachineId, newMachine);

    res.status(200).json({ data: { updatedField } });
  }

}
