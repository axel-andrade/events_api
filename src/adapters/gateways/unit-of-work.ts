import { Entity } from "@entities";
import Guard from "@shared/guard";
import IdentityMap from "./identity-map";
import { TransactionalDataMappers } from "./mappers";

/*
A ideia deste padrão é manter em memória uma lista de objetos afetados por transações de negócios 
e coordenar a escrita e atualização destes objetos de modo a garantir a resolução de problemas de 
concorrência e reduzir do número de chamadas ao BD.

A ideia é que a classe responsável por implementar o padrão Unit of Work faça o controle da persistência
dos objetos de domínio utilizados na aplicação através de listas que definam o status de cada objeto. As listas são:

Ref: https://martinfowler.com/eaaCatalog/unitOfWork.html
*/

interface IUnitOfWork {
  registerNew(e: Entity<any>): void;
  registerClean(e: Entity<any>): void;
  registerDirty(e: Entity<any>): void;
  registerRemoved(e: Entity<any>): void;
  commit(): Promise<void>;
}

export class UnitOfWork implements IUnitOfWork {
  private _newObjects: Entity<any>[];
  private _dirtyObjects: Entity<any>[];
  private _removedObjects: Entity<any>[];
  private _identityMap: IdentityMap;
  private _dataMappers: TransactionalDataMappers;

  /*
  **newObjets**: Armazena as entidades recém-criadas pela aplicação;
  **dirtyObjects**: Armazena as entidades que de alguma forma tiveram suas propriedades alteradas na aplicação;
  **removedObjects**: Armazena as entidades que foram removidas na aplicação.
  **identityMap**: É também um padrão. Sua função na unidade de trabalho é implementar uma lista que armazena 
    entidades “limpas”, ou seja, que não foram nem removidas e nem persistidas em BD.
  */

  constructor(identityMap: IdentityMap, dataMappers: TransactionalDataMappers) {
    this._newObjects = [];
    this._dirtyObjects = [];
    this._removedObjects = [];
    this._identityMap = identityMap;
    this._dataMappers = dataMappers;
  }

  private _isOneOf(obj: Entity<any>, entities: Entity<any>[]) {
    return (
      entities.filter((e) => {
        return e.equals(obj);
      }).length > 0
    );
  }

  private _remove(obj: Entity<any>, entities: Entity<any>[]): boolean {
    let removed = false;

    entities = entities.filter((e) => {
      if (e.equals(obj)) {
        removed = true;
        return false;
      }
      return true;
    });

    return removed;
  }

  private _isDirty(obj: Entity<any>) {
    return this._isOneOf(obj, this._dirtyObjects);
  }

  private _isNew(obj: Entity<any>): boolean {
    return this._isOneOf(obj, this._newObjects);
  }

  private _isRemoved(obj: Entity<any>) {
    return this._isOneOf(obj, this._removedObjects);
  }

  private _removeNew(obj: Entity<any>): boolean {
    return this._remove(obj, this._newObjects);
  }

  private _removeDirty(obj: Entity<any>): boolean {
    return this._remove(obj, this._dirtyObjects);
  }

  public registerClean(obj: Entity<any>) {
    const className = obj.constructor.name;
    Guard.againstNullOrUndefined(obj.id, `${className} Id`);
    this._identityMap.add(obj);
  }

  /*
   ** adiciona uma determinada entidade, recém-criada, nas listas newObjects e identityMap;
   */
  public registerNew(obj: Entity<any>) {
    Guard.againstNullOrUndefined(obj.id, `${obj.constructor.name} Id`);
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Dirty`,
      !this._isDirty(obj)
    );
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Removed`,
      !this._isRemoved(obj)
    );
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as New`,
      !this._isNew(obj)
    );

    this._newObjects.push(obj);
    this._identityMap.add(obj);
  }

  /*
   ** adiciona uma entidade recém-editada nas listas identityMap e dirtyObjects;
   */
  public registerDirty(obj: Entity<any>) {
    Guard.againstNullOrUndefined(obj.id, `${obj.constructor.name} Id`);
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Removed`,
      !this._isRemoved(obj)
    );

    if (!this._isDirty(obj) && !this._isNew(obj)) {
      this._dirtyObjects.push(obj);
    }
  }

  /*
   ** adiciona uma determinada entidade na lista removedObjects e remove ela de todas as outras listas;
   */
  public registerRemoved(obj: Entity<any>) {
    Guard.againstNullOrUndefined(obj.id, `${obj.constructor.name} Id`);
    this._identityMap.remove(obj);

    if (this._removeNew(obj)) {
      return;
    }

    this._removeDirty(obj);

    if (!this._isRemoved(obj)) {
      this._removedObjects.push(obj);
    }
  }

  private async _insertNew() {
    for (const newObject of this._newObjects) {
      await this._dataMappers
        .getEntityMapper(newObject.constructor.name)
        .insert(newObject);
    }
  }

  private async _updateDirty() {
    for (const dirtyObject of this._dirtyObjects) {
      await this._dataMappers
        .getEntityMapper(dirtyObject.constructor.name)
        .update(dirtyObject);
    }
  }

  private async _deleteRemoved() {
    for (const removedObject of this._removedObjects) {
      await this._dataMappers
        .getEntityMapper(removedObject.constructor.name)
        .delete(removedObject);
    }
  }

  /*
   ** Persisti as entidades registradas nas listas da unidade de trabalho utilizando os datas mappers.
   */
  public async commit() {
    try {
      await this._dataMappers.startTransaction();
      await this._insertNew();
      await this._updateDirty();
      await this._deleteRemoved();
      await this._dataMappers.commitTransaction();
    } catch (err) {
      await this._dataMappers.rollbackTransaction();
      throw err;
    }
  }
}
