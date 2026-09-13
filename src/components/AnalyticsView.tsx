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
      <div className="bg-canvas rounded-xl border border-hairline shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-hairline">
            <div>
              <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-primary" />
                Spending Breakdown by Category
              </h3>
              <p className="text-xs text-muted mt-0.5">Distribution of expenditures</p>
            </div>
            <span className="text-xs font-mono font-medium text-ink bg-surface-strong px-2.5 py-1 rounded-pill border border-hairline">
              {categories.length} categories
            </span>
          </div>

          <div className="mt-5 space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {categories.length === 0 ? (
              <p className="text-center text-xs text-muted py-12 font-normal">
                No expense data logged yet.
              </p>
            ) : (
              categories.map((cat, idx) => {
                const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                return (
                  <div key={cat.category} className="group">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-ink flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        {cat.category}
                        <span className="text-[11px] text-muted font-normal font-mono">
                          ({cat.count} {cat.count === 1 ? 'item' : 'items'})
                        </span>
                      </span>
                      <div className="text-right font-mono">
                        <span className="font-medium text-ink">
                          {formatCurrency(cat.amount, currency)}
                        </span>
                        <span className="text-[11px] text-muted ml-1.5">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-surface-strong rounded-pill h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-pill transition-all duration-500 ${colorClass}`}
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
        <div className="mt-5 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-muted font-normal">
          <span>All-Time Expenses:</span>
          <span className="font-mono font-medium text-semantic-down">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>
      </div>

      {/* 2. 7-Day Spending vs Savings Trend Chart */}
      <div className="bg-canvas rounded-xl border border-hairline shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-hairline">
            <div>
              <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-primary" />
                7-Day Cash Flow Dynamics
              </h3>
              <p className="text-xs text-muted mt-0.5">Daily comparison of Savings vs Expenses</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-medium font-mono">
              <span className="flex items-center gap-1.5 text-semantic-up">
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-up" /> Savings
              </span>
              <span className="flex items-center gap-1.5 text-semantic-down">
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-down" /> Expenses
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="mt-5">
            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-3 bg-surface-soft/80 rounded-xl border border-hairline">
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
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      {/* Savings Bar (Emerald) */}
                      <div
                        className="w-3 sm:w-4 bg-semantic-up rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${Math.max(4, savHeightPct)}%` }}
                        title={`Savings: ${formatCurrency(day.savingsAmount, currency)}`}
                      />

                      {/* Expense Bar (Rose) */}
                      <div
                        className="w-3 sm:w-4 bg-semantic-down rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${Math.max(4, expHeightPct)}%` }}
                        title={`Expenses: ${formatCurrency(day.expenseAmount, currency)}`}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[10px] font-mono font-medium text-muted mt-2 text-center group-hover:text-ink">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hover tooltip / info bar */}
            <div className="mt-3.5 px-4 py-2.5 rounded-pill bg-surface-strong border border-hairline text-xs flex items-center justify-between min-h-[42px]">
              {hoveredDay ? (
                <>
                  <span className="font-semibold text-ink">
                    {hoveredDay.label} ({hoveredDay.dateStr}):
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-semantic-up font-medium">
                      +{formatCurrency(hoveredDay.savingsAmount, currency)} saved
                    </span>
                    <span className="text-semantic-down font-medium">
                      -{formatCurrency(hoveredDay.expenseAmount, currency)} spent
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-muted text-[11px] mx-auto italic">
                  Hover over bars to inspect daily cash flow figures
                </span>
              )}
            </div>
          </div>
        </div>

        {/* All-time comparison summary */}
        <div className="mt-5 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-muted font-normal">
          <span>All-Time Accumulated Savings:</span>
          <span className="font-mono font-medium text-semantic-up">
            {formatCurrency(totalSavings, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
