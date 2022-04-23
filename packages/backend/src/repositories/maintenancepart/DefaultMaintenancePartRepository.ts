import { MaintenancePart } from '@/entities/MaintenancePart';
import { MaintenancePartRepository } from '@/repositories/maintenancepart/MaintenancePartRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';

export class DefaultMaintenancePartRepository
  extends Database implements MaintenancePartRepository {

  public async create(maintenancePart: MaintenancePart): Promise<MaintenancePart> {
    const parameter = {
      maintenance_id: maintenancePart.getMaintenanceId(),
      part_id: maintenancePart.getPartId(),
      type: maintenancePart.getType(),
      status: maintenancePart.getStatus(),
      order_id: maintenancePart.getOrderId(),
    };

    try {
      await this.query('INSERT INTO MaintenancePart SET ?', [parameter]);
      return maintenancePart;
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenancePart: MaintenancePart,
    readOptions?: ReadOptions,
  ): Promise<MaintenancePart[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      maintenance_id: maintenancePart.getMaintenanceId(),
      part_id: maintenancePart.getPartId(),
      type: maintenancePart.getType(),
      status: maintenancePart.getStatus(),
      order_id: maintenancePart.getOrderId(),
    }));

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

    const maintenanceParts = results[0].map((result) => {
      return new MaintenancePart()
        .setPrimaryKey([result.part_id, result.machine_id])
        .setType(result.type)
        .setStatus(result.status)
        .setOrderId(result.order_id);
    });

    return maintenanceParts;
  }

  public async update(source: MaintenancePart, destination: MaintenancePart): Promise<number> {
    const sourceParameter = JSON.parse(JSON.stringify({
      type: source.getType(),
      status: source.getStatus(),
      order_id: source.getOrderId(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      maintenance_id: destination.getMaintenanceId(),
      part_id: destination.getPartId(),
      type: destination.getType(),
      status: destination.getStatus(),
      order_id: destination.getOrderId(),
    }));

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

  public async delete(maintenancePart: MaintenancePart): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      maintenance_id: maintenancePart.getMaintenanceId(),
      part_id: maintenancePart.getPartId(),
      type: maintenancePart.getType(),
      status: maintenancePart.getStatus(),
      order_id: maintenancePart.getOrderId(),
    }));

    const query = [
      'DELETE FROM MaintenancePart WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
