import React, { useState } from 'react';
import {
  PieChart,
  BarChart3,
} from 'lucide-react';
import type { CurrencyCode } from '../types';
import type { CategoryBreakdown, DaySpending } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

interface AnalyticsViewProps {
  categories: CategoryBreakdown[];
  dailyTrends: DaySpending[];
  currency: CurrencyCode;
  totalSavings: number;
  totalExpenses: number;
}

const CATEGORY_COLORS: string[] = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-orange-500',
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  categories,
  dailyTrends,
  currency,
  totalSavings,
  totalExpenses,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DaySpending | null>(null);

  const maxDayAmount = Math.max(
    ...dailyTrends.map((d) => Math.max(d.expenseAmount, d.savingsAmount)),
    100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {/* 1. Category Spending Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 flex flex-col justify-between space-y-5 sm:space-y-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                Category Spending Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Distribution of operational expenditures
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              {categories.length} categories
            </span>
          </div>

          <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {categories.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-12 font-normal">
                No expense data logged yet.
              </p>
            ) : (
              categories.map((cat, idx) => {
                const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 flex items-center gap-2 truncate pr-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`} />
                        <span className="truncate">{cat.category}</span>
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          ({cat.count})
                        </span>
                      </span>
                      <div className="text-right font-mono shrink-0">
                        <span className="font-medium text-slate-900">
                          {formatCurrency(cat.amount, currency)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1.5">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-3.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
          <span>All-Time Logged Expenses:</span>
          <span className="font-mono font-medium text-rose-600">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>
      </div>

      {/* 2. 7-Day Cash Flow Dynamics */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 flex flex-col justify-between space-y-5 sm:space-y-6 shadow-xs">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                7-Day Cash Flow Dynamics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Daily comparative dynamics of savings vs expenses
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-medium font-mono">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Savings
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="mt-4 sm:mt-5">
            <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 pt-4 px-2 sm:px-3 bg-slate-50/70 rounded-xl border border-slate-150">
              {dailyTrends.map((day) => {
                const expHeightPct = Math.min(100, Math.round((day.expenseAmount / maxDayAmount) * 100));
                const savHeightPct = Math.min(100, Math.round((day.savingsAmount / maxDayAmount) * 100));
                const isSelected = hoveredDay?.dateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    className={`flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative p-1 rounded-lg transition-colors ${
                      isSelected ? 'bg-slate-200/50' : 'hover:bg-slate-100/50'
                    }`}
                    onClick={() => setHoveredDay(day)}
                    onTouchStart={() => setHoveredDay(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-32">
                      {/* Savings Bar */}
                      <div
                        className="w-2.5 sm:w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${Math.max(4, savHeightPct)}%` }}
                        title={`Savings: ${formatCurrency(day.savingsAmount, currency)}`}
                      />

                      {/* Expense Bar */}
                      <div
                        className="w-2.5 sm:w-4 bg-rose-500 rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${Math.max(4, expHeightPct)}%` }}
                        title={`Expenses: ${formatCurrency(day.expenseAmount, currency)}`}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[10px] font-mono font-medium text-slate-500 mt-2 text-center group-hover:text-slate-900 truncate w-full">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hover/Tap tooltip bar */}
            <div className="mt-3 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full bg-slate-100/80 border border-slate-200 text-xs flex items-center justify-between min-h-[38px]">
              {hoveredDay ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
                  <span className="font-medium text-slate-800">
                    {hoveredDay.label} ({hoveredDay.dateStr})
                  </span>
                  <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-[11px] sm:text-xs">
                    <span className="text-emerald-700 font-medium">
                      +{formatCurrency(hoveredDay.savingsAmount, currency)} saved
                    </span>
                    <span className="text-rose-600 font-medium">
                      -{formatCurrency(hoveredDay.expenseAmount, currency)} spent
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px] mx-auto italic">
                  Tap or hover over bars to inspect daily cash flow figures
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
          <span>All-Time Accumulated Savings:</span>
          <span className="font-mono font-medium text-emerald-700">
            {formatCurrency(totalSavings, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
