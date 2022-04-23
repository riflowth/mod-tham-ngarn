import { Machine } from '@/entities/Machine';
import { MachineRepository } from '@/repositories/machine/MachineRepository';
import { ReadOptions } from '@/repositories/ReadOptions'; 
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultMachineRepository extends Database implements MachineRepository {

  public async create(machine: Machine): Promise<Machine> {
    const parameter = {
      machineId: machine.getMachineId(),
      zoneId: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registrationDate: machine.getRegistrationDate(),
      retiredDate: machine.getRetiredDate(),
    };

    try {
      const result: any = await this.query('INSERT INTO Machine SET ?', [parameter]);
      return machine.setMachineId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(machine: Machine, readOptions: ReadOptions): Promise<Machine[]> {
    const { limit, offset } = readOptions || {};

    const parameter = {
      machineId: machine.getMachineId(),
      zoneId: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registrationDate: machine.getRegistrationDate(),
      retiredDate: machine.getRetiredDate(),
    };

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Machine WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const machines = results[0].map((result) => {
      return new Machine()
        .setMachineId(result.machineId)
        .setZoneId(result.zoneId)
        .setName(result.name)
        .setSerial(result.serial)
        .setRegistrationDate(DateUtil.formatFromSQL(result.registrationDate))
        .setRetiredDate(DateUtil.formatFromSQL(result.retiredDate));
    });

    return machines;
  }

  public async update(source: Machine, destination: Machine): Promise<boolean> {
    const sourceParameter = {
      machineId: source.getMachineId(),
      zoneId: source.getZoneId(),
      name: source.getName(),
      serial: source.getSerial(),
      manufacturer: source.getManufacturer(),
      registrationDate: source.getRegistrationDate(),
      retiredDate: source.getRetiredDate(),
    };

    const destinationParameter = {
      machineId: destination.getMachineId(),
      zoneId: destination.getZoneId(),
      name: destination.getName(),
      serial: destination.getSerial(),
      manufacturer: destination.getManufacturer(),
      registrationDate: destination.getRegistrationDate(),
      retiredDate: destination.getRetiredDate(),
    };

    const query = [
      'UPDATE Machine SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(machine: Machine): Promise<boolean> {
    const parameter = {
      machineId: machine.getMachineId(),
      zoneId: machine.getZoneId(),
      name: machine.getName(),
      serial: machine.getSerial(),
      manufacturer: machine.getManufacturer(),
      registrationDate: machine.getRegistrationDate(),
      retiredDate: machine.getRetiredDate(),
    };

    const query = [
      'DELETE FROM Machine WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
