import { Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/format";

function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">
          View All
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px] space-y-4 pr-2 custom-scrollbar">
        {expenses.length === 0 && (
          <p className="text-center text-slate-500 py-10">
            No expenses recorded yet.
          </p>
        )}

        {expenses.map((e) => (
          <div
            key={e.id}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                <span className="text-sm font-bold">
                  {e.category.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0">
                <p className="font-medium truncate">
                  {e.category}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-semibold whitespace-nowrap">
                {formatCurrency(e.amount)}
              </span>

              {/* Mobile always visible, desktop on hover */}
              <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(e)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(e.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;
