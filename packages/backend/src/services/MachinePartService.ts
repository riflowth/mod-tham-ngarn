import { Machine } from '@/entities/Machine';
import { MachinePart } from '@/entities/MachinePart';
import { Order } from '@/entities/Order';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export class MachinePartService {

  private readonly machineRepository: MachineRepository;
  private readonly machinePartRepository: MachinePartRepository;
  private readonly orderRepository: OrderRepository;

  public constructor(
    machineRepository: MachineRepository,
    machinePartRepository: MachinePartRepository,
    orderRepository: OrderRepository,
  ) {
    this.machineRepository = machineRepository;
    this.machinePartRepository = machinePartRepository;
    this.orderRepository = orderRepository;
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
    const relatedMachine = await this.machineRepository.read(relatedMachineToRead);

    if (!relatedMachine) {
      throw new InvalidRequestException('MachineId related to zone does nor existed');
    }

    return this.machinePartRepository.create(newMachinePart);
  }

  public async editMachinePart(partId: number, newMachinePart: MachinePart): Promise<MachinePart> {
    const machinPartToEdit = new MachinePart().setPartId(partId);
    const targetMachinePart = await this.machinePartRepository.read(machinPartToEdit);

    if (!targetMachinePart) {
      throw new NotFoundException('Target machinePart does not exist');
    }

    const newMachineId = newMachinePart.getMachineId();

    if (newMachineId) {
      const relatedMachineToEdit = new Machine().setMachineId(newMachineId);
      const relatedMachine = await this.machineRepository.read(relatedMachineToEdit);

      if (!relatedMachine) {
        throw new InvalidRequestException('machineId related to machinePart does not exist.');
      }
    }

    const affectedRowAmount = await this.machinePartRepository.update(
      newMachinePart,
      machinPartToEdit,
    );

    return affectedRowAmount === 1 ? newMachinePart.setPrimaryKey(partId) : null;
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

    return 'Active ทำงานอยู่นะมุแง';
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
