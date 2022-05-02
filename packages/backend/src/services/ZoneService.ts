import { Role } from '@/decorators/AuthenticationDecorator';
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

  public async getZoneByZoneId(
    zoneId: number,
    roleToValidate: string,
    zoneIdToValidate: number,
    branchIdToValidate: number,
  ): Promise<Zone[]> {
    if (!zoneId) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    if (
      roleToValidate !== Role.CEO
      && roleToValidate !== Role.MANAGER
      && zoneId !== zoneIdToValidate
    ) {
      throw new BadRequestException('You are not allowed to access this zone');
    }

    const zone = await this.zoneRepository.readByZoneId(zoneId);

    if (
      roleToValidate !== Role.CEO
      && zone.getBranchId() !== branchIdToValidate
    ) {
      throw new BadRequestException('You are not allowed to access this zone that not in your branch');
    }

    return [zone];
  }

  public async getZonesByBranchId(branchId: number, readOptions: ReadOptions): Promise<Zone[]> {
    const zoneToRead = new Zone().setBranchId(branchId);
    const zones = await this.zoneRepository.read(zoneToRead, readOptions);

    return zones;
  }

  public async addZone(
    newZone: Zone,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Zone> {
    const branchIdToAddZone = newZone.getBranchId();
    if (!branchIdToAddZone) {
      throw new BadRequestException('BranchId must be a positive integer');
    }

    if (
      roleToValidate !== Role.CEO
      && branchIdToAddZone !== branchIdToValidate
    ) {
      throw new BadRequestException('You are not allowed to add zone to this branch');
    }

    const relatedBranchToRead = new Branch().setBranchId(branchIdToAddZone);
    const [relatedBranch] = await this.branchRepository.read(relatedBranchToRead);

    if (!relatedBranch) {
      throw new BadRequestException('BranchId related to zone does not existed');
    }

    return this.zoneRepository.create(newZone);
  }

  public async editZone(
    zoneIdToEdit: number,
    newZone: Zone,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Zone> {
    const newTimeToStart = newZone.getTimeToStart();
    const newTimeToEnd = newZone.getTimeToEnd();
    const newBranchId = newZone.getBranchId();

    if (newTimeToStart === undefined && newTimeToEnd === undefined && newBranchId === undefined) {
      throw new BadRequestException('No provided data to update');
    }

    if (!NumberUtils.isPositiveInteger(zoneIdToEdit)) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const targetZone = await this.zoneRepository.readByZoneId(zoneIdToEdit);

    if (!targetZone) {
      throw new NotFoundException('Target zone to edit does not exist');
    }

    if (roleToValidate !== Role.CEO && targetZone.getBranchId() !== branchIdToValidate) {
      throw new BadRequestException('You are not allowed to edit zone that not in your branch');
    }

    if (newBranchId) {
      const relatedBranchToEdit = new Branch().setBranchId(newBranchId);
      const [relatedBranch] = await this.branchRepository.read(relatedBranchToEdit);

      if (!relatedBranch) {
        throw new BadRequestException('BranchId related to zone does not existed');
      }
    }

    const zoneToEdit = new Zone().setZoneId(zoneIdToEdit);

    const affectedRowsAmount = await this.zoneRepository.update(newZone, zoneToEdit);

    return affectedRowsAmount === 1 ? newZone.setPrimaryKey(zoneIdToEdit) : null;
  }

  public async deleteZone(
    zoneIdToDelete: number,
    roleToValidate: string,
    branchIdToValidate: number,
  ): Promise<Zone> {
    if (!NumberUtils.isPositiveInteger(zoneIdToDelete)) {
      throw new BadRequestException('ZoneId must be a positive integer');
    }

    const targetZone = await this.zoneRepository.readByZoneId(zoneIdToDelete);

    if (!targetZone) {
      throw new BadRequestException('Target zone to delete does not exist');
    }

    if (roleToValidate !== Role.CEO && targetZone.getBranchId() !== branchIdToValidate) {
      throw new BadRequestException('You are not allowed to delete zone that not in your branch');
    }

    const relatedMachineToRead = new Machine().setZoneId(zoneIdToDelete);
    const relatedMachine = await this.machineRepository.read(relatedMachineToRead);

    if (relatedMachine.length > 0) {
      throw new BadRequestException('Target zone to delete has related machine.');
    }

    const relatedStaffToRead = new Staff().setZoneId(zoneIdToDelete);
    const relatedStaff = await this.staffRepository.read(relatedStaffToRead);

    if (relatedStaff.length > 0) {
      throw new BadRequestException('Target zone to delete has related staff.');
    }

    const zoneToDelete = new Zone().setZoneId(zoneIdToDelete);

    const affectedRowsAmount = await this.zoneRepository.delete(zoneToDelete);

    return affectedRowsAmount === 1 ? targetZone : null;
  }

}
