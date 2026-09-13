import React from 'react';
import {
  PiggyBank,
  Calendar,
  CalendarRange,
  CalendarDays,
  Scale,
  ArrowUpRight,
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
      {/* 1. TOTAL IPON - Featured Hero Card on Mobile */}
      <div className="bg-gradient-to-br from-white to-rose-50/20 rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between col-span-2 sm:col-span-2 lg:col-span-1 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-primary" /> Total Ipon
          </span>
          <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3 inline" />
            {metrics.savingsRate}%
          </span>
        </div>

        <div className="mt-3 sm:mt-4">
          <div className="text-2xl sm:text-3xl font-medium tracking-tight font-mono text-slate-900">
            {formatCurrency(metrics.totalSavings, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1 font-normal">Accumulated Savings</p>
        </div>
      </div>

      {/* 2. TODAY'S SPENDING */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" /> Today
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">24h</span>
        </div>

        <div className="mt-2.5 sm:mt-4">
          <div className="text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight font-mono text-slate-900 truncate">
            {formatCurrency(metrics.todayExpenses, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-normal">Past 24h Spending</p>
        </div>
      </div>

      {/* 3. WEEKLY SPENDING */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <CalendarRange className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" /> Past 7D
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
            {formatCurrency(weeklyDailyAvg, currency)}/d
          </span>
        </div>

        <div className="mt-2.5 sm:mt-4">
          <div className="text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight font-mono text-slate-900 truncate">
            {formatCurrency(metrics.weeklyExpenses, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-normal">Weekly Spending</p>
        </div>
      </div>

      {/* 4. MONTHLY SPENDING */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" /> Past 30D
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
            {formatCurrency(monthlyDailyAvg, currency)}/d
          </span>
        </div>

        <div className="mt-2.5 sm:mt-4">
          <div className="text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight font-mono text-slate-900 truncate">
            {formatCurrency(metrics.monthlyExpenses, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-normal">Monthly Spending</p>
        </div>
      </div>

      {/* 5. REMAINING LIQUIDITY / CASH FLOW */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" /> Cash Flow
          </span>
          {isSurplus ? (
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
          )}
        </div>

        <div className="mt-2.5 sm:mt-4">
          <div
            className={`text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight font-mono truncate ${
              isSurplus ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isSurplus ? '+' : ''}
            {formatCurrency(metrics.netLiquidity, currency)}
          </div>
          <p
            className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 font-mono font-medium truncate ${
              isSurplus ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {isSurplus ? '● Net Surplus' : '● Deficit Outflow'}
          </p>
        </div>
      </div>
    </div>
  );
};
