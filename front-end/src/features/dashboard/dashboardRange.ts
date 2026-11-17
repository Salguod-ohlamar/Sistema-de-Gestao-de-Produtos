/** Data local (YYYY-MM-DD) no fuso de São Paulo, como o backend agrupa as vendas. */
export function toIsoDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d)
}

/** Período terminando hoje e começando `days - 1` dias atrás. */
export function lastDaysRange(days: number, now: Date = new Date()): { from: string; to: string } {
  const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  return { from: toIsoDate(start), to: toIsoDate(now) }
}
