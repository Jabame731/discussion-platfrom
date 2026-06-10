export namespace WellnessPlatformErrors {
  export class DomainError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly statusCode?: number,
    ) {
      super(message);
      this.name = "DomainError";
    }
  }

  export class NetworkError extends DomainError {
    constructor(message = "Network request faile", statusCode?: number) {
      super(message, "NETWORK_ERROR", statusCode);
      this.name = "NetworkError";
    }
  }

  export class NotFoundError extends DomainError {
    constructor(resource = "Resource") {
      super(`${resource} not found`, "NOT_FOUND", 404);
      this.name = "NotFoundError";
    }
  }

  export class UnauthorizedError extends DomainError {
    constructor(message = "Unauthorized") {
      super(message, "UNAUTHORIZED", 401);
      this.name = "UnauthorizedError";
    }
  }

  export class ValidationError extends DomainError {
    constructor(
      message: string,
      public readonly fields: Record<string, string[]> = {},
    ) {
      super(message, "VALIDATION_ERROR", 422);
      this.name = "ValidationError";
    }
  }

  export class ServerError extends DomainError {
    constructor(message = "Internal server error") {
      super(message, "SERVER_ERROR", 500);
      this.name = "ServerError";
    }
  }
}
