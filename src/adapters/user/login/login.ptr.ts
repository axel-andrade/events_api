import { User } from "@entities";
import { formatHttpResponseError } from "@shared/functions";
import {
  LoginPresenter,
  LoginResponseDTO,
} from "@usecases/user/login/login.types";

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

  private buildSuccessView(data: User) {
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
      const [firstError] = response.failures;
      this._view = formatHttpResponseError(firstError);
    }

    return;
  }
}
