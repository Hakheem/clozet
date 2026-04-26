import { Sparkles } from 'lucide-react'
import Title from './Title'
import { Button } from '../ui/button'
import Link from 'next/link'
import Container from '../layout/Container'


const PremiumDeals = () => {
    return (
        <Container className='my-10 mx-auto '>
            <section className='flex flex-col space-y-3 ' >
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-4 '>
                        <Sparkles className='w-5 h-5 ' />
                        <h2 className="uppercase font-semibold tracking-tight">Limited Time Offers</h2>
                    </div>

                    <Button className='flex items-center gap-2 h-10'>
                        <Link href={`/deals`}>View All Deals</Link>
                    </Button>
                </div>

                <Title className=''> Premium Deals, Unbeatable Prices</Title>


                <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                    Experience luxury for less. Explore our exclusive collection of high-demand items with seasonal discounts designed for the discerning shopper.
                </p>
            </section>
            </Container>
                )
}

                export default PremiumDeals
