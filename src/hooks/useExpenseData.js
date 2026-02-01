import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useExpenseData(role, activeTab) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consolidated Filter State
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    search: "",
  });

  // Sort State
  const [sortConfig, setSortConfig] = useState({
    sortBy: "date",
    order: "desc",
  });

  // Setter for individual filters
  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { sortBy: field, order: "desc" };
    });
  };

  const fetchExpenses = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = { 
        ...filters, 
        ...sortConfig 
      };

      // Configure View & Status based on Tab logic
      if (activeTab === "personal") {
        params.view = "personal";
        // If filters.status is set, use it.
      } else {
        // Shared logic for Manager Team View
        params.view = "team";
        
        if (activeTab === "approvals") {
          params.status = "PENDING";
        } else if (activeTab === "history") {
          // If no specific status filter is selected, default to showing processed items
          if (!filters.status) {
             params.status = "APPROVED"; 
          }
        }
      }

      const res = await api.get("/expenses", { params });
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [activeTab, filters, sortConfig]);

  // Initial Fetch & Debounce on Filter Change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  // Polling Logic
  useEffect(() => {
    let interval;
    // Auto-refresh for "Actionable" tabs (Managers approving things)
    const isActionableTab = activeTab === "approvals" && (role === "MANAGER");

    if (isActionableTab) {
        interval = setInterval(() => fetchExpenses(true), 10000);
    } else if (activeTab === "personal") {
        interval = setInterval(() => fetchExpenses(true), 15000);
    }
    return () => clearInterval(interval);
  }, [role, activeTab, fetchExpenses]);

  return {
    expenses,
    loading,
    filters,
    setFilter,
    sortConfig,
    handleSort,
    refresh: () => fetchExpenses(true),
    // Helper to reset filters when switching tabs, if needed
    resetFilters: () => setFilters({ status: "", from: "", to: "", search: "" }), 
  };
}
