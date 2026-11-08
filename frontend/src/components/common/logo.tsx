import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ROUTE_HOME } from '@/constants/APP_ROUTES';
import { SITE_NAME } from '@/constants/SITE_CONFIG';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

/**
 * Brand Logo component for Windie Cake featuring an artisanal 'W' emblem.
 */
export function Logo({ className, size = 'md', showText = true, variant = 'light' }: LogoProps) {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const titleSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const subtitleSize = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  }[size];

  const isDark = variant === 'dark';

  return (
    <Link
      href={ROUTE_HOME}
      className={cn('inline-flex items-center gap-2.5 group select-none', className)}
      aria-label={SITE_NAME}
    >
      {/* Artisanal SVG Emblem with Stylized 'W' */}
      <div
        className={cn(
          'relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-bakery-900 p-2 shadow-sm transition-transform duration-200 group-hover:scale-105',
          iconDimensions,
        )}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Subtle Outer Wheat Circle Accent */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
          />
          {/* Stylized Baker's W Symbol */}
          <path
            d="M24 32C24 32 27 48 34 68C37 76 43 76 46 66L50 52L54 66C57 76 63 76 66 68C73 48 76 32 76 32"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Wheat Grain Accent above W */}
          <circle cx="50" cy="26" r="4.5" fill="#fef3c7" />
          <path
            d="M42 28C44 24 47 22 50 22C53 22 56 24 58 28"
            stroke="#fef3c7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-serif font-bold tracking-tight transition-colors leading-none',
              titleSize,
              isDark
                ? 'text-white group-hover:text-amber-300'
                : 'text-bakery-950 group-hover:text-amber-800',
            )}
          >
            Windie Cake
          </span>
          <span
            className={cn(
              'font-sans uppercase tracking-widest font-semibold mt-1 leading-none',
              subtitleSize,
              isDark ? 'text-amber-200/80' : 'text-bakery-600',
            )}
          >
            Artisan Bakery
          </span>
        </div>
      )}
    </Link>
  );
}
