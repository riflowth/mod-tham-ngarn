export class ObjectUtils {

  public static removeProperty<T>(object: T, keyToRemove: string): T {
    const newObject = { ...object };
    delete newObject[keyToRemove];

    return newObject;
  }

}
