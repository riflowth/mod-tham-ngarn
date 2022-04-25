import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Branch } from '@/entities/Branch';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { BranchService } from '@/services/BranchService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';
import { Controller } from './Controller';
import { Methods } from './Route';

@ControllerMapping('/branch')
export class BranchController extends Controller {

  private readonly branchService: BranchService;

  public constructor(branchService: BranchService) {
    super();
    this.branchService = branchService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getALlBranches(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };

    const branches = await this.branchService.getAllBranches(readOptions);

    res.status(200).json({ data: branches });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:branchId', Methods.GET)
  @RequestBody('?branchId')
  private async getBranchByBranchId(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('BranchId must be a positive integer');
    }

    const branch = await this.branchService.getBranchByBranchId(parseBranchId);

    res.status(200).json({ data: [branch] });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('address', 'postalCode', 'telNo')
  private async addBranch(req: Request, res: Response): Promise<void> {
    const { address, postalCode, telNo } = req.body;

    const newBranch = new Branch()
      .setAddress(address)
      .setPostalCode(postalCode)
      .setTelNo(telNo);

    const createdField = await this.branchService.addBranch(newBranch);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/:branchId', Methods.PUT)
  @RequestBody('?address', '?postalCode', '?telNo')
  private async editBranchById(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('BranchId must be a positive integer');
    }

    const { address, postalCode, telNo } = req.body;

    if (address === undefined && postalCode === undefined && telNo === undefined) {
      throw new InvalidRequestException('No provided data to update');
    }

    const newBranch = new Branch()
      .setAddress(address)
      .setPostalCode(postalCode)
      .setTelNo(telNo);

    const updatedField = await this.branchService.editBranch(parseBranchId, newBranch);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.CEO)
  @RouteMapping('/:branchId', Methods.DELETE)
  private async deleteBranchById(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('BranchId must be a positive integer');
    }

    const deletedField = await this.branchService.deleteBranch(parseBranchId);

    res.status(200).json({ data: { deletedField } });
  }

}
