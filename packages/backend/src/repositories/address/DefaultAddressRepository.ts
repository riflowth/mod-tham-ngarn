import { Database } from '@/utils/database/Database';
import { Address } from '@/entities/Address';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export class DefaultAddressRepository extends Database implements AddressRepository {

  public async create(address: Address): Promise<Address> {
    const parameter = {
      postal_code: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    };

    try {
      await this.getSqlBuilder().insert('Address', parameter);
      return address;
    } catch (e) {
      return null;
    }
  }

  public async read(address: Address, readOptions?: ReadOptions): Promise<Address[]> {
    const parameter = {
      postal_code: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    };

    const results: any = await this.getSqlBuilder().read('Address', parameter, readOptions);

    const addresses = results[0].map((result) => {
      return new Address()
        .setPostalCode(result.postal_code)
        .setRegion(result.region)
        .setCountry(result.country);
    });

    return addresses;
  }

  public async update(source: Address, destination: Address): Promise<number> {
    const sourceParameter = {
      region: source.getRegion(),
      country: source.getCountry(),
    };

    const destinationParameter = {
      postal_code: destination.getPostalCode(),
      region: destination.getRegion(),
      country: destination.getCountry(),
    };

    const result: any = await this.getSqlBuilder().update('Address', sourceParameter, destinationParameter);

    return result[0].affectedRows;
  }

  public async delete(address: Address): Promise<number> {
    const parameter = {
      postal_code: address.getPostalCode(),
      region: address.getRegion(),
      country: address.getCountry(),
    };

    const result: any = await this.getSqlBuilder().delete('Address', parameter);

    return result[0].affectedRows;
  }

}
