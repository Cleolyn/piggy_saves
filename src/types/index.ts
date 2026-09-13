export type TransactionType = 'EXPENSE' | 'SAVINGS';
export type MainView = 'dashboard' | 'expense' | 'savings' | 'goals' | 'settings';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  destination: string; // Where/how money was spent or saved (e.g. "Jollibee", "Maya Savings", "Shopee")
  timestamp: string;   // ISO 8601 string (e.g., "2026-09-13T18:04:00.000Z")
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  targetDate?: string;
  color?: string;
}

export interface FinancialMetrics {
  totalSavings: number;
  todayExpenses: number;
  weeklyExpenses: number;
  monthlyExpenses: number;
  allTimeExpenses: number;
  netLiquidity: number; // totalSavings - allTimeExpenses or cash flow balance
  savingsRate: number;  // savings / (savings + expenses) * 100
}

export interface FilterState {
  searchQuery: string;
  type: 'ALL' | 'EXPENSE' | 'SAVINGS';
  category: string;
  timeRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM';
  startDate?: string;
  endDate?: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'title-asc';
}

export type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
