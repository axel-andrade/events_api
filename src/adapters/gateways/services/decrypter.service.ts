type GConstructor<T = {}> = new (...args: any[]) => T;

export interface DecrypterGateway {
  decrypt: (ciphertext: string) => Promise<string>;
}

export default function MixDecrypterService<TBase extends GConstructor>(
  Base: TBase
) {
  return class Decrypter extends Base implements DecrypterGateway {
    private _decrypterGateway: DecrypterGateway;

    constructor(...args: any[]) {
      super(...args);
      this._decrypterGateway = args[0].decrypterGateway;
    }

    public async decrypt(ciphertext: string): Promise<string> {
      return this._decrypterGateway.decrypt(ciphertext);
    }
  };
}
