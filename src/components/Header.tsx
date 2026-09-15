import React, { useRef, useState } from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import {
  PiggyBank,
  Upload,
  Trash2,
  ChevronDown,
  TrendingUp,
  SlidersHorizontal,
  FileSpreadsheet,
  FileCode,
  Menu,
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
  onToggleSidebar?: () => void;
  activeViewTitle?: string;
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
  onToggleSidebar,
  activeViewTitle,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    exportToCSV(transactions);
    showToast('Exported transactions to CSV', 'info');
    setShowSettingsMenu(false);
  };

  const handleExportJSON = () => {
    exportToJSON(transactions, savingsGoals);
    showToast('Exported JSON backup file', 'info');
    setShowSettingsMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.transactions)) {
          onImportData(parsed.transactions, parsed.goals || []);
          showToast(`Imported ${parsed.transactions.length} transactions`, 'success');
        } else if (Array.isArray(parsed)) {
          onImportData(parsed, []);
          showToast(`Imported ${parsed.length} transactions`, 'success');
        } else {
          showToast('Invalid JSON file format', 'error');
        }
      } catch {
        showToast('Error reading backup file', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center"
                title="Toggle Features Sidebar"
                aria-label="Open Features Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-xs">
              <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-1">
                Piggy<span className="text-primary font-normal">Vault</span>
              </span>
              <span className="hidden xs:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                Ipon
              </span>
              {activeViewTitle && (
                <>
                  <span className="hidden md:inline-block text-slate-300">/</span>
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                    {activeViewTitle}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Primary & Contextual Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Ipon Summary Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] sm:text-xs">
              <span className="text-slate-500 hidden sm:inline">Savings:</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCurrency(totalSavings, currency)}
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center text-emerald-600 font-mono font-semibold">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                {savingsRate}%
              </span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center">
              <label htmlFor="currency-select" className="sr-only">
                Currency
              </label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-full px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer min-h-[34px]"
                title="Change display currency"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings & Data Management Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-2.5 sm:px-3 py-1.5 transition-all cursor-pointer min-h-[34px]"
                title="Data and Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Data</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showSettingsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Backup & Export
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                      <span>Export to CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-slate-500" />
                      <span>Export Backup JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Import JSON Backup</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Manage Data
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (
                          window.confirm(
                            'Are you sure you want to clear all transactions and reset to a clean slate?'
                          )
                        ) {
                          onClearData();
                        }
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Clear All Data</span>
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
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Clerk Authentication Controls */}
            <div className="flex items-center pl-2 border-l border-slate-200">
              <Show when="signed-out">
                <div className="flex items-center gap-1.5">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-full px-3.5 py-1.5 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="text-xs font-semibold text-white bg-primary hover:bg-primary-active rounded-full px-3.5 py-1.5 transition-colors cursor-pointer shadow-xs"
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
