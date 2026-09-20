/** An API failure that keeps the HTTP status next to the backend's message. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}
