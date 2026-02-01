import { useEffect, useState } from "react";
import api from "../services/api";
import { getUserRole } from "../utils/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

// Professional Palette for the Pie Chart
const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Rose
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

export default function Analytics() {
  const [total, setTotal] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = getUserRole();

  useEffect(() => {
    const promises = [
      api.get("/analytics/total"),
      api.get("/analytics/current-month"),
      api.get("/analytics/monthly"),
      api.get("/analytics/category"),
    ];

    if (role === 'MANAGER') {
        promises.push(api.get("/analytics/stats"));
    }

    Promise.all(promises)
      .then((results) => {
        setTotal(results[0].data.totalExpense);
        setMonthly(results[1].data.monthlyExpense);
        setTrend(results[2].data.data);
        setCategories(results[3].data.categories);
        if (role === 'MANAGER' && results[4]) {
            setStats(results[4].data);
        }
      })
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  // Calculate Rates for Manager
  const approvalRate = stats ? Math.round((Number(stats.approved) / Number(stats.total || 1)) * 100) : 0;
  const rejectionRate = stats ? Math.round((Number(stats.rejected) / Number(stats.total || 1)) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPI GRID */}
      <div className={`grid grid-cols-1 gap-6 ${role === 'MANAGER' ? 'md:grid-cols-4' : 'md:grid-cols-2'}`}>
        
        {/* Total Expense KPI */}
        <KPI 
          title={role === 'MANAGER' ? "Team Total Expenses" : "Total Approved Expense"} 
          value={total} 
          isCurrency
          icon={
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          }
        />
        
        {/* Monthly Expense KPI */}
        <KPI 
          title={role === 'MANAGER' ? "Team Monthly Spend" : "Current Month Expense"} 
          value={monthly} 
          isCurrency
          icon={
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          }
        />

        {/* Manager Specific KPIs */}
        {role === 'MANAGER' && stats && (
            <>
                <KPI 
                    title="Approval Rate" 
                    value={`${approvalRate}%`}
                    subValue={`${stats.approved} / ${stats.total} Requests`}
                    icon={
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </div>
                    }
                />
                 <KPI 
                    title="Rejection Rate" 
                    value={`${rejectionRate}%`}
                    subValue={`${stats.rejected} Rejected`}
                    icon={
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </div>
                    }
                />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MONTHLY TREND */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {role === 'MANAGER' ? "Team Spending Trend" : "Monthly Trends"}
             </h3>
             <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                Last 12 Months
             </span>
          </div>

          {trend.length === 0 ? (
            <Empty />
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Expense"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalExpense"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CATEGORY PIE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ring-1 ring-slate-900/5">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">
            Category Breakdown
          </h3>

          {categories.length === 0 ? (
            <Empty />
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="totalExpense"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                     formatter={(value) => `₹${Number(value).toLocaleString()}`}
                     contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function KPI({ title, value, icon, subValue, isCurrency }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg ring-1 ring-slate-900/5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
          {isCurrency ? `₹${Number(value).toLocaleString()}` : value}
        </p>
        {subValue && (
            <p className="text-xs font-semibold text-slate-400 mt-1">{subValue}</p>
        )}
      </div>
      {icon}
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
       <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
       </svg>
      <p className="text-sm">No data available yet</p>
    </div>
  );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[350px] bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="h-[350px] bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
        </div>
    )
}