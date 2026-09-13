import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Tag,
  Edit3,
  Trash2,
  TrendingDown,
  PiggyBank,
  ArrowUpDown,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import type { Transaction, FilterState, CurrencyCode } from '../types';
import { formatCurrency, formatExactTimestamp, formatFriendlyDate } from '../utils/formatters';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_SAVINGS_CATEGORIES } from '../utils/sampleData';

interface HistoryListProps {
  transactions: Transaction[];
  filter: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
  currency: CurrencyCode;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  transactions,
  filter,
  onFilterChange,
  currency,
  onEdit,
  onDelete,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const availableCategories = Array.from(
    new Set([
      ...DEFAULT_EXPENSE_CATEGORIES,
      ...DEFAULT_SAVINGS_CATEGORIES,
      ...transactions.map((t) => t.category).filter(Boolean),
    ])
  );

  const totalFilteredExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalFilteredSavings = transactions
    .filter((t) => t.type === 'SAVINGS')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      {/* Header & Search Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              Historical Audit Trail
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {transactions.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Searchable ledger with exact auto-timestamps
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 font-medium">
              -{formatCurrency(totalFilteredExpenses, currency)}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium">
              +{formatCurrency(totalFilteredSavings, currency)}
            </span>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by title, merchant/destination, category, or notes..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-2 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[42px]"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer min-h-[42px] ${
                showAdvancedFilters || filter.category !== 'ALL' || filter.timeRange !== 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filter.category !== 'ALL' || filter.timeRange !== 'ALL') && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />
              )}
            </button>

            {/* Sort */}
            <div className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-white rounded-xl px-2.5 py-2 border border-slate-200 min-h-[42px]">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="text-xs font-medium bg-transparent text-slate-700 focus:outline-none cursor-pointer font-mono w-full"
              >
                <option value="date-desc">Newest</option>
                <option value="date-asc">Oldest</option>
                <option value="amount-desc">High Amount</option>
                <option value="amount-asc">Low Amount</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Type Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'ALL' })}
            className={`flex-1 py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
              filter.type === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            All Activity
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'EXPENSE' })}
            className={`flex-1 py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
              filter.type === 'EXPENSE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            Expenses Only
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'SAVINGS' })}
            className={`flex-1 py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
              filter.type === 'SAVINGS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            Ipon Deposits
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-100">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                Time Horizon
              </label>
              <select
                value={filter.timeRange}
                onChange={(e) =>
                  onFilterChange({ timeRange: e.target.value as FilterState['timeRange'] })
                }
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today Only</option>
                <option value="WEEK">Past 7 Days</option>
                <option value="MONTH">Past 30 Days</option>
                <option value="CUSTOM">Custom Date Range</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {filter.timeRange === 'CUSTOM' && (
              <div className="sm:col-span-2 grid grid-cols-2 gap-2 mt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filter.startDate || ''}
                    onChange={(e) => onFilterChange({ startDate: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filter.endDate || ''}
                    onChange={(e) => onFilterChange({ endDate: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction List Feed */}
      <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-normal">
              Try adjusting your search query, clearing filters, or log a new expense or piggy bank deposit above.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isExpense = tx.type === 'EXPENSE';
            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Icon, Title, Destination, Category, Timestamp */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-slate-100 border border-slate-200">
                    {isExpense ? (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    ) : (
                      <PiggyBank className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{tx.title}</h4>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {isExpense ? 'Expense' : 'Ipon Deposit'}
                      </span>
                      {tx.category && (
                        <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                          <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                          {tx.category}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {tx.destination && (
                        <span className="inline-flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {tx.destination}
                        </span>
                      )}
                      <span title={formatExactTimestamp(tx.timestamp)}>
                        {formatFriendlyDate(tx.timestamp)}
                      </span>
                      {tx.notes && (
                        <span className="text-slate-400 truncate max-w-xs" title={tx.notes}>
                          "{tx.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Contextual Edit/Delete Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span
                    className={`font-mono text-sm sm:text-base font-semibold ${
                      isExpense ? 'text-slate-900' : 'text-emerald-700'
                    }`}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tx.amount, currency)}
                  </span>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit(tx)}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Edit entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete entry "${tx.title}"?`)) {
                          onDelete(tx.id);
                        }
                      }}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 active:bg-rose-50 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
