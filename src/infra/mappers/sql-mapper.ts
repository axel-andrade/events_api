import { Entity } from "@entities";
import { Transaction } from "sequelize/types";
import { DataMapper } from "src/adapters/common/mappers";

export default abstract class SQLMapper implements DataMapper {
  protected _db: any;
  protected _models: any;
  protected _transaction: Transaction | undefined;

  constructor(
    dbName: string,
    modelName: string,
    connections: any,
    transaction?: Transaction
  ) {
    this._db = connections[dbName].models[modelName];
    this._transaction = transaction;
  }

  public abstract toPersistence(entity: Entity<any>): any;
  public abstract toDomain(row: any): Entity<any>;

  protected async _getTransaction(): Promise<any> {
    return this._transaction;
  }

  public async find(criteria: any): Promise<Entity<any>> {
    const t = await this._getTransaction();

    let options: any = {
      where: criteria,
    };

    if (t) {
      options.transaction = t;
    }

    const row = await this._db.findOne(options);
    if (!row) {
      return null;
    }

    return this.toDomain(row);
  }

  public async findAll(conditions: any): Promise<Array<Entity<any>>> {
    const t = await this._getTransaction();

    let options: any = {
      where: conditions,
      raw: true,
    };

    if (t) {
      options.transaction = t;
    }

    const rows = await this._db.findAll(options);

    return rows.map((row: any) => {
      return this.toDomain(row);
    });
  }

  public async updateByCriteria(criteria: any, options: any): Promise<void> {
    const t = await this._getTransaction();

    let _criteria: any = {
      where: criteria,
    };

    if (Object.keys(_criteria.where).length === 0) {
      throw new Error("BlankUpdateCriteriaError");
    }

    if (t) {
      _criteria.transaction = t;
    }

    await this._db.update(options, _criteria);
  }

  public async upsert(entity: Entity<any>): Promise<void> {
    const t = await this._getTransaction();

    return await this._db.upsert(this.toPersistence(entity), {
      transaction: t,
    });
  }

  public async insert(entity: Entity<any>): Promise<void> {
    const t = await this._getTransaction();

    return await this._db.create(this.toPersistence(entity), {
      transaction: t,
    });
  }

  public async update(entity: Entity<any>): Promise<void> {
    const t = await this._getTransaction();

    const options = {
      where: {
        id: entity.id.toValue(),
      },
      transaction: t,
    };

    const data = this.toPersistence(entity);
    return this._db.update(data, options);
  }

  async insertCollection(entities: Array<Entity<any>>): Promise<void> {
    const t = await this._getTransaction();

    const rows = entities.map((e) => {
      return this.toPersistence(e);
    });

    return await this._db.bulkCreate(rows, {
      transaction: t,
    });
  }

  async delete(entity: Entity<any>): Promise<void> {
    const t = await this._getTransaction();

    return await this._db.destroy({
      where: {
        id: entity.id.toValue(),
      },
      transaction: t,
    });
  }

  async deleteByCriteria(criteria: any): Promise<void> {
    const t = await this._getTransaction();

    return await this._db.destroy({
      where: criteria,
      transaction: t,
    });
  }
}
