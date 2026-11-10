const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

export function describeError(error: unknown): string {
  return error instanceof Error && error.message.trim() !== '' ? error.message : FALLBACK_MESSAGE
}
