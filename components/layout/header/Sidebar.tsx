'use client'

import React, { FC } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './Logo'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { headerLinks } from '@/lib/static-data'
import SocialIcons from '@/components/general/SocialIcons'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const navVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0 },
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ background: 'rgba(28,26,23,0.55)', backdropFilter: 'blur(4px)' }}
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-[320px] h-full flex flex-col md:hidden overflow-hidden"
                        style={{ background: '#1C1A17' }}
                    >
                        {/* Grain overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.04]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat',
                                backgroundSize: '128px',
                            }}
                        />

                        {/* Accent edge */}
                        <div
                            className="absolute inset-y-0 left-0 w-px"
                            style={{ background: 'linear-gradient(to bottom, transparent, rgba(191,164,122,0.4) 30%, rgba(191,164,122,0.4) 70%, transparent)' }}
                        />

                        {/* Header row */}
                        <div className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
                            <Logo theme="dark" size="md" />
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                                style={{ color: 'rgba(247,245,242,0.5)' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#F7F5F2')}
                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(247,245,242,0.5)')}
                                aria-label="Close menu"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Hairline */}
                        <div className="mx-6 h-px" style={{ background: 'rgba(247,245,242,0.07)' }} />

                        {/* Nav links */}
                        <motion.nav
                            variants={navVariants}
                            initial="hidden"
                            animate="show"
                            className="relative z-10 flex flex-col flex-1 px-6 pt-8 gap-1"
                        >
                            {headerLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <motion.div
                                        key={link.title}
                                        variants={itemVariants}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="group flex items-center justify-between py-3 transition-colors duration-200"
                                            style={{ borderBottom: '1px solid rgba(247,245,242,0.05)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-base font-semibold uppercase tracking-widest"
                                                    style={{
                                                        color: isActive ? '#F7F5F2' : 'rgba(247,245,242,0.55)',
                                                    }}
                                                >
                                                    {link.title}
                                                </span>
                                            </div>
                                            <ArrowRight
                                                className="size-3.5 transition-all duration-200 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                                style={{ color: '#BFA47A' }}
                                            />
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </motion.nav>

                        {/* Footer */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55, duration: 0.4 }}
                            className="relative z-10 px-6 pb-8 pt-6"
                            style={{ borderTop: '1px solid rgba(247,245,242,0.07)' }}
                        >
                            <p
                                className="text-[0.6rem] uppercase tracking-[0.22em] mb-4"
                                style={{ color: 'rgba(191,164,122,0.6)' }}
                            >
                                Connect With Us
                            </p>
                            <SocialIcons theme="dark" />
                        </motion.div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}

export default Sidebar

