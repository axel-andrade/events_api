export class TooShortError extends Error {
  constructor(field: string, length: number) {
    super(`The "${field}" must have a minimum length of ${length} characters.`);
    this.name = "TooShortError";
  }
}
