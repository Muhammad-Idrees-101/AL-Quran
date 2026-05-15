import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-dark-slate text-white">
      <h2 className="mb-4 text-4xl font-bold text-islamic-gold">404</h2>
      <p className="mb-8 text-gray-400">Could not find requested resource</p>
      <Link href="/" className="rounded-xl bg-islamic-emerald px-6 py-3 font-semibold text-white hover:bg-emerald-600">
        Return Home
      </Link>
    </div>
  );
}
