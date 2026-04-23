import { Heart } from 'lucide-react'

const WishlistIcon = () => {
  return (
    <div>
        <button className="relative p-2 hover:bg-[#BFA47A]/10 rounded-full transition-colors">
        <Heart className='w-5 h-5 text-muted-foreground hover:text-primary hoverEffect ' />
                      </button>

    </div>
  )
}

export default WishlistIcon