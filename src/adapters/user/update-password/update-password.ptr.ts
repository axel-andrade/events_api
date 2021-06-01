import { formatHttpResponseError } from "@shared/functions";
import {
  UpdatePasswordPresenter,
  UpdatePasswordResponseDTO,
} from "@usecases/user/update-password/update-password.types";

type UpdatePasswordHTTPView = {
  statusCode: number;
  message?: string;
  body?: any;
  headers?: JSON;
};

export default class HTTPUpdatePasswordPresenter
  implements UpdatePasswordPresenter
{
  private _view: UpdatePasswordHTTPView;

  get view(): UpdatePasswordHTTPView {
    return this._view;
  }

  public show(response: UpdatePasswordResponseDTO): void {
    if (response.success) {
      this._view = {
        statusCode: 200,
        body: {
          message: "Password updated successfully",
        },
      };
    }

    if (response.failures) {
      const [firstError] = response.failures;
      this._view = formatHttpResponseError(firstError);
    }

    return;
  }
}
