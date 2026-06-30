interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({
  rows = 4,
  className = '',
}: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-16 rounded-xl bg-bg-card border border-border-soft animate-pulse"
        />
      ))}
    </div>
  );
}

export function PodiumSkeleton() {
  return (
    <div className="flex items-end gap-4 max-w-2xl mx-auto mb-6">
      <div className="flex-1 h-28 rounded-t-lg bg-bg-card border border-border-soft animate-pulse" />
      <div className="flex-1 h-36 rounded-t-lg bg-bg-card border border-border-soft animate-pulse" />
      <div className="flex-1 h-24 rounded-t-lg bg-bg-card border border-border-soft animate-pulse" />
    </div>
  );
}
