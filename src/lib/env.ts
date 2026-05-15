/**
 * Environment Variable Validator & Accessor
 * Ensures that all required environment variables are present and correctly formatted.
 */

interface EnvSchema {
  // Public
  NEXT_PUBLIC_QURAN_API: string;
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_AUDIO_CDN: string;
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_ENV: 'development' | 'production' | 'test';

  // Private (Server-side only)
  DATABASE_URL?: string;
  STRIPE_SECRET_KEY?: string;
  JWT_SECRET?: string;
  INTERNAL_API_KEY?: string;
}

const isServer = typeof window === 'undefined';

export const env: EnvSchema = {
  // Public variables are safe to access anywhere
  NEXT_PUBLIC_QURAN_API: process.env.NEXT_PUBLIC_QURAN_API || 'https://api.alquran.cloud',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  NEXT_PUBLIC_AUDIO_CDN: process.env.NEXT_PUBLIC_AUDIO_CDN || 'https://everyayah.com/data',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://al-quran-beige.vercel.app/',
  NEXT_PUBLIC_ENV: (process.env.NEXT_PUBLIC_ENV as any) || 'development',

  // Private variables should only be accessed on the server
  DATABASE_URL: isServer ? process.env.DATABASE_URL : undefined,
  STRIPE_SECRET_KEY: isServer ? process.env.STRIPE_SECRET_KEY : undefined,
  JWT_SECRET: isServer ? process.env.JWT_SECRET : undefined,
  INTERNAL_API_KEY: isServer ? process.env.INTERNAL_API_KEY : undefined,
};

/**
 * Validates that all required server-side environment variables are present.
 * Should be called in server-side entry points (e.g., API routes, generateStaticParams).
 */
export function validateServerEnv() {
  if (!isServer) return;

  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Critical environment variables missing: ${missing.join(', ')}`);
    }
  }
}

/**
 * Security Check: Ensure no sensitive keys are leaked in public exports.
 * This is a runtime safeguard.
 */
if (typeof window !== 'undefined') {
  const sensitiveKeys = ['STRIPE_SECRET_KEY', 'DATABASE_URL', 'JWT_SECRET', 'INTERNAL_API_KEY'];
  sensitiveKeys.forEach(key => {
    try {
      // On some client environments, process.env might not be a full object or might be undefined
      if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
        console.warn(`⚠️ SECURITY WARNING: Sensitive variable ${key} is visible on the client-side. Ensure it is NOT prefixed with NEXT_PUBLIC_.`);
      }
    } catch (e) {
      // Silently fail if process.env is not accessible
    }
  });
}
