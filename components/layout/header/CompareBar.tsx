"use client";

import { ChartNoAxesColumn } from 'lucide-react'
import { useCompareStore } from '@/lib/stores'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CompareBar = () => {
  const { compareIds } = useCompareStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Link href="/compare" className="relative p-2 hover:bg-[#BFA47A]/10 rounded-full transition-colors group">
      <ChartNoAxesColumn className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors hoverEffect' />
      {mounted && compareIds.length > 0 && (
        <span className="absolute p-2 -top-1 -right-0 bg-[#BFA47A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
          {compareIds.length}
        </span>
      )}
    </Link>
  )
}

export default CompareBar