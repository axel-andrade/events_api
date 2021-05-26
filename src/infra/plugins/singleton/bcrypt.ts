import { Gateways } from "@adapters";
import bcrypt from "bcrypt";

export default class BcryptGateway implements Gateways.HasherGateway {
  constructor(private readonly salt: number) {}

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest);
  }
}
