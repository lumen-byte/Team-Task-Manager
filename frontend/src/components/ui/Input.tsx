import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 bg-red-500/5 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-semibold text-red-400 ml-1 animate-fade-in">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
