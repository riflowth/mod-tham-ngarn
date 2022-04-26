import { Controller } from '@/controllers/Controller';
import { Methods } from '@/controllers/Route';
import { Authentication, Role } from '@/decorators/AuthenticationDecorator';
import { ControllerMapping } from '@/decorators/ControllerDecorator';
import { RequestBody } from '@/decorators/RequestDecorator';
import { RouteMapping } from '@/decorators/RouteDecorator';
import { Staff } from '@/entities/Staff';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffService } from '@/services/StaffService';
import { NumberUtils } from '@/utils/NumberUtils';
import { Request, Response } from 'express';

@ControllerMapping('/staff')
export class StaffController extends Controller {

  private readonly staffService: StaffService;

  public constructor(staffService: StaffService) {
    super();
    this.staffService = staffService;
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.GET)
  private async getAllStaff(req: Request, res: Response): Promise<void> {
    const readOptions: ReadOptions = {
      limit: Number(req.query.limit),
      offset: Number(req.query.offset),
    };
    const staffs = await this.staffService.getAllStaffs(readOptions);

    res.status(200).json({ data: staffs });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:staffId', Methods.GET)
  private async getStaffByStaffId(req: Request, res: Response): Promise<void> {
    const parseStaffId = NumberUtils.parsePositiveInteger(req.params.staffId);

    if (!parseStaffId) {
      throw new InvalidRequestException('StaffId must be a positive integer');
    }

    const staff = await this.staffService.getStaffByStaffId(parseStaffId);

    res.status(200).json({ data: staff });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.GET)
  private async getStaffByZoneId(req: Request, res: Response): Promise<void> {
    const parseZoneId = NumberUtils.parsePositiveInteger(req.params.zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('zoneId must be a positive integer');
    }

    const staff = await this.staffService.getStaffByZoneId(parseZoneId);

    res.status(200).json({ data: staff });
  }

  @Authentication(Role.OFFICER, Role.TECHNICIAN, Role.PURCHASING, Role.MANAGER, Role.CEO)
  @RouteMapping('/:branchId', Methods.GET)
  private async getStaffByBranchId(req: Request, res: Response): Promise<void> {
    const parseBranchId = NumberUtils.parsePositiveInteger(req.params.branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('branchId must be a positive integer');
    }

    const staff = await this.staffService.getStaffByBranchId(parseBranchId);

    res.status(200).json({ data: staff });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/', Methods.POST)
  @RequestBody('password', '?fullName', '?branchId', '?zoneId', '?telNo', '?salary', '?position', '?dob')
  private async addStaff(req: Request, res: Response): Promise<void> {
    const {
      password,
      fullName,
      branchId,
      zoneId,
      telNo,
      salary,
      position,
      dob,
    } = req.body;

    const parseBranchId = NumberUtils.parsePositiveInteger(branchId);

    if (!parseBranchId) {
      throw new InvalidRequestException('BranchId must be a positive integer');
    }

    const parseZoneId = NumberUtils.parsePositiveInteger(zoneId);

    if (!parseZoneId) {
      throw new InvalidRequestException('ZoneId must be a positive integer');
    }

    const newStaff = new Staff()
      .setPassword(password)
      .setFullName(fullName)
      .setBranchId(branchId)
      .setZoneId(zoneId)
      .setTelNo(telNo)
      .setSalary(salary)
      .setPosition(position)
      .setDateOfBirth(new Date(dob));

    const createdField = await this.staffService.addStaff(newStaff);

    res.status(200).json({ data: { createdField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:zoneId', Methods.PUT)
  @RequestBody('?password', '?fullName', '?branchId', '?zoneId', '?telNo', '?salary', '?position', '?dob')
  private async editStaffByStaffId(req: Request, res: Response): Promise<void> {
    const parseStaffId = NumberUtils.parsePositiveInteger(req.params.staffId);

    if (!parseStaffId) {
      throw new InvalidRequestException('StaffId must be a positive integer');
    }

    if (Object.keys(req.body).length === 0) {
      throw new InvalidRequestException('No provided data to update');
    }

    const {
      password,
      fullName,
      branchId,
      zoneId,
      telNo,
      salary,
      position,
      dob,
    } = req.body;

    const newStaff = new Staff()
      .setPassword(password)
      .setFullName(fullName)
      .setBranchId(branchId)
      .setZoneId(zoneId)
      .setTelNo(telNo)
      .setSalary(salary)
      .setPosition(position)
      .setDateOfBirth(new Date(dob));

    const updatedField = await this.staffService.editStaff(parseStaffId, newStaff);

    res.status(200).json({ data: { updatedField } });
  }

  @Authentication(Role.MANAGER, Role.CEO)
  @RouteMapping('/:staffId', Methods.DELETE)
  public async deleteStaffByStaffId(req: Request, res: Response): Promise<void> {
    const parseStaffId = NumberUtils.parsePositiveInteger(req.params.staffId);

    if (!parseStaffId) {
      throw new InvalidRequestException('StaffId must be a positive integer');
    }

    const deletedField = await this.staffService.deleteStaff(parseStaffId);

    res.status(200).json({ data: { deletedField } });
  }

}
