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
      part_id: order.getOrderId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    try {
      const result: any = await this.query('INSERT INTO Order SET ?', [parameter]);
      return order.setOrderId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(order: Order, readOptions?: ReadOptions): Promise<Order[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      order_id: order.getOrderId(),
      machine_id: order.getMachineId(),
      part_id: order.getOrderId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Order WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

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
    const sourceParameter = JSON.parse(JSON.stringify({
      machine_id: source.getMachineId(),
      part_id: source.getOrderId(),
      bill_id: source.getBillId(),
      price: source.getPrice(),
      arrival_date: DateUtil.formatToSQL(source.getArrivalDate()),
      status: source.getStatus(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      order_id: destination.getOrderId(),
      machine_id: destination.getMachineId(),
      part_id: destination.getOrderId(),
      bill_id: destination.getBillId(),
      price: destination.getPrice(),
      arrival_date: DateUtil.formatToSQL(destination.getArrivalDate()),
      status: destination.getStatus(),
    }));

    const query = [
      'UPDATE Order SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(order: Order): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      order_id: order.getOrderId(),
      machine_id: order.getMachineId(),
      part_id: order.getOrderId(),
      bill_id: order.getBillId(),
      price: order.getPrice(),
      arrival_date: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    }));

    const query = [
      'DELETE FROM Order WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
