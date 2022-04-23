import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultMaintenanceLogRepository extends Database implements MaintenanceLogRepository {

  public async create(maintenancelog: MaintenanceLog): Promise<MaintenanceLog> {
    const parameter = {
      maintenance_id: maintenancelog.getMaintenaceId(),
      machine_id: maintenancelog.getmachineId(),
      reporter_id: maintenancelog.getReporterId(),
      maintainer_id: maintenancelog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenancelog.getReportDate()),
      maintenace_date: DateUtil.formatToSQL(maintenancelog.getMaintenaceDate()),
      reason: maintenancelog.getReason(),
      status: maintenancelog.getStatus(),
    };

    try {
      const result: any = await this.query('INSERT INTO MaintenanceLog SET ?', [parameter]);
      return maintenancelog.setMaintenanceId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenancelog: MaintenanceLog,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    const { limit, offset } = readOptions || {};

    const parameter = {
      maintenance_id: maintenancelog.getMaintenaceId(),
      machine_id: maintenancelog.getmachineId(),
      reporter_id: maintenancelog.getReporterId(),
      maintainer_id: maintenancelog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenancelog.getReportDate()),
      maintenace_date: DateUtil.formatToSQL(maintenancelog.getMaintenaceDate()),
      reason: maintenancelog.getReason(),
      status: maintenancelog.getStatus(),
    };

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM MaintenanceLog WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const maintenancelogs = results[0].map((result) => {
      return new MaintenanceLog()
        .setMaintenanceId(result.maintenance_id)
        .setMachineId(result.machine_id)
        .setReporterId(result.reporter_id)
        .setMaintainerId(result.maintainer_id)
        .setReportDate(DateUtil.formatFromSQL(result.report_date))
        .setMaintenaceDate(DateUtil.formatFromSQL(result.maintenace_date))
        .setReason(result.reason)
        .setStatus(result.status);
    });

    return maintenancelogs;
  }

  public async update(source: MaintenanceLog, destination: MaintenanceLog): Promise<number> {
    const sourceParameter = {
      maintenance_id: source.getMaintenaceId(),
      machine_id: source.getmachineId(),
      reporter_id: source.getReporterId(),
      maintainer_id: source.getMaintainerId(),
      report_date: DateUtil.formatToSQL(source.getReportDate()),
      maintenace_date: DateUtil.formatToSQL(source.getMaintenaceDate()),
      reason: source.getReason(),
      status: source.getStatus(),
    };

    const destinationParameter = {
      maintenance_id: destination.getMaintenaceId(),
      machine_id: destination.getmachineId(),
      reporter_id: destination.getReporterId(),
      maintainer_id: destination.getMaintainerId(),
      report_date: DateUtil.formatToSQL(destination.getReportDate()),
      maintenace_date: DateUtil.formatToSQL(destination.getMaintenaceDate()),
      reason: destination.getReason(),
      status: destination.getStatus(),
    };

    const query = [
      'UPDATE MaintenanceLog SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(maintenancelog: MaintenanceLog): Promise<number> {
    const parameter = {
      maintenance_id: maintenancelog.getMaintenaceId(),
      machine_id: maintenancelog.getmachineId(),
      reporter_id: maintenancelog.getReporterId(),
      maintainer_id: maintenancelog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenancelog.getReportDate()),
      maintenace_date: DateUtil.formatToSQL(maintenancelog.getMaintenaceDate()),
      reason: maintenancelog.getReason(),
      status: maintenancelog.getStatus(),
    };

    const query = [
      'DELETE FROM MaintenanceLog WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
