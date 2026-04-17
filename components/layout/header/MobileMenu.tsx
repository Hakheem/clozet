'use client'

import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import Sidebar from './Sidebar'

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsSidebarOpen(true)} 
        className='md:hidden flex items-center justify-center py-1 pr-2 hoverEffect hover:text-primary'
        aria-label="Open mobile menu"
      >
        <AlignLeft className='size-6' />
      </button>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

export default MobileMenu

