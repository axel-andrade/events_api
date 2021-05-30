type GConstructor<T = {}> = new (...args: any[]) => T;

export interface IHasher {
  hash(plaintext: string): Promise<string>;
  compare(plaintext: string, digest: string): Promise<boolean>;
}

export default function MixHasher<TBase extends GConstructor>(Base: TBase) {
  return class Hasher extends Base {
    private _hasher: IHasher;

    constructor(...args: any[]) {
      super(...args);
      this._hasher = args[0].hasher;
    }

    public async hash(plaintext: string): Promise<string> {
      return this._hasher.hash(plaintext);
    }

    public async compare(plaintext: string, digest: string): Promise<boolean> {
      return this._hasher.compare(plaintext, digest);
    }
  };
}
