export default function StatusBadge({ status }) {
    const styles = {
      PENDING: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
      APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
      REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
    };
  
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  }