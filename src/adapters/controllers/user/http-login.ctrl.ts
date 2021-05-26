import { Login } from "@useCases/index";
import { LoginRequestDTO } from "@useCases/user/login";

type HTTPLoginInput = {
  params: any;
  headers?: any;
  body: LoginRequestDTO;
};

export class HTTPLoginController {
  constructor(
    private _input: HTTPLoginInput,
    private _loginInteractor: Login.LoginInteractor
  ) {}

  async run(): Promise<void> {
    const request: Login.LoginRequestDTO = this._input.body;
    await this._loginInteractor.execute(request);
  }
}
