import { User } from "@entities";

export interface UpdatePasswordGateway {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  findUserAccountByEmail(email: string): Promise<User>;
  compare: (plaitext: string, digest: string) => Promise<boolean>;
  encrypt: (plaintext: string) => Promise<string>;
}

export interface UpdatePasswordRequestDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponseDTO {
  success: boolean;
  data?: User;
  failures?: Error[];
}

export interface UpdatePasswordPresenter {
  show(result: UpdatePasswordResponseDTO): Promise<void>;
}

export interface UpdatePasswordParams {
  updatePasswordGateway: UpdatePasswordGateway;
  updatePasswordPresenter: UpdatePasswordPresenter;
}
