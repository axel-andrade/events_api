import { InternalServerError } from "@shared/errors";
import logger from "@shared/logger";
import { NextFunction, Request, Response } from "express";

export function createAction(rule: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { container } = req;
    const controller: any = container.resolve(`${rule}Controller`);
    try {
      await controller.run(req, res, next);
      const presenter: any = container.resolve(`${rule}Presenter`);
      const view = presenter.view;
      if (view.message) {
        return res.status(view.statusCode).end(view.message);
      }
      return res.status(view.statusCode).json(view.body);
    } catch (err) {
      logger.error(err.message, { err });
      return res.status(500).json({
        error: new InternalServerError().message,
      });
    }
  };
}
