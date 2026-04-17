import React from 'react';
import Link from 'next/link';
import { Archivo_Black } from 'next/font/google';
import { cn } from '@/lib/utils';

const archivo = Archivo_Black({ subsets: ['latin'], weight: ['400'] });

interface LogoProps {
  className?: string;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
}

const Logo = ({ className, children, theme = 'light' }: LogoProps) => {
  const isDark = theme === 'dark';

  return (
    <Link 
      href="/" 
      className={cn(
        archivo.className, 
        "group flex items-center gap-2", 
        className
      )}
    >
      {children ? children : (
        <>
          {/* Stylized Monogram Block (Scaled to match icon sizes) */}
          <div className={cn(
            "relative w-8 h-8 flex items-center justify-center transform -skew-x-12 transition-colors duration-300 shadow-sm",
            isDark ? "bg-background text-foreground group-hover:bg-muted" : "bg-foreground text-background group-hover:bg-primary"
          )}>
            <span className="text-xl leading-none skew-x-12 mt-1 mr-0.5">L</span>
            <span className={cn(
              "absolute bottom-0.5 right-0.5 w-1 h-1 skew-x-12",
              isDark ? "bg-foreground" : "bg-primary"
            )} />
          </div>
          
          {/* Logotype & Slogan */}
          <div className="flex flex-col justify-center uppercase leading-none">
            <span className={cn(
              "text-xl lg:text-2xl tracking-tighter -mb-0.5",
              isDark ? "text-background" : "text-foreground"
            )}>
              LUKUU
            </span>
            <span className={cn(
              "text-[0.55rem] tracking-[0.25em] font-sans font-bold transition-colors duration-300 ml-0.5",
              isDark ? "text-muted hover:text-background" : "text-muted-foreground group-hover:text-primary"
            )}>
              Safi.Daily
            </span>
          </div>
        </>
      )}
    </Link>
  );
};

export default Logo;

