import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { AdanLayout } from '../components/AdanLayout'

type NewsArticle = {
  title: string
  description: string
  url: string
  urlToImage?: string | null
  publishedAt: string
  source?: { name?: string }
}

const stats = [
  { value: '12+ Years', label: 'Institutional Trading Experience' },
  { value: '3 Core Markets', label: 'Forex, Gold, Bitcoin Focus' },
  { value: '24/5', label: 'Global Market Coverage' },
]

const services = [
  {
    title: 'Macro Strategy & Positioning',
    description:
      'Top-down market structure analysis aligned with global liquidity, central bank cycles, and risk sentiment.',
  },
  {
    title: 'Risk-First Execution',
    description:
      'Disciplined risk management frameworks designed for funded account performance and capital preservation.',
  },
  {
    title: 'Advanced Trading Education',
    description:
      'Professional-grade training focused on repeatable systems, statistical edge, and execution consistency.',
  },
]

const analysisCards = [
  {
    title: 'FX Flow Intelligence',
    detail:
      'Daily directional bias built on institutional order flow, volatility bands, and session structure.',
  },
  {
    title: 'Gold Hedging Models',
    detail:
      'XAU/USD mapped against real yields, risk-on sentiment, and liquidity inflection points.',
  },
  {
    title: 'Crypto Tactical Desk',
    detail:
      'BTC/USD momentum and trend signals powered by multi-timeframe confirmations.',
  },
]

const testimonials = [
  {
    quote:
      'Adan Investments transformed my forex market approach. The analysis is precise and the strategies truly work.',
    name: 'Carlos Silva',
    role: 'Investor since 2022',
  },
  {
    quote:
      'Thanks to Adan’s gold analysis, I increased my trading returns by over 30% last year.',
    name: 'Mariana Costa',
    role: 'Investor since 2023',
  },
  {
    quote:
      'The tools and support from Adan are unmatched. Highly recommended for serious forex traders.',
    name: 'Rafael Mendes',
    role: 'Investor since 2021',
  },
]

type TradingViewWidgetConfig = {
  containerId: string
  symbol: string
  interval?: string
  theme?: 'dark' | 'light'
  autosize?: boolean
  locale?: string
  hide_top_toolbar?: boolean
  hide_legend?: boolean
  withdateranges?: boolean
  allow_symbol_change?: boolean
  save_image?: boolean
  studies?: string[]
  timezone?: string
}

declare global {
  interface Window {
    TradingView?: {
      widget: (config: TradingViewWidgetConfig) => void
    }
    __tvScriptLoading?: Promise<void>
  }
}

const loadTradingViewScript = () => {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.TradingView) return Promise.resolve()
  if (window.__tvScriptLoading) return window.__tvScriptLoading

  window.__tvScriptLoading = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => resolve()
    document.body.appendChild(script)
  })

  return window.__tvScriptLoading
}

const TradingChart = ({
  id,
  symbol,
  title,
  subtitle,
  withTimeframes,
}: {
  id: string
  symbol: string
  title: string
  subtitle: string
  withTimeframes?: boolean
}) => {
  useEffect(() => {
    let isMounted = true
    loadTradingViewScript().then(() => {
      if (!isMounted || !window.TradingView) return
      window.TradingView.widget({
        containerId: id,
        symbol,
        interval: '60',
        timezone: 'Etc/UTC',
        theme: 'dark',
        autosize: true,
        locale: 'en',
        hide_top_toolbar: !withTimeframes,
        hide_legend: true,
        withdateranges: Boolean(withTimeframes),
        allow_symbol_change: false,
        save_image: false,
      })
    })
    return () => {
      isMounted = false
    }
  }, [id, symbol, withTimeframes])

  return (
    <div className="rounded-2xl border border-white/10 bg-black/70 p-5 shadow-[0_0_40px_rgba(176,239,2,0.12)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B0EF02]/80">{subtitle}</p>
        <h3 className="text-xl font-semibold text-[#E6E7E9]">{title}</h3>
      </div>
      <div className="h-[320px] w-full" id={id} />
    </div>
  )
}

