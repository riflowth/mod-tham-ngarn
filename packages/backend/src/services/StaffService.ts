import { Bill } from '@/entities/Bill';
import { Branch } from '@/entities/Branch';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { Staff } from '@/entities/Staff';
import { Zone } from '@/entities/Zone';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { NumberUtils } from '@/utils/NumberUtils';

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
    return this.staffRepository.read(staffToRead, readOptions);
  }

  public async getStaffByBranchId(branchId: number, readOptions?: ReadOptions): Promise<Staff[]> {
    const branchToRead = new Branch().setBranchId(branchId);
    const [relatedBranch] = await this.branchRepository.read(branchToRead);

    if (!relatedBranch) {
      throw new InvalidRequestException('BranchId related to staff does not existed');
    }

    const staffToRead = new Staff().setBranchId(branchId);
    const staffs = await this.staffRepository.read(staffToRead, readOptions);

    return staffs;
  }

  public async getStaffByZoneId(zoneId: number, readOptions?: ReadOptions): Promise<Staff[]> {
    const zoneToRead = new Zone().setZoneId(zoneId);
    const [relatedZone] = await this.zoneRepository.read(zoneToRead);

    if (!relatedZone) {
      throw new InvalidRequestException('ZoneId related to staff does not existed');
    }

    const staffToRead = new Staff().setZoneId(zoneId);
    const staffs = await this.staffRepository.read(staffToRead, readOptions);

    return staffs;
  }

  public async getStaffByStaffId(staffId: number, readOptions?: ReadOptions): Promise<Staff[]> {
    const staffToRead = new Staff().setStaffId(staffId);
    const [targetStaff] = await this.staffRepository.read(staffToRead, readOptions);

    if (!targetStaff) {
      throw new InvalidRequestException('StaffId does not existed');
    }

    return [targetStaff];
  }

  public async addStaff(newStaff: Staff): Promise<Staff> {
    const relatedBranchToRead = new Branch().setBranchId(newStaff.getBranchId());
    const [relatedBranch] = await this.branchRepository.read(relatedBranchToRead);

    if (!relatedBranch) {
      throw new InvalidRequestException('BranchId related to staff does not existed');
    }

    const relatedZoneToRead = new Zone().setZoneId(newStaff.getZoneId());
    const [relatedZone] = await this.zoneRepository.read(relatedZoneToRead);

    if (!relatedZone) {
      throw new InvalidRequestException('ZoneId related to staff does not existed');
    }

    return this.staffRepository.create(newStaff);
  }

  public async editStaff(staffId: number, newStaff: Staff): Promise<Staff> {
    const staffToEdit = new Staff().setZoneId(staffId);
    const [targetStaff] = await this.staffRepository.read(staffToEdit);

    if (!targetStaff) {
      throw new NotFoundException('Target staff to edit does not exist');
    }

    const newBranchId = newStaff.getBranchId();

    if (newBranchId === null && (newBranchId && !NumberUtils.isPositiveInteger(newBranchId))) {
      throw new InvalidRequestException('newBranch must be positive integer');
    }

    if (newBranchId) {
      const relatedBranchToEdit = new Branch().setBranchId(newBranchId);
      const [relatedBranch] = await this.branchRepository.read(relatedBranchToEdit);

      if (!relatedBranch) {
        throw new InvalidRequestException('BranchId related to staff does not existed');
      }
    }

    const newZoneId = newStaff.getZoneId();

    if (newZoneId === null && (newZoneId && !NumberUtils.isPositiveInteger(newZoneId))) {
      throw new InvalidRequestException('newZoneId must be positive integer');
    }

    if (newZoneId) {
      const relatedZoneToEdit = new Zone().setZoneId(newZoneId);
      const [relatedZone] = await this.zoneRepository.read(relatedZoneToEdit);

      if (!relatedZone) {
        throw new InvalidRequestException('ZoneId related to staff does not existed');
      }
    }

    const affectedRowsAmount = await this.staffRepository.update(newStaff, staffToEdit);

    return affectedRowsAmount === 1 ? newStaff.setPrimaryKey(staffId) : null;
  }

  public async deleteStaff(staffId: number): Promise<Staff> {
    const staffToDelete = new Staff().setZoneId(staffId);
    const [targetStaff] = await this.staffRepository.read(staffToDelete);

    if (!targetStaff) {
      throw new InvalidRequestException('Target staff to delete does not exist');
    }

    const relatedReporterMaintenanceLog = new MaintenanceLog().setReporterId(staffId);
    const relatedReporter = await this.maintenanceLogRepository
      .read(relatedReporterMaintenanceLog);
    const relatedMaintainerMaintenanceLog = new MaintenanceLog().setMaintainerId(staffId);
    const relatedMaintainer = await this.maintenanceLogRepository
      .read(relatedMaintainerMaintenanceLog);

    if (relatedReporter.length > 0) {
      throw new InvalidRequestException('Target staff to delete has related reporter.');
    }

    if (relatedMaintainer.length > 0) {
      throw new InvalidRequestException('Target staff to delete has related maintainer.');
    }

    const relatedOrderByBill = new Bill().setOrderBy(staffId);
    const relatedOrderBy = await this.billRepository.read(relatedOrderByBill);

    if (relatedOrderBy.length > 0) {
      throw new InvalidRequestException('Target staff to delete has related order_by.');
    }

    const affectedRowsAmount = await this.staffRepository.delete(targetStaff);

    return affectedRowsAmount === 1 ? targetStaff : null;
  }

}
