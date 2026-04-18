'use client'

import React from 'react'
import { LuFacebook, LuInstagram } from 'react-icons/lu'
import { PiTiktokLogo } from 'react-icons/pi'
import { cn } from '@/lib/utils'

interface SocialIconsProps {
    theme?: 'light' | 'dark';
    className?: string;
}

const socials = [
    { name: 'Facebook', icon: LuFacebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: LuInstagram, href: 'https://instagram.com' },
    { name: 'TikTok', icon: PiTiktokLogo, href: 'https://tiktok.com' },
]

const SocialIcons = ({ theme = 'light', className }: SocialIconsProps) => {
    const isDark = theme === 'dark';

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {socials.map((social) => {
                const Icon = social.icon;
                return (
                    <a 
                        key={social.name}
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(
                            "flex items-center gap-2 group transition-colors duration-200",
                            isDark 
                                ? "text-muted-foreground hover:text-background" 
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Icon className="size-6 transition-opacity opacity-70 duration-200 group-hover:opacity-90" />
                        <span className={cn(
                            "text-xs font-medium uppercase",
                            "opacity-60 group-hover:opacity-90 transition-opacity duration-200",
                            "md:opacity-90"
                        )}>
                            {social.name}
                        </span>
                    </a>
                )
            })}
        </div>
    )
}

export default SocialIcons
