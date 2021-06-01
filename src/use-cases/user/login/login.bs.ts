import { ERROR_MESSAGES } from "@constants/error";
import { AppContainer } from "@infra/bootstrap/types";
import { InternalServerError, NotFoundError, ApplicationError} from "@shared/errors";
import { LoginGateway, LoginPresenter, LoginRequestDTO } from "./login.types";

export default class LoginBs {
  private _gateway: LoginGateway;
  private _presenter: LoginPresenter;

  constructor(params: AppContainer) {
    this._gateway = params.loginGateway;
    this._presenter = params.loginPresenter;
  }

  public async execute(data: LoginRequestDTO): Promise<void> {
    /* Validate email here */

    const user = await this._gateway.findUserAccountByEmail(data.email);

    try {
      if (user) {
        const isValid = await this._gateway.compare(
          data.password,
          user.password
        );

        if (isValid) {
          const accessToken = await this._gateway.encrypt(user.id.toString());

          user.accessToken = accessToken;

          await this._gateway.startTransaction();
          await this._gateway.save(user);
          await this._gateway.endTransaction();

          return this._presenter.show({ success: true, data: user });
        }

        return this._presenter.show({
          success: false,
          failures: [new ApplicationError(ERROR_MESSAGES.INVALID_PASSWORD)],
        });
      }

      return this._presenter.show({
        success: false,
        failures: [new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND)],
      });
    } catch (err) {
      return this._presenter.show({
        success: false,
        failures: [new InternalServerError()],
      });
    }
  }
}
