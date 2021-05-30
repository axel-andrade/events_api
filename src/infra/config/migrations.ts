import { getConfig } from './config';

const getDatabases = async () => {
  let config = await getConfig();

  const defaultDbAttributes = {
    timezone: '+00:00',
    define: {
      underscored: true
    },
    dialect: 'mysql',
    dialectOptions: {
      timezone: '+00:00',
      maxPreparedStatements: 0
    },
    migrationStorageTableName: 'sequelize_meta',
  };

  Object.keys(config.databases)
    .forEach((key) => {
      Object.assign(config.databases[key], defaultDbAttributes);
    });

  return config.databases;
};

module.exports = getDatabases();
