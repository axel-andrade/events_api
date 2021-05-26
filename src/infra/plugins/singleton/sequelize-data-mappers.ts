import { Transaction, Sequelize } from "sequelize";
import {
  DataMapper,
  TransactionalDataMappers,
} from "../../../adapters/gateways/mappers";
import SqlUserMapper from "@infra/mappers/sql-user.mapper";

interface EntityDataMappers {
  [entity: string]: DataMapper;
}

const dbName = "main";

export default class SequelizeDataMappers implements TransactionalDataMappers {
  private _transaction: Transaction;
  private _mappers: EntityDataMappers;
  private _db: any;

  constructor(connections: any) {
    this._db = connections;
    this._transaction = null;
    this._mappers = {};
  }

  private _buildEntityMapper(entity: string) {
    switch (entity) {
      case "User":
        return new SqlUserMapper(this._db, this._transaction);
      default:
        throw new Error(`There is no initialized Mapper for ${entity} entity`);
    }
  }

  public async startTransaction() {
    this._transaction = await this._db[dbName].sequelize.transaction();
  }

  public getEntityMapper(entityName: string): DataMapper {
    if (!this._mappers[entityName]) {
      this._mappers[entityName] = this._buildEntityMapper(entityName);
    }

    return this._mappers[entityName];
  }

  public async commitTransaction() {
    await this._transaction.commit();
    this._transaction = undefined;
  }

  public async rollbackTransaction() {
    if (!this._transaction) {
      return;
    }

    await this._transaction.rollback();
    this._transaction = undefined;
  }
}
