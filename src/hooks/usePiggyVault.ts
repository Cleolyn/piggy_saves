import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type {
  Transaction,
  SavingsGoal,
  FilterState,
  CurrencyCode,
  ToastMessage,
} from '../types';
import {
  loadTransactions,
  saveTransactions,
  loadSavingsGoals,
  saveSavingsGoals,
  loadCurrency,
  saveCurrency,
  resetToDefaults,
  clearAllData,
} from '../utils/storage';
import {
  calculateAllMetrics,
  getExpenseCategoryBreakdown,
  getDailyTrends,
} from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_FILTER: FilterState = {
  searchQuery: '',
  type: 'ALL',
  category: 'ALL',
  timeRange: 'ALL',
  sortBy: 'date-desc',
};

export function usePiggyVault() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => loadSavingsGoals());
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => loadCurrency());
  const [filter, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync transactions to localStorage on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Sync goals to localStorage on change
  useEffect(() => {
    saveSavingsGoals(savingsGoals);
  }, [savingsGoals]);

  // Currency changer
  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    saveCurrency(code);
  }, []);

  // Filter updater supporting partial updates
  const setFilter = useCallback((partial: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...partial }));
  }, []);

  // Toast notification system
  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Micro-interaction: Confetti trigger for savings deposits
  const triggerSavingsConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#f43f5e', '#fbbf24', '#60a5fa'],
      });
    } catch {
      // safe fallback if confetti fails
    }
  }, []);

  // Add transaction
  const addTransaction = useCallback(
    (input: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = {
        ...input,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        amount: Math.abs(Number(input.amount) || 0),
        timestamp: input.timestamp || new Date().toISOString(),
      };

      setTransactions((prev) => [newTx, ...prev]);

      // If it's a savings deposit, check if it matches any goal and celebrate
      if (newTx.type === 'SAVINGS') {
        triggerSavingsConfetti();
        showToast(
          `🐖 Yay! Added ${formatCurrency(newTx.amount, currency)} to Piggy Savings!`,
          'success'
        );

        // Auto-credit savings goal if matching category or note
        if (newTx.category) {
          setSavingsGoals((prevGoals) =>
            prevGoals.map((goal) => {
              if (
                goal.title.toLowerCase().includes(newTx.category.toLowerCase()) ||
                newTx.title.toLowerCase().includes(goal.title.toLowerCase())
              ) {
                return {
                  ...goal,
                  currentAmount: goal.currentAmount + newTx.amount,
                };
              }
              return goal;
            })
          );
        }
      } else {
        showToast(
          `Logged expense: ${newTx.title} (${formatCurrency(newTx.amount, currency)})`,
          'info'
        );
      }

      return newTx;
    },
    [currency, showToast, triggerSavingsConfetti]
  );

  // Update transaction
  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated = {
              ...t,
              ...updates,
              amount: updates.amount !== undefined ? Math.abs(Number(updates.amount) || 0) : t.amount,
            };
            return updated;
          }
          return t;
        })
      );
      showToast('Transaction successfully updated!', 'success');
    },
    [showToast]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    (id: string) => {
      const target = transactions.find((t) => t.id === id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast(
        `Deleted ${target ? target.title : 'entry'} (${target ? formatCurrency(target.amount, currency) : ''})`,
        'warning'
      );
    },
    [transactions, currency, showToast]
  );

  // Savings Goal Actions
  const addSavingsGoal = useCallback(
    (goalInput: Omit<SavingsGoal, 'id'>) => {
      const newGoal: SavingsGoal = {
        ...goalInput,
        id: `goal-${Date.now()}`,
        targetAmount: Math.max(1, Number(goalInput.targetAmount) || 0),
        currentAmount: Math.max(0, Number(goalInput.currentAmount) || 0),
      };
      setSavingsGoals((prev) => [...prev, newGoal]);
      showToast(`🎯 Created savings goal: "${newGoal.title}"`, 'success');
    },
    [showToast]
  );

  const updateSavingsGoal = useCallback(
    (id: string, updates: Partial<SavingsGoal>) => {
      setSavingsGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
      );
      showToast('Savings goal updated', 'success');
    },
    [showToast]
  );

  const deleteSavingsGoal = useCallback(
    (id: string) => {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      showToast('Savings goal removed', 'info');
    },
    [showToast]
  );

  // Reset & Clear data
  const handleResetData = useCallback(() => {
    const res = resetToDefaults();
    setTransactions(res.transactions);
    setSavingsGoals(res.goals);
    showToast('Dashboard restored to default sample data', 'info');
  }, [showToast]);

  const handleClearData = useCallback(() => {
    const res = clearAllData();
    setTransactions(res.transactions);
    setSavingsGoals(res.goals);
    showToast('All transaction records and goals cleared', 'warning');
  }, [showToast]);

  // Dynamic calculations
  const metrics = useMemo(() => {
    return calculateAllMetrics(transactions);
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    return getExpenseCategoryBreakdown(transactions);
  }, [transactions]);

  const dailyTrends = useMemo(() => {
    return getDailyTrends(transactions, 7);
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    return transactions.filter((t) => {
      // Type filter
      if (filter.type !== 'ALL' && t.type !== filter.type) {
        return false;
      }

      // Category filter
      if (filter.category !== 'ALL' && t.category !== filter.category) {
        return false;
      }

      // Time range filter
      const tDate = new Date(t.timestamp);
      if (filter.timeRange === 'TODAY' && tDate < startOfToday) {
        return false;
      }
      if (filter.timeRange === 'WEEK' && tDate < startOfWeek) {
        return false;
      }
      if (filter.timeRange === 'MONTH' && tDate < startOfMonth) {
        return false;
      }
      if (filter.timeRange === 'CUSTOM') {
        if (filter.startDate) {
          const s = new Date(filter.startDate);
          s.setHours(0, 0, 0, 0);
          if (tDate < s) return false;
        }
        if (filter.endDate) {
          const e = new Date(filter.endDate);
          e.setHours(23, 59, 59, 999);
          if (tDate > e) return false;
        }
      }

      // Search query (matches title, category, destination, notes)
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesTitle = t.title?.toLowerCase().includes(query);
        const matchesCategory = t.category?.toLowerCase().includes(query);
        const matchesDestination = t.destination?.toLowerCase().includes(query);
        const matchesNotes = t.notes?.toLowerCase().includes(query);
        const matchesAmount = t.amount.toString().includes(query);

        if (!matchesTitle && !matchesCategory && !matchesDestination && !matchesNotes && !matchesAmount) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'date-desc') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (filter.sortBy === 'date-asc') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (filter.sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (filter.sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      if (filter.sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });
  }, [transactions, filter]);

  return {
    transactions,
    savingsGoals,
    currency,
    setCurrency,
    filter,
    setFilter,
    filteredTransactions,
    metrics,
    categoryBreakdown,
    dailyTrends,
    toasts,
    showToast,
    removeToast,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    resetToDefaults: handleResetData,
    clearAllData: handleClearData,
  };
}
