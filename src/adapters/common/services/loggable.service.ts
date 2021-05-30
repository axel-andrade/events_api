type GConstructor<T = {}> = new (...args: any[]) => T;

export interface Logger {
  error(message: string, err: { err: Error }): void;
}

export default function Loggable<TBase extends GConstructor>(Base: TBase) {
  return class Loggable extends Base {
    private _logger: Logger;

    constructor(...args: any[]) {
      super(...args);
      this._logger = args[0].logger;
    }

    public logError(error: Error) {
      this._logger.error(error.message, { err: error });
    }

    public logErrors(errors: Array<Error>) {
      errors.forEach((error) =>
        this._logger.error(error.message, { err: error })
      );
    }
  };
}
