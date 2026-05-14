'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-4">
            Al-Quran Interactive is designed to be privacy-first. We do not require you to create an account, and we do not collect personal identifiable information (PII) such as your name, email address, or phone number.
          </p>
          <p>
            Any data related to your usage of the platform—such as reading progress, bookmarks, selected themes, and audio preferences—is stored locally on your device using your browser's local storage. This data never leaves your device and is never transmitted to our servers.
          </p>
        </>
      )
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <p>
          Because we only store data locally on your device, we use this information exclusively to provide a personalized experience. For example, your reading history allows the "Jump Back In" feature to work, and your theme preferences ensure the app looks the way you want it to the next time you visit.
        </p>
      )
    },
    {
      title: "3. Third-Party Services & APIs",
      content: (
        <>
          <p className="mb-4">
            To provide you with rich media content, Al-Quran Interactive integrates with external APIs and services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Audio Recitations:</strong> Audio files are streamed from third-party Quranic audio repositories.</li>
            <li><strong>Tafseer Videos:</strong> Video content is streamed directly from Youtube</li>
          </ul>
          <p className="mt-4">
            When you access these media files, your IP address and standard browser headers may be visible to these third-party providers. We encourage you to review their respective privacy policies.
          </p>
        </>
      )
    },
    {
      title: "4. Data Security",
      content: (
        <p>
          We employ standard web security practices to protect the integrity of the application. Since no personal user data is transmitted to or stored on our servers, the risk of data breaches involving your personal information through our platform is eliminated.
        </p>
      )
    },
    {
      title: "5. Changes to This Policy",
      content: (
        <p>
          We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page with a revised "Last Updated" date.
        </p>
      )
    },
    {
      title: "6. Contact Us",
      content: (
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us via the <Link href="/contact" className="text-islamic-gold hover:underline">Contact Page</Link>.
        </p>
      )
    }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative px-4 md:px-8 pt-20 md:pt-32 pb-12 overflow-hidden flex flex-col items-center justify-center border-b border-white/[0.05]">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-islamic-emerald/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] shadow-lg flex items-center justify-center mb-6">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Last Updated: <span className="text-gray-300 font-medium">{lastUpdated}</span>
          </p>
        </motion.div>
      </section>

      {/* Policy Content */}
      <section className="px-4 md:px-8 max-w-4xl mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-10 space-y-12 shadow-2xl"
        >
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-islamic-gold/10 text-islamic-gold flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </span>
                {section.title.split('. ')[1]}
              </h2>
              <div className="text-gray-300 leading-relaxed text-base md:text-lg pl-11">
                {section.content}
              </div>
            </div>
          ))}

          {/* Footer of Policy */}
          <div className="pt-8 mt-12 border-t border-white/[0.08] text-center">
            <p className="text-gray-400 mb-6">
              Thank you for trusting Al-Quran Interactive.
            </p>
            <Link href="/">
              <button className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
