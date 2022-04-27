import { Order } from '@/entities/Order';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultOrderRepository extends Database implements OrderRepository {

  public async create(order: Order): Promise<Order> {
    const parameter = {
      order_id: order.getOrderId(),
      machine_id: order.getMachineId(),
      part_id: order.getPartId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('`Order`', parameter);
      return order.setOrderId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(order: Order, readOptions?: ReadOptions): Promise<Order[]> {
    const parameter = {
      order_id: order.getOrderId(),
      machine_id: order.getMachineId(),
      part_id: order.getPartId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    const results: any = await this.getSqlBuilder().read('`Order`', parameter, readOptions);

    const orders = results[0].map((result) => {
      return new Order()
        .setOrderId(result.order_id)
        .setMachineId(result.machine_id)
        .setPartId(result.part_id)
        .setBillId(result.bill_id)
        .setPrice(result.price)
        .setArrivalDate(DateUtil.formatFromSQL(result.arrival_date))
        .setStatus(result.status);
    });

    return orders;
  }

  public async update(source: Order, destination: Order): Promise<number> {
    const sourceParameter = {
      machine_id: source.getMachineId(),
      part_id: source.getPartId(),
      bill_id: source.getBillId(),
      price: source.getPrice(),
      arrival_date: DateUtil.formatToSQL(source.getArrivalDate()),
      status: source.getStatus(),
    };

    const destinationParameter = {
      order_id: destination.getOrderId(),
      machine_id: destination.getMachineId(),
      part_id: destination.getPartId(),
      bill_id: destination.getBillId(),
      price: destination.getPrice(),
      arrival_date: DateUtil.formatToSQL(destination.getArrivalDate()),
      status: destination.getStatus(),
    };

    const result: any = await this.getSqlBuilder().update('`Order`', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(order: Order): Promise<number> {
    const parameter = {
      order_id: order.getOrderId(),
      machine_id: order.getMachineId(),
      part_id: order.getPartId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    const result: any = await this.getSqlBuilder().delete('`Order`', parameter);

    return result[0].affectedRows;
  }

}
