"use client";

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useFavoritesStore } from '@/lib/stores'

const WishlistIcon = () => {
  const { favorites } = useFavoritesStore()
  
  return (
    <Link href="/wishlist" className="relative p-2 hover:bg-[#BFA47A]/10 rounded-full transition-colors group">
      <Heart className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors' />
      {favorites.length > 0 && (
        <span className="absolute p-2 -top-1 -right-0 bg-[#BFA47A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
          {favorites.length}
        </span>
      )} 
    </Link>
  )
}

export default WishlistIcon

