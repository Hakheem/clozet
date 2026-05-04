import HeaderMenu from './header/HeaderMenu'
import Logo from './header/Logo'
import Container from './Container'
import MobileMenu from './header/MobileMenu'
import SearchBar from './header/SearchBar'
import CartSheet from '../general/CartSheet'
import UserDropdown from '../auth/UserDropdown'
import WishlistIcon from './header/WishlistIcon'
import CompareBar from './header/CompareBar'
import { getSiteContent } from '@/actions/contents'


export default async function Header() {
  const content = await getSiteContent()
  const announcementBar = content.announcement_bar || 'Free shipping on orders over KES 3,000 &nbsp;·&nbsp; New drops every Friday'

  return (
    <header className="sticky top-0 z-30 bg-background">

      <div
        className="w-full py-3 px-2 text-center text-[0.55rem] md:text-[0.65rem] font-semibold uppercase tracking-[0.22em]"
        style={{
          background: '#1C1A17',
          color: 'rgba(191,164,122,0.9)',
          letterSpacing: '0.22em',
        }}
        dangerouslySetInnerHTML={{ __html: announcementBar }}
      />

      <div className="border-b border-[#E4E0D9] ">
        <Container className="flex items-center mx-auto justify-between py-4 md:grid md:grid-cols-3 gap-6">

          <div className="hidden md:flex items-center justify-start">
            <HeaderMenu />
          </div>

          <div className="flex items-center justify-start md:justify-center gap-2">
            <MobileMenu />
            {/* Logo for Mobile (sm)  */}
            <Logo size="sm" className="md:hidden" />
            {/* Logo for Desktop (md)  */}
            <Logo size="md" className="hidden md:flex" />
          </div>


          <div className="flex items-center gap-1 md:gap-3 justify-end">
            <div className="flex gap-1 items-center">
              <SearchBar />
              <div className="hidden md:flex" >
                <CompareBar />
              </div>
              <WishlistIcon />
              <CartSheet />
            </div>
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
