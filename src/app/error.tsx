'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-dark-slate text-white">
      <h2 className="mb-4 text-2xl font-bold text-islamic-gold">Something went wrong!</h2>
      <p className="mb-8 text-gray-400">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-islamic-emerald px-6 py-3 font-semibold text-white hover:bg-emerald-600"
      >
        Try again
      </button>
    </div>
  );
}
