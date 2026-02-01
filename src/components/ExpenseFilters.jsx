import Input from "./ui/Input";

export default function ExpenseFilters({
  status,
  setStatus,
  from,
  setFrom,
  to,
  setTo,
  search,
  setSearch,
  hideStatus = false
}) {
  const clearFilters = () => {
    setStatus("");
    setFrom("");
    setTo("");
    setSearch("");
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl
                 p-4 shadow-sm
                 border border-slate-200 dark:border-slate-700"
    >
      {/* FILTER BAR - Grid layout for better control over spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        {/* STATUS */}
        {!hideStatus && (
        <div className="w-full">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-11 rounded-xl
                       border border-slate-200 dark:border-slate-700
                       bg-slate-50 dark:bg-slate-900/50
                       px-4 text-sm
                       text-slate-700 dark:text-slate-200
                       focus:ring-2 focus:ring-indigo-500/20
                       focus:border-indigo-500
                       focus:outline-none
                       cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: `right 0.75rem center`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `1.25em 1.25em`,
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        )}

        {/* FROM */}
        <div className="w-full">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From Date"
          />
        </div>

        {/* TO */}
        <div className="w-full">
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To Date"
          />
        </div>

        {/* SEARCH */}
        <div className="hidden sm:block"></div> {/* Spacer on larger screens if needed, or remove */}
        <div className="w-full sm:col-span-2 lg:col-span-1">
             <div className="relative">
                <Input
                    type="text"
                    value={search || ''}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="pl-9"
                />
                <svg className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        {/* CLEAR BUTTON (Only shows if filters are active) */}
        <div className="flex justify-end sm:justify-start lg:justify-end">
            {(status || from || to || search) && (
            <button
                onClick={clearFilters}
                className="h-11 px-6 rounded-xl w-full sm:w-auto
                        flex items-center justify-center gap-2
                        text-sm font-medium
                        text-slate-500 hover:text-slate-700
                        dark:text-slate-400 dark:hover:text-slate-200
                        bg-slate-100 hover:bg-slate-200
                        dark:bg-slate-700/50 dark:hover:bg-slate-700
                        transition-colors"
            >
                <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
                </svg>
                Clear
            </button>
            )}
        </div>
      </div>
    </div>
  );
}