import { Machine } from '@/entities/Machine';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultMachineRepository extends Database implements MachineRepository {

  public async create(machine: Machine): Promise<Machine> {
    const parameter = {
      zone_id: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registration_date: DateUtil.formatToSQL(machine.getRegistrationDate()),
      retired_date: DateUtil.formatToSQL(machine.getRetiredDate()),
      price: machine.getPrice(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('Machine', parameter);
      return machine.setMachineId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(machine: Machine, readOptions?: ReadOptions): Promise<Machine[]> {
    const parameter = {
      machine_id: machine.getMachineId(),
      zone_id: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registration_date: DateUtil.formatToSQL(machine.getRegistrationDate()),
      retired_date: DateUtil.formatToSQL(machine.getRetiredDate()),
      price: machine.getPrice(),
    };

    const results: any = await this.getSqlBuilder().read('Machine', parameter, readOptions);

    const machines = results[0].map((result) => {
      return new Machine()
        .setMachineId(result.machine_id)
        .setZoneId(result.zone_id)
        .setName(result.name)
        .setSerial(result.serial)
        .setManufacturer(result.manufacturer)
        .setRegistrationDate(DateUtil.formatFromSQL(result.registration_date))
        .setRetiredDate(DateUtil.formatFromSQL(result.retired_date))
        .setPrice(result.price);
    });

    return machines;
  }

  public async update(source: Machine, destination: Machine): Promise<number> {
    const sourceParameter = {
      zone_id: source.getZoneId(),
      name: source.getName(),
      serial: source.getSerial(),
      manufacturer: source.getManufacturer(),
      registration_date: DateUtil.formatToSQL(source.getRegistrationDate()),
      retired_date: DateUtil.formatToSQL(source.getRetiredDate()),
      price: source.getPrice(),
    };

    const destinationParameter = {
      machine_id: destination.getMachineId(),
      zone_id: destination.getZoneId(),
      name: destination.getName(),
      serial: destination.getSerial(),
      manufacturer: destination.getManufacturer(),
      registration_date: DateUtil.formatToSQL(destination.getRegistrationDate()),
      retired_date: DateUtil.formatToSQL(destination.getRetiredDate()),
      price: destination.getPrice(),
    };

    const result: any = await this.getSqlBuilder().update('Machine', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(machine: Machine): Promise<number> {
    const parameter = {
      machine_id: machine.getMachineId(),
      zone_id: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registration_date: DateUtil.formatToSQL(machine.getRegistrationDate()),
      retired_date: DateUtil.formatToSQL(machine.getRetiredDate()),
      price: machine.getPrice(),
    };

    const result: any = await this.getSqlBuilder().delete('Machine', parameter);

    return result[0].affectedRows;
  }

  public async readByMachineId(machineId: number): Promise<Machine> {
    const expectedMachine = new Machine().setMachineId(machineId);
    const [machine] = await this.read(expectedMachine);

    return machine;
  }

  public async readByBranchId(branchId: number, readOptions?: ReadOptions): Promise<Machine[]> {
    const { limit, offset } = readOptions || {};

    if (limit || offset) {
      const isIntegerOptions = Number.isInteger(limit) || Number.isInteger(offset);
      if (!isIntegerOptions) {
        throw new Error('limit and offset must be integer');
      }

      const isValidReadOptions = limit > 0 && (!offset || offset >= 0);
      if (!isValidReadOptions) {
        throw new Error('Invalid relationship limit or offset');
      }
    }

    const limitOption = (limit && limit >= 0) && `LIMIT ${limit}`;
    const offsetOption = (limitOption && offset > 0) && `OFFSET ${offset}`;

    const query = [
      'SELECT * FROM Machine WHERE zone_id IN (SELECT zone_id FROM Zone WHERE branch_id = ?)',
      limitOption,
      offsetOption,
    ].filter(Boolean).join(' ');

    const results: any = await this.execute(query, [branchId]);

    const machines = results[0].map((result) => {
      return new Machine()
        .setMachineId(result.machine_id)
        .setZoneId(result.zone_id)
        .setName(result.name)
        .setSerial(result.serial)
        .setManufacturer(result.manufacturer)
        .setRegistrationDate(DateUtil.formatFromSQL(result.registration_date))
        .setRetiredDate(DateUtil.formatFromSQL(result.retired_date))
        .setPrice(result.price);
    });

    return machines;
  }

}
