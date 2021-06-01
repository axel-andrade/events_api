import { AppContainer } from "@infra/bootstrap/types";
import SignUpBs from "@usecases/user/sign-up/sign-up.bs";
import { SignUpRequestDTO } from "@usecases/user/sign-up/sign-up.types";


type HTTPSignUpInput = {
  params: any;
  headers?: any;
  body: SignUpRequestDTO;
};

export default class HTTPSignUpController {
  private _interactor: SignUpBs;

  constructor(params: AppContainer) {
    this._interactor = params.signUpBs;
  }

  async run(input: HTTPSignUpInput): Promise<void> {
    const request: SignUpRequestDTO = input.body;
    await this._interactor.execute(request);
  }
}
