export interface ValidatorHandler {
  password(password: string): boolean;
}
