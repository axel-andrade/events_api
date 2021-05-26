export class UserAlreadyExistsError extends Error {
  constructor(field: string) {
    super(`There is already a registered user with this field ${field}.`);
    this.name = "UserAlreadyExistsError";
  }
}
