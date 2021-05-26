import { User } from "@entities";

export interface LoginGateway {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  findUserAccountByEmail(email: string): Promise<User>;
  compare: (plaitext: string, digest: string) => Promise<boolean>;
  encrypt: (plaintext: string) => Promise<string>;
}
