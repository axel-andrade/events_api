import * as Adapters from "@adapters";
import { Login } from "@useCases/index";
import { Request, Response } from "express";
import SequelizeDataMappers from "@infra/plugins/singleton/sequelize-data-mappers";
import BcryptGateway from "@infra/plugins/singleton/bcrypt";
import JwtGateway from "@infra/plugins/singleton/jwt";

const models = require("./../../../db/models");

export default async function loginAction(
  req: Request,
  res: Response
) { 
  
  const salt = 12;
  const secret = 'mysecretkey';

  const loginGateway = new Adapters.Gateways.LoginGateway(
    {
      hasherGateway: new BcryptGateway(salt),
      encrypterGateway: new JwtGateway(secret),
      dataMappers: new SequelizeDataMappers(models),
    }
  );

  const loginPresenter = new Adapters.Presenters.HTTPLoginPresenter();

  const loginInteractor = new Login.LoginInteractor(
    loginGateway,
    loginPresenter
  );

  const loginController = new Adapters.Controllers.HTTPLoginController(
    req,
    loginInteractor
  );

  await loginController.run();

  const view = loginPresenter.view;

  if (view.message) {
    return res.status(view.statusCode).end(view.message);
  }

  res.status(view.statusCode).json(view.body);
}
