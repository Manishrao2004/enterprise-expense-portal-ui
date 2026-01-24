import Skeleton from "./Skeleton";

function SpendingChartSkeleton() {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
      <Skeleton className="h-5 w-48 mb-6" />
      <div className="flex items-center justify-center h-[300px]">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>
    </div>
  );
}

export default SpendingChartSkeleton;
