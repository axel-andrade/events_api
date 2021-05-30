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
import sequelize, { Op, Transaction } from "sequelize";

import logger from "@shared/logger";
import { DB, getModels } from "@infra/db/models";
import { SignupBs } from "@useCases/user/signup";
import GetUserByAccessTokenBs from "@useCases/user/get-user-by-access-token/get-user-by-access-token.bs";
import UpdatePasswordBs from "@useCases/user/update-password/update-password.bs";
import {
  UpdatePasswordGateway,
  UpdatePasswordPresenter,
} from "@useCases/user/update-password/update-password.types";
import { GetUserByAccessTokenGateway } from "@useCases/user/get-user-by-access-token/get-user-by-acess-token.types";
import { DataMapper } from "src/adapters/common/mappers";
import { Config } from "@infra/config/config";
import LoginBs from "@useCases/user/login/login.bs";
import { LoginGateway, LoginPresenter } from "@useCases/user/login/login.types";

export type Authorization = {
  organization_id: number;
};

export type GetTransaction = (name: string) => sequelize.Transaction;
export type SetTransaction = (
  name: string,
  transaction: sequelize.Transaction
) => void;

export interface EntityDataMappers {
  [entity: string]: DataMapper;
}

export type AppContainer = {
  config: Config;
  env: string;
  fs: typeof fs;
  util: typeof util;
  uuidv4: typeof uuidv4;
  path: typeof path;
  sequelizeOp: typeof Op;
  db: DB;
  getTransaction: GetTransaction;
  setTransaction: SetTransaction;
  transaction: Transaction;
  mappers: EntityDataMappers;

  /* Interactors */
  loginBs: LoginBs;
  signupBs: SignupBs;
  getUserByAccessTokenInteractor: GetUserByAccessTokenBs;
  updatePasswordBs: UpdatePasswordBs;

  /* Gateways */
  loginGateway: LoginGateway
  updatePasswordGateway: UpdatePasswordGateway;
  getUserByAccessTokenGateway: GetUserByAccessTokenGateway;

  /* Presentes */
  loginPresenter: LoginPresenter;
  updatePasswordPresenter: UpdatePasswordPresenter;

};

export const setupContainer = async (config: Config): Promise<AwilixContainer> => {
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
