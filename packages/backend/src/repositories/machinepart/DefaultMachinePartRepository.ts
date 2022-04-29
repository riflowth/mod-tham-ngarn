import { MachinePart } from '@/entities/MachinePart';
import { MachinePartRepository } from '@/repositories/machinepart/MachinePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';

export class DefaultMachinePartRepository extends Database implements MachinePartRepository {

  public async create(machinePart: MachinePart): Promise<MachinePart> {
    const parameter = {
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('MachinePart', parameter);
      return machinePart.setPrimaryKey(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(machinePart: MachinePart, readOptions?: ReadOptions): Promise<MachinePart[]> {
    const parameter = {
      part_id: machinePart.getPartId(),
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    };

    const results: any = await this.getSqlBuilder().read('MachinePart', parameter, readOptions);

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
    const sourceParameter = {
      machine_id: source.getMachineId(),
      part_name: source.getPartName(),
      status: source.getStatus(),
    };

    const destinationParameter = {
      part_id: destination.getPartId(),
      machine_id: destination.getMachineId(),
      part_name: destination.getPartName(),
      status: destination.getStatus(),
    };

    const result: any = await this.getSqlBuilder().update('MachinePart', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(machinePart: MachinePart): Promise<number> {
    const parameter = {
      part_id: machinePart.getPartId(),
      machine_id: machinePart.getMachineId(),
      part_name: machinePart.getPartName(),
      status: machinePart.getStatus(),
    };

    const result: any = await this.getSqlBuilder().delete('MachinePart', parameter);

    return result[0].affectedRows;
  }

  public async readByPartId(partId: number): Promise<MachinePart> {
    const expectedPart = new MachinePart().setPartId(partId);
    const [part] = await this.read(expectedPart);

    return part;
  }

}
