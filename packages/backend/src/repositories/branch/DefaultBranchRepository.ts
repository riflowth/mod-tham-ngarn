import { Branch } from '@/entities/Branch';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';

export class DefaultBranchRepository extends Database implements BranchRepository {

  public async create(branch: Branch): Promise<Branch> {
    const parameter = {
      address: branch.getAddress(),
      postal_code: branch.getPostalCode(),
      tel_no: branch.getTelNo(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('Branch', parameter);
      return branch.setBranchId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(branch: Branch, readOptions?: ReadOptions): Promise<Branch[]> {
    const parameter = {
      branch_id: branch.getBranchId(),
      address: branch.getAddress(),
      postal_code: branch.getPostalCode(),
      tel_no: branch.getTelNo(),
    };

    const results: any = await this.getSqlBuilder().read('Branch', parameter, readOptions);

    const branches = results[0].map((result) => {
      return new Branch()
        .setBranchId(result.branch_id)
        .setAddress(result.address)
        .setPostalCode(result.postal_code)
        .setTelNo(result.tel_no);
    });

    return branches;
  }

  public async update(source: Branch, destination: Branch): Promise<number> {
    const sourceParameter = {
      address: source.getAddress(),
      postal_code: source.getPostalCode(),
      tel_no: source.getTelNo(),
    };

    const destinationParameter = {
      branch_id: destination.getBranchId(),
      address: destination.getAddress(),
      postal_code: destination.getPostalCode(),
      tel_no: destination.getTelNo(),
    };

    const result: any = await this.getSqlBuilder().update('Branch', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(branch: Branch): Promise<number> {
    const parameter = {
      branch_id: branch.getBranchId(),
      address: branch.getAddress(),
      postal_code: branch.getPostalCode(),
      tel_no: branch.getTelNo(),
    };

    const result: any = await this.getSqlBuilder().delete('Branch', parameter);

    return result[0].affectedRows;
  }

}
