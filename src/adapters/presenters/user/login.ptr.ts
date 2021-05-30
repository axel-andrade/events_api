import { InternalServerError, NotFoundError } from "@shared/errors";
import { InvalidPasswordError } from "@useCases/user/errors";
import {
  LoginPresenter,
  LoginResponseDTO,
} from "@useCases/user/login/login.types";

type LoginHTTPView = {
  statusCode: number;
  message?: string;
  body?: any;
  headers?: JSON;
};

export default class HTTPLoginPresenter implements LoginPresenter {
  private _view: LoginHTTPView;

  get view(): LoginHTTPView {
    return this._view;
  }

  private getStatusCode(error: Error): number {
    let statusCode = 400;

    if (error instanceof InvalidPasswordError) {
      statusCode = 400;
    } else if (error instanceof NotFoundError) {
      statusCode = 404;
    } else if (error instanceof InternalServerError) {
      statusCode = 500;
    }

    return statusCode;
  }

  private buildErrorView(errors: Error[]) {
    const [firstError] = errors;

    this._view = {
      statusCode: this.getStatusCode(firstError),
      body: { error: firstError.message },
    };
  }

  private buildSuccessView(data: any) {
    this._view = {
      statusCode: 200,
      body: {
        data: {
          id: data.id.toValue(),
          accessToken: data.accessToken,
        },
      },
    };
  }

  public show(response: LoginResponseDTO): void {
    if (response.success) {
      this.buildSuccessView(response.data);
    }

    if (response.failures) {
      this.buildErrorView(response.failures);
    }

    return;
  }
}
