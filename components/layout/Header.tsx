import HeaderMenu from './header/HeaderMenu'
import Logo from './header/Logo'
import Container from './Container'
import MobileMenu from './header/MobileMenu'
import SearchBar from './header/SearchBar'
import CartIcon from './header/CartIcon'
import { Button } from '../ui/button'
import UserDropdown from '../auth/UserDropdown'

const Header = () => {
    return (
        <header className='bg-background border-b border-gray-200 py-5'>
            <Container className='flex text-muted-foreground justify-between md:grid grid-cols-2 md:grid-cols-3 items-center gap-8'>
                <div className="md:flex hidden items-center justify-start">
                    <HeaderMenu />
                </div>
                <div className="flex items-center justify-center gap-2.5">
                    <MobileMenu />
                    <Logo />
                </div>
                <div className="flex items-center gap-4 justify-end">
                    <SearchBar />
                    <CartIcon />
                    <div>
                        <UserDropdown />
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header
