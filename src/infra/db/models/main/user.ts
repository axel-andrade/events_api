import Sequelize from "sequelize";

export class UserModel extends Sequelize.Model {
  public id!: string;
  public name: string;
  public role: string;
  public access_token: string;
  public password: string;
  public phone: string;
  public email: string;
  public birthdate: string;
  public date: Date;
  public created_at: Date;
  public updated_at: Date;
}

export default (sequelize: Sequelize.Sequelize) => {
  return UserModel.init(
    {
      id: {
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("admin", "user"),
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
    {
      sequelize,
      tableName: "user",
      modelName: "user",
    }
  );
};
