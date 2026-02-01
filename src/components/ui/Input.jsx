export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 
                  bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-sm
                  text-slate-900 dark:text-white placeholder:text-slate-400
                  focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none 
                  transition-all duration-200 ${className}`}
    />
  );
}