import { useState } from "react";
import api from "../services/api";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner"; 
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { getUserId } from "../utils/auth";

export default function ExpenseList({ expenses, role, onAction, isManagerView = false, showUserColumn = false, sortConfig, onSort }) {
  const [selected, setSelected] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const currentUserId = getUserId();
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(10); // increased default

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  
  // Helper for Sort Icons
  const SortIcon = ({ field }) => {
      if (!sortConfig || sortConfig.sortBy !== field) return <ChevronsUpDown className="w-4 h-4 text-slate-400 opacity-50" />;
      return sortConfig.order === 'asc' 
        ? <ArrowUp className="w-4 h-4 text-indigo-600" /> 
        : <ArrowDown className="w-4 h-4 text-indigo-600" />;
  };

  const SortHeader = ({ field, label, align = 'left' }) => (
      <th 
        className={`px-6 py-4 text-${align} text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none`}
        onClick={() => onSort && onSort(field)}
      >
          <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
              {label}
              <SortIcon field={field} />
          </div>
      </th>
  );

  const toggleSelectAll = () => {
    const selectableVisibleIds = visibleExpenses
      .filter((e) => e.status === "PENDING" && e.user_id !== currentUserId)
      .map((e) => e.id);

    const allVisibleAreSelected =
      selectableVisibleIds.length > 0 &&
      selectableVisibleIds.every((id) => selected.includes(id));

    if (allVisibleAreSelected) {
      // Unselect all visible selectable items
      setSelected((prev) => prev.filter((id) => !selectableVisibleIds.includes(id)));
    } else {
      // Select all visible selectable items, avoiding duplicates
      setSelected((prev) => [...new Set([...prev, ...selectableVisibleIds])]);
    }
  };

  const handleBulkAction = async (action) => {
    const actionName = action === 'approve' ? 'Approve' : 'Reject';
    if(!confirm(`${actionName} ${selected.length} expenses?`)) return;

    let conflicts = 0;
    let errors = 0;

    await Promise.all(selected.map(async (id) => {
        const expense = expenses.find(e => e.id === id);
        if (!expense) return;

        try {
            await api.patch(`/expenses/${id}/${action}`, { expectedAmount: expense.amount });
        } catch (e) {
            if (e.response && e.response.status === 409) {
                conflicts++;
            } else {
                errors++;
            }
        }
    }));

    if (conflicts > 0) {
        toast.error(`${conflicts} expense(s) modified by others! Refreshing...`);
    } else if (errors > 0) {
        toast.error(`Failed to process ${errors} expenses.`);
    } else {
        toast.success(`Expenses ${action}d successfully`);
    }

    setSelected([]);
    onAction();
  };

  const bulkApprove = () => handleBulkAction('approve');
  const bulkReject = () => handleBulkAction('reject');

  // --- Individual Actions ---
  const startEdit = (expense) => { setEditingId(expense.id); setEditAmount(expense.amount); };
  const cancelEdit = () => { setEditingId(null); setEditAmount(""); };
  const saveEdit = async (id) => {
    try {
        await api.put(`/expenses/${id}`, { amount: Number(editAmount) });
        toast.success("Expense updated.");
        setEditingId(null);
        onAction();
    } catch (e) {
        if (e.response && e.response.status === 409) {
            toast.error(e.response.data.error || "Action failed due to status change", { duration: 4000 });
            setEditingId(null);
            onAction(); // Auto-refresh to show real status
        } else {
            toast.error("Failed to update expense.");
        }
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
        await api.delete(`/expenses/${id}`);
        toast.success("Expense deleted.");
        onAction();
    } catch (e) {
        if (e.response && e.response.status === 409) {
            toast.error(e.response.data.error || "Action failed due to status change", { duration: 4000 });
            onAction(); // Auto-refresh to show real status
        } else {
            toast.error("Failed to delete expense.");
        }
    }
  };
  // -------------------------------------

  const handleShowMore = () => setVisibleCount(prev => prev + 5);

  // Get visible slice
  const visibleExpenses = expenses.slice(0, visibleCount);

  // Derived state for the "Select All" checkbox
  const selectableVisibleIds = visibleExpenses
    .filter((e) => e.status === "PENDING" && e.user_id !== currentUserId)
    .map((e) => e.id);
  
  const areAllSelected =
    selectableVisibleIds.length > 0 &&
    selectableVisibleIds.every((id) => selected.includes(id));

  const areSomeSelected = selectableVisibleIds.some((id) => selected.includes(id));


  if (expenses.length === 0) {
    return (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No expenses found matching your filters.</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300">
      
      {/* BULK ACTION BAR - Only for Managers in Approval View */}
      {isManagerView && selected.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 flex items-center justify-between border-b border-indigo-100 dark:border-indigo-800 animate-in slide-in-from-top-2">
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            {selected.length} selected
          </span>
          <div className="flex gap-3">
            <button onClick={bulkApprove} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors">
              Approve
            </button>
            <button onClick={bulkReject} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              {/* Checkbox Column - Only for Managers in Approval View */}
              {isManagerView && (
                <th className="px-6 py-4 w-12">
                   <input 
                    type="checkbox" 
                    onChange={toggleSelectAll}
                    checked={areAllSelected}
                    ref={el => el && (el.indeterminate = areSomeSelected && !areAllSelected)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                   />
                </th>
              )}

              {/* Requester Column - Only if showing team data */}
              {showUserColumn && (
                 <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested By</th>
              )}

              <SortHeader field="category" label="Category" />
              <SortHeader field="amount" label="Amount" />
              <SortHeader field="status" label="Status" />
              <SortHeader field="date" label="Date" />
              
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {visibleExpenses.map(e => (
              <tr key={e.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selected.includes(e.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                
                {/* Checkbox */}
                {isManagerView && (
                  <td className="px-6 py-4">
                    {e.status === 'PENDING' && e.user_id !== currentUserId && (
                        <input
                        type="checkbox"
                        checked={selected.includes(e.id)}
                        onChange={() => toggleSelect(e.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                    )}
                  </td>
                )}

                {/* Requester Name/Email */}
                {showUserColumn && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                     <div className="flex flex-col">
                        <span className="font-medium">{e.employee_email ? e.employee_email.split('@')[0] : 'Unknown'}</span>
                        <span className="text-xs text-slate-500">{e.employee_email}</span>
                     </div>
                  </td>
                )}

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
                    {e.category}
                </td>
                
                {/* Editable Amount - Only editable if NOT manager view (meaning it is personal) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                  {editingId === e.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    `₹${e.amount}`
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={e.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(e.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* EDIT MODE ACTIONS */}
                  {editingId === e.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => saveEdit(e.id)} className="text-indigo-600 hover:text-indigo-800 font-medium">Save</button>
                        <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700">Cancel</button>
                      </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                        {/* Personal Actions (Employee & Manager) */}
                        {!isManagerView && (role === 'EMPLOYEE' || role === 'MANAGER') && e.status === "PENDING" && (
                          <>
                            <button onClick={() => startEdit(e)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                            <button onClick={() => handleDelete(e.id)} className="text-rose-600 hover:text-rose-800">Delete</button>
                          </>
                        )}

                        {/* APPROVAL ACTIONS (Managers) */}
                        {isManagerView && e.status === "PENDING" && e.user_id !== currentUserId && !selected.includes(e.id) && (
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => api.patch(`/expenses/${e.id}/approve`, { expectedAmount: e.amount }).then(onAction).catch(e => toast.error(e.response?.status === 409 ? "Expense modified, refreshing..." : "Failed"))}
                                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => api.patch(`/expenses/${e.id}/reject`, { expectedAmount: e.amount }).then(onAction).catch(e => toast.error(e.response?.status === 409 ? "Expense modified, refreshing..." : "Failed"))}
                                  className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-200"
                                >
                                  Reject
                                </button>
                            </div>
                        )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden">
        {isManagerView && (
           <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
               <input 
                  type="checkbox" 
                  onChange={toggleSelectAll}
                  checked={areAllSelected}
                  ref={el => el && (el.indeterminate = areSomeSelected && !areAllSelected)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
               />
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select All on Page</span>
           </div>
        )}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {visibleExpenses.map(e => (
             <div key={e.id} className={`p-4 space-y-4 ${selected.includes(e.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        {/* Checkbox inside card */}
                        {isManagerView && e.status === "PENDING" && e.user_id !== currentUserId && (
                            <input
                              type="checkbox"
                              checked={selected.includes(e.id)}
                              onChange={() => toggleSelect(e.id)}
                              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                        )}
                        <div>
                             <div className="font-medium text-slate-900 dark:text-white">{e.category}</div>
                             <div className="text-xs text-slate-500">{new Date(e.created_at).toLocaleDateString()}</div>
                             {showUserColumn && (
                                <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                                   by {e.employee_email ? e.employee_email.split('@')[0] : 'Unknown'}
                                </div>
                             )}
                        </div>
                    </div>
                    <div className="text-right">
                       {editingId === e.id ? (
                           <input
                             type="number"
                             value={editAmount}
                             onChange={(e) => setEditAmount(e.target.value)}
                             className="w-20 px-1 py-0.5 text-right text-sm border border-indigo-300 rounded"
                           />
                       ) : (
                           <div className="font-mono font-semibold text-slate-900 dark:text-white">₹{e.amount}</div>
                       )}
                       <div className="mt-1"><StatusBadge status={e.status} /></div>
                    </div>
                 </div>

                 {/* Mobile Actions Toolbar */}
                 {editingId === e.id ? (
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => saveEdit(e.id)} className="text-sm font-medium text-indigo-600">Save</button>
                        <button onClick={cancelEdit} className="text-sm font-medium text-slate-500">Cancel</button>
                      </div>
                 ) : (
                    <div className="flex justify-end gap-3 pt-2">
                       {/* Manager Actions */}
                       {isManagerView && e.status === "PENDING" && e.user_id !== currentUserId && !selected.includes(e.id) && (
                          <>
                             <button
                               onClick={() => api.patch(`/expenses/${e.id}/reject`, { expectedAmount: e.amount }).then(onAction)}
                               className="text-sm font-medium text-rose-600 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg"
                             >Reject</button>
                             <button
                               onClick={() => api.patch(`/expenses/${e.id}/approve`, { expectedAmount: e.amount }).then(onAction)}
                               className="text-sm font-medium text-emerald-600 border border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded-lg"
                             >Approve</button>
                          </>
                       )}

                       {/* Personal Actions (Employee & Manager) */}
                       {!isManagerView && (role === 'EMPLOYEE' || role === 'MANAGER') && e.status === "PENDING" && (
                          <>
                            <button onClick={() => handleDelete(e.id)} className="text-sm text-rose-600">Delete</button>
                            <button onClick={() => startEdit(e)} className="text-sm text-indigo-600 font-medium">Edit</button>
                          </>
                       )}
                    </div>
                 )}
             </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      {visibleCount < expenses.length && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 p-3 text-center">
            <button 
                onClick={handleShowMore}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 transition-colors"
            >
                Show More ({expenses.length - visibleCount} remaining)
            </button>
        </div>
      )}
    </div>
  );
}