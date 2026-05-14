export default function PlayerLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="px-4 md:px-8 py-6 border-b border-white/[0.06]">
        <div className="h-3 w-20 bg-white/[0.08] rounded mb-3" />
        <div className="h-8 w-64 bg-white/[0.08] rounded-lg mb-2" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/[0.06] rounded-full" />
          <div className="h-5 w-20 bg-white/[0.06] rounded-full" />
        </div>
      </div>

      {/* Bismillah skeleton */}
      <div className="py-10 flex justify-center">
        <div className="h-10 w-80 bg-white/[0.06] rounded-xl" />
      </div>

      {/* Ayah skeletons */}
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-8 w-8 bg-white/[0.08] rounded-lg" />
              <div className="h-8 w-8 bg-white/[0.06] rounded-full" />
            </div>
            <div className="h-8 w-full bg-white/[0.06] rounded-lg" />
            <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
