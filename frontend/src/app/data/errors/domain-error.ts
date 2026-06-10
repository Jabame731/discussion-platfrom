import axios from "axios";
import { WellnessPlatformErrors } from "./wellness-platform.errors";

export function toDomainError(
  err: unknown,
): WellnessPlatformErrors.DomainError {
  if (err instanceof WellnessPlatformErrors.DomainError) {
    return err;
  }

  // Axios error
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    switch (status) {
      case 401:
        return new WellnessPlatformErrors.UnauthorizedError(
          data?.message ?? "Unauthorized",
        );

      case 404:
        return new WellnessPlatformErrors.NotFoundError(
          data?.resource ?? "Resource",
        );

      case 422:
        return new WellnessPlatformErrors.ValidationError(
          data?.message ?? "Validation failed",
          data?.errors ?? {},
        );

      case 500:
        return new WellnessPlatformErrors.ServerError(
          data?.message ?? "Internal server error",
        );

      default:
        return new WellnessPlatformErrors.NetworkError(err.message, status);
    }
  }

  return new WellnessPlatformErrors.NetworkError(
    err instanceof Error ? err.message : "An unexpected error occurred",
  );
}
