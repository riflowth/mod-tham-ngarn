import { Role } from '@/decorators/AuthenticationDecorator';
import { Bill } from '@/entities/Bill';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { Staff } from '@/entities/Staff';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { NumberUtils } from '@/utils/NumberUtils';
import { ObjectUtils } from '@/utils/ObjectUtils';
import { BadRequestException, NotFoundException } from 'springpress';

export class StaffService {

  private readonly staffRepository: StaffRepository;
  private readonly zoneRepository: ZoneRepository;
  private readonly branchRepository: BranchRepository;
  private readonly maintenanceLogRepository: MaintenanceLogRepository;
  private readonly billRepository: BillRepository;

  public constructor(
    staffRepository: StaffRepository,
    zoneRepository: ZoneRepository,
    branchRepository: BranchRepository,
    maintenanceLogRepository: MaintenanceLogRepository,
    billRepository: BillRepository,
  ) {
    this.staffRepository = staffRepository;
    this.zoneRepository = zoneRepository;
    this.branchRepository = branchRepository;
    this.maintenanceLogRepository = maintenanceLogRepository;
    this.billRepository = billRepository;
  }

  public async getAllStaffs(readOptions: ReadOptions): Promise<Staff[]> {
    const staffToRead = new Staff();
    const staffs = await this.staffRepository.read(staffToRead, readOptions);
    return staffs.map((staff) => this.removeStaffPassword(staff));
  }

  public async getStaffByBranchId(
    branchIdToGetStaff: number,
    roleToValidate: string,
    branchIdToValidate: number,
    readOptions?: ReadOptions,
  ): Promise<Staff[]> {
    if (
      roleToValidate !== Role.CEO
      && branchIdToValidate !== branchIdToGetStaff
    ) {
      throw new BadRequestException('You are not allowed to access staff that not in your branch');
    }

    const relatedBranch = await this.branchRepository.readByBranchId(branchIdToGetStaff);

    if (!relatedBranch) {
      throw new BadRequestException('BranchId related to staff does not existed');
    }

    const staffToRead = new Staff().setBranchId(branchIdToGetStaff);
    const staffs = await this.staffRepository.read(staffToRead, readOptions);

    return staffs.map((staff) => this.removeStaffPassword(staff));
  }

  public async getStaffByZoneId(
    zoneIdToGetStaff: number,
    readOptions?: ReadOptions,
  ): Promise<Staff[]> {
    if (!NumberUtils.isPositiveInteger(zoneIdToGetStaff)) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const relatedZone = this.zoneRepository.readByZoneId(zoneIdToGetStaff);

    if (!relatedZone) {
      throw new BadRequestException('ZoneId related to staff does not existed');
    }

    const staffToRead = new Staff().setZoneId(zoneIdToGetStaff);
    const staffs = await this.staffRepository.read(staffToRead, readOptions);

    return staffs.map((staff) => this.removeStaffPassword(staff));
  }

