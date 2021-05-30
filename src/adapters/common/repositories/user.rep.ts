import { User, UniqueEntityID } from "@entities";
import { Repository } from "./base-repository";

export default function MixUserRepository<TBase extends Repository>(
  Base: TBase
) {
  return class UserRepository extends Base {
    public async findUserAccountById(userId: UniqueEntityID): Promise<User> {
      const user = await this.abstractFindById("User", userId);
      return user as User;
    }

    public async findUserAccountByEmail(email: string): Promise<User> {
      const user = await this.abstractFind("User", { email });
      return user as User;
    }

    public async findUserByIdAndRole(id: string, role?: string): Promise<User> {
      const user = await this.abstractFind("User", { id, role });
      return user as User;
    }
  };
}
