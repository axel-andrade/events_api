type GConstructor<T = {}> = new (...args: any[]) => T;

export interface ValidatorServiceAdapter {
  password(password: string): Promise<boolean>;
}

export default function MixValidatorService<TBase extends GConstructor>(
  Base: TBase
) {
  return class ValidatorService extends Base implements ValidatorServiceAdapter {
    private _lib: ValidatorServiceAdapter;

    constructor(...args: any[]) {
      super(...args);
      this._lib = args[0].validatorImpl;
    }

    public async password(password: string): Promise<boolean> {
      return this._lib.password(password);
    }
  };
}
