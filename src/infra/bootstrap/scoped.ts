import { AwilixContainer, asValue } from "awilix";
import { Response } from "express";
import { Transaction } from "sequelize/types";

export const createScope = (
  container: AwilixContainer,
  res: Response,
  requestId?: string
) => {
  const scope = container.createScope();
  scope.register({
    setTransaction: asValue((name: string, transaction: Transaction) => {
      let regs = {
        [`${name}Transaction`]: asValue(transaction),
      };

      scope.register(regs);
    }),
    requestId: asValue(requestId),
  });

  return scope;
};
