import { AppContainer } from "@infra/bootstrap/types";
import UpdatePasswordBs from "@usecases/user/update-password/update-password.bs";
import { UpdatePasswordRequestDTO } from "@usecases/user/update-password/update-password.types";

type HTTPUpdatePasswordInput = {
  params: any;
  headers?: any;
  body: UpdatePasswordRequestDTO;
};

export default class HTTPUpdatePasswordController {
  private readonly _interactor: UpdatePasswordBs;
  
  constructor(params: AppContainer) {
    this._interactor = params.updatePasswordBs;
  }

  async run(input: HTTPUpdatePasswordInput): Promise<void> {
    const request: UpdatePasswordRequestDTO = input.body;
    await this._interactor.execute(request);
  }
}
