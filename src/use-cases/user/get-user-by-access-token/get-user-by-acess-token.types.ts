import { User, UserRoleEnum } from "@entities";

export interface GetUserByAccessTokenGateway {
  findUserByIdAndRole(
    accessToken: string,
    role?: string
  ): Promise<User>;
  decrypt: (ciphertext: string) => Promise<string>;
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
