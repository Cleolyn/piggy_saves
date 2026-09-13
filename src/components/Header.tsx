import React, { useRef, useState } from 'react';
import {
  PiggyBank,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';
import type { CurrencyCode, Transaction, SavingsGoal } from '../types';
import { CURRENCIES, formatCurrency } from '../utils/formatters';
import { exportToCSV, exportToJSON } from '../utils/storage';

interface HeaderProps {
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  totalSavings: number;
  savingsRate: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  onResetData: () => void;
  onClearData: () => void;
  onImportData: (transactions: Transaction[], goals: SavingsGoal[]) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  totalSavings,
  savingsRate,
  transactions,
  savingsGoals,
  onResetData,
  onClearData,
  onImportData,
  showToast,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.transactions)) {
          onImportData(parsed.transactions, parsed.goals || []);
          showToast(`Successfully imported ${parsed.transactions.length} transactions!`, 'success');
        } else if (Array.isArray(parsed)) {
          onImportData(parsed, []);
          showToast(`Successfully imported ${parsed.length} transactions!`, 'success');
        } else {
          showToast('Invalid JSON file format', 'error');
        }
      } catch {
        showToast('Error reading import file: invalid JSON', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-200 text-white transform hover:scale-105 transition-transform">
              <PiggyBank className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Piggy<span className="text-rose-600">Vault</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Ipon OS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Automated Savings & Spending Logging Dashboard
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Mini Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-slate-500">Ipon Stash:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {formatCurrency(totalSavings, currency)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center text-emerald-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" /> {savingsRate}% rate
              </span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center">
              <label htmlFor="currency-select" className="sr-only">Currency</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors cursor-pointer"
                title="Change display currency"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors"
                title="Export or backup data"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        exportToCSV(transactions);
                        setShowExportMenu(false);
                        showToast('Exported transactions to CSV', 'info');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      Export to CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportToJSON(transactions, savingsGoals);
                        setShowExportMenu(false);
                        showToast('Exported backup JSON file', 'info');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      Export to JSON
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Hidden file input for import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors"
              title="Import JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Reset Demo Data */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all transactions and goals to default demo sample data?')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors"
              title="Reset to sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>

            {/* Clear Data */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all transactions and reset data?')) {
                  onClearData();
                }
              }}
              className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg px-2 py-1.5 transition-colors"
              title="Clear all records"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
