import { MaintenancePart } from '@/entities/MaintenancePart';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';

export class DefaultMaintenancePartRepository
  extends Database implements MaintenancePartRepository {

  public async create(maintenancepart: MaintenancePart): Promise<MaintenancePart> {
    const parameter = {
      maintenance_id: maintenancepart.getMaintenanceId(),
      part_id: maintenancepart.getPartId(),
      type: maintenancepart.getType(),
      status: maintenancepart.getStatus(),
      order_id: maintenancepart.getOrderId(),
    };

    try {
      const result: any = await this.query('INSERT INTO MaintenancePart SET ?', [parameter]);
      return maintenancepart.setPrimaryKey(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenancepart: MaintenancePart,
    readOptions?: ReadOptions,
  ): Promise<MaintenancePart[]> {
    const { limit, offset } = readOptions || {};

    const parameter = {
      maintenance_id: maintenancepart.getMaintenanceId(),
      part_id: maintenancepart.getPartId(),
      type: maintenancepart.getType(),
      status: maintenancepart.getStatus(),
      order_id: maintenancepart.getOrderId(),
    };

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM MaintenancePart WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const maintenanceparts = results[0].map((result) => {
      return new MaintenancePart()
        .setPrimaryKey([result.part_id, result.machine_id])
        .setType(result.type)
        .setStatus(result.status)
        .setOrderId(result.order_id);
    });

    return maintenanceparts;
  }

  public async update(source: MaintenancePart, destination: MaintenancePart): Promise<number> {
    const sourceParameter = {
      maintenance_id: source.getMaintenanceId(),
      part_id: source.getPartId(),
      type: source.getType(),
      status: source.getStatus(),
      order_id: source.getOrderId(),
    };

    const destinationParameter = {
      maintenance_id: destination.getMaintenanceId(),
      part_id: destination.getPartId(),
      type: destination.getType(),
      status: destination.getStatus(),
      order_id: destination.getOrderId(),
    };

    const query = [
      'UPDATE MaintenancePart SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(maintenancepart: MaintenancePart): Promise<number> {
    const parameter = {
      maintenance_id: maintenancepart.getMaintenanceId(),
      part_id: maintenancepart.getPartId(),
      type: maintenancepart.getType(),
      status: maintenancepart.getStatus(),
      order_id: maintenancepart.getOrderId(),
    };

    const query = [
      'DELETE FROM MaintenancePart WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
