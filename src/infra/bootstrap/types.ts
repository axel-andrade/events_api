import { Config } from "@infra/config/config";
import fs from "fs";
import path from "path";
import util from "util";
import lodash from "lodash";
import { v4 as uuidv4 } from "uuid";
import sequelize, { Op, Transaction } from "sequelize";
import { DataMapper } from "src/adapters/common/mappers";
import { DB } from "@infra/db/models";

import LoginBs from "@usecases/user/login/login.bs";
import SignUpBs from "@usecases/user/sign-up/sign-up.bs";
import GetUserByAccessTokenBs from "@usecases/user/get-user-by-access-token/get-user-by-access-token.bs";
import UpdatePasswordBs from "@usecases/user/update-password/update-password.bs";

import { LoginGateway, LoginPresenter } from "@usecases/user/login/login.types";
import { SignUpGateway, SignUpPresenter } from "@usecases/user/sign-up/sign-up.types";
import { UpdatePasswordGateway, UpdatePasswordPresenter } from "@usecases/user/update-password/update-password.types";
import { GetUserByAccessTokenGateway } from "@usecases/user/get-user-by-access-token/get-user-by-acess-token.types";


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
  signUpBs: SignUpBs;
  getUserByAccessTokenInteractor: GetUserByAccessTokenBs;
  updatePasswordBs: UpdatePasswordBs;

  /* Gateways */
  loginGateway: LoginGateway;
  signUpGateway: SignUpGateway;
  updatePasswordGateway: UpdatePasswordGateway;
  getUserByAccessTokenGateway: GetUserByAccessTokenGateway;

  /* Presentes */
  loginPresenter: LoginPresenter;
  signUpPresenter: SignUpPresenter;
  updatePasswordPresenter: UpdatePasswordPresenter;
};
