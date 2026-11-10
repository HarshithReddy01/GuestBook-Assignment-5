export abstract class GuestbookError extends Error {}

export class ValidationError extends GuestbookError {
  override name = 'ValidationError'
}

export class AuthenticationError extends GuestbookError {
  override name = 'AuthenticationError'
}

export class DataAccessError extends GuestbookError {
  override name = 'DataAccessError'
}
