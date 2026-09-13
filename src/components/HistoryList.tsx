import React, { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
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

  // All distinct categories from transactions
  const availableCategories = Array.from(
    new Set([
      ...DEFAULT_EXPENSE_CATEGORIES,
      ...DEFAULT_SAVINGS_CATEGORIES,
      ...transactions.map((t) => t.category).filter(Boolean),
    ])
  );

  // Calculate filtered totals
  const totalFilteredExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalFilteredSavings = transactions
    .filter((t) => t.type === 'SAVINGS')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header & Main Search */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              Transaction History & Log
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filterable transaction feed with automated precise timestamps
            </p>
          </div>

          {/* Quick summary badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-mono font-semibold">
              -{formatCurrency(totalFilteredExpenses, currency)}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
              +{formatCurrency(totalFilteredSavings, currency)}
            </span>
          </div>
        </div>

        {/* Search Input and Filter Toggle */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by title, merchant/destination, category, or amount..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Bar Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                showAdvancedFilters || filter.category !== 'ALL' || filter.timeRange !== 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filter.category !== 'ALL' || filter.timeRange !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2 py-1 border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none cursor-pointer py-1"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Type Filter Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'ALL' })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              filter.type === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'EXPENSE' })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
              filter.type === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <TrendingDown className="w-3 h-3" /> Expenses Only
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'SAVINGS' })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
              filter.type === 'SAVINGS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <PiggyBank className="w-3 h-3" /> Savings Deposits Only
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl">
            {/* Time Range Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Time Horizon
              </label>
              <select
                value={filter.timeRange}
                onChange={(e) =>
                  onFilterChange({ timeRange: e.target.value as FilterState['timeRange'] })
                }
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today Only</option>
                <option value="WEEK">Past 7 Days</option>
                <option value="MONTH">Past 30 Days</option>
                <option value="CUSTOM">Custom Date Range</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-800"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Dates (if CUSTOM selected) */}
            {filter.timeRange === 'CUSTOM' && (
              <div className="sm:col-span-3 grid grid-cols-2 gap-2 mt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Start Date</label>
                  <input
                    type="date"
                    value={filter.startDate || ''}
                    onChange={(e) => onFilterChange({ startDate: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 p-1.5 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">End Date</label>
                  <input
                    type="date"
                    value={filter.endDate || ''}
                    onChange={(e) => onFilterChange({ endDate: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-300 p-1.5 bg-white text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Reset Filters button */}
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    searchQuery: '',
                    type: 'ALL',
                    category: 'ALL',
                    timeRange: 'ALL',
                    startDate: undefined,
                    endDate: undefined,
                  })
                }
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Feed / Table */}
      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search query, clearing filters, or log a new expense or piggy bank deposit above.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isExpense = tx.type === 'EXPENSE';
            return (
              <div
                key={tx.id}
                className="p-4 sm:p-4.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left Side: Type Icon, Title, Destination, Category, Timestamp */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-base shadow-xs ${
                      isExpense
                        ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    }`}
                  >
                    {isExpense ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <PiggyBank className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {tx.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isExpense
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExpense ? 'Expense' : 'Ipon Deposit'}
                      </span>
                      {tx.category && (
                        <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                          {tx.category}
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Destination, Exact Timestamp, Friendly Date */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {tx.destination && (
                        <span className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {tx.destination}
                        </span>
                      )}

                      {/* Precise Timestamp */}
                      <span
                        className="flex items-center gap-1 font-mono text-slate-500 text-[11px]"
                        title={`Precise Log: ${formatExactTimestamp(tx.timestamp)}`}
                      >
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        {formatExactTimestamp(tx.timestamp)}
                      </span>

                      {/* Friendly relative date */}
                      <span className="text-[11px] text-slate-400">
                        ({formatFriendlyDate(tx.timestamp)})
                      </span>
                    </div>

                    {/* Notes if present */}
                    {tx.notes && (
                      <p className="mt-1 text-xs text-slate-500 italic bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        "{tx.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Amount & Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div
                    className={`font-mono font-extrabold text-base sm:text-lg tracking-tight ${
                      isExpense ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tx.amount, currency)}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit(tx)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete entry "${tx.title}" (${formatCurrency(tx.amount, currency)})?`
                          )
                        ) {
                          onDelete(tx.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
