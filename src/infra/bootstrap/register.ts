import {
  createContainer,
  asValue,
  asClass,
  asFunction,
  AwilixContainer,
  InjectionMode,
  Lifetime,
} from "awilix";

import fs from "fs";
import path from "path";
import util from "util";
import lodash from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

import logger from "@shared/logger";
import { getModels } from "@infra/db/models";
import { Config } from "@infra/config/config";

export const setupContainer = async (
  config: Config
): Promise<AwilixContainer> => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  const env = process.env.NODE_ENV; // || ENV.DEVELOPMENT;

  container.register({
    config: asValue(config),
    logger: asValue(logger),
    env: asValue(env),
    fs: asValue(fs),
    util: asValue(util),
    uuidv4: asValue(uuidv4),
    path: asValue(path),
    sequelizeOp: asValue(Op),
    db: asFunction(getModels),
    getTransaction: asFunction((params) => {
      return (name: string) => {
        try {
          return params[`${name}Transaction`];
        } catch (e) {
          return null;
        }
      };
    }),
  });

  const baseDir = path.resolve(`${__dirname} + '/../..`);

  container.loadModules(
    [
      [
        `${baseDir}/infra/plugins/singleton/**/*.js`,
        {
          lifetime: Lifetime.SINGLETON,
        },
      ],
      `${baseDir}/use-cases/**/*.bs.js`,
      `${baseDir}/adapters/**/*.ctrl.js`,
      `${baseDir}/adapters/**/*.ptr.js`,
      `${baseDir}/adapters/**/*.gateway.js`,
      `${baseDir}/adapters/**/*.rep.js`,
      `${baseDir}/adapters/**/*.service.js`,
      `${baseDir}/infra/plugins/scoped/**/*.js`,
      `${baseDir}/infra/mappers/*.js`,
    ],
    {
      formatName: (name: string) => {
        const infraLabelRegex = /sequelize|sql/gi;
        let moduleName = name.replace(infraLabelRegex, "");
        moduleName = moduleName.replace(".ctrl", ".controller");
        moduleName = moduleName.replace(".rep", ".repository");
        moduleName = moduleName.replace(".ptr", ".presenter");
        moduleName = moduleName.replace(".", "-");
        moduleName = lodash.camelCase(moduleName);
        return moduleName;
      },
      resolverOptions: {
        register: asClass,
        lifetime: Lifetime.SCOPED,
      },
    }
  );

  return container;
};
