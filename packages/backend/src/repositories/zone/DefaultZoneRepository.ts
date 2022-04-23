import { Database } from '@/utils/database/Database';
import { Zone } from '@/entities/Zone';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultZoneRepository extends Database implements ZoneRepository {

  public async create(zone: Zone): Promise<Zone> {
    const parameter = {
      zoneId: zone.getZoneId(),
      timeToStart: DateUtil.formatToSQL(zone.getTimeToStart()),
      timeToEnd: DateUtil.formatToSQL(zone.getTimeToEnd()),
      branchId: zone.getBranchId(),
    };

    try {
      const result: any = await this.query('INSERT INTO Zone SET ?', [parameter]);
      return zone.setZoneId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(zone: Zone, readOptions: ReadOptions): Promise<Zone[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      zoneId: zone.getZoneId(),
      timeToStart: zone.getTimeToStart(),
      timeToEnd: zone.getTimeToEnd(),
      branchId: zone.getBranchId(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Zone WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const zones = results[0].map((result) => {
      return new Zone()
        .setZoneId(result.zoneId)
        .setTimeToStart(DateUtil.formatFromSQL(result.timeToStart))
        .setTimeToEnd(DateUtil.formatFromSQL(result.timeToEnd))
        .setBranchId(result.branchId);
    });

    return zones;
  }

  public async update(source: Zone, destination: Zone): Promise<boolean> {
    const sourceParameter = JSON.parse(JSON.stringify({
      zoneId: source.getZoneId(),
      timeToStart: source.getTimeToStart(),
      timeToEnd: source.getTimeToEnd(),
      branchId: source.getBranchId(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      zoneId: destination.getZoneId(),
      timeToStart: destination.getTimeToStart(),
      timeToEnd: destination.getTimeToEnd(),
      branchId: destination.getBranchId(),
    }));

    const query = [
      'UPDATE Zone SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(zone: Zone): Promise<boolean> {
    const parameter = JSON.parse(JSON.stringify({
      zoneId: zone.getZoneId(),
      timeToStart: zone.getTimeToStart(),
      timeToEnd: zone.getTimeToEnd(),
      branchId: zone.getBranchId(),
    }));
    const query = [
      'DELETE FROM Zone WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
