import * as Adapters from "@adapters";
import { Signup } from "@useCases/index";
import { Request, Response } from "express";
import SequelizeDataMappers from "@infra/plugins/singleton/sequelize-data-mappers";
import BcryptGateway from "@infra/plugins/singleton/bcrypt";

const models = require("./../../../db/models");

export default async function SignupAction(
  req: Request,
  res: Response
) {
  const salt = 12;

  const signupGateway = new Adapters.Gateways.SignupGateway(
    {
      hasherGateway: new BcryptGateway(salt),
      dataMappers: new SequelizeDataMappers(models),
    }
  );

  const signupPresenter = new Adapters.Presenters.HTTPSignupPresenter();

  const signupInteractor = new Signup.SignupInteractor(
    signupGateway,
    signupPresenter
  );

  const signupController = new Adapters.Controllers.HTTPSignupController(
    req,
    signupInteractor
  );

  await signupController.run();

  const view = signupPresenter.view;

  if (view.message) {
    return res.status(view.statusCode).end(view.message);
  }

  res.status(view.statusCode).json(view.body);
}
