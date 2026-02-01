import Expenses from "./Expenses";
import Analytics from "./Analytics";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Overview of your expenses and analytics.
          </p>
        </div>
        <Expenses />
        <Analytics />
      </div>
    </div>
  );
}