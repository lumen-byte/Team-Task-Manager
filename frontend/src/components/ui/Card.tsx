import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl glass-card text-gray-100 shadow-xl animate-slide-up', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <h3 className={cn('font-semibold leading-none tracking-tight', className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}
