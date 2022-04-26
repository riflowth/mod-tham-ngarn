/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Machine } from '@/entities/Machine';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Zone } from '@/entities/Zone';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { NumberUtils } from '@/utils/NumberUtils';

export class MachineService {

  private readonly machineRepository: MachineRepository;
  private readonly zoneRepository: ZoneRepository;

  public constructor(
    machineRepository: MachineRepository,
    zoneRepository: ZoneRepository,
  ) {
    this.machineRepository = machineRepository;
    this.zoneRepository = zoneRepository;
  }

  public async getAllMachines(readOptions?: ReadOptions): Promise<Machine[]> {
    const machineToRead = new Machine();
    return this.machineRepository.read(machineToRead, readOptions);
  }

  public async getMachinesByZoneId(zoneId: number, readOptions: ReadOptions): Promise<Machine[]> {
    const machineToRead = new Machine().setZoneId(zoneId);
    return this.machineRepository.read(machineToRead, readOptions);
  }

  public async getMachinesByBranchId(
    branchId: number,
    readOptions?: ReadOptions,
  ): Promise<Machine[]> {
    const zoneToRead = new Zone().setBranchId(branchId);
    const zones = await this.zoneRepository.read(zoneToRead);

    const newReadOptions = readOptions;
    const branchMachines: Array<Machine> = [];

    if (NumberUtils.isPositiveInteger(readOptions.limit)) {
      for (const zone of zones) {
        if (newReadOptions.limit > 0) {
          const machineToRead = new Machine().setZoneId(zone.getZoneId());
          const machines = await this.machineRepository.read(machineToRead, newReadOptions);
          newReadOptions.offset -= machines.length;
          newReadOptions.offset = newReadOptions.offset > 0 ? newReadOptions.offset : 0;
          newReadOptions.limit -= machines.length;
          branchMachines.push(...machines);
        }
      }
    } else {
      await Promise.all(zones.map(async (zone) => {
        const machineToRead = new Machine().setZoneId(zone.getZoneId());
        const machines = await this.machineRepository.read(machineToRead, newReadOptions);
        branchMachines.push(...machines);
      }));
    }

    return branchMachines;
  }

  public async addMachine(newMachine: Machine): Promise<Machine> {
    const relatedZoneToRead = new Zone().setZoneId(newMachine.getZoneId());
    const [relatedZone] = await this.zoneRepository.read(relatedZoneToRead);

    if (!relatedZone) {
      throw new NotFoundException('Zone id related to machine does not exist');
    }

    return this.machineRepository.create(newMachine);
  }

  public async editMachine(machineId: number, newMachine: Machine): Promise<Machine> {
    const machineToEdit = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToEdit);

    if (!targetMachine) {
      throw new NotFoundException('Target machine to edit does not exist');
    }

    const newZoneId = newMachine.getZoneId();

    if (newZoneId) {
      const relatedZoneToEdit = new Zone().setZoneId(newMachine.getZoneId());
      const [targetZone] = await this.zoneRepository.read(relatedZoneToEdit);

      if (!targetZone) {
        throw new NotFoundException('Zone to edit does not exist');
      }
    }

    const affectedRowsAmount = await this.machineRepository.update(newMachine, targetMachine);

    return affectedRowsAmount === 1 ? newMachine.setMachineId(machineId) : null;
  }

}
