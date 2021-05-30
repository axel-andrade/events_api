import { AppContainer } from "@infra/bootstrap/register";
import LoginBs from "@useCases/user/login/login.bs";
import { LoginRequestDTO } from "@useCases/user/login/login.types";

type HTTPLoginInput = {
  params: any;
  headers?: any;
  body: LoginRequestDTO;
};

export default class HTTPLoginController {
  private readonly _interactor: LoginBs;
  constructor(params: AppContainer) {
    this._interactor = params.loginBs;
  }

  async run(input: HTTPLoginInput): Promise<void> {
    const request = input.body;
    await this._interactor.execute(request);
  }
}
