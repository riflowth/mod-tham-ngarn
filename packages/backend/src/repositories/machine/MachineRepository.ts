import { Machine } from '@/entities/Machine';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Repository } from '@/repositories/Repository';

export interface MachineRepository extends Repository<Machine> {

  readByMachineId(machineId: number): Promise<Machine>

  readByBranchId(branchId: number, readOptions?: ReadOptions): Promise<Machine[]>

}