  public async getStaffByStaffId(
    staffIdToGet: number,
    staffIdToValidate: number,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Staff[]> {
    if (!NumberUtils.isPositiveInteger(staffIdToGet)) {
      throw new BadRequestException('staffIdToGet must be positive integer');
    }

    const targetStaff = await this.staffRepository.readByStaffId(staffIdToGet);

    if (!targetStaff) {
      throw new BadRequestException('StaffId does not existed');
    }

    if (
      roleToValidate !== Role.MANAGER
      && roleToValidate !== Role.CEO
      && staffIdToValidate !== staffIdToGet
    ) {
      throw new BadRequestException('You are not allowed to access this staff');
    }

    if (
      roleToValidate === Role.MANAGER
      && targetStaff.getBranchId() !== branchIdToValidate
    ) {
      throw new BadRequestException('You are not allowed to access this staff (staff not in your branch)');
    }

    return [this.removeStaffPassword(targetStaff)];
  }

  public async addStaff(
    newStaff: Staff,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Staff> {
    if (
      roleToValidate !== Role.CEO
      && branchIdToValidate !== newStaff.getBranchId()
    ) {
      throw new BadRequestException('You are not allowed to access staff that not in your branch');
    }

    const relatedBranch = this.branchRepository.readByBranchId(newStaff.getBranchId());

    if (!relatedBranch) {
      throw new BadRequestException('BranchId related to staff does not existed');
    }

    const relatedZone = await this.zoneRepository.readByZoneId(newStaff.getZoneId());

    if (!relatedZone) {
      throw new BadRequestException('ZoneId related to staff does not existed');
    }

    return this.staffRepository.create(newStaff);
  }

  public async editStaff(
    staffIdToEdit: number,
    newStaff: Staff,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Staff> {
    const newBranchId = newStaff.getBranchId();
    const newZoneId = newStaff.getZoneId();

    if (newBranchId === null && (newBranchId && !NumberUtils.isPositiveInteger(newBranchId))) {
      throw new BadRequestException('newBranch must be positive integer');
    }

    if (newZoneId === null && (newZoneId && !NumberUtils.isPositiveInteger(newZoneId))) {
      throw new BadRequestException('newZoneId must be positive integer');
    }

    if (
      roleToValidate !== Role.CEO
      && branchIdToValidate !== newBranchId
    ) {
      throw new BadRequestException('You are not allowed to access staff that not in your branch');
    }

    const targetStaff = await this.staffRepository.readByStaffId(staffIdToEdit);

    if (!targetStaff) {
      throw new NotFoundException('Target staff to edit does not exist');
    }

    if (newBranchId) {
      const relatedBranch = await this.branchRepository.readByBranchId(newBranchId);

      if (!relatedBranch) {
        throw new BadRequestException('BranchId related to staff does not existed');
      }
    }

    if (newZoneId) {
      const relatedZone = await this.zoneRepository.readByZoneId(newZoneId);

      if (!relatedZone) {
        throw new BadRequestException('ZoneId related to staff does not existed');
      }
    }

    const staffToEdit = new Staff().setStaffId(staffIdToEdit);

    const affectedRowsAmount = await this.staffRepository.update(newStaff, staffToEdit);

    return affectedRowsAmount === 1
      ? this.removeStaffPassword(newStaff.setPrimaryKey(staffIdToEdit)) : null;
  }

  public async deleteStaff(
    staffIdToDelete: number,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Staff> {
    const targetStaff = await this.staffRepository.readByStaffId(staffIdToDelete);

    if (!targetStaff) {
      throw new BadRequestException('Target staff to delete does not exist');
    }

    if (
      roleToValidate !== Role.CEO
      && branchIdToValidate !== targetStaff.getBranchId()
    ) {
      throw new BadRequestException('You are not allowed to access staff that not in your branch');
    }

    const relatedReporterMaintenanceLog = new MaintenanceLog().setReporterId(staffIdToDelete);
    const relatedReporter = await this.maintenanceLogRepository
      .read(relatedReporterMaintenanceLog);
    const relatedMaintainerMaintenanceLog = new MaintenanceLog().setMaintainerId(staffIdToDelete);
    const relatedMaintainer = await this.maintenanceLogRepository
      .read(relatedMaintainerMaintenanceLog);

    if (relatedReporter.length > 0) {
      throw new BadRequestException('Target staff to delete has related reporter.');
    }

    if (relatedMaintainer.length > 0) {
      throw new BadRequestException('Target staff to delete has related maintainer.');
    }

    const relatedOrderByBill = new Bill().setOrderBy(staffIdToDelete);
    const relatedOrderBy = await this.billRepository.read(relatedOrderByBill);

    if (relatedOrderBy.length > 0) {
      throw new BadRequestException('Target staff to delete has related order_by.');
    }

    const staffToDelete = new Staff().setStaffId(staffIdToDelete);

    const affectedRowsAmount = await this.staffRepository.delete(staffToDelete);

    return affectedRowsAmount === 1 ? this.removeStaffPassword(targetStaff) : null;
  }

  private removeStaffPassword(staff: Staff): Staff {
    return ObjectUtils.removeProperty(staff, 'password');
  }

}
