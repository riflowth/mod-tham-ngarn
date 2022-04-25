import { Address } from '@/entities/Address';
import { Branch } from '@/entities/Branch';
import { InvalidRequestException } from '@/exceptions/InvalidRequestException';
import { NotFoundException } from '@/exceptions/NotFoundException';
import { AddressRepository } from '@/repositories/address/AddressRepository';
import { BranchRepository } from '@/repositories/branch/BranchRepository';
import { ReadOptions } from '@/repositories/ReadOptions';

export class AddressService {

  private readonly addressRepository: AddressRepository;
  private readonly branchRepository: BranchRepository;

  public constructor(
    addressRepository: AddressRepository,
    branchRepository: BranchRepository,
  ) {
    this.addressRepository = addressRepository;
    this.branchRepository = branchRepository;
  }

  public async getAllAddresses(readOptions?: ReadOptions): Promise<Address[]> {
    const addressToRead = new Address();
    return this.addressRepository.read(addressToRead, readOptions);
  }

  public async getAddressByPostalCode(postalCode: string): Promise<Address[]> {
    const addressToRead = new Address().setPostalCode(postalCode);
    return this.addressRepository.read(addressToRead);
  }

  public async addAddress(newAddress: Address): Promise<Address> {
    const addressToAdd = new Address().setPostalCode(newAddress.getPostalCode());
    const existedAddress = await this.addressRepository.read(addressToAdd);

    if (existedAddress.length > 0) {
      throw new InvalidRequestException('Postal code already existed');
    }

    return this.addressRepository.create(newAddress);
  }

  public async editAddress(postalCode: string, newAddress: Address): Promise<Address> {
    const addressToEdit = new Address().setPostalCode(postalCode);
    const [targetAddress] = await this.addressRepository.read(addressToEdit);

    if (!targetAddress) {
      throw new NotFoundException('Target address to edit does not exist');
    }

    const newPostalCode = newAddress.getPostalCode();

    if (newPostalCode) {
      const addressToCreate = new Address().setPostalCode(newPostalCode);
      const existedAddress = await this.addressRepository.read(addressToCreate);

      if (existedAddress.length > 0) {
        throw new InvalidRequestException('New Postal code already existed');
      }

      const relatedBranchesToEdit = new Branch().setPostalCode(postalCode);
      const newBranch = new Branch().setPostalCode(newPostalCode);
      await this.branchRepository.update(newBranch, relatedBranchesToEdit);
    }

    const affectedRowsAmount = await this.addressRepository.update(newAddress, addressToEdit);

    return affectedRowsAmount === 1 ? newAddress.setPrimaryKey(postalCode) : null;
  }

  public async deleteAddress(postalCode: string): Promise<Address> {
    const addressToDelete = new Address().setPostalCode(postalCode);
    const [targetAddress] = await this.addressRepository.read(addressToDelete);

    if (!targetAddress) {
      throw new InvalidRequestException('Target address to delete does not exist');
    }

    const relatedBranchToRead = new Branch().setPostalCode(postalCode);
    const relatedBranch = await this.branchRepository.read(relatedBranchToRead);

    if (relatedBranch.length > 0) {
      throw new InvalidRequestException('Target address to delete has related branch.');
    }

    const affectedRowsAmount = await this.addressRepository.delete(addressToDelete);

    return affectedRowsAmount === 1 ? targetAddress : null;
  }

}
