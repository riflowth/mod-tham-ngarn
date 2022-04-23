import { Order } from '@/entities/Order';
import { OrderRepository } from '@/repositories/order/OrderRepository';
import { ReadOptions } from '@/repositories/ReadOptions';
import { Database } from '@/utils/database/Database';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultOrderRepository extends Database implements OrderRepository {

  public async create(order: Order): Promise<Order> {
    const parameter = {
      orderId: order.getOrderId(),
      machineId: order.getMachineId(),
      partId: order.getOrderId(),
      billId: order.getBillId(),
      price: order.getPrice(),
      arrivalDate: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    try {
      const result: any = await this.query('INSERT INTO Staff SET ?', [parameter]);
      return order.setOrderId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(order: Order, readOptions?: ReadOptions): Promise<Order[]> {
    const { limit, offset } = readOptions || {};

    const parameter = {
      orderId: order.getOrderId(),
      machineId: order.getMachineId(),
      partId: order.getOrderId(),
      billId: order.getBillId(),
      price: order.getPrice(),
      arrivalDate: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

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
        .setOrderId(result.orderId)
        .setMachineId(result.machineId)
        .setPartId(result.partId)
        .setBillId(result.billId)
        .setPrice(result.price)
        .setArrivalDate(DateUtil.formatFromSQL(result.arrivalDate))
        .setStatus(result.status);
    });

    return orders;
  }

  public async update(source: Order, destination: Order): Promise<boolean> {
    const sourceParameter = {
      orderId: source.getOrderId(),
      machineId: source.getMachineId(),
      partId: source.getOrderId(),
      billId: source.getBillId(),
      price: source.getPrice(),
      arrivalDate: DateUtil.formatToSQL(source.getArrivalDate()),
      status: source.getStatus(),
    };

    const destinationParameter = {
      orderId: destination.getOrderId(),
      machineId: destination.getMachineId(),
      partId: destination.getOrderId(),
      billId: destination.getBillId(),
      price: destination.getPrice(),
      arrivalDate: DateUtil.formatToSQL(destination.getArrivalDate()),
      status: destination.getStatus(),
    };

    const query = [
      'UPDATE Order SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(order: Order): Promise<boolean> {
    const parameter = {
      orderId: order.getOrderId(),
      machineId: order.getMachineId(),
      partId: order.getOrderId(),
      billId: order.getBillId(),
      price: order.getPrice(),
      arrivalDate: DateUtil.formatToSQL(order.getArrivalDate()),
      status: order.getStatus(),
    };

    const query = [
      'DELETE FROM Order WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
