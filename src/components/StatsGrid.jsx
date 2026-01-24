import { Wallet, CreditCard, TrendingUp, LayoutDashboard } from "lucide-react";
import { formatCurrency } from "../utils/format";

const ACCENT_STYLES = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
  },
};

function StatCard({ title, value, icon: Icon, accent, subtitle }) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${styles.bg}`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {title}
        </p>
      </div>

      <h2 className="text-3xl font-bold tracking-tight">
        {value}
      </h2>

      <p className="text-xs text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

function StatsGrid({ total, monthly, categoryCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Balance"
        value={formatCurrency(total)}
        icon={Wallet}
        accent="indigo"
        subtitle="Lifetime expenditure"
      />

      <StatCard
        title="This Month"
        value={formatCurrency(monthly)}
        icon={CreditCard}
        accent="emerald"
        subtitle="Current billing cycle"
      />

      <StatCard
        title="Active Categories"
        value={categoryCount}
        icon={LayoutDashboard}
        accent="amber"
        subtitle="Diversified spending"
      />
    </div>
  );
}

export default StatsGrid;
