import bcrypt from "bcrypt";
import { IHasher } from "src/adapters/common/services/hasher.service";

export default class Hasher implements IHasher {
  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, process.env.BCRYPT_SALT);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest);
  }
}
