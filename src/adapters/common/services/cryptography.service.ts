type GConstructor<T = {}> = new (...args: any[]) => T;

export interface ICryptography {
  decrypt: (ciphertext: string) => Promise<string>;
  encrypt(plaintext: string): Promise<string>;
}

export default function MixCryptography<TBase extends GConstructor>(
  Base: TBase
) {
  return class Cryptography extends Base {
    private _cryptography: ICryptography;

    constructor(...args: any[]) {
      super(...args);
      this._cryptography = args[0].cryptography;
    }

    public async decrypt(ciphertext: string): Promise<string> {
      return this._cryptography.decrypt(ciphertext);
    }

    public async encrypt(plaintext: string): Promise<string> {
      return this._cryptography.encrypt(plaintext);
    }
  };
}
