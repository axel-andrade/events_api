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
import sequelize, { Op } from "sequelize";

import { LoginInteractor } from "@useCases/user/login";
import logger from "@shared/logger";

export type Authorization = {
  organization_id: number;
};
export type GetTransaction = (name: string) => sequelize.Transaction;
export type SetTransaction = (
  name: string,
  transaction: sequelize.Transaction
) => void;

export type AppContainer = {
  env: string;
  fs: typeof fs;
  util: typeof util;
  uuidv4: typeof uuidv4;
  path: typeof path;
  sequelizeOp: typeof Op;
  getTransaction: GetTransaction;
  setTransaction: SetTransaction;

  /* Handlers */

  /* Interactors */
  paymentsReceiverBs: LoginInteractor;

  /* Gateways */

  /* Repositories */
};

export const setupContainer = async (config: any): Promise<AwilixContainer> => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  //   const firehoseLogWriter = getFirehoseWriter(config.log.stream);
  //   const createLoggerInstance = () => getLogger(config.log.level, firehoseLogWriter);

  const env = process.env.NODE_ENV; // || ENV.DEVELOPMENT;

  //   const agent = new Agent({ keepAlive: false });

  container.register({
    logger: asValue(logger),
    env: asValue(env),
    fs: asValue(fs),
    util: asValue(util),
    uuidv4: asValue(uuidv4),
    path: asValue(path),
    sequelizeOp: asValue(Op),
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
        `${baseDir}/use-cases/**/*[.|-]interactor.js`,
        {
          lifetime: Lifetime.SCOPED,
        },
      ],
      [
        `${baseDir}/adapters/**/*[.|-]ptr.js`,
        {
          lifetime: Lifetime.SCOPED,
        },
      ],
      [
        `${baseDir}/adapters/**/*[.|-]ctrl.js`,
        {
          lifetime: Lifetime.SCOPED,
        },
      ],
      [
        `${baseDir}/adapters/**/*[.|-]gateway.js`,
        {
          lifetime: Lifetime.SCOPED,
        },
      ],
      [
        `${baseDir}/infra/plugins/scoped/**/*.js`,
        {
          lifetime: Lifetime.SCOPED,
        },
      ],
      `${baseDir}/infra/plugins/singleton/**/*.js`,
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
        lifetime: Lifetime.SINGLETON,
      },
    }
  );

  //   container.register({
  //     requestQueueHandler: asClass(RequestQueueHandler).singleton(),
  //     jsonValidatorHandler: asClass(JsonValidatorHandler).singleton(),
  //     redisClient: asValue(redis.createClient(config.databases.redis)),
  //     redisSubscriber: asValue(redis.createClient(config.databases.redis)),
  //   });

  //   const jsonValidatorHandler: JsonValidatorHandler = container.resolve(
  //     "jsonValidatorHandler"
  //   );
  //   await jsonValidatorHandler.initialize();

  return container;
};
