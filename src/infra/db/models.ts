import fs from 'fs';
import path from 'path';
import SequelizeLib, { Sequelize } from 'sequelize';
import relations from './relations';
import lodash from 'lodash';
import { UserModel } from './models/main/user';
import { Config } from '@infra/config/config';

type ModelMap = {
  /* events_main */
  user: typeof UserModel
}

export type DB = {
  Sequelize: typeof SequelizeLib
  connections: {
    [k: string]: Sequelize
  }
  models: ModelMap
}

let db: DB = null;

export const loadModels = async (config: Config, logger?: any): Promise<DB> => {
  if (db) {
    throw new Error('DB models already loaded');
  }

  const databases = config.databases;

  const dbObj: any = {
    Sequelize: SequelizeLib,
    connections: {},
    models: {}
  };

  const connPromises = Object.keys(databases)
    .map((key) => {
      if (databases[key].dialect !== 'mysql' || key.endsWith('_mig')) {
        return;
      }

      const defaultDbAttributes = {
        logging: false,
        timezone: '+00:00',
        define: {
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        },
        dialectOptions: {
          timezone: '+00:00'
        },
        retry: {
          max: 3
        },
        isolationLevel: SequelizeLib.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        bindParam: false
      };

      const dbOptions = lodash.merge({}, databases[key], defaultDbAttributes);

      const connection = new Sequelize(
        dbOptions.database,
        dbOptions.username,
        dbOptions.password,
        dbOptions
      );

      const folderPath = `${__dirname}/models/${key}`;

      fs.readdirSync(folderPath)
        .forEach((file) => {
          let stats = fs.lstatSync(path.join(folderPath, file));
          if (!stats.isDirectory() && file.endsWith('.js')) {
            let model = connection.import(path.join(folderPath, file));
            connection.models[model.name].schema(dbOptions.database);

            dbObj.connections[key] = connection;

            let modelName = model.name;
            dbObj.models[modelName] = model;
          }
        });

      return connection.authenticate();
    });

  relations(dbObj);

  await Promise.all(connPromises);

  db = dbObj;

  return dbObj;
};

export const getModels = () => {
  return db;
};

export const unloadModels = async (): Promise<void> => {
  if (!db) {
    throw new Error('DB models are not loaded');
  }

  // @ts-ignore
  await Promise.allSettled(
    Object
      .keys(db.connections)
      .map(async (key) => {
        return db.connections[key].close();
      })
  );

  db = null;
};
