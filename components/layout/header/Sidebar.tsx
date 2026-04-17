'use client'

import React, { FC } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerLinks } from '@/lib/static-data';
import SocialIcons from '@/components/general/SocialIcons';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void
}

const navVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Dark blurred overlay to click out */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                />

                <motion.div 
                    initial={{ x: '-100%' }} 
                    animate={{ x: 0 }} 
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
                    className='fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-foreground text-background h-full p-6 pt-8 border-r border-border/20 flex flex-col md:hidden'
                >
                    <div className="flex items-center justify-between mb-10">
                        <Logo theme="dark" />
                        <Button 
                            variant='ghost' 
                            size='icon'
                            className='rounded-md hover:bg-white/10 hover:text-background text-muted hoverEffect -mr-2' 
                            onClick={onClose}
                        > 
                            <X className='size-6' /> 
                        </Button>
                    </div>

                    {/* Navigation Links */}
                    <motion.div 
                        variants={navVariants} 
                        initial="hidden" 
                        animate="show" 
                        className="flex flex-col gap-6 flex-1 mt-4"
                    >
                        {headerLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <motion.div key={link.title} variants={itemVariants}>
                                    <Link 
                                        href={link.href} 
                                        onClick={onClose} 
                                        className={`text-lg font-semibold tracking-wide uppercase hoverEffect transition-colors block w-full ${
                                            isActive 
                                                ? 'text-background' 
                                                : 'text-muted-foreground hover:text-background'
                                        }`}
                                    >
                                        {link.title}
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* Social Media Component */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="mt-auto pt-6 border-t border-border/20"
                    >
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Connect With Us</p>
                        <SocialIcons theme="dark" />
                    </motion.div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Sidebar

