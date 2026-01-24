import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

// Chart colors (static, safe for Tailwind)
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {payload[0].name}
        </p>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
          ₹ {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

function SpendingChart({ categories }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <h3 className="text-lg font-bold mb-6">
        Spending Analysis
      </h3>

      <div className="h-[300px] w-full">
        {categories.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="total"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                cornerRadius={5}
              >
                {categories.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>

              <RechartsTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-slate-600 dark:text-slate-300 ml-1">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <PieIcon className="w-12 h-12 mb-2 opacity-20" />
            <p>No data to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpendingChart;
