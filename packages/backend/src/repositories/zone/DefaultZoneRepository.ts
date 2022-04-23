import { Database } from '@/utils/database/Database';
import { Zone } from '@/entities/Zone';
import { ZoneRepository } from '@/repositories/zone/ZoneRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultZoneRepository extends Database implements ZoneRepository {

  public async create(zone: Zone): Promise<Zone> {
    const parameter = {
      time_to_start: DateUtil.formatToSQL(zone.getTimeToStart()),
      time_to_end: DateUtil.formatToSQL(zone.getTimeToEnd()),
      branch_id: zone.getBranchId(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('Zone', parameter);
      return zone.setZoneId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(zone: Zone, readOptions?: ReadOptions): Promise<Zone[]> {
    const parameter = {
      zone_id: zone.getZoneId(),
      time_to_start: zone.getTimeToStart(),
      time_to_end: zone.getTimeToEnd(),
      branch_id: zone.getBranchId(),
    };

    const results: any = await this.getSqlBuilder().read('Zone', parameter, readOptions);

    const zones = results[0].map((result) => {
      return new Zone()
        .setZoneId(result.zone_id)
        .setTimeToStart(DateUtil.formatFromSQL(result.time_to_start))
        .setTimeToEnd(DateUtil.formatFromSQL(result.time_to_end))
        .setBranchId(result.branch_id);
    });

    return zones;
  }

  public async update(source: Zone, destination: Zone): Promise<number> {
    const sourceParameter = {
      time_to_start: source.getTimeToStart(),
      time_to_end: source.getTimeToEnd(),
      branch_id: source.getBranchId(),
    };

    const destinationParameter = {
      zone_id: destination.getZoneId(),
      time_to_start: destination.getTimeToStart(),
      time_to_end: destination.getTimeToEnd(),
      branch_id: destination.getBranchId(),
    };

    const result: any = await this.getSqlBuilder().update('Zone', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(zone: Zone): Promise<number> {
    const parameter = {
      zone_id: zone.getZoneId(),
      time_to_start: zone.getTimeToStart(),
      time_to_end: zone.getTimeToEnd(),
      branch_id: zone.getBranchId(),
    };
    const result: any = await this.getSqlBuilder().delete('Zone', parameter);

    return result[0].affectedRows;
  }

}
