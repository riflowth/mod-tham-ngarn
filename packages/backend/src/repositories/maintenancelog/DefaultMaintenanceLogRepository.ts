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
      const result: any = await this.getSqlBuilder().insert('MaintenanceLog', parameter);
      return maintenanceLog.setMaintenanceId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenanceLog: MaintenanceLog,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {

    const parameter = {
      maintenance_id: maintenanceLog.getMaintenanceId(),
      machine_id: maintenanceLog.getMachineId(),
      reporter_id: maintenanceLog.getReporterId(),
      maintainer_id: maintenanceLog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenanceLog.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(maintenanceLog.getMaintenanceDate()),
      reason: maintenanceLog.getReason(),
      status: maintenanceLog.getStatus(),
    };

    const results: any = await this.getSqlBuilder().read('MaintenanceLog', parameter, readOptions);

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
    const sourceParameter = {
      machine_id: source.getMachineId(),
      reporter_id: source.getReporterId(),
      maintainer_id: source.getMaintainerId(),
      report_date: DateUtil.formatToSQL(source.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(source.getMaintenanceDate()),
      reason: source.getReason(),
      status: source.getStatus(),
    };

    const destinationParameter = {
      maintenance_id: destination.getMaintenanceId(),
      machine_id: destination.getMachineId(),
      reporter_id: destination.getReporterId(),
      maintainer_id: destination.getMaintainerId(),
      report_date: DateUtil.formatToSQL(destination.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(destination.getMaintenanceDate()),
      reason: destination.getReason(),
      status: destination.getStatus(),
    };

    const result: any = await this.getSqlBuilder().update('MaintenanceLog', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(maintenanceLog: MaintenanceLog): Promise<number> {
    const parameter = {
      maintenance_id: maintenanceLog.getMaintenanceId(),
      machine_id: maintenanceLog.getMachineId(),
      reporter_id: maintenanceLog.getReporterId(),
      maintainer_id: maintenanceLog.getMaintainerId(),
      report_date: DateUtil.formatToSQL(maintenanceLog.getReportDate()),
      maintenance_date: DateUtil.formatToSQL(maintenanceLog.getMaintenanceDate()),
      reason: maintenanceLog.getReason(),
      status: maintenanceLog.getStatus(),
    };

    const result: any = await this.getSqlBuilder().delete('MaintenanceLog', parameter);

    return result[0].affectedRows;
  }

  public async readByMaintenanceId(maintenanceId: number) {
    const expectedMaintenanceLog = new MaintenanceLog().setMaintenanceId(maintenanceId);
    const [maintenanceLog] = await this.read(expectedMaintenanceLog);

    return maintenanceLog;
  }

  public async readInprogressMaintenanceByMachineId(machineId: number): Promise<MaintenanceLog> {
    const query = 'SELECT * FROM MaintenanceLog WHERE machine_id = ? AND (status = \'OPENED\' OR status = \'PENDING\')';
    const values = [machineId];

    const results: any = await this.execute(query, values);

    const [maintenanceLogs] = results[0].map((result) => {
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

  public async readByStatusByBranchId(
    branchId: number,
    status: string,
    readOptions?: ReadOptions,
  ): Promise<MaintenanceLog[]> {
    const query = 'SELECT * FROM MaintenanceLog WHERE status = ? AND machine_id IN (SELECT machine_id FROM Machine WHERE zone_id IN (SELECT zone_id FROM Zone WHERE branch_id = ?))';
    const values = [status, branchId];

    const results: any = await this.execute(query, values);

    const [maintenanceLogs] = results[0].map((result) => {
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

}
