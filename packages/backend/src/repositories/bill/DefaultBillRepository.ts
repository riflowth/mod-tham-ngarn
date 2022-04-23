import { Bill } from '@/entities/Bill';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { Database } from '@/utils/database/Database';
import { ReadOptions } from '@/repositories/ReadOptions';

export class DefaultBillRepository extends Database implements BillRepository {

  public async create(bill: Bill): Promise<Bill> {
    const parameter = {
      store_name: bill.getStoreName(),
      bill_date: bill.getOrderDate(),
      order_by: bill.getOrderBy(),
    };

    try {
      const result: any = await this.query('INSERT INTO Bill SET ?', [parameter]);
      return bill.setBillId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(bill: Bill, readOptions?: ReadOptions): Promise<Bill[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      bill_id: bill.getBillId(),
      store_name: bill.getStoreName(),
      bill_date: bill.getOrderDate(),
      order_by: bill.getOrderBy(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Bill WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const bills = results[0].map((result) => {
      return new Bill()
        .setBillId(result.bill_id)
        .setStoreName(result.store_name)
        .setOrderDate(result.bill_date)
        .setOrderBy(result.order_by);
    });

    return bills;
  }

  public async update(source: Bill, destination: Bill): Promise<number> {
    const sourceParameter = JSON.parse(JSON.stringify({
      store_name: source.getStoreName(),
      bill_date: source.getOrderDate(),
      order_by: source.getOrderBy(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      bill_id: source.getBillId(),
      store_name: destination.getStoreName(),
      bill_date: destination.getOrderDate(),
      order_by: destination.getOrderBy(),
    }));

    const query = [
      'UPDATE Bill SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows;
  }

  public async delete(bill: Bill): Promise<number> {
    const parameter = JSON.parse(JSON.stringify({
      bill_id: bill.getBillId(),
      store_name: bill.getStoreName(),
      bill_date: bill.getOrderDate(),
      order_by: bill.getOrderBy(),
    }));

    const query = [
      'DELETE FROM Bill WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows;
  }

}
