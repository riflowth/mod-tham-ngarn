import { Branch } from '@/entities/Branch';
import { Machine } from '@/entities/Machine';
import { Staff } from '@/entities/Staff';
import { Zone } from '@/entities/Zone';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { NumberUtils } from '@/utils/NumberUtils';
import { BadRequestException, NotFoundException } from 'springpress';

export class ZoneService {

  private readonly branchRepository: BranchRepository;
  private readonly machineRepository: MachineRepository;
  private readonly zoneRepository: ZoneRepository;
  private readonly staffRepository: StaffRepository;

  public constructor(
    branchRepository: BranchRepository,
    machineRepository: MachineRepository,
    zoneRepository: ZoneRepository,
    staffRepository: StaffRepository,
  ) {
    this.branchRepository = branchRepository;
    this.machineRepository = machineRepository;
    this.zoneRepository = zoneRepository;
    this.staffRepository = staffRepository;
  }

  public async getAllZones(readOptions: ReadOptions): Promise<Zone[]> {
    const zoneToRead = new Zone();
    return this.zoneRepository.read(zoneToRead, readOptions);
  }

  public async getZoneByZoneId(zoneId: number): Promise<Zone[]> {
    if (!zoneId) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const zoneToRead = new Zone().setZoneId(zoneId);
    return this.zoneRepository.read(zoneToRead);
  }

  public async getZonesByBranchId(branchId: number, readOptions: ReadOptions): Promise<Zone[]> {
    const zoneToRead = new Zone().setBranchId(branchId);
    const zones = await this.zoneRepository.read(zoneToRead, readOptions);

    return zones;
  }

  public async addZone(newZone: Zone): Promise<Zone> {
    const branchId = newZone.getBranchId();
    if (!branchId) {
      throw new BadRequestException('BranchId must be a positive integer');
    }

    const relatedBranchToRead = new Branch().setBranchId(newZone.getBranchId());
    const [relatedBranch] = await this.branchRepository.read(relatedBranchToRead);

    if (!relatedBranch) {
      throw new BadRequestException('BranchId related to zone does not existed');
    }

    return this.zoneRepository.create(newZone);
  }

  public async editZone(zoneId: number, newZone: Zone): Promise<Zone> {
    const timeToStart = newZone.getTimeToStart();
    const timeToEnd = newZone.getTimeToEnd();
    const branchId = newZone.getBranchId();

    if (timeToStart === undefined && timeToEnd === undefined && branchId === undefined) {
      throw new BadRequestException('No provided data to update');
    }

    if (zoneId === null || (zoneId && !NumberUtils.parsePositiveInteger(zoneId))) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const zoneToEdit = new Zone().setZoneId(zoneId);
    const [targetZone] = await this.zoneRepository.read(zoneToEdit);

    if (!targetZone) {
      throw new NotFoundException('Target zone to edit does not exist');
    }

    const newBranchId = newZone.getBranchId();

    if (newBranchId) {
      const relatedBranchToEdit = new Branch().setBranchId(newBranchId);
      const [relatedBranch] = await this.branchRepository.read(relatedBranchToEdit);

      if (!relatedBranch) {
        throw new BadRequestException('BranchId related to zone does not existed');
      }
    }

    const affectedRowsAmount = await this.zoneRepository.update(newZone, zoneToEdit);

    return affectedRowsAmount === 1 ? newZone.setPrimaryKey(zoneId) : null;
  }

  public async deleteZone(zoneId: number): Promise<Zone> {
    if (!zoneId) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const zoneToDelete = new Zone().setZoneId(zoneId);
    const [targetZone] = await this.zoneRepository.read(zoneToDelete);

    if (!targetZone) {
      throw new BadRequestException('Target zone to delete does not exist');
    }

    const relatedMachineToRead = new Machine().setZoneId(zoneId);
    const relatedMachine = await this.machineRepository.read(relatedMachineToRead);

    if (relatedMachine.length > 0) {
      throw new BadRequestException('Target zone to delete has related machine.');
    }

    const relatedStaffToRead = new Staff().setZoneId(zoneId);
    const relatedStaff = await this.staffRepository.read(relatedStaffToRead);

    if (relatedStaff.length > 0) {
      throw new BadRequestException('Target zone to delete has related staff.');
    }

    const affectedRowsAmount = await this.zoneRepository.delete(zoneToDelete);

    return affectedRowsAmount === 1 ? targetZone : null;
  }

}
