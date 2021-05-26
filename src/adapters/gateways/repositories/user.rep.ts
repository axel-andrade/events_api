import { User, UniqueEntityID } from "@entities";
import { Repository } from "./base-repository";

export default function MixUserRepository<TBase extends Repository>(
  Base: TBase
) {
  return class UserRepository extends Base {
    public async findUserAccountById(userId: UniqueEntityID): Promise<User> {
      const user = await this.abstractFind("User", userId);
      return user as User;
    }

    public async findUserAccountByEmail(email: string): Promise<User> {
      const [user] = await this.abstractFindAll("User", { email });
      return user as User;
    }

    public async findUserAccountByAccessToken(
      accessToken: string,
      role?: string
    ): Promise<User> {
      const [user] = await this.abstractFindAll("User", { accessToken, role });
      return user as User;
    }
  };
}
