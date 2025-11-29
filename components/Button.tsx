'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClass =
    variant === 'primary'
      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
      : variant === 'secondary'
      ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
      : 'bg-transparent text-gray-600 hover:bg-gray-100';

  const sizeClass =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : 'px-4 py-2 text-sm';

  return (
    <button
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      )}
      {children}
    </button>
  );
}
