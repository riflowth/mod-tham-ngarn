export class Machine {

  private readonly machineId: number;
  private zoneId: number;
  private name: string;
  private serial: string;
  private manufacturer: string;
  private registrationDate: Date;
  private retiredDate: Date;

  public constructor(machineId: number) {
    this.machineId = machineId;
  }

  public getMachineId(): number {
    return this.machineId;
  }

  public getZoneId(): number {
    return this.zoneId;
  }

  public getName(): string {
    return this.name;
  }

  public getSerial(): string {
    return this.serial;
  }

  public getManufacturer(): string {
    return this.manufacturer;
  }

  public getRegistrationDate(): Date {
    return this.registrationDate;
  }

  public getRetiredDate(): Date {
    return this.retiredDate;
  }

  public setZoneId(zoneId: number): Machine {
    this.zoneId = zoneId;
    return this;
  }

  public setName(name: string): Machine {
    this.name = name;
    return this;
  }

  public setSerial(serial: string): Machine {
    this.serial = serial;
    return this;
  }

  public setManufacturer(manufacturer: string): Machine {
    this.manufacturer = manufacturer;
    return this;
  }

  public setRegistrationDate(registrationDate: Date): Machine {
    this.registrationDate = registrationDate;
    return this;
  }

  public setRetiredDate(retiredDate: Date): Machine {
    this.retiredDate = retiredDate;
    return this;
  }

}
