import { AwilixContainer, asValue } from "awilix";
// import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import logger from "@shared/logger";
import { Response } from "express";

export const createScope = (container: AwilixContainer, res: Response, requestId?: string) => {
  const scope = container.createScope();
  //   let logger: logger = scope.resolve('logger');

  //   logger.addContext({ uuid: requestId || uuidv4() });

  //   scope.register({
  //     setTransaction: asValue((name: string, transaction: Transaction) => {
  //       let regs = {
  //         [`${name}Transaction`]: asValue(transaction)
  //       };

  //       scope.register(regs);
  //     })
  //   });

  scope.register({
    requestId: asValue(requestId)
  });

  return scope;
};
