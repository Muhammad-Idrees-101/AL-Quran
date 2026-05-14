'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'heavy' | 'light';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children, className, onClick, variant = 'default',
}) => {
  const base = {
    default: 'bg-white/[0.07] backdrop-blur-md border border-white/[0.12]',
    heavy:   'bg-white/[0.14] backdrop-blur-lg border border-white/[0.22]',
    light:   'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={cn(base, 'rounded-2xl', className)}
    >
      {children}
    </div>
  );
};

GlassPanel.displayName = 'GlassPanel';