const MarketTicker = () => (
  <div className="overflow-hidden border-y border-white/10 bg-black/70">
    <div className="flex w-[200%] animate-[ticker_18s_linear_infinite] items-center gap-10 whitespace-nowrap px-4 py-3 text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/70">
      <div className="flex w-1/2 items-center gap-10">
        <span>Forex Liquidity • Live Macro Feeds</span>
        <span>XAU/USD Institutional Flow</span>
        <span>BTC/USD Real-Time Momentum</span>
        <span>Risk Managed Execution</span>
        <span>Central Bank Watch</span>
        <span>Volatility Controls</span>
      </div>
      <div className="flex w-1/2 items-center gap-10">
        <span>Forex Liquidity • Live Macro Feeds</span>
        <span>XAU/USD Institutional Flow</span>
        <span>BTC/USD Real-Time Momentum</span>
        <span>Risk Managed Execution</span>
        <span>Central Bank Watch</span>
        <span>Volatility Controls</span>
      </div>
    </div>
  </div>
)

function Home() {
  const [activeNews, setActiveNews] = useState<'gold' | 'crypto' | 'forex'>('gold')
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const refreshIntervalMs = 7 * 60 * 1000

  const newsConfig = useMemo(
    () => ({
      gold: {
        label: 'Gold',
        query: 'gold OR XAU OR gold market',
      },
      crypto: {
        label: 'Crypto',
        query: 'bitcoin OR BTC OR crypto market',
      },
      forex: {
        label: 'Forex',
        query: 'forex OR central bank OR interest rates OR macro economy',
      },
    }),
    [],
  )

  useEffect(() => {
    let active = true

    const loadNews = async () => {
      try {
        setNewsLoading(true)
        setNewsError(null)
        const response = await fetch(`/.netlify/functions/news?category=${activeNews}`)
        if (!response.ok) {
          throw new Error('Failed to load news')
        }
        const data = (await response.json()) as { articles: NewsArticle[] }
        if (!active) return
        setNewsItems(data.articles || [])
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      } catch (error) {
        if (!active) return
        setNewsError('News feed temporarily unavailable. Please check back shortly.')
      } finally {
        if (active) setNewsLoading(false)
      }
    }

    loadNews()
    const interval = window.setInterval(loadNews, refreshIntervalMs)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [activeNews, refreshIntervalMs])

  return (
    <AdanLayout>
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-grid" />
        </div>
        <div className="watermark-logo" aria-hidden="true" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[#B0EF02]/80">Premium Trading Desk</p>
            <h1 className="text-4xl font-semibold leading-tight text-[#E6E7E9] sm:text-5xl">
              Institutional-Grade Insights for <span className="text-[#B0EF02]">Forex</span>,{' '}
              <span className="text-[#B0EF02]">Gold</span>, and <span className="text-[#B0EF02]">Bitcoin</span>.
            </h1>
            <p className="max-w-xl text-base text-[#E6E7E9]/70 sm:text-lg">
              Adan Investments delivers disciplined execution, macro intelligence, and risk-first frameworks built for
              consistent performance in the world’s most liquid markets.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#analysis"
                className="rounded-full bg-[#B0EF02] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-[0_0_30px_rgba(176,239,2,0.4)] transition hover:brightness-110"
              >
                View Live Analysis
              </a>
              <a
                href="#services"
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E6E7E9]/80 transition hover:border-[#B0EF02] hover:text-[#B0EF02]"
              >
                Explore Services
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-[#B0EF02]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E6E7E9]/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Founder Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#E6E7E9]">Professional Trader | FOREX</h2>
              <ul className="mt-4 space-y-2 text-sm text-[#E6E7E9]/70">
                <li>Funded Account Specialist</li>
                <li>Consistency-Focused Trading</li>
                <li>Risk Management</li>
                <li>Trading Education</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Live Desk</p>
              <h3 className="mt-2 text-xl font-semibold text-[#E6E7E9]">Market Pulse Snapshot</h3>
              <p className="mt-2 text-sm text-[#E6E7E9]/70">
                Real-time pricing feeds with low-latency charting, optimized for mobile and desktop trading sessions.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E6E7E9]/60">XAU/USD</p>
                  <p className="text-lg font-semibold text-[#B0EF02]">Gold Live Stream</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#E6E7E9]/60">BTC/USD</p>
                  <p className="text-lg font-semibold text-[#B0EF02]">Bitcoin Live Stream</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketTicker />

      <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Institutional Credibility</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#E6E7E9]">Authority, Trust, and Performance Discipline.</h2>
            <p className="mt-4 text-base text-[#E6E7E9]/70">
              Adan Investments combines institutional trading discipline with retail accessibility. The desk specializes
              in macro-driven forex strategies, gold hedging, and tactical crypto positioning, designed for investors
              seeking resilient performance across volatility cycles.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Operating Principles</p>
            <ul className="mt-4 space-y-3 text-sm text-[#E6E7E9]/70">
              <li>Institutional-grade risk controls and capital protection.</li>
              <li>Structured trade plans rooted in data and macro catalysts.</li>
              <li>Transparent communication and client-ready reporting.</li>
              <li>High-performance execution with disciplined accountability.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Services</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#E6E7E9]">Built for Professional Traders.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-2xl border border-white/10 bg-black/60 p-6">
                <h3 className="text-lg font-semibold text-[#E6E7E9]">{service.title}</h3>
                <p className="mt-3 text-sm text-[#E6E7E9]/70">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="analysis" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Real-Time Market Charts</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#E6E7E9]">Live Gold & Bitcoin Intelligence.</h2>
            <p className="mt-3 text-sm text-[#E6E7E9]/70">
              Streaming charts are powered by TradingView real-time data feeds with optimized rendering for fast loading
              and low latency.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <TradingChart
              id="tv-xauusd"
              symbol="OANDA:XAUUSD"
              title="XAU/USD — Gold"
              subtitle="Real-Time Data"
              withTimeframes
            />
            <TradingChart
              id="tv-btcusd"
              symbol="COINBASE:BTCUSD"
              title="BTC/USD — Bitcoin"
              subtitle="Real-Time Data"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {analysisCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-black/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Analysis Desk</p>
              <h3 className="mt-3 text-lg font-semibold text-[#E6E7E9]">{card.title}</h3>
              <p className="mt-3 text-sm text-[#E6E7E9]/70">{card.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="blog" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">News Blog</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#E6E7E9]">Live Market Headlines.</h2>
            <p className="mt-3 text-sm text-[#E6E7E9]/70">
              Curated financial news streams by asset class with automatic refresh every 7 minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(newsConfig) as Array<[keyof typeof newsConfig, { label: string }]>).map(([id, item]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveNews(id)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  activeNews === id
                    ? 'bg-[#B0EF02] text-black'
                    : 'border border-white/20 text-[#E6E7E9]/70 hover:border-[#B0EF02] hover:text-[#B0EF02]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">
              <span>{newsConfig[activeNews].query}</span>
              <span>Last update {lastUpdated || '...'} </span>
            </div>
            {newsLoading && <p className="text-sm text-[#E6E7E9]/60">Loading latest headlines...</p>}
            {newsError && <p className="text-sm text-[#E6E7E9]/60">{newsError}</p>}
            {!newsLoading && !newsError && (
              <>
                {newsItems.length === 0 ? (
                  <p className="text-sm text-[#E6E7E9]/60">No headlines available at the moment.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {newsItems.map((article) => (
                      <a
                        key={article.url}
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group rounded-2xl border border-white/10 bg-black/70 p-4 transition hover:border-[#B0EF02]/60"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="h-24 w-full overflow-hidden rounded-xl border border-white/10 bg-black/80 sm:h-28 sm:w-28">
                            {article.urlToImage ? (
                              <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[#B0EF02]/70">
                                Adan
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/70">
                              {article.source?.name || 'Market Wire'}
                            </p>
                            <h3 className="mt-2 text-base font-semibold text-[#E6E7E9]">{article.title}</h3>
                            <p className="mt-2 text-sm text-[#E6E7E9]/70">
                              {article.description || 'Read the latest market intelligence from Adan Investments.'}
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">
                              {new Date(article.publishedAt).toLocaleString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-white/10 bg-black/60 p-6">
              <p className="text-sm text-[#E6E7E9]/70">“{testimonial.quote}”</p>
              <p className="mt-4 text-base font-semibold text-[#E6E7E9]">{testimonial.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#E6E7E9]">Connect with Adan Investments.</h2>
            <p className="mt-3 text-sm text-[#E6E7E9]/70">
              Engage the desk for professional trading intelligence, capital protection strategies, and institutional
              execution frameworks.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Newsletter Capture</p>
              <p className="mt-2 text-sm text-[#E6E7E9]/70">
                Receive weekly macro notes, event risk alerts, and market structure updates.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-[#E6E7E9] placeholder:text-[#E6E7E9]/40"
                />
                <button className="rounded-full bg-[#B0EF02] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/80">Direct Line</p>
            <div className="mt-4 space-y-3 text-sm text-[#E6E7E9]/70">
              <p>Email: contato@adaninvestment.com</p>
              <p>Phone: +55 (11) 9999-9999</p>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E6E7E9]/50">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </AdanLayout>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
