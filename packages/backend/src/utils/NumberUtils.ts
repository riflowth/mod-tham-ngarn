export class NumberUtils {

  public static isPositiveInteger(number: any): boolean {
    return Number.isInteger(number) && Number(number) > 0;
  }

  public static isNonNegativeNumber(number: any): boolean {
    return Math.sign(number) >= 0;
  }

  public static parsePositiveInteger(number: any): number | null {
    const parsedNumber = Number(number);
    return NumberUtils.isPositiveInteger(parsedNumber) ? parsedNumber : null;
  }

  public static parseNonNegativeNumber(number: any): number | null {
    const parsedNumber = Number(number);
    return NumberUtils.isNonNegativeNumber(parsedNumber) ? parsedNumber : null;
  }

}
