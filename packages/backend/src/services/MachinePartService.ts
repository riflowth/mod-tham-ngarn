import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export enum MachinePartStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export class MachinePartService {

  private readonly machineRepository: MachineRepository;
  private readonly machinePartRepository: MachinePartRepository;
  private readonly orderRepository: OrderRepository;
  private readonly maintenancePartRepository: MaintenancePartRepository;

  public constructor(
    machineRepository: MachineRepository,
    machinePartRepository: MachinePartRepository,
    orderRepository: OrderRepository,
    maintenancePartRepository: MaintenancePartRepository,
  ) {
    this.machineRepository = machineRepository;
    this.machinePartRepository = machinePartRepository;
    this.orderRepository = orderRepository;
    this.maintenancePartRepository = maintenancePartRepository;
  }

  public async getAllMachineParts(readOptions: ReadOptions): Promise<MachinePart[]> {
    const machinePartToRead = new MachinePart();
    return this.machinePartRepository.read(machinePartToRead, readOptions);
  }

  public async getMachinePartByPartId(partId: number): Promise<MachinePart[]> {
    const machinePartToRead = new MachinePart().setPartId(partId);
    const machinePart = await this.machinePartRepository.read(machinePartToRead);
    return machinePart;
  }

  public async getMachinePartByMachineId(
    machineId: number,
    readOptions: ReadOptions,
  ): Promise<MachinePart[]> {
    const machinePartToRead = new MachinePart().setMachineId(machineId);
    const machineParts = await this.machinePartRepository.read(machinePartToRead, readOptions);

    return machineParts;
  }

  public async getAllMachinePartByMachineId(machineId: number): Promise<MachinePart[]> {
    const machinePartToRead = new MachinePart().setMachineId(machineId);
    const machineParts = await this.machinePartRepository.read(machinePartToRead);

    return machineParts;
  }

  public async addMachinePart(newMachinePart: MachinePart): Promise<MachinePart> {
    const relatedMachineToRead = new Machine().setMachineId(newMachinePart.getMachineId());
    const [relatedMachine] = await this.machineRepository.read(relatedMachineToRead);

    if (!relatedMachine) {
      throw new InvalidRequestException('MachineId related to zone does nor existed');
    }

    return this.machinePartRepository.create(newMachinePart);
  }

  public async editMachinePart(partId: number, newMachinePart: MachinePart): Promise<MachinePart> {
    const machinePartToEdit = new MachinePart().setPartId(partId);
    const [targetMachinePart] = await this.machinePartRepository.read(machinePartToEdit);

    if (!targetMachinePart) {
      throw new NotFoundException('Target machinePart does not exist');
    }
    const newMachineId = newMachinePart.getMachineId();

    if (newMachinePart.getPartName() === null) {
      newMachinePart.setPartName(undefined);
    }

    if (newMachinePart.getStatus() === null) {
      newMachinePart.setStatus(undefined);
    }

    if (newMachineId) {
      const relatedMachineToEdit = new Machine().setMachineId(newMachineId);
      const [relatedMachine] = await this.machineRepository.read(relatedMachineToEdit);

      if (!relatedMachine) {
        throw new InvalidRequestException('machineId related to machinePart does not exist.');
      }
    }
    this.validatedStatus(partId, targetMachinePart.getStatus());

    const affectedRowAmount = await this.machinePartRepository.update(
      newMachinePart,
      machinePartToEdit,
    );

    return affectedRowAmount === 1 ? newMachinePart.setPrimaryKey(partId) : null;
  }

  private async validatedStatus(partId: number, status: String): Promise<void> {
    const relatedMaintenancePart = new MaintenancePart().setPartId(partId);
    const allMaintenancePartRelated = await this.maintenancePartRepository
      .read(relatedMaintenancePart);
    allMaintenancePartRelated.forEach((maintenancePart) => {
      if (status === 'DISABLE') {
        if (maintenancePart.getStatus() !== 'SUCCESS') {
          throw new InvalidRequestException('Can not change status because MaintenancePart is not SUCCESS');
        }
      }
    });
    const relatedOrder = new Order().setPartId(partId);
    const allOrder = await this.orderRepository.read(relatedOrder);
    allOrder.forEach((order) => {
      if (status === 'DISABLE') {
        if (order.getStatus() !== 'DELIVERED') {
          throw new InvalidRequestException('Can not change status because Order is not DELIVERED');
        }
      }
    });
  }

  public async getMachineStatus(machineId: number): Promise<String> {
    const machineToRead = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToRead);

    if (!targetMachine) {
      throw new InvalidRequestException('Target machine does not exist');
    }
    const machinePartToRead = await this.getAllMachinePartByMachineId(machineId);
    const resultsStatus = machinePartToRead.filter((machinePart) => {
      return machinePart.getStatus() === 'Disable';
    });

    if (resultsStatus[0]) {
      return 'Disable';
    }

    return 'Active';
  }

  public async getMachineMaintenanceCost(machineId: number): Promise<number> {
    const machineToRead = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToRead);

    if (!targetMachine) {
      throw new InvalidRequestException('Target machine does not exist');
    }

    const machinePartToRead = await this.getAllMachinePartByMachineId(machineId);
    let totalCost = 0;
    machinePartToRead.forEach(async (machinePart) => {
      const targetOrder = new Order().setPartId(machinePart.getPartId());
      const [order] = await this.orderRepository.read(targetOrder);
      totalCost += order.getPrice();
    });
    return totalCost;
  }

}
