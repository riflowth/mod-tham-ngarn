export class NumberUtils {

  public static isPositiveInteger(number: string | number): boolean {
    return Number.isInteger(number) && Number(number) > 0;
  }

  public static parsePositiveInteger(number: string | number): number | null {
    const parsedNumber = Number(number);
    return NumberUtils.isPositiveInteger(parsedNumber) ? parsedNumber : null;
  }

}
