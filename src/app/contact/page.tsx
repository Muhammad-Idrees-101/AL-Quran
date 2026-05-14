'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <div className="pb-20 min-h-[calc(100vh-80px)] flex flex-col items-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-1/4 left-1/4 w-[40%] h-[40%] bg-islamic-emerald/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[40%] h-[40%] bg-islamic-gold/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <section className="relative px-4 md:px-8 pt-20 md:pt-32 pb-10 overflow-hidden w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.05] border border-white/[0.1] text-islamic-gold text-sm font-semibold tracking-wide">
            <span>✨</span> Let's Connect
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-islamic-gold to-amber-300">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="px-4 md:px-8 w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1B2A]/90 backdrop-blur-lg rounded-3xl z-10 py-16"
              >
                <div className="w-24 h-24 bg-islamic-emerald/20 text-islamic-emerald-light rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-islamic-emerald/30 animate-ping rounded-full" />
                  <span className="text-5xl relative z-10">✓</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-gray-300 text-center max-w-sm px-6">
                  Jazakallah Khair for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-8 px-8 py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white rounded-xl transition-all font-medium active:scale-95"
                >
                  Send another message
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Your Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                  <input
                    type="text"
                    id="name"
                    required
                    disabled={formState === 'submitting'}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic-gold/50 focus:border-islamic-gold/50 transition-all disabled:opacity-50"
                    placeholder="e.g. Idrees"
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    id="email"
                    required
                    disabled={formState === 'submitting'}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic-gold/50 focus:border-islamic-gold/50 transition-all disabled:opacity-50"
                    placeholder="e.g. idrees@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="subject" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📝</span>
                <input
                  type="text"
                  id="subject"
                  required
                  disabled={formState === 'submitting'}
                  className="w-full bg-black/40 border border-white/[0.1] rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic-gold/50 focus:border-islamic-gold/50 transition-all disabled:opacity-50"
                  placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                disabled={formState === 'submitting'}
                className="w-full bg-black/40 border border-white/[0.1] rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic-gold/50 focus:border-islamic-gold/50 transition-all resize-none disabled:opacity-50"
                placeholder="Assalamu alaikum..."
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full py-4 mt-4 bg-gradient-to-r from-islamic-gold to-amber-400 hover:from-amber-400 hover:to-islamic-gold text-[#0A1A14] font-bold text-lg rounded-2xl shadow-glow-gold transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {formState === 'submitting' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#0A1A14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Send Message
                  <span className="text-xl">→</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Or email us directly at <a href="mailto:su92-bsitm-f24-130@superior.edu.pk" className="text-islamic-gold hover:underline font-medium">su92-bsitm-f24-130@superior.edu.pk</a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
