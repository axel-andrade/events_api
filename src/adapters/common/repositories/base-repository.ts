import { Entity, UniqueEntityID } from "@entities";
import IdentityMap from "../identity-map";
import { TransactionalDataMappers } from "../mappers";
import { UnitOfWork } from "../unit-of-work";

export interface IRepository {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  startBatchTransaction(): Promise<void>;
  commitBatchTransaction(): Promise<void>;
  rollbackBatchTransaction(): Promise<void>;
  abstractFindAll(entityName: string, criteria: any): Promise<Entity<any>[]>;
  abstractFind(entityName: string, criteria: any): Promise<Entity<any>>;
  abstractFindById(
    entityName: string,
    id: UniqueEntityID
  ): Promise<Entity<any>>;
  abstractUpdateAll(
    entityName: string,
    criteria: any,
    options: any
  ): Promise<void>;
  remove(e: Entity<any>): Promise<void>;
  removeCollection(entities: Entity<any>[]): Promise<void>;
  save(e: Entity<any>): Promise<void>;
  saveCollection(entities: Entity<any>[]): Promise<void>;
  upsert(e: Entity<any>): Promise<void>;
  upsertCollection(entities: Entity<any>[]): Promise<void>;
}

export default class BaseRepository {
  protected uow: UnitOfWork | undefined;
  protected identityMap: IdentityMap;
  private _dataMappers: TransactionalDataMappers;

  constructor(...args: any[]) {
    this.identityMap = new IdentityMap();
    this._dataMappers = args[0].dataMappers;
  }

  private _reloadIdentityMap(
    entityName: string,
    entity: Entity<any>
  ): Entity<any> {
    const loaded = this.identityMap.load(entityName, entity.id);

    if (!loaded) {
      this.identityMap.add(entity);
      return entity;
    }

    return loaded;
  }

  public async abstractFindById(
    entityName: string,
    id: UniqueEntityID
  ): Promise<Entity<any>> {
    let entity = this.identityMap.load(entityName, id);

    if (!entity) {
      entity = await this._dataMappers
        .getEntityMapper(entityName)
        .find({ id: id.toValue() });
    }

    if (!entity) {
      return null;
    }

    this.identityMap.add(entity);
    return entity;
  }

  public async abstractFind(
    entityName: string,
    criteria: any
  ): Promise<Entity<any>> {
    const found = await this._dataMappers
      .getEntityMapper(entityName)
      .find(criteria);

    if (!found) {
      return null;
    }
    
    return this._reloadIdentityMap(entityName, found);
  }

  public async abstractFindAll(
    entityName: string,
    criteria: any
  ): Promise<Entity<any>[]> {
    let entities = await this._dataMappers
      .getEntityMapper(entityName)
      .findAll(criteria);
    for (let i = 0; i < entities.length; i++) {
      entities[i] = this._reloadIdentityMap(entityName, entities[i]);
    }

    return entities;
  }

  public async abstractUpdateAll(
    entityName: string,
    criteria: any,
    options: any
  ): Promise<void> {
    await this._dataMappers
      .getEntityMapper(entityName)
      .updateByCriteria(criteria, options);
  }

  public async save(e: Entity<any>) {
    if (!this.uow) {
      throw new Error("There is no started transaction");
    }

    const entityName = e.constructor.name;
    const registered = this.identityMap.load(entityName, e.id);

    if (registered) {
      this.uow.registerDirty(e);
    } else {
      this.uow.registerNew(e);
    }
  }

  public async saveCollection(entities: Entity<any>[]) {
    for (const e of entities) {
      this.save(e);
    }
  }

  public async upsert(e: Entity<any>) {
    if (!this.uow) {
      throw new Error("There is no started transaction");
    }

    const entityName = e.constructor.name;
    const registered = this.identityMap.load(entityName, e.id);

    if (registered) {
      throw new Error("Error registered!");
    }

    this.uow.registerUpsert(e);
  }

  public async upsertCollection(entities: Entity<any>[]) {
    for (const e of entities) {
      this.upsert(e);
    }
  }

  public async remove(e: Entity<any>) {
    if (!this.uow) {
      throw new Error("There is no started transaction");
    }

    this.uow.registerRemoved(e);
  }

  public async removeCollection(entities: Entity<any>[]) {
    for (const e of entities) {
      this.remove(e);
    }
  }

  public startTransaction() {
    this.uow = new UnitOfWork(this.identityMap, this._dataMappers);
  }

  public async endTransaction() {
    if (!this.uow) {
      throw new Error("There is no started transaction");
    }

    await this.uow.commit();
    this.uow = undefined;
  }

  public async startBatchTransaction() {
    await this._dataMappers.startTransaction();
  }

  public async commitBatchTransaction() {
    await this._dataMappers.commitTransaction();
  }

  public async rollbackBatchTransaction() {
    await this._dataMappers.rollbackTransaction();
  }
}

type GConstructor<T = {}> = new (...args: any[]) => T;
export type Repository = GConstructor<IRepository>;
