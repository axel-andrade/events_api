import { Gateways } from "@adapters";
import jwt from "jsonwebtoken";

export default class JwtGateway
  implements Gateways.EncrypterGateway, Gateways.DecrypterGateway {
  constructor(private readonly secret: string) {}

  async encrypt(plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this.secret);
  }

  async decrypt(ciphertext: string): Promise<string> {
    return jwt.verify(ciphertext, this.secret) as any;
  }
}
