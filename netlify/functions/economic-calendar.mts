const buildCalendarUrl = (country: string, impact?: string) => {
  const apiKey = Netlify.env.get('TRADING_ECONOMICS_KEY')
  const apiUser = Netlify.env.get('TRADING_ECONOMICS_USER')
  const credential = apiUser && apiKey ? `${apiUser}:${apiKey}` : apiKey

  if (!credential) {
    throw new Error('Missing Trading Economics API credentials.')
  }

  const endpoint = new URL(`https://api.tradingeconomics.com/calendar/country/${encodeURIComponent(country)}`)
  endpoint.searchParams.set('c', credential)
  endpoint.searchParams.set('f', 'json')
  if (impact) endpoint.searchParams.set('importance', impact)

  return endpoint
}

export default async (req: Request) => {
  try {
    const url = new URL(req.url)
    const country = url.searchParams.get('country') || 'united states'
    const impact = url.searchParams.get('impact') || undefined

    const endpoint = buildCalendarUrl(country, impact)
    const response = await fetch(endpoint.toString())

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch calendar.' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = (await response.json()) as unknown[]
    return new Response(JSON.stringify({ events: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Calendar service unavailable.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
