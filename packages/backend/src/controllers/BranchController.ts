import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { Branch } from '@/entities/Branch';
import { ReadOptions } from '@/repositories/ReadOptions';
import { BranchService } from '@/services/BranchService';
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

@ControllerMapping('/branch')
export class BranchController extends Controller {

  private readonly branchService: BranchService;

  public constructor(branchService: BranchService) {
    super();
    this.branchService = branchService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/me', Methods.GET)
  private async getBranchByRequester(req: Request, res: Response): Promise<void> {
    const branch = await this.branchService.getBranchByBranchId(req.session?.branchId);
    res.status(200).json({ data: branch });
  }

  @Authentication(Role.CEO)
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
      throw new BadRequestException('BranchId must be a positive integer');
    }

    if (req.session.role !== Role.CEO && req.session.branchId !== parseBranchId) {
      throw new BadRequestException('You are not allowed to access this branch');
    }

    const branch = await this.branchService.getBranchByBranchId(parseBranchId);
    res.status(200).json({ data: branch });
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
      throw new BadRequestException('BranchId must be a positive integer');
    }

    const { address, postalCode, telNo } = req.body;
    if (address === undefined && postalCode === undefined && telNo === undefined) {
      throw new BadRequestException('No provided data to update');
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
      throw new BadRequestException('BranchId must be a positive integer');
    }
    const deletedField = await this.branchService.deleteBranch(parseBranchId);
    res.status(200).json({ data: { deletedField } });
  }

}
