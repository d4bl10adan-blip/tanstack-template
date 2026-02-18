import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { AdanLayout } from '../components/AdanLayout'

type EconomicEvent = {
  Country?: string
  Currency?: string
  Event?: string
  Date?: string
  Actual?: string
  Forecast?: string
  Previous?: string
  Importance?: number
  Impact?: string
  Category?: string
}

const countryOptions = [
  { label: 'United States', value: 'united states' },
  { label: 'Euro Area', value: 'euro area' },
  { label: 'United Kingdom', value: 'united kingdom' },
  { label: 'Japan', value: 'japan' },
  { label: 'Canada', value: 'canada' },
  { label: 'Australia', value: 'australia' },
  { label: 'Switzerland', value: 'switzerland' },
  { label: 'New Zealand', value: 'new zealand' },
  { label: 'China', value: 'china' },
  { label: 'Brazil', value: 'brazil' },
]

const impactOptions = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: '1' },
  { label: 'Medium', value: '2' },
  { label: 'High', value: '3' },
]

const priorityKeywords = /interest rate|cpi|nfp|gdp|central bank|speech|speeches|payroll/i

const formatImpact = (event: EconomicEvent) => {
  if (event.Impact) return event.Impact
  if (event.Importance === 3) return 'High'
  if (event.Importance === 2) return 'Medium'
  if (event.Importance === 1) return 'Low'
  return 'Low'
}

const impactPillClass = (impact: string) => {
  switch (impact) {
    case 'High':
      return 'bg-[#B0EF02]/20 text-[#B0EF02]'
    case 'Medium':
      return 'bg-white/10 text-[#E6E7E9]'
    default:
      return 'bg-white/5 text-[#E6E7E9]/70'
  }
}

function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState('united states')
  const [impact, setImpact] = useState('all')
  const [currency, setCurrency] = useState('all')

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  useEffect(() => {
    let active = true

    const loadEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = new URL('/.netlify/functions/economic-calendar', window.location.origin)
        url.searchParams.set('country', country)
        if (impact !== 'all') url.searchParams.set('impact', impact)
        const response = await fetch(url.toString())
        if (!response.ok) throw new Error('Failed to load calendar')
        const data = (await response.json()) as { events: EconomicEvent[] }
        if (!active) return
        const sorted = [...(data.events || [])].sort((a, b) => {
          const aTime = a.Date ? new Date(a.Date).getTime() : 0
          const bTime = b.Date ? new Date(b.Date).getTime() : 0
          return aTime - bTime
        })
        setEvents(sorted)
      } catch (err) {
        if (!active) return
        setError('Economic calendar is temporarily unavailable. Please try again later.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEvents()
    return () => {
      active = false
    }
  }, [country, impact])

  const availableCurrencies = useMemo(() => {
    const set = new Set<string>()
    events.forEach((event) => {
      if (event.Currency) set.add(event.Currency)
    })
    return Array.from(set).sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (currency !== 'all' && event.Currency !== currency) return false
      return true
    })
  }, [events, currency])

  return (
    <AdanLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="watermark-logo" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Economic Calendar</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#E6E7E9]">Global Macro Event Monitor</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#E6E7E9]/70">
            Track high-impact economic releases in real time with automatic timezone detection ({timezone}).
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Filters</p>
            <div className="mt-4 space-y-4 text-sm text-[#E6E7E9]/70">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/60">Country</span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-[#E6E7E9]"
                >
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/60">Impact</span>
                <select
                  value={impact}
                  onChange={(event) => setImpact(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-[#E6E7E9]"
                >
                  {impactOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/60">Currency</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-[#E6E7E9]"
                >
                  <option value="all">All</option>
                  {availableCurrencies.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Upcoming Events</p>
                <p className="mt-2 text-sm text-[#E6E7E9]/70">
                  Highlighting CPI, GDP, NFP, interest rate decisions, and central bank speeches.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">{filteredEvents.length} events</p>
            </div>
            {loading && <p className="mt-4 text-sm text-[#E6E7E9]/60">Loading calendar...</p>}
            {error && <p className="mt-4 text-sm text-[#E6E7E9]/60">{error}</p>}
            {!loading && !error && (
              <>
                <div className="mt-6 hidden overflow-hidden rounded-xl border border-white/10 md:block">
                  <table className="w-full text-left text-sm text-[#E6E7E9]/80">
                    <thead className="bg-black/70 text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Event</th>
                        <th className="px-4 py-3">Country</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3">Impact</th>
                        <th className="px-4 py-3">Actual</th>
                        <th className="px-4 py-3">Forecast</th>
                        <th className="px-4 py-3">Previous</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredEvents.map((event) => {
                        const impactLabel = formatImpact(event)
                        const isPriority = priorityKeywords.test(`${event.Event || ''} ${event.Category || ''}`)
                        return (
                          <tr key={`${event.Event}-${event.Date}`} className={isPriority ? 'bg-[#B0EF02]/5' : ''}>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/60">
                              {event.Date
                                ? new Date(event.Date).toLocaleString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: timezone,
                                  })
                                : 'TBA'}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#E6E7E9]">
                              {event.Event}
                              {isPriority && (
                                <span className="ml-2 rounded-full bg-[#B0EF02]/20 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-[#B0EF02]">
                                  Priority
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/70">{event.Country || '-'}</td>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/70">{event.Currency || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${impactPillClass(impactLabel)}`}>
                                {impactLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/70">{event.Actual || '-'}</td>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/70">{event.Forecast || '-'}</td>
                            <td className="px-4 py-3 text-xs text-[#E6E7E9]/70">{event.Previous || '-'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 grid gap-4 md:hidden">
                  {filteredEvents.map((event) => {
                    const impactLabel = formatImpact(event)
                    const isPriority = priorityKeywords.test(`${event.Event || ''} ${event.Category || ''}`)
                    return (
                      <div key={`${event.Event}-${event.Date}`} className="rounded-2xl border border-white/10 bg-black/60 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">
                            {event.Date
                              ? new Date(event.Date).toLocaleString('en-US', {
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZone: timezone,
                                })
                              : 'TBA'}
                          </p>
                          <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${impactPillClass(impactLabel)}`}>
                            {impactLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-base font-semibold text-[#E6E7E9]">{event.Event}</p>
                        {isPriority && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#B0EF02]">Priority Event</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#E6E7E9]/60">
                          <span>{event.Country || '-'}</span>
                          <span>{event.Currency || '-'}</span>
                          <span>Actual: {event.Actual || '-'}</span>
                          <span>Forecast: {event.Forecast || '-'}</span>
                          <span>Previous: {event.Previous || '-'}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </AdanLayout>
  )
}

export const Route = createFileRoute('/economic-calendar')({
  component: EconomicCalendar,
})
