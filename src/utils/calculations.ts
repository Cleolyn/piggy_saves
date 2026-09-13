import type { Transaction, FinancialMetrics } from '../types';

/**
 * Helper to round to 2 decimal places to avoid floating point issues
 */
export function roundToCents(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates total accumulated savings (ipon)
 */
export function getTotalSavings(transactions: Transaction[]): number {
  const sum = transactions
    .filter((t) => t.type === 'SAVINGS')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  return roundToCents(sum);
}

/**
 * Calculates total all-time expenses
 */
export function getAllTimeExpenses(transactions: Transaction[]): number {
  const sum = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  return roundToCents(sum);
}

/**
 * Calculates expenses for "Today" (from midnight 00:00:00 of reference date to reference date / end of day)
 */
export function getTodayExpenses(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): number {
  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(referenceDate);
  endOfDay.setHours(23, 59, 59, 999);

  const sum = transactions
    .filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      const tDate = new Date(t.timestamp);
      return tDate >= startOfDay && tDate <= endOfDay;
    })
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return roundToCents(sum);
}

/**
 * Calculates expenses for the rolling past 24 hours
 */
export function getPast24HoursExpenses(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): number {
  const cutoffTime = referenceDate.getTime() - 24 * 60 * 60 * 1000;
  const maxTime = referenceDate.getTime();

  const sum = transactions
    .filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      const tTime = new Date(t.timestamp).getTime();
      return tTime >= cutoffTime && tTime <= maxTime;
    })
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return roundToCents(sum);
}

/**
 * Calculates expenses for the past 7 days (rolling 7 days: referenceDate - 7 days to referenceDate)
 */
export function getWeeklyExpenses(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): number {
  // Start 7 days ago at 00:00:00 to include full week of data
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(referenceDate);
  endOfWeek.setHours(23, 59, 59, 999);

  const sum = transactions
    .filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      const tDate = new Date(t.timestamp);
      return tDate >= startOfWeek && tDate <= endOfWeek;
    })
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return roundToCents(sum);
}

/**
 * Calculates expenses for the past 30 days (rolling 30 days)
 */
export function getMonthlyExpenses(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): number {
  // 30 days including today
  const startOfMonth = new Date(referenceDate);
  startOfMonth.setDate(referenceDate.getDate() - 29);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(referenceDate);
  endOfMonth.setHours(23, 59, 59, 999);

  const sum = transactions
    .filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      const tDate = new Date(t.timestamp);
      return tDate >= startOfMonth && tDate <= endOfMonth;
    })
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return roundToCents(sum);
}

/**
 * Calculates expenses for the current calendar month (1st of month to end of month)
 */
export function getCurrentCalendarMonthExpenses(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): number {
  const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const sum = transactions
    .filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      const tDate = new Date(t.timestamp);
      return tDate >= startOfMonth && tDate <= endOfMonth;
    })
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return roundToCents(sum);
}

/**
 * Comprehensive metric calculations
 */
export function calculateAllMetrics(
  transactions: Transaction[],
  referenceDate: Date = new Date()
): FinancialMetrics {
  const totalSavings = getTotalSavings(transactions);
  const todayExpenses = getTodayExpenses(transactions, referenceDate);
  const weeklyExpenses = getWeeklyExpenses(transactions, referenceDate);
  const monthlyExpenses = getMonthlyExpenses(transactions, referenceDate);
  const allTimeExpenses = getAllTimeExpenses(transactions);

  const netLiquidity = roundToCents(totalSavings - allTimeExpenses);
  const totalCashFlow = totalSavings + allTimeExpenses;
  const savingsRate = totalCashFlow > 0 ? roundToCents((totalSavings / totalCashFlow) * 100) : 0;

  return {
    totalSavings,
    todayExpenses,
    weeklyExpenses,
    monthlyExpenses,
    allTimeExpenses,
    netLiquidity,
    savingsRate,
  };
}

/**
 * Breakdown of expenses by category with percentages
 */
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export function getExpenseCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');
  const total = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const map = new Map<string, { amount: number; count: number }>();

  for (const exp of expenses) {
    const cat = exp.category?.trim() || 'Uncategorized';
    const current = map.get(cat) || { amount: 0, count: 0 };
    map.set(cat, {
      amount: current.amount + (Number(exp.amount) || 0),
      count: current.count + 1,
    });
  }

  const breakdown: CategoryBreakdown[] = [];
  map.forEach((value, category) => {
    breakdown.push({
      category,
      amount: roundToCents(value.amount),
      percentage: total > 0 ? roundToCents((value.amount / total) * 100) : 0,
      count: value.count,
    });
  });

  return breakdown.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate spending trend over past N days
 */
export interface DaySpending {
  dateStr: string;
  label: string;
  expenseAmount: number;
  savingsAmount: number;
}

export function getDailyTrends(
  transactions: Transaction[],
  days: number = 7,
  referenceDate: Date = new Date()
): DaySpending[] {
  const result: DaySpending[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setHours(23, 59, 59, 999);

    const dayExpenses = transactions
      .filter((t) => {
        if (t.type !== 'EXPENSE') return false;
        const time = new Date(t.timestamp).getTime();
        return time >= d.getTime() && time <= nextD.getTime();
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const daySavings = transactions
      .filter((t) => {
        if (t.type !== 'SAVINGS') return false;
        const time = new Date(t.timestamp).getTime();
        return time >= d.getTime() && time <= nextD.getTime();
      })
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const label = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : d.toLocaleDateString([], { weekday: 'short' });

    result.push({
      dateStr: d.toISOString().split('T')[0],
      label,
      expenseAmount: roundToCents(dayExpenses),
      savingsAmount: roundToCents(daySavings),
    });
  }

  return result;
}
