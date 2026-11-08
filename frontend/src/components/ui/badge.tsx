import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-amber-100 text-amber-900 border border-amber-200',
        secondary: 'bg-bakery-100 text-bakery-900 border border-bakery-200',
        outline: 'border border-bakery-300 text-bakery-800 bg-white',
        destructive: 'bg-rose-100 text-rose-800 border border-rose-200',
        success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Standard badge component styled with bakery palette.
 */
function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
