import { ReactNode } from 'react'

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Market Analysis', href: '/#analysis' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Economic Calendar', href: '/economic-calendar' },
  { label: 'Contact', href: '/#contact' },
]

type LayoutProps = {
  children: ReactNode
}

export const AdanLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-black text-white">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="/#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B0EF02]/40 bg-[#B0EF02]/10">
            <img src="/assets/adan-logo.png" alt="Adan Investments logo" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#B0EF02]/90">ADAN INVESTMENTS</p>
            <p className="text-xs text-[#E6E7E9]/70">Institutional Forex & Commodities</p>
          </div>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-[#E6E7E9]/70 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#B0EF02]">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="/#contact"
          className="rounded-full border border-[#B0EF02]/40 bg-[#B0EF02]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B0EF02] transition hover:bg-[#B0EF02]/20"
        >
          Request Access
        </a>
      </div>
    </header>
    <main>{children}</main>
    <footer className="border-t border-white/10 bg-black/90">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#B0EF02]/90">Adan Investments</p>
            <p className="mt-3 text-base font-semibold text-[#E6E7E9]">Forex and XAU/USD Specialists</p>
            <p className="mt-2 text-sm text-[#E6E7E9]/60">
              Institutional-grade trading intelligence with precision execution for modern investors.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/90">Quick Links</p>
            <div className="mt-4 grid gap-2 text-sm text-[#E6E7E9]/70">
              <a href="/#home" className="transition hover:text-[#B0EF02]">Home</a>
              <a href="/#about" className="transition hover:text-[#B0EF02]">About</a>
              <a href="/#services" className="transition hover:text-[#B0EF02]">Services</a>
              <a href="/#analysis" className="transition hover:text-[#B0EF02]">Analysis</a>
              <a href="/#blog" className="transition hover:text-[#B0EF02]">Blog</a>
              <a href="/#contact" className="transition hover:text-[#B0EF02]">Contact</a>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/90">Social Links</p>
            <div className="mt-4 grid gap-2 text-sm text-[#E6E7E9]/70">
              <a href="https://instagram.com" className="transition hover:text-[#B0EF02]">Instagram</a>
              <a href="https://twitter.com" className="transition hover:text-[#B0EF02]">Twitter</a>
              <a href="https://linkedin.com" className="transition hover:text-[#B0EF02]">LinkedIn</a>
              <a href="https://youtube.com" className="transition hover:text-[#B0EF02]">YouTube</a>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B0EF02]/90">Contact Info</p>
            <div className="mt-4 space-y-2 text-sm text-[#E6E7E9]/70">
              <p>Email: contato@adaninvestment.com</p>
              <p>Phone: +55 (11) 9999-9999</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#E6E7E9]/50 sm:flex-row">
          <p>© 2025 Adan Investments. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-[#B0EF02]">Privacy Policy</a>
            <a href="#" className="transition hover:text-[#B0EF02]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
)
