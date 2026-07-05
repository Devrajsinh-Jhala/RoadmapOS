export default function AppLoading() {
  return (
    <div className="grid gap-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-lg border border-neutral-200 bg-white"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border border-neutral-200 bg-white" />
    </div>
  );
}
