export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black px-6 pt-32 pb-16">
      {/* Title skeleton */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="relative bg-white/5 rounded-lg overflow-hidden animate-pulse"
            style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
