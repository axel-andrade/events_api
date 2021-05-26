import { InternalServerError, NotFoundError } from "@shared/errors";
import { OutputPort, Login } from "@useCases/index";
import { InvalidPasswordError } from "../errors";
import { LoginRequestDTO } from "./login-request.dto";

export class LoginInteractor {
  constructor(
    private _gateway: Login.LoginGateway,
    private _presenter: OutputPort<Login.LoginResponseDTO>
  ) {}

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

          return this._presenter.show({
            success: true,
            data: user,
          });
        }

        return this._presenter.show({
          success: false,
          failures: [new InvalidPasswordError()],
        });
      }

      return this._presenter.show({
        success: false,
        failures: [new NotFoundError("User")],
      });
    } catch (err) {
      return this._presenter.show({
        success: false,
        failures: [new InternalServerError()],
      });
    }
  }
}
