export class BadRequestError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "BadRequestError";
  }
}
