const newsQueries: Record<string, string> = {
  gold: 'gold OR XAU OR gold market',
  crypto: 'bitcoin OR BTC OR crypto market',
  forex: 'forex OR central bank OR interest rates OR macro economy',
}

export default async (req: Request) => {
  const apiKey = Netlify.env.get('NEWSAPI_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing News API key.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  const category = url.searchParams.get('category') || 'gold'
  const query = newsQueries[category] || newsQueries.gold

  const apiUrl = new URL('https://newsapi.org/v2/everything')
  apiUrl.searchParams.set('q', query)
  apiUrl.searchParams.set('language', 'en')
  apiUrl.searchParams.set('sortBy', 'publishedAt')
  apiUrl.searchParams.set('pageSize', '10')

  const response = await fetch(apiUrl.toString(), {
    headers: {
      'X-Api-Key': apiKey,
    },
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch news.' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = (await response.json()) as { articles?: unknown[] }
  return new Response(JSON.stringify({ articles: data.articles || [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
