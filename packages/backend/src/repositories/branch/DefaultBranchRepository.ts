import { Branch } from '@/entities/Branch';
import { BranchRepository } from '@/repositories/branch/branchRepository';
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
      const result: any = await this.query('INSERT INTO Branch SET ?', [parameter]);
      return branch.setBranchId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(branch: Branch, readOptions: ReadOptions): Promise<Branch[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      branch_id: branch.getBranchId(),
      address: branch.getAddress(),
      postal_code: branch.getPostalCode(),
      tel_no: branch.getTelNo(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Branch WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const branches = results[0].map((result) => {
      return new Branch()
        .setBranchId(result.branch_id)
        .setAddress(result.address)
        .setPostalCode(result.postal_code)
        .setTelNo(result.tel_no);
    });
    console.log(branches);

    return branches;
  }

  public async update(source: Branch, destination: Branch): Promise<number> {
    const sourceParameter = JSON.parse(JSON.stringify({
      address: source.getAddress(),
      postal_code: source.getPostalCode(),
      tel_no: source.getTelNo(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      branch_id: destination.getBranchId(),
      address: destination.getAddress(),
      postal_code: destination.getPostalCode(),
      tel_no: destination.getTelNo(),
    }));

    const query = [
      'UPDATE Branch SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(branch: Branch): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      branch_id: branch.getBranchId(),
      address: branch.getAddress(),
      postal_code: branch.getPostalCode(),
      tel_no: branch.getTelNo(),
    }));

    const query = [
      'DELETE FROM Branch WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
