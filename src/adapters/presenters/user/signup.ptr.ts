import { InternalServerError } from "@shared/errors";
import { OutputPort, Signup } from "@useCases/index";
import { UserAlreadyExistsError } from "@useCases/user/errors";

type SignupHTTPView = {
  statusCode: number;
  message?: string;
  body?: any;
  headers?: JSON;
};

export class HTTPSignupPresenter
  implements OutputPort<Signup.SignupResponseDTO> {
  private _view: SignupHTTPView;

  get view(): SignupHTTPView {
    return this._view;
  }

  private getStatusCode(error: Error): number {
    let statusCode = 400;

    if (error instanceof UserAlreadyExistsError) {
      statusCode = 409;
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
        },
      },
    };
  }

  public show(response: Signup.SignupResponseDTO) {
    if (response.success) {
      this.buildSuccessView(response.data);
    }

    if (response.failures) {
      this.buildErrorView(response.failures);
    }

    return;
  }
}
