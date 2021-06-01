import { AppContainer } from "@infra/bootstrap/types";
import { InternalServerError } from "@shared/errors";
import {
  UpdatePasswordGateway,
  UpdatePasswordPresenter,
  UpdatePasswordRequestDTO,
} from "./update-password.types";

export default class UpdatePasswordBs {
  private readonly _gateway: UpdatePasswordGateway;
  private readonly _presenter: UpdatePasswordPresenter;

  constructor(params: AppContainer) {
    (this._gateway = params.updatePasswordGateway),
      (this._presenter = params.updatePasswordPresenter);
  }

  public async execute(data: UpdatePasswordRequestDTO): Promise<void> {
    /* Validate email here */

    // const user = await this._gateway.findUserAccountByEmail(data.email);

    try {
      //   if (user) {
      //     const isValid = await this._gateway.compare(
      //       data.password,
      //       user.password
      //     );

      //     if (isValid) {
      //       const accessToken = await this._gateway.encrypt(user.id.toString());

      //       user.accessToken = accessToken;

      //       await this._gateway.startTransaction();
      //       await this._gateway.save(user);
      //       await this._gateway.endTransaction();

      //       return this._presenter.show({
      //         success: true,
      //         data: user,
      //       });
      //     }

      //     return this._presenter.show({
      //       success: false,
      //       failures: [new InvalidPasswordError()],
      //     });
      //   }

      return  this._presenter.show({
        success: true,
        data: null,
      });
    } catch (err) {
      return this._presenter.show({
        success: false,
        failures: [new InternalServerError()],
      });
    }
  }
}
