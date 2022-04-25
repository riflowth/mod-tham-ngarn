import { Bill } from '@/entities/Bill';
import { BillRepository } from '@/repositories/bill/BillRepository';
import { Database } from '@/utils/database/Database';
import { ReadOptions } from '@/repositories/ReadOptions';
import { DateUtil } from '@/utils/DateUtil';

export class DefaultBillRepository extends Database implements BillRepository {

  public async create(bill: Bill): Promise<Bill> {
    const parameter = {
      store_name: bill.getStoreName(),
      bill_date: DateUtil.formatToSQL(bill.getOrderDate()),
      order_by: bill.getOrderBy(),
    };

    try {
      const result: any = await this.getSqlBuilder().insert('Bill', parameter);
      return bill.setBillId(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(bill: Bill, readOptions?: ReadOptions): Promise<Bill[]> {
    const parameter = {
      bill_id: bill.getBillId(),
      store_name: bill.getStoreName(),
      bill_date: DateUtil.formatToSQL(bill.getOrderDate()),
      order_by: bill.getOrderBy(),
    };

    const results: any = await this.getSqlBuilder().read('Bill', parameter, readOptions);

    const bills = results[0].map((result) => {
      return new Bill()
        .setBillId(result.bill_id)
        .setStoreName(result.store_name)
        .setOrderDate(DateUtil.formatFromSQL(result.bill_date))
        .setOrderBy(result.order_by);
    });

    return bills;
  }

  public async update(source: Bill, destination: Bill): Promise<number> {
    const sourceParameter = {
      store_name: source.getStoreName(),
      bill_date: DateUtil.formatToSQL(source.getOrderDate()),
      order_by: source.getOrderBy(),
    };

    const destinationParameter = {
      bill_id: source.getBillId(),
      store_name: destination.getStoreName(),
      bill_date: DateUtil.formatToSQL(destination.getOrderDate()),
      order_by: destination.getOrderBy(),
    };

    const result: any = await this.getSqlBuilder().update('Bill', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(bill: Bill): Promise<number> {
    const parameter = {
      bill_id: bill.getBillId(),
      store_name: bill.getStoreName(),
      bill_date: DateUtil.formatToSQL(bill.getOrderDate()),
      order_by: bill.getOrderBy(),
    };

    const result: any = await this.getSqlBuilder().delete('Bill', parameter);

    return result[0].affectedRows;
  }

}
