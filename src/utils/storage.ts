import type { Transaction, SavingsGoal, CurrencyCode } from '../types';

const KEYS = {
  TRANSACTIONS: 'piggyvault_v2_transactions',
  GOALS: 'piggyvault_v2_goals',
  CURRENCY: 'piggyvault_v2_currency',
  THEME: 'piggyvault_v2_theme',
};

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    if (!raw) {
      // First time initialization: clean fresh start
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage:', err);
  }
}

export function loadSavingsGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(KEYS.GOALS);
    if (!raw) {
      localStorage.setItem(KEYS.GOALS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load savings goals from localStorage:', err);
    return [];
  }
}

export function saveSavingsGoals(goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save savings goals to localStorage:', err);
  }
}

export function loadCurrency(): CurrencyCode {
  try {
    const raw = localStorage.getItem(KEYS.CURRENCY) as CurrencyCode;
    if (raw && ['PHP', 'USD', 'EUR', 'GBP', 'JPY', 'SGD'].includes(raw)) {
      return raw;
    }
  } catch {
    // fallback
  }
  return 'PHP';
}

export function saveCurrency(currency: CurrencyCode): void {
  try {
    localStorage.setItem(KEYS.CURRENCY, currency);
  } catch (err) {
    console.error('Failed to save currency setting:', err);
  }
}

export function resetToDefaults(): { transactions: Transaction[]; goals: SavingsGoal[] } {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.GOALS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
  return {
    transactions: [],
    goals: [],
  };
}

export function clearAllData(): { transactions: Transaction[]; goals: SavingsGoal[] } {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.GOALS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  return { transactions: [], goals: [] };
}

/**
 * Export data as JSON file download
 */
export function exportToJSON(transactions: Transaction[], goals: SavingsGoal[]): void {
  const data = {
    app: 'PiggyVault',
    exportedAt: new Date().toISOString(),
    transactions,
    goals,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `piggyvault-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to CSV format
 */
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Type', 'Title', 'Amount', 'Category', 'Destination/Where', 'Timestamp', 'Notes'];
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.type}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.destination || '').replace(/"/g, '""')}"`,
    `"${t.timestamp}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `piggyvault-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
