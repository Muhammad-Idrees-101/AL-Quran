'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
  onSelect: () => void;
}

interface OmniSearchProps {
  items: CommandItem[];
  placeholder?: string;
  onClose?: () => void;
}

export const OmniSearch: React.FC<OmniSearchProps> = ({
  items, placeholder = 'Search Surahs, Ayahs, Videos...', onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = useCallback((item: CommandItem) => {
    item.onSelect();
    setValue('');
    setOpen(false);
    onClose?.();
  }, [onClose]);

  // Group items by category
  const categories = Array.from(new Set(items.map(i => i.category || 'Other')));

  const filtered = items.filter(item => {
    const catMatch = !filter || item.category === filter;
    const textMatch = !value || item.label.toLowerCase().includes(value.toLowerCase()) ||
      item.description?.toLowerCase().includes(value.toLowerCase());
    return catMatch && textMatch;
  });

  const grouped = filtered.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className={cn(
          'w-full pl-6 pr-2 py-2 rounded-full text-base font-medium shadow-2xl shadow-blue-900/20',
          'bg-white text-gray-900 border-2 border-transparent hover:border-gray-200',
          'transition-all duration-300 flex items-center justify-between group'
        )}
      >
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-gray-600 transition-colors">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-gray-500">Search 114 Surahs, Videos...</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-400">
            ⌘K
          </kbd>
          <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md">
            Search
          </div>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="bg-[#0F1F1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.12] overflow-hidden">
                <div className="flex items-center gap-3 px-4 border-b border-white/[0.08]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-islamic-gold flex-shrink-0">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <Command.Input
                    placeholder={placeholder}
                    value={value}
                    onValueChange={setValue}
                    className="w-full py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                    autoFocus
                  />
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded-lg border border-white/[0.1] transition-colors">
                    ESC
                  </button>
                </div>

                {/* Tag Filters */}
                <div className="flex gap-1.5 px-4 py-2 border-b border-white/[0.05]">
                  <FilterTag active={!filter} onClick={() => setFilter(null)}>All</FilterTag>
                  {categories.map(cat => (
                    <FilterTag key={cat} active={filter === cat} onClick={() => setFilter(f => f === cat ? null : cat)}>
                      {cat}
                    </FilterTag>
                  ))}
                </div>

                <Command.List className="max-h-80 overflow-y-auto py-2">
                  <Command.Empty className="px-4 py-8 text-center text-gray-500 text-sm">
                    No results found.
                  </Command.Empty>

                  {Object.entries(grouped).map(([category, catItems]) => (
                    <Command.Group key={category} heading={category}>
                      {catItems.slice(0, 20).map((item) => (
                        <Command.Item
                          key={item.id}
                          value={`${item.label} ${item.description || ''}`}
                          onSelect={() => handleSelect(item)}
                          className="mx-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white flex items-center gap-3 data-[selected=true]:bg-islamic-gold/15 data-[selected=true]:text-white"
                        >
                          {item.icon && <span className="text-base flex-shrink-0">{item.icon}</span>}
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 truncate">{item.description}</div>
                            )}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function FilterTag({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all',
        active
          ? 'bg-islamic-gold/20 text-islamic-gold border border-islamic-gold/30'
          : 'bg-white/[0.05] text-gray-500 hover:text-gray-300 border border-transparent'
      )}
    >{children}</button>
  );
}

OmniSearch.displayName = 'OmniSearch';
