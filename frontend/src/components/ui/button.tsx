import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-amber-700 text-white hover:bg-amber-800 shadow-sm',
        outline:
          'border-bakery-300 bg-white text-bakery-900 hover:bg-bakery-100 hover:border-bakery-400',
        secondary: 'bg-bakery-100 text-bakery-900 hover:bg-bakery-200 border border-bakery-200',
        ghost: 'text-bakery-800 hover:bg-bakery-100 hover:text-bakery-950',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        link: 'text-amber-700 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 gap-2 px-4 py-2 text-sm',
        sm: 'h-8 gap-1.5 px-3 text-sm',
        lg: 'h-11 gap-2.5 px-5 text-sm font-semibold',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Standard button component adhering to shadcn/ui and enforcing text-sm typography.
 */
function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
