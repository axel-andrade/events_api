import { Signup } from "@useCases/index";
import { SignupRequestDTO } from "@useCases/user/signup";

type HTTPSignupInput = {
  params: any;
  headers?: any;
  body: SignupRequestDTO;
};

export class HTTPSignupController {
  constructor(
    private _input: HTTPSignupInput,
    private _signupInteractor: Signup.SignupInteractor
  ) {}

  async run(): Promise<void> {
    const request: Signup.SignupRequestDTO = this._input.body;
    await this._signupInteractor.execute(request);
  }
}
