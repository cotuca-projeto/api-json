export class DangerError extends Error {
    constructor(message: string | undefined) {
      super(message);
      this.name = "DangerError";
    }
  }
  