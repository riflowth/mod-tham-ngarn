export class ClassUtils {
  
  public static concat(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

}
