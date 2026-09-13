import React, { useRef, useState } from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import {
  PiggyBank,
  Download,
  Upload,
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
    <header className="border-b border-hairline bg-canvas/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-surface-strong border border-hairline flex items-center justify-center text-primary shadow-xs">
              <PiggyBank className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-ink flex items-center gap-1.5">
                  Piggy<span className="text-primary font-normal">Vault</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-pill font-medium bg-surface-strong text-ink tracking-wider uppercase border border-hairline">
                    Ipon OS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-muted font-normal">
                Automated Personal Treasury & Multi-Horizon Logging
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Mini Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-pill bg-surface-soft border border-hairline text-xs">
              <span className="text-muted">Ipon Stash:</span>
              <span className="font-mono font-medium text-ink">
                {formatCurrency(totalSavings, currency)}
              </span>
              <span className="text-hairline">|</span>
              <span className="flex items-center text-semantic-up font-mono font-medium">
                <TrendingUp className="w-3 h-3 mr-1 inline" /> {savingsRate}%
              </span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center">
              <label htmlFor="currency-select" className="sr-only">Currency</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="text-xs font-mono font-medium bg-surface-strong hover:bg-hairline/60 text-ink border border-hairline rounded-pill px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
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
                className="flex items-center gap-1.5 text-xs font-medium bg-surface-strong hover:bg-hairline/60 text-ink border border-hairline rounded-pill px-3 py-1.5 transition-colors"
                title="Export or backup data"
              >
                <Download className="w-3.5 h-3.5 text-muted" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-muted" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 bg-canvas rounded-xl shadow-soft-drop border border-hairline py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        exportToCSV(transactions);
                        setShowExportMenu(false);
                        showToast('Exported transactions to CSV', 'info');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-ink hover:bg-surface-soft flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-muted" />
                      Export to CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportToJSON(transactions, savingsGoals);
                        setShowExportMenu(false);
                        showToast('Exported backup JSON file', 'info');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-ink hover:bg-surface-soft flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-muted" />
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
              className="flex items-center gap-1.5 text-xs font-medium bg-surface-strong hover:bg-hairline/60 text-ink border border-hairline rounded-pill px-3 py-1.5 transition-colors"
              title="Import JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-muted" />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Clear All Data */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all transactions and reset to a clean slate?')) {
                  onClearData();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-semantic-down hover:bg-surface-strong border border-hairline rounded-pill px-2.5 py-1.5 transition-colors"
              title="Clear all records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Clear Data</span>
            </button>

            {/* Clerk Authentication Controls */}
            <div className="flex items-center pl-2 sm:border-l sm:border-hairline ml-1">
              <Show when="signed-out">
                <div className="flex items-center gap-1.5">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="text-xs font-semibold text-ink hover:text-body-strong bg-surface-strong hover:bg-hairline/70 border border-hairline rounded-pill px-3.5 py-1.5 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="text-xs font-semibold text-on-primary bg-primary hover:bg-primary-active rounded-pill px-3.5 py-1.5 transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
