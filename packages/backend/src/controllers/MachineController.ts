import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { Machine } from '@/entities/Machine';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MachinePartService } from '@/services/MachinePartService';
import { MachineService } from '@/services/MachineService';
import { NumberUtils } from '@/utils/NumberUtils';
import {
  BadRequestException,
  Controller,
  ControllerMapping,
  ForbiddenException,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/machine')
export class MachineController extends Controller {

  private readonly machineService: MachineService;
  private readonly machinePartService: MachinePartService;

  public constructor(
    machinePartService: MachinePartService,
    machineService: MachineService,
  ) {
    super();
    this.machinePartService = machinePartService;
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

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN, Role.OFFICER)
  @RouteMapping('/zone/:zoneId', Methods.GET)
  private async getMachinesByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    if (req.session.role === 'OFFICER' && parseZoneId !== req.session.zoneId) {
      throw new ForbiddenException('You do not belong in this zone');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const machines = await this.machineService.getMachinesByZoneId(
      parseZoneId,
      readOptions,
      req.session.staffId,
    );

    res.status(200).json({ data: machines });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.TECHNICIAN, Role.PURCHASING)
  @RouteMapping('/branch/:branchId', Methods.GET)
  private async getMachineByBranchId(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);

    if (parseBranchId !== req.session.branchId && req.session.role !== 'CEO') {
      throw new ForbiddenException('This is not your branch');
    }

    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const machines = await this.machineService.getMachinesByBranchId(parseBranchId, readOptions);

    res.status(200).json({ data: machines });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.TECHNICIAN, Role.PURCHASING)
  @RouteMapping('/:machineId/part', Methods.GET)
  private async getMachinePartByMachineId(req: Request, res: Response): Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);

    const machineParts = await this.machinePartService.getAllMachinePartByMachineId(parseMachineId);

    res.status(200).json({ data: machineParts });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/', Methods.POST)
  @RequestBody('zoneId', 'name', 'serial', 'manufacturer', 'registrationDate', 'retiredDate', 'storeName', 'price')
  private async addMachine(req: Request, res: Response): Promise<void> {
    const {
      zoneId,
      name,
      serial,
      manufacturer,
      registrationDate,
      retiredDate,
      price,
      storeName,
    } = req.body;

    const parseZoneId = NumberUtils.parsePositiveInteger(zoneId);
    const newMachine = new Machine()
      .setZoneId(parseZoneId)
      .setName(name)
      .setSerial(serial)
      .setManufacturer(manufacturer)
      .setRegistrationDate(new Date(registrationDate))
      .setRetiredDate(new Date(retiredDate))
      .setPrice(price);
    const createdField = await this.machineService
      .addMachine(newMachine, req.session.staffId, storeName);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/:machineId', Methods.PUT)
  @RequestBody('?zoneId', '?name', '?serial', '?manufacturer', '?registrationDate', '?retiredDate', '?price')
  private async editMachineByMachineId(req: Request, res: Response) :Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);

    if (Object.keys(req.body).length === 0) {
      throw new BadRequestException('No provided data to update');
    }

    const {
      zoneId,
      name,
      serial,
      manufacturer,
      registrationDate,
      retiredDate,
      price,
    } = req.body;

    let parseZoneId: number;
    if (zoneId !== undefined) {
      parseZoneId = NumberUtils.parsePositiveInteger(zoneId);
    }

    const newMachine = new Machine()
      .setZoneId(parseZoneId)
      .setName(name)
      .setSerial(serial)
      .setManufacturer(manufacturer)
      .setRegistrationDate(registrationDate ? new Date(registrationDate) : undefined)
      .setPrice(price)
      .setRetiredDate(retiredDate ? new Date(retiredDate) : undefined);
    const updatedField = await this.machineService.editMachine(
      parseMachineId,
      newMachine,
      req.session.staffId,
    );

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.MANAGER, Role.CEO, Role.PURCHASING, Role.TECHNICIAN)
  @RouteMapping('/:machineId', Methods.DELETE)
  private async deleteMachineByMachineId(req: Request, res: Response): Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);
    const deletedField = await this.machineService.deleteMachine(
      parseMachineId,
      req.session.staffId,
    );
    res.status(200).json({ data: { deletedField } });
  }

}
