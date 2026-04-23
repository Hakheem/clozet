import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CartIcon = () => { 
  return (
    <Link href={'/cart'} className='relative group '>
        
<ShoppingBag className='w-5 h-5 hoverEffect text-muted-foreground hover:text-primary'/>
<span className='absolute -top-1 -right-1 w-3.5 h-3.5 font-medium rounded-full bg-primary text-background flex items-center justify-center text-xs p-1.5'>0</span>
    </Link>
  )
}

export default CartIcon
