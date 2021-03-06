import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { MachinePart } from '@/entities/MachinePart';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MachinePartService } from '@/services/MachinePartService';
import { NumberUtils } from '@/utils/NumberUtils';
import {
  BadRequestException,
  Controller,
  ControllerMapping,
  Methods,
  Request,
  RequestBody,
  Response,
  RouteMapping,
} from 'springpress';

@ControllerMapping('/part')
export class MachinePartController extends Controller {

  private readonly machinePartService: MachinePartService;

  public constructor(machinePartService: MachinePartService) {
    super();
    this.machinePartService = machinePartService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllMachinePart(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const machineParts = await this.machinePartService.getAllMachineParts(readOptions);
    res.status(200).json({ data: machineParts });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:partId', Methods.GET)
  private async getMachinePartByPartId(req: Request, res: Response): Promise<void> {
    const parsePartId = NumberUtils.parsePositiveInteger(req.params.partId);
    if (!parsePartId) {
      throw new BadRequestException('PartId must be a positive integer');
    }
    const machinePart = await this.machinePartService.getMachinePartByPartId(parsePartId);
    res.status(200).json({ data: machinePart });
  }

  @Authentication(Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('machineId', 'partName', 'status')
  private async addMachinePart(req: Request, res: Response): Promise<void> {
    const { machineId, partName, status } = req.body;
    const parseMachinePart = NumberUtils.parsePositiveInteger(machineId);

    if (!parseMachinePart) {
      throw new BadRequestException('MachineId must be a positive integer');
    }

    const newMachinePart = new MachinePart()
      .setMachineId(machineId)
      .setPartName(partName)
      .setStatus(status);
    const createdField = await this.machinePartService.addMachinePart(newMachinePart);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:partId', Methods.PUT)
  @RequestBody('?machineId', '?partName', '?status')
  private async editMachinePartByPartId(req: Request, res: Response): Promise<void> {
    const parsePartId = NumberUtils.parsePositiveInteger(req.params.partId);

    if (!parsePartId) {
      throw new BadRequestException('PartId must be a positive integer');
    }

    const { machineId, partName, status } = req.body;
    if (machineId === undefined && partName === undefined && status === undefined) {
      throw new BadRequestException('No provided data to update');
    }

    const newMachinePart = new MachinePart()
      .setMachineId(machineId)
      .setPartName(partName)
      .setStatus(status);
    const updatedField = await this.machinePartService.editMachinePart(parsePartId, newMachinePart);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/status/:machineId', Methods.GET)
  public async getStatusMachineByMachineId(req: Request, res: Response): Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);
    if (!parseMachineId) {
      throw new BadRequestException('MachineId must be a positive integer');
    }
    const status = await this.machinePartService.getMachineStatus(parseMachineId);
    res.status(200).json({ data: status });
  }

  @Authentication(Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/costs/:machineId', Methods.GET)
  public async getCostMachineMaintenanceByMachineId(req: Request, res: Response): Promise<void> {
    const parseMachineId = NumberUtils.parsePositiveInteger(req.params.machineId);
    if (!parseMachineId) {
      throw new BadRequestException('MachineId must be a positive integer');
    }
    const totalCost = await this.machinePartService.getMachineMaintenanceCost(parseMachineId);
    res.status(200).json({ data: totalCost });
  }

}
