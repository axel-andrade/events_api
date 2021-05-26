import { User } from "@entities";

export interface SignupGateway {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  findUserAccountByEmail(email: string): Promise<User>;
  hash: (plaintext: string) => Promise<string>
}
