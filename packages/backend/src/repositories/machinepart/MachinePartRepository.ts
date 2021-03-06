import { MachinePart } from '@/entities/MachinePart';
import { Repository } from '@/repositories/Repository';

export interface MachinePartRepository extends Repository<MachinePart> {

  readByPartId(partId: number): Promise<MachinePart>

  updateStatus(targetPartId: number, status: string): Promise<number>

}
