import Skeleton from "./Skeleton";

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800"
        >
          <Skeleton className="h-10 w-10 rounded-xl mb-4" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-40" />
        </div>
      ))}
    </div>
  );
}

export default StatsGridSkeleton;
