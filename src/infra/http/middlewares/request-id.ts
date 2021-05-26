import { Response, NextFunction, Request } from "express";
import { AwilixContainer } from "awilix";
import { createScope } from "@infra/bootstrap/scoped";

export default (container: AwilixContainer) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId: string = <string>req.headers["x-request-id"];
    const scope = createScope(container, res, requestId);

    req.container = scope;

    next();
  };
};
