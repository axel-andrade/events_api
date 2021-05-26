export default class Guard {
  /*
   ** Evita argumentos nulos ou indefinidos
   */
  public static againstNullOrUndefined(argument: any, argumentName: string) {
    if (argument === null || argument === undefined) {
      throw `${argumentName} is null or undefined`;
    }
  }

  /*
   ** Evita argumentos que não estejam dentro da lista de coleções
   */
  public static isNotOneOf(
    argument: any,
    collection: any[],
    argumentName: string,
    collectionName: string
  ) {
    if (collection.includes(argument)) {
      throw `${argumentName} is one of ${collectionName}`;
    }
  }

  /*
  ** Evita condições falsas
  */
  public static isTrue(error: string | Error, condition: any) {
    if (!condition) {
      throw error;
    }
  }
}
