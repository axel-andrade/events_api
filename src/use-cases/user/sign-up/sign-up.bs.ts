import { ERROR_MESSAGES } from "@constants/error";
import { User, UserRoleEnum } from "@entities";
import { AppContainer } from "@infra/bootstrap/types";
import { ConflictError, InternalServerError } from "@shared/errors";
import { SignUpGateway, SignUpPresenter, SignUpRequestDTO } from "./sign-up.types";

export default class SignUpBs {
  private _gateway: SignUpGateway;
  private _presenter: SignUpPresenter;

  constructor(params: AppContainer) {
    this._gateway = params.signUpGateway;
    this._presenter = params.signUpPresenter;
  }

  public async execute(data: SignUpRequestDTO) {
    const userEntity = User.build({ ...data, role: UserRoleEnum.USER });

    if (!userEntity.succeeded) {
      return this._presenter.show({
        success: false,
        failures: userEntity.errors,
      });
    }

    const userExistsByEmail = await this._gateway.findUserAccountByEmail(
      data.email
    );

    if (userExistsByEmail) {
      return this._presenter.show({
        success: false,
        failures: [new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)],
      });
    }

    const user = userEntity.value;
    user.password = await this._gateway.hash(user.password);

    try {
      await this._gateway.startTransaction();
      await this._gateway.save(user);
      await this._gateway.endTransaction();
    } catch (err) {
      return this._presenter.show({
        success: false,
        failures: [new InternalServerError()],
      });
    }

    return this._presenter.show({
      success: true,
      data: user,
    });
  }
}
