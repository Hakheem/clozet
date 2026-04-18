import HeaderMenu from './header/HeaderMenu'
import Logo from './header/Logo'
import Container from './Container'
import MobileMenu from './header/MobileMenu'
import SearchBar from './header/SearchBar'
import CartIcon from './header/CartIcon'
import UserDropdown from '../auth/UserDropdown'


const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-background">

      {/* ── Announcement bar ─────────────────────────────── */}
      <div
        className="w-full py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em]"
        style={{
          background: '#1C1A17',
          color: 'rgba(191,164,122,0.9)',
          letterSpacing: '0.22em',
        }}
      >
        Free shipping on orders over KES 3,000 &nbsp;·&nbsp; New drops every Friday
      </div>

      {/* ── Main header row ──────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: '#E4E0D9' }}
      >
        <Container className="flex items-center justify-between py-4 md:grid md:grid-cols-3 gap-6">

          {/* Left — nav (desktop) */}
          <div className="hidden md:flex items-center justify-start">
            <HeaderMenu />
          </div>

          {/* Centre — logo */}
          <div className="flex items-center justify-start md:justify-center gap-2">
            <MobileMenu />
            <Logo size="md" />
          </div>

          {/* Right — utilities */}
          <div className="flex items-center gap-4 justify-end">
            <SearchBar />
            <CartIcon />
            <UserDropdown />
          </div>

        </Container>
      </div>

      {/* ── Accent hairline ──────────────────────────────── */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(191,164,122,0.35) 30%, rgba(191,164,122,0.35) 70%, transparent 100%)',
        }}
      />

    </header>
  )
}

export default Header
