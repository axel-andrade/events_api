import fs from "fs";
import readPkgUp from "read-pkg-up";
import { Options } from "sequelize";
import { ENV } from "./../../shared/types";

const env = process.env.NODE_ENV || ENV.DEVELOPMENT;

export type Config = {
  readonly httpServer: {
    readonly port: number;
  };
  readonly timezone: string;
  readonly databases: { [key: string]: Options };
};

const buildParamName = (param: string): string => {
  const appPackage = readPkgUp.sync({ normalize: false }).packageJson;
  return `/${env}/${appPackage.name}/${param}`;
};

const PARAMETER_CONFIG = buildParamName("config");
const PARAMETER_DATABASES = buildParamName("databases");
const PARAMETER_TIMEZONE = `/${env}/common/timezone`;

const getParameters = async (): Promise<{ [key: string]: string }> => {
  return {
    [PARAMETER_CONFIG]: fs.readFileSync(`${__dirname}/config.json`).toString(),
    [PARAMETER_DATABASES]: fs
      .readFileSync(`${__dirname}/databases.json`)
      .toString(),
    [PARAMETER_TIMEZONE]: "America/Fortaleza",
  };
};

export const getConfig = async (): Promise<Config> => {
  const params = await getParameters();

  const config = JSON.parse(params[PARAMETER_CONFIG]);
  const databases = JSON.parse(params[PARAMETER_DATABASES]);

  config.timezone = params[PARAMETER_TIMEZONE];
  config.databases = databases;
  config.env = env;

  return config;
};
