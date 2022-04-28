import { Bill } from '@/entities/Bill';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Repository } from '@/repositories/Repository';

export interface BillRepository extends Repository<Bill> {

  readByBranchId(branchId: number, readOptions?: ReadOptions): Promise<Bill[]>

}
