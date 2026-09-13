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

  // Find max daily amount for chart scaling
  const maxDayAmount = Math.max(
    ...dailyTrends.map((d) => Math.max(d.expenseAmount, d.savingsAmount)),
    100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Category Spending Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-rose-500" />
                Spending Breakdown by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution of expenditures</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {categories.length} categories
            </span>
          </div>

          <div className="mt-4 space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
            {categories.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-10">
                No expense data logged yet.
              </p>
            ) : (
              categories.map((cat, idx) => {
                const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                return (
                  <div key={cat.category} className="group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        {cat.category}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({cat.count} {cat.count === 1 ? 'item' : 'items'})
                        </span>
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(cat.amount, currency)}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>All-Time Expenses:</span>
          <span className="font-mono font-bold text-rose-600">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>
      </div>

      {/* 2. 7-Day Spending vs Savings Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                7-Day Cash Flow Dynamics
              </h3>
              <p className="text-xs text-slate-500">Daily comparison of Savings vs Expenses</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Savings
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Expenses
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="mt-4">
            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-50/50 rounded-xl border border-slate-100">
              {dailyTrends.map((day) => {
                const expHeightPct = Math.min(100, Math.round((day.expenseAmount / maxDayAmount) * 100));
                const savHeightPct = Math.min(100, Math.round((day.savingsAmount / maxDayAmount) * 100));

                return (
                  <div
                    key={day.dateStr}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-32">
                      {/* Savings Bar (Emerald) */}
                      <div
                        className="w-3.5 sm:w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-600"
                        style={{ height: `${Math.max(4, savHeightPct)}%` }}
                        title={`Savings: ${formatCurrency(day.savingsAmount, currency)}`}
                      />

                      {/* Expense Bar (Rose) */}
                      <div
                        className="w-3.5 sm:w-4 bg-rose-500 rounded-t-sm transition-all duration-300 group-hover:bg-rose-600"
                        style={{ height: `${Math.max(4, expHeightPct)}%` }}
                        title={`Expenses: ${formatCurrency(day.expenseAmount, currency)}`}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[10px] font-semibold text-slate-500 mt-2 text-center group-hover:text-slate-900">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hover tooltip / info bar */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-100/70 text-xs flex items-center justify-between min-h-[42px]">
              {hoveredDay ? (
                <>
                  <span className="font-bold text-slate-800">
                    {hoveredDay.label} ({hoveredDay.dateStr}):
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-emerald-700 font-bold">
                      +{formatCurrency(hoveredDay.savingsAmount, currency)} saved
                    </span>
                    <span className="text-rose-600 font-bold">
                      -{formatCurrency(hoveredDay.expenseAmount, currency)} spent
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-slate-400 text-[11px] mx-auto italic">
                  Hover over bars to inspect daily breakdown
                </span>
              )}
            </div>
          </div>
        </div>

        {/* All-time comparison summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>All-Time Accumulated Savings:</span>
          <span className="font-mono font-bold text-emerald-700">
            {formatCurrency(totalSavings, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
