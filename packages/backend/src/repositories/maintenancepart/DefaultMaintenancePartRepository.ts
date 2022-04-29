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
      await this.getSqlBuilder().insert('MaintenancePart', parameter);
      return maintenancePart;
    } catch (e) {
      return null;
    }
  }

  public async read(
    maintenancePart: MaintenancePart,
    readOptions?: ReadOptions,
  ): Promise<MaintenancePart[]> {
    const parameter = {
      maintenance_id: maintenancePart.getMaintenanceId(),
      part_id: maintenancePart.getPartId(),
      type: maintenancePart.getType(),
      status: maintenancePart.getStatus(),
      order_id: maintenancePart.getOrderId(),
    };

    const results: any = await this.getSqlBuilder().read('MaintenancePart', parameter, readOptions);

    const maintenanceParts = results[0].map((result) => {
      return new MaintenancePart()
        .setPrimaryKey([result.maintenance_id, result.part_id])
        .setType(result.type)
        .setStatus(result.status)
        .setOrderId(result.order_id);
    });

    return maintenanceParts;
  }

  public async update(source: MaintenancePart, destination: MaintenancePart): Promise<number> {
    const sourceParameter = {
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

    const result: any = await this.getSqlBuilder().update('MaintenancePart', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(maintenancePart: MaintenancePart): Promise<number> {
    const parameter = {
      maintenance_id: maintenancePart.getMaintenanceId(),
      part_id: maintenancePart.getPartId(),
      type: maintenancePart.getType(),
      status: maintenancePart.getStatus(),
      order_id: maintenancePart.getOrderId(),
    };

    const result: any = await this.getSqlBuilder().delete('MaintenancePart', parameter);

    return result[0].affectedRows;
  }

  public async readByOrderId(orderId: number): Promise<MaintenancePart> {
    const expectedMaintenancePart = new MaintenancePart().setOrderId(orderId);
    const [maintenanceParts] = await this.read(expectedMaintenancePart);

    return maintenanceParts;
  }

  public async readByMaintenanceId(maintenanceId: number): Promise<MaintenancePart[]> {
    const expectedMaintenancePart = new MaintenancePart().setMaintenanceId(maintenanceId);
    return this.read(expectedMaintenancePart);
  }

  public async readByPrimaryKey(maintenanceId: number, partId: number): Promise<MaintenancePart> {
    const expectedMaintenancePart = new MaintenancePart()
      .setPrimaryKey([maintenanceId, partId]);
    const [maintenancePart] = await this.read(expectedMaintenancePart);

    return maintenancePart;
  }

}
