import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { MaintenancePart } from '@/entities/MaintenancePart';
import { Order } from '@/entities/Order';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { MaintenancePartStatus } from '@/services/MaintenanceLogService';
import { OrderStatus } from '@/services/OrderService';
import { NumberUtils } from '@/utils/NumberUtils';
import { BadRequestException, NotFoundException } from 'springpress';

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
      throw new BadRequestException('MachineId related to zone does nor existed');
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

    if (newMachineId === null || (newMachineId && !NumberUtils.isPositiveInteger(newMachineId))) {
      throw new BadRequestException('newMachine must be positive integer');
    }

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
        throw new BadRequestException('machineId related to machinePart does not exist.');
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
      if (status === MachinePartStatus.UNAVAILABLE) {
        if (maintenancePart.getStatus() !== MaintenancePartStatus.SUCCESS) {
          throw new BadRequestException('Can not change status because MaintenancePart is not SUCCESS');
        }
      }
    });
    const relatedOrder = new Order().setPartId(partId);
    const allOrder = await this.orderRepository.read(relatedOrder);
    allOrder.forEach((order) => {
      if (status === MachinePartStatus.UNAVAILABLE) {
        if (order.getStatus() !== OrderStatus.DELIVERED) {
          throw new BadRequestException('Can not change status because Order is not DELIVERED');
        }
      }
    });
  }

  public async getMachineStatus(machineId: number): Promise<String> {
    const machineToRead = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToRead);

    if (!targetMachine) {
      throw new BadRequestException('Target machine does not exist');
    }
    const machinePartToRead = await this.getAllMachinePartByMachineId(machineId);
    const resultsStatus = machinePartToRead.filter((machinePart) => {
      return machinePart.getStatus() === MachinePartStatus.UNAVAILABLE;
    });

    return resultsStatus[0] ? MachinePartStatus.UNAVAILABLE : MachinePartStatus.AVAILABLE;
  }

  public async getMachineMaintenanceCost(machineId: number): Promise<number> {
    const machineToRead = new Machine().setMachineId(machineId);
    const [targetMachine] = await this.machineRepository.read(machineToRead);

    if (!targetMachine) {
      throw new BadRequestException('Target machine does not exist');
    }

    const machinePartToRead = await this.getAllMachinePartByMachineId(machineId);

    const orders = await Promise.all(machinePartToRead.map((machinePart) => {
      const targetOrder = new Order().setPartId(machinePart.getPartId());
      return this.orderRepository.read(targetOrder);
    }));

    const cost = orders.reduce((acc, order) => {
      const price = (order.length !== 0) ? order[0].getPrice() : 0;
      return acc + price;
    }, 0);

    return cost;
  }

}
