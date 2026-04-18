import React from 'react';
import Link from 'next/link';
import { Archivo_Black } from 'next/font/google';
import { cn } from '@/lib/utils';

const archivo = Archivo_Black({ subsets: ['latin'], weight: ['400'] });

interface LogoProps {
  className?: string;
  theme?: 'light' | 'dark';

  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { mark: 28, wordmark: 'text-lg',  sub: 'text-[0.48rem]' },
  md: { mark: 34, wordmark: 'text-xl',  sub: 'text-[0.52rem]' },
  lg: { mark: 42, wordmark: 'text-2xl', sub: 'text-[0.58rem]' },
};

const LukuuMark = ({
  size = 34,
  foreground = 'currentColor',
  accent = '#BFA47A',
}: {
  size?: number;
  foreground?: string;
  accent?: string;
}) => {
  const s = size;
  const stroke = Math.max(1.6, s * 0.052);   // stroke scales with size
  const half = s / 2;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer border — thin square rotated 0deg */}
      <rect
        x="1"
        y="1"
        width="32"
        height="32"
        rx="1"
        stroke={foreground}
        strokeWidth={stroke}
        strokeOpacity="0.18"
      />

      {/* Vertical stroke of the L */}
      <line
        x1="10"
        y1="8"
        x2="10"
        y2="26"
        stroke={foreground}
        strokeWidth={stroke * 2.3}
        strokeLinecap="round"
      />

      {/* Horizontal base of the L */}
      <line
        x1="10"
        y1="26"
        x2="22"
        y2="26"
        stroke={foreground}
        strokeWidth={stroke * 2.3}
        strokeLinecap="round"
      />

      {/* Accent — a detached top-right tick in brand gold */}
      <line
        x1="16"
        y1="8"
        x2="24"
        y2="8"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
      />

      {/* Accent dot — corner anchor */}
      <circle cx="26" cy="25" r={stroke * 2} fill={accent} />
    </svg>
  );
};

const Logo = ({
  className,
  theme = 'light',
  variant = 'full',
  size = 'md',
}: LogoProps) => {
  const isDark = theme === 'dark';
  const { mark: markSize, wordmark, sub } = sizes[size];

  const fg = isDark ? '#F7F5F2' : '#1C1A17';
  const subColor = isDark ? 'rgba(247,245,242,0.45)' : 'rgba(28,26,23,0.45)';

  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5 select-none', className)}
    >
      {/* Mark */}
      {variant !== 'wordmark' && (
        <span className="flex-shrink-0 transition-opacity duration-300 group-hover:opacity-80">
          <LukuuMark size={markSize} foreground={fg} />
        </span>
      )}

      {/* Wordmark */}
      {variant !== 'mark' && (
        <span className="flex flex-col leading-none justify-center">
          <span
            className={cn(archivo.className, wordmark, 'tracking-tight leading-none')}
            style={{ color: fg, letterSpacing: '-0.01em' }}
          >
            LUKUU
          </span>
          <span
            className={cn(sub, 'uppercase font-sans font-semibold tracking-[0.22em] mt-1 ml-px')}
            style={{
              color: subColor,
              transition: 'color 0.2s',
            }}
          >
            Safi.Daily
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;

