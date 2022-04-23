import { MaintenanceLog } from '@/entities/MaintenanceLog';
import { MaintenanceLogRepository } from '@/repositories/maintenancelog/MaintenanceLogRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultMaintenanceLogRepository extends Database implements MaintenanceLogRepository {

  public async create(maintenanceLog: MaintenanceLog): Promise<MaintenanceLog> {
    const parameter = {
      machine_id: maintenanceLog.getMachineId(),
      reporter_id: maintenanceLog.getReporterId(),
      maintainer_id: maintenanceLog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenanceLog.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(maintenanceLog.getMaintenanceDate()),
      reason: maintenanceLog.getReason(),
      status: maintenanceLog.getStatus(),
    };

    try {
      const result: any = await this.query('INSERT INTO MaintenanceLog SET ?', [parameter]);
      return maintenanceLog.setMaintenanceId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenanceLog: MaintenanceLog,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      maintenance_id: maintenanceLog.getMaintenanceId(),
      machine_id: maintenanceLog.getMachineId(),
      reporter_id: maintenanceLog.getReporterId(),
      maintainer_id: maintenanceLog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenanceLog.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(maintenanceLog.getMaintenanceDate()),
      reason: maintenanceLog.getReason(),
      status: maintenanceLog.getStatus(),
    }));

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

    const maintenanceLogs = results[0].map((result) => {
      return new MaintenanceLog()
        .setMaintenanceId(result.maintenance_id)
        .setMachineId(result.machine_id)
        .setReporterId(result.reporter_id)
        .setMaintainerId(result.maintainer_id)
        .setReportDate(DateUtil.formatFromSQL(result.report_date))
        .setMaintenanceDate(DateUtil.formatFromSQL(result.maintenance_date))
        .setReason(result.reason)
        .setStatus(result.status);
    });

    return maintenanceLogs;
  }

  public async update(source: MaintenanceLog, destination: MaintenanceLog): Promise<number> {
    const sourceParameter = JSON.parse(JSON.stringify({
      machine_id: source.getMachineId(),
      reporter_id: source.getReporterId(),
      maintainer_id: source.getMaintainerId(),
      report_date: DateUtil.formatToSQL(source.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(source.getMaintenanceDate()),
      reason: source.getReason(),
      status: source.getStatus(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      maintenance_id: destination.getMaintenanceId(),
      machine_id: destination.getMachineId(),
      reporter_id: destination.getReporterId(),
      maintainer_id: destination.getMaintainerId(),
      report_date: DateUtil.formatToSQL(destination.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(destination.getMaintenanceDate()),
      reason: destination.getReason(),
      status: destination.getStatus(),
    }));

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

  public async delete(maintenanceLog: MaintenanceLog): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      maintenance_id: maintenanceLog.getMaintenanceId(),
      machine_id: maintenanceLog.getMachineId(),
      reporter_id: maintenanceLog.getReporterId(),
      maintainer_id: maintenanceLog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenanceLog.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(maintenanceLog.getMaintenanceDate()),
      reason: maintenanceLog.getReason(),
      status: maintenanceLog.getStatus(),
    }));

    const query = [
      'DELETE FROM MaintenanceLog WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
