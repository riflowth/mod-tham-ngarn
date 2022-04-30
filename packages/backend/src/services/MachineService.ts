import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { Order } from '@/entities/Order';
import { Staff } from '@/entities/Staff';
import { Zone } from '@/entities/Zone';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { StaffRepository } from '@/repositories/staff/StaffRepository';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { BadRequestException, ForbiddenException, NotFoundException } from 'springpress';

export class MachineService {

  private readonly machineRepository: MachineRepository;
  private readonly machinePartRepository: MachinePartRepository;
  private readonly maintenanceLogRepository: MaintenanceLogRepository;
  private readonly orderRepository: OrderRepository;
  private readonly staffRepository: StaffRepository;
  private readonly zoneRepository: ZoneRepository;

  public constructor(
    machineRepository: MachineRepository,
    machinePartRepository: MachinePartRepository,
    maintenanceLogRepository: MaintenanceLogRepository,
    orderRepository: OrderRepository,
    staffRepository: StaffRepository,
    zoneRepository: ZoneRepository,
  ) {
    this.machineRepository = machineRepository;
    this.machinePartRepository = machinePartRepository;
    this.maintenanceLogRepository = maintenanceLogRepository;
    this.orderRepository = orderRepository;
    this.staffRepository = staffRepository;
    this.zoneRepository = zoneRepository;
  }

  public async getAllMachines(readOptions?: ReadOptions): Promise<Machine[]> {
    const expectedMachine = new Machine();
    return this.machineRepository.read(expectedMachine, readOptions);
  }

  public async getMachinesByZoneId(
    zoneId: number,
    readOptions: ReadOptions,
    staffId: number,
  ): Promise<Machine[]> {
    await this.validateNumber(zoneId, 'Zone id');
    await this.validateZone(zoneId, staffId);

    const expectedMachine = new Machine().setZoneId(zoneId);
    return this.machineRepository.read(expectedMachine, readOptions);
  }

  public async getMachinesByBranchId(
    branchId: number,
    readOptions?: ReadOptions,
  ): Promise<Machine[]> {
    await this.validateNumber(branchId, 'Branch id');
    return this.machineRepository.readByBranchId(branchId, readOptions);
  }

  public async addMachine(newMachine: Machine, staffId: number): Promise<Machine> {
    await this.validateNumber(newMachine.getZoneId(), 'Zone id');
    await this.validateZone(newMachine.getZoneId(), staffId);

    return this.machineRepository.create(newMachine);
  }

  public async editMachine(
    machineId: number,
    newMachine: Machine,
    staffId: number,
  ): Promise<Machine> {
    await this.validateNumber(machineId, 'Machine id');
    const targetMachine = await this.validateMachine(machineId, staffId);

    const newZoneId = newMachine.getZoneId();

    if (newZoneId !== undefined) {
      await this.validateNumber(newZoneId, 'Zone id');
      await this.validateZone(newZoneId, staffId);
    }

    const affectedRowsAmount = await this.machineRepository.update(newMachine, targetMachine);

    return affectedRowsAmount === 1 ? newMachine.setMachineId(machineId) : null;
  }

  public async deleteMachine(machineId: number, staffId: number): Promise<Machine> {
    await this.validateNumber(machineId, 'Machine id');
    const targetMachine = await this.validateMachine(machineId, staffId);

    const expectedRelatedMachineParts = new MachinePart().setMachineId(machineId);
    const relatedMachineParts = await this.machinePartRepository.read(expectedRelatedMachineParts);

    if (relatedMachineParts.length !== 0) {
      throw new BadRequestException('There are machine parts still related to this machine');
    }

    const expectedRelatedMaintenanceLogs = new MaintenanceLog().setMachineId(machineId);
    const relatedMaintenanceLogs = await this.maintenanceLogRepository.read(
      expectedRelatedMaintenanceLogs,
    );

    if (relatedMaintenanceLogs.length !== 0) {
      throw new BadRequestException('There are maintenance logs still related to this machine');
    }

    const expectedRelatedOrders = new Order().setMachineId(machineId);
    const relatedOrders = await this.orderRepository.read(expectedRelatedOrders);

    if (relatedOrders.length !== 0) {
      throw new BadRequestException('There are orders still related to this machine');
    }

    const affectedRowsAmount = await this.machineRepository.delete(targetMachine);

    return affectedRowsAmount === 1 ? targetMachine : null;
  }

  private async validateNumber(numberToValidate: number, name: string): Promise<void> {
    if (!numberToValidate) {
      throw new BadRequestException(`${name} must be a positive integer`);
    }
  }

  private async validateZone(zoneId: number, staffId: number): Promise<void> {
    const expectedRelatedZone = new Zone().setZoneId(zoneId);
    const [expectedZone] = await this.zoneRepository.read(expectedRelatedZone);

    const currentExpectedStaff = new Staff().setStaffId(staffId);
    const [currentStaff] = await this.staffRepository.read(currentExpectedStaff);

    if (!expectedZone) {
      throw new NotFoundException('Zone related to machine does not exist');
    }

    if (
      expectedZone.getBranchId() !== currentStaff.getBranchId()
      && currentStaff.getPosition() !== 'CEO'
    ) {
      throw new ForbiddenException('Zone does not belong to young branch');
    }
  }

  private async validateMachine(machineId: number, staffId: number): Promise<Machine> {
    const machineToValidate = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToValidate);

    if (!targetMachine) {
      throw new NotFoundException('Machine does not exist');
    }

    const zoneToValidate = new Zone().setZoneId(targetMachine.getZoneId());
    const [targetZone] = await this.zoneRepository.read(zoneToValidate);

    const currentStaffToValidate = new Staff().setStaffId(staffId);
    const [targetCurrentStaff] = await this.staffRepository.read(currentStaffToValidate);

    if (
      targetZone.getBranchId() !== targetCurrentStaff.getBranchId()
      && targetCurrentStaff.getPosition() !== 'CEO'
    ) {
      throw new ForbiddenException('Machine does not belong to the provided staff\'s branch');
    }

    return targetMachine;
  }

}
