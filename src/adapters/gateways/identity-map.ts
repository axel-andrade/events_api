import { Entity, UniqueEntityID } from "@entities";

/*
Garante que cada objeto seja carregado apenas uma vez, mantendo todos os objetos 
carregados em um mapa(lista em memória). Procura objetos usando o mapa ao se referir a eles.

Ref: https://martinfowler.com/eaaCatalog/identityMap.html
*/

interface EntityMap {
  [entity: string]: Entity<any>[];
}

export default class IdentityMap {
  private _map: EntityMap;

  constructor() {
    this._map = {};
  }

  /*
   ** carregar entidade da lista de entidades do Identity Map, evitando uma consulta desnecessária ao BD.
   */
  public load(entityName: string, id: UniqueEntityID): Entity<any> {
    if (!this._map[entityName]) return;

    const filtered = this._map[entityName].filter((e: Entity<any>) => {
      return e.id.equals(id);
    });

    return filtered[0];
  }

  /*
   ** adicionando entidade na lista de entidades do Identity Map, quando esta entidade for recuperada através de um Data Mapper.
   */
  public add(entity: Entity<any>) {
    const entityName = entity.constructor.name;

    const registered = this.load(entityName, entity.id);

    if (registered) {
      throw new Error(
        `${entityName} of ID ${entity.id} alread registered in Identity Map`
      );
    }

    if (this._map[entityName]) {
      this._map[entityName].push(entity);
    } else {
      this._map[entityName] = [entity];
    }
  }

  /*
   ** removendo entidade da lista de entidades do Identity Map
   */
  public remove(entity: Entity<any>) {
    const entityName = entity.constructor.name;

    this._map[entityName] = this._map[entityName].filter((e: Entity<any>) => {
      return !e.equals(entity);
    });
  }
}
