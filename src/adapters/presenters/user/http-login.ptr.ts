import { InternalServerError, NotFoundError } from "@shared/errors";
import { OutputPort, Login } from "@useCases/index";
import { InvalidPasswordError } from "@useCases/user/errors";

type LoginHTTPView = {
  statusCode: number;
  message?: string;
  body?: any;
  headers?: JSON;
};

export class HTTPLoginPresenter implements OutputPort<Login.LoginResponseDTO> {
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

  public show(response: Login.LoginResponseDTO) {
    if (response.success) {
      this.buildSuccessView(response.data);
    }

    if (response.failures) {
      this.buildErrorView(response.failures);
    }

    return;
  }
}
