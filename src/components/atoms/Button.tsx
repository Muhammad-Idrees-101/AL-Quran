'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-islamic-emerald text-white hover:bg-islamic-emerald-light border border-islamic-emerald-light/30',
  glass:   'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  ghost:   'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white border border-transparent',
  gold:    'bg-islamic-gold/20 text-islamic-gold border border-islamic-gold/30 hover:bg-islamic-gold/30',
  danger:  'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', className, children, ...props
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.02 }}
    className={cn(
      'rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-islamic-gold/50 focus:ring-offset-1 focus:ring-offset-transparent inline-flex items-center justify-center gap-2',
      variants[variant],
      sizes[size],
      className
    )}
    {...(props as any)}
  >
    {children}
  </motion.button>
);

Button.displayName = 'Button';
