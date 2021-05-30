import jwt from "jsonwebtoken";
import { ICryptography } from "src/adapters/common/services/cryptography.service";

interface AccessTokenData {
  id: string;
}

export default class Cryptography implements ICryptography {
  async encrypt(plaintext: string): Promise<string> {
    const options: jwt.SignOptions = {
      expiresIn: process.env.JWT_EXPIRATION_IN_MINUTES,
    };
    return jwt.sign({ id: plaintext }, process.env.JWT_SECRET_KEY, options);
  }

  async decrypt(ciphertext: string): Promise<string> {
    const result: any = await jwt.verify(
      ciphertext,
      process.env.JWT_SECRET_KEY
    );

    return result.id;
  }
}
