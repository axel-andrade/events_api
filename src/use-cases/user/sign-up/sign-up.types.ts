import { User } from "@entities";

export interface SignUpGateway {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  findUserAccountByEmail(email: string): Promise<User>;
  hash: (plaintext: string) => Promise<string>;
}

export interface SignUpRequestDTO {
  name: string;
  password: string;
  phone: string;
  email: string;
  birthdate: Date;
}

export interface SignUpResponseDTO {
  success: boolean;
  data?: User;
  failures?: Error[];
}

export interface SignUpPresenter {
  show(result: SignUpResponseDTO): void | Promise<void>;
}
