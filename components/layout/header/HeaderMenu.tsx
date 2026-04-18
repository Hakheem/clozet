'use client'

import { headerLinks } from '@/lib/static-data'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const HeaderMenu = () => {

 const pathname = usePathname()
 

  return (
    <div className='hidden items-center md:inline-flex w-1/3 gap-4 text-sm capitalize font-semibold  '>
      { 
        headerLinks.map((link) => (
          <Link key={link.title} href={link.href} className={`relative hoverEffect hover:text-primary group ${pathname === link.href ? 'text-primary' : ''}`}>
            {link.title}
            <span className={`absolute -bottom-2 left-1/2 w-0 h-0.5 bg-primary hoverEffect group-hover:w-1/2 group-hover:left-0 ${pathname === link.href ? 'w-1/2 !left-0' : ''}`}/>
            <span className={`absolute -bottom-2 right-1/2 w-0 h-0.5 bg-primary hoverEffect group-hover:w-1/2 group-hover:right-0 ${pathname === link.href ? 'w-1/2 !right-0' : ''}`}/>
          </Link>
        ))
      }
    </div>
  )
}

export default HeaderMenu
