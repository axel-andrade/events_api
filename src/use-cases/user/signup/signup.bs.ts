import { User, UserRoleEnum } from "@entities";
import { InternalServerError } from "@shared/errors";
import { OutputPort, Signup } from "@useCases/index";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { SignupRequestDTO } from "./signup-request.dto";

export class SignupBs {
  constructor(
    private _gateway: Signup.SignupGateway,
    private _presenter: OutputPort<Signup.SignupResponseDTO>
  ) {}

  public async execute(data: SignupRequestDTO) {
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
      userEntity.errors.push(new UserAlreadyExistsError("email"));
      return this._presenter.show({
        success: false,
        failures: userEntity.errors,
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
