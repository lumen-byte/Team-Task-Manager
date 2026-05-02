import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(190,242,100,0.2)] active:scale-95',
      secondary: 'bg-secondary text-foreground hover:bg-zinc-800 active:scale-95',
      outline: 'border-2 border-white/10 bg-transparent hover:bg-white/5 active:scale-95',
      ghost: 'bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white active:scale-95',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs',
      md: 'h-12 px-8 text-sm',
      lg: 'h-14 px-10 text-base',
      icon: 'h-12 w-12 flex items-center justify-center p-0',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
