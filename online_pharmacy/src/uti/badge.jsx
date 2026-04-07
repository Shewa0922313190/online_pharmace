import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils'; // Assuming you have a utility function for className concatenation

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-1 text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
        destructive: 'bg-red-500 text-white',
        outline: 'border border-gray-300 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = ({ className, variant, asChild, ...props }) => {
  const Component = asChild ? Slot : 'span';
  return (
    <Component className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
