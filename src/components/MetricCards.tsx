import React from 'react';
import {
  PiggyBank,
  Calendar,
  CalendarRange,
  CalendarDays,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import type { FinancialMetrics, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MetricCardsProps {
  metrics: FinancialMetrics;
  currency: CurrencyCode;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, currency }) => {
  const isSurplus = metrics.netLiquidity >= 0;
  const weeklyDailyAvg = metrics.weeklyExpenses > 0 ? metrics.weeklyExpenses / 7 : 0;
  const monthlyDailyAvg = metrics.monthlyExpenses > 0 ? metrics.monthlyExpenses / 30 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {/* 1. NET SAVINGS / IPON */}
      <div className="bg-canvas rounded-xl p-6 border border-hairline hover:shadow-soft-drop transition-shadow flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-wider uppercase bg-surface-strong text-ink border border-hairline">
              <PiggyBank className="w-3.5 h-3.5 text-primary" /> Total Ipon
            </span>
            <p className="text-xs text-muted mt-2 font-normal">Accumulated Savings</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-primary">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-2xl sm:text-3xl font-medium tracking-tight font-mono text-ink">
            {formatCurrency(metrics.totalSavings, currency)}
          </div>
          <div className="mt-2.5 flex items-center text-xs">
            <span className="inline-flex items-center gap-1 font-mono font-medium text-semantic-up">
              <ArrowUpRight className="w-3.5 h-3.5" /> {metrics.savingsRate}%
            </span>
            <span className="ml-2 text-muted">Savings Ratio</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S SPENDING */}
      <div className="bg-canvas rounded-xl p-6 border border-hairline hover:shadow-soft-drop transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-wider uppercase bg-surface-strong text-ink border border-hairline">
              <Calendar className="w-3.5 h-3.5 text-muted" /> Today
            </span>
            <p className="text-xs text-muted mt-2 font-normal">Past 24h Spending</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-muted">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-2xl sm:text-3xl font-medium tracking-tight font-mono text-ink">
            {formatCurrency(metrics.todayExpenses, currency)}
          </div>
          <div className="mt-2.5 text-xs">
            <span className={`font-mono font-medium ${metrics.todayExpenses > 0 ? 'text-semantic-down' : 'text-muted'}`}>
              {metrics.todayExpenses > 0 ? 'Active logging' : 'Zero spending today'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. WEEKLY SPENDING (PAST 7 DAYS) */}
      <div className="bg-canvas rounded-xl p-6 border border-hairline hover:shadow-soft-drop transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-wider uppercase bg-surface-strong text-ink border border-hairline">
              <CalendarRange className="w-3.5 h-3.5 text-muted" /> Past 7 Days
            </span>
            <p className="text-xs text-muted mt-2 font-normal">Weekly Spending</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-muted">
            <CalendarRange className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-2xl sm:text-3xl font-medium tracking-tight font-mono text-ink">
            {formatCurrency(metrics.weeklyExpenses, currency)}
          </div>
          <div className="mt-2.5 text-xs text-muted">
            Avg: <span className="font-mono font-medium text-ink">{formatCurrency(weeklyDailyAvg, currency)}</span>/day
          </div>
        </div>
      </div>

      {/* 4. MONTHLY SPENDING (PAST 30 DAYS) */}
      <div className="bg-canvas rounded-xl p-6 border border-hairline hover:shadow-soft-drop transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-wider uppercase bg-surface-strong text-ink border border-hairline">
              <CalendarDays className="w-3.5 h-3.5 text-muted" /> Past 30 Days
            </span>
            <p className="text-xs text-muted mt-2 font-normal">Monthly Spending</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-muted">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-2xl sm:text-3xl font-medium tracking-tight font-mono text-ink">
            {formatCurrency(metrics.monthlyExpenses, currency)}
          </div>
          <div className="mt-2.5 text-xs text-muted">
            Avg: <span className="font-mono font-medium text-ink">{formatCurrency(monthlyDailyAvg, currency)}</span>/day
          </div>
        </div>
      </div>

      {/* 5. REMAINING BUDGET / LIQUIDITY INDICATOR */}
      <div className="bg-canvas rounded-xl p-6 border border-hairline hover:shadow-soft-drop transition-shadow flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-wider uppercase bg-surface-strong text-ink border border-hairline">
              <Scale className="w-3.5 h-3.5 text-muted" /> Cash Flow
            </span>
            <p className="text-xs text-muted mt-2 font-normal">Net Savings vs Expenses</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center">
            {isSurplus ? (
              <ShieldCheck className="w-4 h-4 text-semantic-up" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-semantic-down" />
            )}
          </div>
        </div>

        <div className="mt-5">
          <div
            className={`text-2xl sm:text-3xl font-medium tracking-tight font-mono ${
              isSurplus ? 'text-semantic-up' : 'text-semantic-down'
            }`}
          >
            {isSurplus ? '+' : ''}
            {formatCurrency(metrics.netLiquidity, currency)}
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-xs">
            <span
              className={`font-mono font-medium ${
                isSurplus ? 'text-semantic-up' : 'text-semantic-down'
              }`}
            >
              {isSurplus ? '● Net Surplus' : '● Deficit Outflow'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
