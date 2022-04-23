import { MachinePart } from '@/entities/MachinePart';
import { MachinePartRepository } from '@/repositories/machinePart/MachinePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';

export class DefaultMachinePartRepository extends Database implements MachinePartRepository {

  public async create(machinePart: MachinePart): Promise<MachinePart> {
    const parameter = {
      part_id: machinePart.getPartId(),
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    };

    try {
      const result: any = await this.query('INSERT INTO MachinePart SET ?', [parameter]);
      return machinePart.setPrimaryKey(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(machinePart: MachinePart, readOptions?: ReadOptions): Promise<MachinePart[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      part_id: machinePart.getPartId(),
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM MachinePart WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    console.log(query);

    const results: any = await this.query(query, Object.values(parameter));

    const machineParts = results[0].map((result) => {
      return new MachinePart()
        .setPrimaryKey(result.id)
        .setPartId(result.part_id)
        .setMachineId(result.machine_id)
        .setPartName(result.part_name)
        .setStatus(result.status);
    });

    return machineParts;
  }

  public async update(source: MachinePart, destination: MachinePart): Promise<number> {
    const sourceParameter = JSON.parse(JSON.stringify({
      machine_id: source.getMachineId(),
      part_name: source.getPartName(),
      status: source.getStatus(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      part_id: destination.getPartId(),
      machine_id: destination.getMachineId(),
      part_name: destination.getPartName(),
      status: destination.getStatus(),
    }));

    const query = [
      'UPDATE MachinePart SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(machinePart: MachinePart): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      part_id: machinePart.getPartId(),
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    }));

    const query = [
      'DELETE FROM MachinePart WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
