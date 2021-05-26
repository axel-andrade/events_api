import SQLMapper from "./sql-mapper";
import { UniqueEntityID, User } from "@entities";
import { Transaction } from "sequelize";

const dbName = "main";
const modelName = "user";

export default class SqlUserMapper extends SQLMapper {
  constructor(db: any, transaction: Transaction) {
    super(dbName, modelName, db, transaction);
  }

  public toDomain(userRowDTO: any): User {
    const userProps = {
      name: userRowDTO.name,
      phone: userRowDTO.phone,
      email: userRowDTO.email,
      birthdate: userRowDTO.birthdate,
      role: userRowDTO.role,
      password: userRowDTO.password,
    };

    const uniqueId = new UniqueEntityID(userRowDTO.id);
    return User.build(userProps, uniqueId).value;
  }

  public toPersistence(user: User): any {
    return {
      id: user.id.toValue(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      birthdate: user.birthdate,
      role: user.role,
      password: user.password,
      access_token: user.accessToken,
    };
  }

  /*
  @override
  */
  public async find(criteria: any): Promise<User> {
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

  /*
  @override
  */
  public async findAll(conditions: any): Promise<Array<User>> {
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

  /**
   * @override
   */
  public async update(user: User): Promise<void> {
    await super.update(user);
  }
}
