import UpdatePasswordInteractor from "@useCases/user/update-password/update-password.interactor";
import { UpdatePasswordRequestDTO } from "@useCases/user/update-password/update-password.types";

type HTTPUpdatePasswordInput = {
  params: any;
  headers?: any;
  body: UpdatePasswordRequestDTO;
};

export default class HTTPUpdatePasswordController {
  private readonly _interactor: UpdatePasswordInteractor;
  constructor(params: any) {
    this._interactor = params.updatePasswordInteractor;
  }

  async run(input: HTTPUpdatePasswordInput): Promise<void> {
    const request: UpdatePasswordRequestDTO = input.body;
    await this._interactor.execute(request);
  }
}
