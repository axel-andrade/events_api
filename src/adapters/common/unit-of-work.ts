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

interface IEntityMap {
  [entity: string]: Entity<any>[];
}

interface IUnitOfWork {
  registerNew(e: Entity<any>): void;
  registerClean(e: Entity<any>): void;
  registerDirty(e: Entity<any>): void;
  registerRemoved(e: Entity<any>): void;
  registerUpsert(e: Entity<any>): void;
  commit(): Promise<void>;
}

export class UnitOfWork implements IUnitOfWork {
  private _newObjects: Entity<any>[];
  private _dirtyObjects: Entity<any>[];
  private _removedObjects: Entity<any>[];
  private _upsertObjects: Entity<any>[];

  private _identityMap: IdentityMap;
  private _dataMappers: TransactionalDataMappers;

  constructor(identityMap: IdentityMap, dataMappers: TransactionalDataMappers) {
    this._newObjects = [];
    this._dirtyObjects = [];
    this._removedObjects = [];
    this._upsertObjects = [];

    this._identityMap = identityMap;
    this._dataMappers = dataMappers;
  }

  /*
  **newObjets**: Armazena as entidades recém-criadas pela aplicação;
  **dirtyObjects**: Armazena as entidades que de alguma forma tiveram suas propriedades alteradas na aplicação;
  **removedObjects**: Armazena as entidades que foram removidas na aplicação.
  **identityMap**: É também um padrão. Sua função na unidade de trabalho é implementar uma lista que armazena 
    entidades “limpas”, ou seja, que não foram nem removidas e nem persistidas em BD.
  */
  private _isOneOf(obj: Entity<any>, entities: Entity<any>[]): boolean {
    return entities.find((e) => e.equals(obj)) ? true : false;
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
    entities;

    return removed;
  }

  private _isDirty(obj: Entity<any>): boolean {
    return this._isOneOf(obj, this._dirtyObjects);
  }

  private _isNew(obj: Entity<any>): boolean {
    return this._isOneOf(obj, this._newObjects);
  }

  private _isRemoved(obj: Entity<any>): boolean {
    return this._isOneOf(obj, this._removedObjects);
  }

  private _isUpsert(obj: Entity<any>): boolean {
    return this._isOneOf(obj, this._upsertObjects);
  }

  private _removeNew(obj: Entity<any>): boolean {
    return this._remove(obj, this._newObjects);
  }

  private _removeDirty(obj: Entity<any>): boolean {
    return this._remove(obj, this._dirtyObjects);
  }

  public registerClean(obj: Entity<any>): void {
    const className = obj.constructor.name;
    Guard.againstNullOrUndefined(obj.id, `${className} Id`);
    this._identityMap.add(obj);
  }

  /*
   ** adiciona uma determinada entidade, recém-criada, nas listas newObjects e identityMap;
   */
  public registerNew(obj: Entity<any>): void {
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
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Upsert`,
      !this._isUpsert(obj)
    );

    this._newObjects.push(obj);
    this._identityMap.add(obj);
  }

  /*
   ** adiciona uma entidade recém-editada nas listas identityMap e dirtyObjects;
   */
  public registerDirty(obj: Entity<any>): void {
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
  public registerRemoved(obj: Entity<any>): void {
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

  public registerUpsert(obj: Entity<any>): void {
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
    Guard.isTrue(
      `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Upsert`,
      !this._isUpsert(obj)
    );

    this._upsertObjects.push(obj);
    this._identityMap.add(obj);
  }

  private _groupByEntityName(entities: Entity<any>[]) {
    const entityMap: IEntityMap = {};
    for (const entityObject of entities) {
      let className = entityObject.constructor.name;
      if (className.endsWith("View")) {
        className = "View";
      }

      if (entityMap[className]) {
        entityMap[className].push(entityObject);
      } else {
        entityMap[className] = [entityObject];
      }
    }

    return entityMap;
  }

  private async _insertNew(): Promise<void> {
    const entityMap = this._groupByEntityName(this._newObjects);
    for (const className of Object.keys(entityMap)) {
      await this._dataMappers
        .getEntityMapper(className)
        .insertCollection(entityMap[className]);
    }
  }

  private async _updateDirty(): Promise<void> {
    for (const dirtyObject of this._dirtyObjects) {
      await this._dataMappers
        .getEntityMapper(dirtyObject.constructor.name)
        .update(dirtyObject);
    }
  }

  private async _deleteRemoved(): Promise<void> {
    const entityMap = this._groupByEntityName(this._removedObjects);
    for (const className of Object.keys(entityMap)) {
      await this._dataMappers.getEntityMapper(className).deleteByCriteria({
        id: entityMap[className].map((e) => e.id.toValue()),
      });
    }
  }

  private async _upsertNew() {
    for (const upsertObject of this._upsertObjects) {
      await this._dataMappers
        .getEntityMapper(upsertObject.constructor.name)
        .upsert(upsertObject);
    }
  }

  /*
   ** Persisti as entidades registradas nas listas da unidade de trabalho
   ** utilizando os datas mappers.
   */
  public async commit() {
    try {
      await this._dataMappers.startTransaction();
      await this._insertNew();
      await this._updateDirty();
      await this._deleteRemoved();
      await this._upsertNew();
      await this._dataMappers.commitTransaction();
    } catch (err) {
      await this._dataMappers.rollbackTransaction();
      throw err;
    }
  }
}
