import { User, UserRoleEnum } from "@entities";

export interface GetUserByAccessTokenGateway {
  findUserAccountByAccessToken(
    accessToken: string,
    role?: string
  ): Promise<User>;
  decrypt: (ciphertext: string) => Promise<string>;
}

export interface GetUserByAccessTokenParams {
  getUserByAccessTokenGateway: GetUserByAccessTokenGateway;
}

export interface GetUserByAccessTokenRequestDTO {
  accessToken: string;
  role?: UserRoleEnum;
}

export interface GetUserByAccessTokenResponseDTO {
  success: boolean;
  data?: User;
  failures?: string[];
}
