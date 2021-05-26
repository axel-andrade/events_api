type GConstructor<T = {}> = new (...args: any[]) => T;

export interface EncrypterGateway {
  encrypt: (plaintext: string) => Promise<string>;
}

export default function MixEncrypterService<TBase extends GConstructor>(
  Base: TBase
) {
  return class Encrypter extends Base implements EncrypterGateway {
    private _encrypterGateway: EncrypterGateway;

    constructor(...args: any[]) {
      super(...args);
      this._encrypterGateway = args[0].encrypterGateway;
    }

    public async encrypt(plaintext: string): Promise<string> {
      return this._encrypterGateway.encrypt(plaintext);
    }
  };
}
