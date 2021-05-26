import { User } from "@entities";
import {
  GetUserByAccessTokenGateway,
  GetUserByAccessTokenParams,
  GetUserByAccessTokenRequestDTO,
} from "./get-user-by-acess-token.types";

export default class GetUserByAccessTokenInteractor {
  private readonly _gateway: GetUserByAccessTokenGateway;
  
  constructor(params: GetUserByAccessTokenParams) {
    this._gateway = params.getUserByAccessTokenGateway;
  }

  public async execute(data: GetUserByAccessTokenRequestDTO): Promise<User> {
    try {
      const accessToken: string = await this._gateway.decrypt(data.accessToken);
      if (accessToken) {
        const user = await this._gateway.findUserAccountByAccessToken(
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
