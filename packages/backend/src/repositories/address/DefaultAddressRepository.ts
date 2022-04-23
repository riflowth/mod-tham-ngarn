import { Database } from '@/utils/database/Database';
import { Address } from '@/entities/Address';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export class DefaultAddressRepository extends Database implements AddressRepository {

  public async create(address: Address): Promise<Address> {
    const parameter = {
      postalCode: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    };

    try {
      const result: any = await this.query('INSERT INTO Address SET ?', [parameter]);
      return address.setPostalCode(result[0].insertId);
    } catch (e) {
      return null;
    }
  }

  public async read(address: Address, readOptions: ReadOptions): Promise<Address[]> {
    const { limit, offset } = readOptions || {};

    const parameter = JSON.parse(JSON.stringify({
      postalCode: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    }));

    const condition = Object.keys(parameter).map((key) => `AND ${key} = ?`);
    const limitOption = (limit && limit >= 0) ? `LIMIT ${limit}` : '';
    const offsetOption = (limitOption && offset > 0) ? `OFFSET ${offset}` : '';

    const query = [
      'SELECT * FROM Address WHERE 1',
      ...condition,
      limitOption,
      offsetOption,
    ].join(' ');

    const results: any = await this.query(query, Object.values(parameter));

    const addresses = results[0].map((result) => {
      return new Address()
        .setPostalCode(result.postalCode)
        .setRegion(result.region)
        .setCountry(result.country);
    });

    return addresses;
  }

  public async update(source: Address, destination: Address): Promise<boolean> {
    const sourceParameter = JSON.parse(JSON.stringify({
      postalCode: source.getPostalCode(),
      region: source.getRegion(),
      country: source.getCountry(),
    }));

    const destinationParameter = JSON.parse(JSON.stringify({
      postalCode: destination.getPostalCode(),
      region: destination.getRegion(),
      country: destination.getCountry(),
    }));

    const query = [
      'UPDATE Address SET ? WHERE 1',
      ...Object.keys(destinationParameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(
      query,
      [sourceParameter, ...Object.values(destinationParameter)],
    );

    return result[0].affectedRows !== 0;
  }

  public async delete(address: Address): Promise<boolean> {
    const parameter = JSON.parse(JSON.stringify({
      postalCode: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    }));
    const query = [
      'DELETE FROM Address WHERE 1',
      ...Object.keys(parameter).map((key) => `AND ${key} = ?`),
    ].join(' ');

    const result: any = await this.query(query, Object.values(parameter));

    return result[0].affectedRows !== 0;
  }

}
