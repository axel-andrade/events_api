export interface HTTPResponseError {
  statusCode: number;
  body: {
    error: string;
  };
}
