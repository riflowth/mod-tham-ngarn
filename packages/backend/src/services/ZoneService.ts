import { Branch } from '@/entities/Branch';
import { Machine } from '@/entities/Machine';
import { Zone } from '@/entities/Zone';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';

export class ZoneService {

  private readonly branchRepository: BranchRepository;
  private readonly machineRepository: MachineRepository;
  private readonly zoneRepository: ZoneRepository;

  public constructor(
    branchRepository: BranchRepository,
    machineRepository: MachineRepository,
    zoneRepository: ZoneRepository,
  ) {
    this.branchRepository = branchRepository;
    this.machineRepository = machineRepository;
    this.zoneRepository = zoneRepository;
  }

  public async getAllZones(readOptions: ReadOptions): Promise<Zone[]> {
    const zoneToRead = new Zone();
    return this.zoneRepository.read(zoneToRead, readOptions);
  }

  public async getZoneByZoneId(zoneId: number): Promise<Zone> {
    const zoneToRead = new Zone().setZoneId(zoneId);
    const [zone] = await this.zoneRepository.read(zoneToRead);

    return zone;
  }

  public async getZonesByBranchId(branchId: number, readOptions: ReadOptions): Promise<Zone[]> {
    const zoneToRead = new Zone().setBranchId(branchId);
    const zones = await this.zoneRepository.read(zoneToRead, readOptions);

    return zones;
  }

  public async addZone(newZone: Zone): Promise<Zone> {
    const relatedBranchToRead = new Branch().setBranchId(newZone.getBranchId());
    const [relatedBranch] = await this.branchRepository.read(relatedBranchToRead);

    if (!relatedBranch) {
      throw new InvalidRequestException('BranchId related to zone does not existed');
    }

    return this.zoneRepository.create(newZone);
  }

  public async editZone(zoneId: number, newZone: Zone): Promise<Zone> {
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
        throw new InvalidRequestException('BranchId related to zone does not existed');
      }
    }

    const affectedRowsAmount = await this.zoneRepository.update(newZone, zoneToEdit);

    return affectedRowsAmount === 1 ? newZone.setPrimaryKey(zoneId) : null;
  }

  public async deleteZone(zoneId: number): Promise<Zone> {
    const zoneToDelete = new Zone().setZoneId(zoneId);
    const [targetZone] = await this.zoneRepository.read(zoneToDelete);

    if (!targetZone) {
      throw new InvalidRequestException('Target zone to delete does not exist');
    }

    const relatedMachineToRead = new Machine().setZoneId(zoneId);
    const relatedMachine = await this.machineRepository.read(relatedMachineToRead);

    if (relatedMachine.length > 0) {
      throw new InvalidRequestException('Target zone to delete has related machine.');
    }

    const affectedRowsAmount = await this.zoneRepository.delete(zoneToDelete);

    return affectedRowsAmount === 1 ? targetZone : null;
  }

}
