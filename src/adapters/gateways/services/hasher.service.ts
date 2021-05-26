type GConstructor<T = {}> = new (...args: any[]) => T;

export interface HasherGateway {
  hash: (plaintext: string) => Promise<string>;
  compare: (plaintext: string, digest: string) => Promise<boolean>;
}

export default function MixHasherService<TBase extends GConstructor>(
  Base: TBase
) {
  return class Hasher extends Base implements HasherGateway {
    private _hasherGateway: HasherGateway;

    constructor(...args: any[]) {
      super(...args);
      this._hasherGateway = args[0].hasherGateway;
    }

    public async hash(plaintext: string): Promise<string> {
      return this._hasherGateway.hash(plaintext);
    }
    public async compare(plaintext: string, digest: string): Promise<boolean> {
      return this._hasherGateway.compare(plaintext, digest);
    }
  };
}
