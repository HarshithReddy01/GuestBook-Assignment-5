const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function formatTimestamp(date: Date): string {
  return formatter.format(date)
}
