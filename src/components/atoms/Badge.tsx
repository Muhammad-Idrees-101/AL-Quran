'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'gold' | 'slate' | 'blue' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

const colors = {
  emerald: 'bg-islamic-emerald/20 text-emerald-300 border-islamic-emerald/30',
  gold:    'bg-islamic-gold/20 text-islamic-gold border-islamic-gold/30',
  slate:   'bg-slate-600/20 text-slate-300 border-slate-500/30',
  blue:    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  purple:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  amber:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export const Badge: React.FC<BadgeProps> = ({
  children, variant = 'emerald', size = 'sm', className,
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border font-semibold',
      size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      colors[variant],
      className
    )}
  >
    {children}
  </span>
);

Badge.displayName = 'Badge';
