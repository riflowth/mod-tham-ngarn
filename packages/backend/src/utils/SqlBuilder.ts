import { ReadOptions } from '@/repositories/ReadOptions';
import { MySqlClient } from '@/utils/database/connectors/MySqlConnector';

export class SqlBuilder {

  private readonly database: MySqlClient;

  public constructor(database: MySqlClient) {
    this.database = database;
  }

  public insert(table: string, parameter: Object) {
    const cleanedParameter: Object = JSON.parse(JSON.stringify(parameter));

    const set = Object
      .keys(cleanedParameter)
      .map((key) => key.concat('= ?')).join(', ');

    const query = [`INSERT INTO ${table} SET`, set].join(' ');
    const values = Object.values(cleanedParameter);

    return this.database.execute(query, values);
  }

  public read(table: string, parameter: Object, readOptions?: ReadOptions) {
    const { limit, offset } = readOptions || {};

    if (limit || offset) {
      const isIntegerOptions = Number.isInteger(limit) && Number.isInteger(offset);
      if (!isIntegerOptions) {
        throw new Error('limit and offset must be integer');
      }

      const isValidReadOptions = limit > 0 && (!offset || offset >= 0);
      if (!isValidReadOptions) {
        throw new Error('Invalid relationship limit or offset');
      }
    }

    const cleanedParameter: Object = JSON.parse(JSON.stringify(parameter));

    const condition = Object
      .keys(cleanedParameter)
      .map((key) => `AND ${key} = ?`);

    const limitOption = (limit && limit >= 0) && `LIMIT ${limit}`;
    const offsetOption = (limitOption && offset > 0) && `OFFSET ${offset}`;

    const query = [
      `SELECT * FROM ${table} WHERE 1`,
      ...condition,
      limitOption,
      offsetOption,
    ].filter(Boolean).join(' ');

    const values = Object.values(cleanedParameter);

    return this.database.execute(query, values);
  }

  public update(table: string, source: Object, destination: Object) {
    const sourceParameter = JSON.parse(JSON.stringify(source));
    const destinationParameter = JSON.parse(JSON.stringify(destination));

    const set = Object
      .keys(sourceParameter)
      .map((key) => key.concat('= ?')).join(', ');

    const query = [
      `UPDATE ${table} SET ${set} WHERE 1`,
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const values = [
      ...Object.values<string>(sourceParameter),
      ...Object.values<string>(destinationParameter),
    ];

    return this.database.execute(query, values);
  }

  public delete(table: string, parameter: Object) {
    const cleanedParameter: Object = JSON.parse(JSON.stringify(parameter));

    const query = [
      `DELETE FROM ${table} WHERE 1`,
      ...Object.keys(cleanedParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const values = Object.values(cleanedParameter);

    return this.database.execute(query, values);
  }

}
