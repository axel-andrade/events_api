import { User } from "@entities";
import { formatHttpResponseError } from "@shared/functions";
import {
  SignUpPresenter,
  SignUpResponseDTO,
} from "@usecases/user/sign-up/sign-up.types";

type SignUpHTTPView = {
  statusCode: number;
  message?: string;
  body?: any;
  headers?: JSON;
};

export class HTTPSignUpPresenter implements SignUpPresenter {
  private _view: SignUpHTTPView;

  get view(): SignUpHTTPView {
    return this._view;
  }

  private buildSuccessView(data: User) {
    this._view = {
      statusCode: 200,
      body: {
        data: {
          id: data.id.toValue(),
        },
      },
    };
  }

  public show(response: SignUpResponseDTO): void {
    if (response.success) {
      this.buildSuccessView(response.data);
    }

    if (response.failures) {
      const [firstError] = response.failures;
      this._view = formatHttpResponseError(firstError);
    }

    return;
  }
}
