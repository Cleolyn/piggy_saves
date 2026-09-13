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
    <div className="bg-canvas rounded-xl border border-hairline shadow-xs overflow-hidden">
      {/* Header & Main Search */}
      <div className="p-6 border-b border-hairline">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-muted" />
              Transaction History & Log
              <span className="text-xs px-2.5 py-0.5 rounded-pill font-mono font-medium bg-surface-strong text-ink border border-hairline">
                {transactions.length} {transactions.length === 1 ? 'record' : 'records'}
              </span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Filterable transaction feed with automated precise timestamps
            </p>
          </div>

          {/* Quick summary badges */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-pill bg-surface-soft border border-hairline text-semantic-down font-medium">
              -{formatCurrency(totalFilteredExpenses, currency)}
            </span>
            <span className="px-3 py-1 rounded-pill bg-surface-soft border border-hairline text-semantic-up font-medium">
              +{formatCurrency(totalFilteredSavings, currency)}
            </span>
          </div>
        </div>

        {/* Search Input and Filter Toggle */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search by title, merchant/destination, category, or amount..."
              className="w-full pl-11 pr-9 py-2.5 text-xs sm:text-sm rounded-pill border border-hairline text-ink placeholder:text-muted bg-surface-strong/60 focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            {filter.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
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
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-pill border transition-colors cursor-pointer ${
                showAdvancedFilters || filter.category !== 'ALL' || filter.timeRange !== 'ALL'
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-surface-strong text-ink border-hairline hover:bg-hairline'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filter.category !== 'ALL' || filter.timeRange !== 'ALL') && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-surface-strong rounded-pill px-3 py-1.5 border border-hairline">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="text-xs font-medium bg-transparent text-ink focus:outline-none cursor-pointer py-0.5 font-mono"
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
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'ALL' })}
            className={`px-3.5 py-1.5 rounded-pill text-xs font-medium transition-all shrink-0 cursor-pointer ${
              filter.type === 'ALL'
                ? 'bg-ink text-canvas shadow-xs'
                : 'bg-surface-strong text-muted hover:text-ink'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'EXPENSE' })}
            className={`px-3.5 py-1.5 rounded-pill text-xs font-medium transition-all shrink-0 flex items-center gap-1 cursor-pointer border ${
              filter.type === 'EXPENSE'
                ? 'bg-ink text-canvas border-ink shadow-xs'
                : 'bg-surface-soft text-semantic-down border-hairline hover:bg-surface-strong'
            }`}
          >
            <TrendingDown className="w-3 h-3" /> Expenses Only
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ type: 'SAVINGS' })}
            className={`px-3.5 py-1.5 rounded-pill text-xs font-medium transition-all shrink-0 flex items-center gap-1 cursor-pointer border ${
              filter.type === 'SAVINGS'
                ? 'bg-ink text-canvas border-ink shadow-xs'
                : 'bg-surface-soft text-semantic-up border-hairline hover:bg-surface-strong'
            }`}
          >
            <PiggyBank className="w-3 h-3" /> Savings Deposits Only
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-hairline grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-surface-soft/80 p-4 rounded-xl border">
            {/* Time Range Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-muted mb-1.5">
                Time Horizon
              </label>
              <select
                value={filter.timeRange}
                onChange={(e) =>
                  onFilterChange({ timeRange: e.target.value as FilterState['timeRange'] })
                }
                className="w-full text-xs rounded-xl border border-hairline p-2.5 bg-canvas text-ink"
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
              <label className="block text-[11px] font-semibold uppercase text-muted mb-1.5">
                Category
              </label>
              <select
                value={filter.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full text-xs rounded-xl border border-hairline p-2.5 bg-canvas text-ink"
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
                  <label className="block text-[10px] text-muted font-semibold mb-0.5">Start Date</label>
                  <input
                    type="date"
                    value={filter.startDate || ''}
                    onChange={(e) => onFilterChange({ startDate: e.target.value })}
                    className="w-full text-xs rounded-xl border border-hairline p-2 bg-canvas text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted font-semibold mb-0.5">End Date</label>
                  <input
                    type="date"
                    value={filter.endDate || ''}
                    onChange={(e) => onFilterChange({ endDate: e.target.value })}
                    className="w-full text-xs rounded-xl border border-hairline p-2 bg-canvas text-ink font-mono"
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
                className="text-xs text-primary hover:text-primary-active font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Feed / Table */}
      <div className="divide-y divide-hairline max-h-[600px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center text-muted mx-auto mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-ink">No transactions found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Try adjusting your search query, clearing filters, or log a new expense or piggy bank deposit above.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isExpense = tx.type === 'EXPENSE';
            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 hover:bg-surface-soft/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left Side: Type Icon Plate, Title, Destination, Category, Timestamp */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-surface-strong text-ink border border-hairline">
                    {isExpense ? (
                      <TrendingDown className="w-4 h-4 text-semantic-down" />
                    ) : (
                      <PiggyBank className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-ink truncate">
                        {tx.title}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill uppercase tracking-wider bg-surface-strong text-muted border border-hairline">
                        {isExpense ? 'Expense' : 'Ipon Deposit'}
                      </span>
                      {tx.category && (
                        <span className="inline-flex items-center text-[11px] font-medium text-body bg-surface-soft px-2 py-0.5 rounded-pill border border-hairline">
                          <Tag className="w-2.5 h-2.5 mr-1 text-muted" />
                          {tx.category}
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Destination, Exact Timestamp, Friendly Date */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      {tx.destination && (
                        <span className="flex items-center gap-1 text-body font-normal truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-muted shrink-0" />
                          {tx.destination}
                        </span>
                      )}

                      {/* Precise Timestamp */}
                      <span
                        className="flex items-center gap-1 font-mono text-muted text-[11px]"
                        title={`Precise Log: ${formatExactTimestamp(tx.timestamp)}`}
                      >
                        <Clock className="w-3 h-3 text-muted shrink-0" />
                        {formatExactTimestamp(tx.timestamp)}
                      </span>

                      {/* Friendly relative date */}
                      <span className="text-[11px] text-muted">
                        ({formatFriendlyDate(tx.timestamp)})
                      </span>
                    </div>

                    {/* Notes if present */}
                    {tx.notes && (
                      <p className="mt-1.5 text-xs text-muted italic bg-surface-soft px-2.5 py-1 rounded-xl border border-hairline">
                        "{tx.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Amount & Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline">
                  <div
                    className={`font-mono font-medium text-base sm:text-lg tracking-tight ${
                      isExpense ? 'text-semantic-down' : 'text-semantic-up'
                    }`}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tx.amount, currency)}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEdit(tx)}
                      className="p-1.5 text-muted hover:text-ink hover:bg-surface-strong rounded-pill transition-colors cursor-pointer"
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
                      className="p-1.5 text-muted hover:text-semantic-down hover:bg-surface-strong rounded-pill transition-colors cursor-pointer"
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
