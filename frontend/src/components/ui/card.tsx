import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card container component with subtle borders and shadows.
 */
function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex flex-col gap-4 overflow-hidden rounded-2xl bg-white border border-bakery-200 text-bakery-950 shadow-xs transition-all duration-300',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Card header area for titles and category tags.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col space-y-1.5 p-4 sm:p-5', className)}
      {...props}
    />
  );
}

/**
 * Card title element.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('font-serif text-base font-bold text-bakery-950', className)}
      {...props}
    />
  );
}

/**
 * Card description text.
 */
function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-xs text-bakery-600 line-clamp-2', className)}
      {...props}
    />
  );
}

/**
 * Card content body area.
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-4 sm:p-5 pt-0', className)} {...props} />;
}

/**
 * Card footer element for action buttons and pricing.
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center justify-between p-4 sm:p-5 pt-0', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
