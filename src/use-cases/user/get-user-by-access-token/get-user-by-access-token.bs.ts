import { User } from "@entities";
import { AppContainer } from "@infra/bootstrap/types";
import {
  GetUserByAccessTokenGateway,
  GetUserByAccessTokenRequestDTO,
} from "./get-user-by-acess-token.types";

export default class GetUserByAccessTokenBs {
  private readonly _gateway: GetUserByAccessTokenGateway;
  
  constructor(params: AppContainer) {
    this._gateway = params.getUserByAccessTokenGateway;
  }

  public async execute(data: GetUserByAccessTokenRequestDTO): Promise<User> {
    try {
      const accessToken = await this._gateway.decrypt(data.accessToken);
      if (accessToken) {
        const user = await this._gateway.findUserByIdAndRole(
          accessToken,
          data.role
        );
        if (user) {
          return user;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
