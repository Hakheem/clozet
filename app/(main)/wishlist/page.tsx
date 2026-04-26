import Container from '@/components/layout/Container'
import WishlistContent from './WishlistContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Wishlist — Lukuu",
    description: "Manage your wishlist of favorite items.",
};

export default function WishlistPage() {
    return (
        <Container className='mx-auto w-full'>
            <main className="w-full pt-4 pb-8 md:pb-12">
                <WishlistContent />
            </main>
        </Container>
    )
}

