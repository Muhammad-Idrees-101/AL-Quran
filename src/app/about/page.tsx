'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-20 md:pt-32 pb-16 overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] theme-hero-glow blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] shadow-xl flex items-center justify-center mb-8">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            A New Era of <br className="hidden sm:block" />
            <span className="gradient-text-gold">Spiritual Discovery</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium mb-10">
            Al-Quran Interactive was built to bridge the gap between traditional Islamic scholarship and modern digital design. Our goal is to provide a premium, deeply immersive environment for engaging with the divine revelation.
          </p>
        </motion.div>
      </section>

      {/* Content Sections */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto space-y-16">
        
        {/* Mission */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-islamic-gold/10 blur-[80px] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg relative z-10">
            We believe that accessing the Quran, its translations, and its scholarly interpretations (Tafseer) should be a seamless, beautiful, and profoundly personal experience. By combining state-of-the-art web technologies with authentic Islamic texts, we aim to foster a deeper connection between the believer and the Word of Allah.
          </p>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📖",
              title: "Immersive Reading",
              desc: "A distraction-free reading experience with precise audio synchronization and customizable fonts tailored to your preference."
            },
            {
              icon: "🎓",
              title: "Scholarly Content",
              desc: "Integrated video lectures and classical Tafseer from renowned scholars, providing context and depth to every Ayah."
            },
            {
              icon: "📱",
              title: "Modern Engineering",
              desc: "Built from the ground up for speed, responsiveness, and accessibility across all devices, ensuring the Quran is always within reach."
            }
          ].map((pillar, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-colors"
            >
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
              <p className="text-gray-400 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Technology & Open Source */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-white/[0.08]"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Built for the Ummah</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            This platform leverages modern web technologies to deliver a fast, responsive, and robust experience. We continually strive to improve and expand our features based on community feedback.
          </p>
          <Link href="/">
            <button className="bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95">
              Return to Dashboard
            </button>
          </Link>
        </motion.div>

      </section>
    </div>
  );
}
