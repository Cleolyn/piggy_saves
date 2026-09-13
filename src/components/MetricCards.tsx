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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. NET SAVINGS / IPON */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-2xl p-5 text-white shadow-lg shadow-emerald-700/20 border border-emerald-500/30 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/40 text-emerald-100 border border-emerald-400/30">
              <PiggyBank className="w-3.5 h-3.5" /> Total Ipon
            </span>
            <p className="text-xs text-emerald-100/80 mt-1 font-medium">Accumulated Savings</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-200">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
            {formatCurrency(metrics.totalSavings, currency)}
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-100">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5" /> {metrics.savingsRate}%
            </span>
            <span className="ml-2 text-emerald-100/70">Savings Ratio</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S SPENDING */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <Calendar className="w-3.5 h-3.5" /> Today
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Past 24h Spending</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {formatCurrency(metrics.todayExpenses, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="font-medium text-rose-600">
              {metrics.todayExpenses > 0 ? 'Active logging' : 'Zero spending so far!'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. WEEKLY SPENDING (PAST 7 DAYS) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <CalendarRange className="w-3.5 h-3.5" /> Past 7 Days
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Weekly Spending</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <CalendarRange className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {formatCurrency(metrics.weeklyExpenses, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Avg: <span className="font-mono font-semibold text-slate-700">{formatCurrency(weeklyDailyAvg, currency)}</span>/day
          </div>
        </div>
      </div>

      {/* 4. MONTHLY SPENDING (PAST 30 DAYS) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <CalendarDays className="w-3.5 h-3.5" /> Past 30 Days
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Monthly Spending</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {formatCurrency(metrics.monthlyExpenses, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Avg: <span className="font-mono font-semibold text-slate-700">{formatCurrency(monthlyDailyAvg, currency)}</span>/day
          </div>
        </div>
      </div>

      {/* 5. REMAINING BUDGET / LIQUIDITY INDICATOR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isSurplus
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" /> Cash Flow
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">Net Savings vs Expenses</p>
          </div>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isSurplus ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isSurplus ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
        </div>

        <div className="mt-4">
          <div
            className={`text-2xl font-bold tracking-tight font-mono ${
              isSurplus ? 'text-blue-700' : 'text-rose-600'
            }`}
          >
            {isSurplus ? '+' : ''}
            {formatCurrency(metrics.netLiquidity, currency)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span
              className={`font-semibold ${
                isSurplus ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isSurplus ? '● Net Surplus' : '● Expenditure Exceeds Ipon'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
