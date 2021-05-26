import { HTTPResponseError } from "src/adapters/common/http-response-error";
import logger from "./logger";

export const pErr = (err: Error) => {
  if (err) {
    logger.error(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export const getErrorStatusCode = (error: Error): number => {
  switch (error.name) {
    case "UnauthorizedError":
      return 401;
    case "ForbiddenError":
      return 403;
    case "NotFoundError":
      return 404;
    case "ConflictError":
      return 409;
    case "ValidationError":
      return 422;
    case "InternalServerError":
      return 500;
    default:
      return 400;
  }
};

export const formatHttpResponseError = (error: Error): HTTPResponseError => {
  return {
    statusCode: getErrorStatusCode(error),
    body: { error: error.message },
  };
};
