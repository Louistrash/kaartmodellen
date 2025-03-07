export function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="space-y-4 mt-6">
        <div className="h-64 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-40 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
