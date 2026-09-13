import React from 'react';
import {
  LayoutDashboard,
  TrendingDown,
  PiggyBank,
  FileSpreadsheet,
  Target,
  FileCode,
  Upload,
  Trash2,
  X,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { CurrencyCode, MainView } from '../types';
import { CURRENCIES, formatCurrency } from '../utils/formatters';

export type FeatureKey =
  | 'dashboard'
  | 'horizons'
  | 'expense'
  | 'savings'
  | 'ledger'
  | 'analytics'
  | 'goals'
  | 'health'
  | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeView: MainView;
  onSelectView: (view: MainView) => void;
  activeFeature?: FeatureKey;
  onSelectFeature: (feature: FeatureKey) => void;
  totalSavings: number;
  savingsRate: number;
  netLiquidity: number;
  transactionsCount: number;
  goalsCount: number;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportClick: () => void;
  onClearData: () => void;
}

interface NavViewItem {
  id: MainView;
  label: string;
  sublabel: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  activeView,
  onSelectView,
  totalSavings,
  savingsRate,
  goalsCount,
  currency,
  onCurrencyChange,
  onExportCSV,
  onExportJSON,
  onImportClick,
  onClearData,
}) => {
  // 1. Five Main Dedicated Pages
  const mainViews: NavViewItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard / Overview',
      sublabel: 'Main summary & liquidity',
      badge: 'Overview',
      icon: LayoutDashboard,
      colorClass: 'text-indigo-600',
    },
    {
      id: 'expense',
      label: 'Expense Tracking',
      sublabel: 'Multi-horizon disbursements',
      badge: 'Mode A',
      icon: TrendingDown,
      colorClass: 'text-rose-500',
    },
    {
      id: 'savings',
      label: 'Ipon Savings',
      sublabel: 'Piggy bank deposits & vaults',
      badge: 'Mode B',
      icon: PiggyBank,
      colorClass: 'text-primary',
    },
    {
      id: 'goals',
      label: 'Milestone Goals',
      sublabel: 'Target savings capital',
      badge: goalsCount > 0 ? `${goalsCount}` : undefined,
      icon: Target,
      colorClass: 'text-amber-500',
    },
    {
      id: 'settings',
      label: 'Settings & Auth',
      sublabel: 'Preferences, currency & tools',
      badge: 'Config',
      icon: Settings,
      colorClass: 'text-slate-600',
    },
  ];

  // Render expanded content (used for desktop expanded & mobile drawer)
  const renderExpandedContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Sidebar Header / Brand */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-xs">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-1">
              Piggy<span className="text-primary font-normal">Vault</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">Features Navigation</div>
          </div>
        </div>

        {/* Collapse toggle (desktop) or close button (mobile) */}
        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer hidden lg:flex items-center justify-center"
              aria-label="Collapse sidebar"
              title="Collapse sidebar (show icon rail)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6">
        {/* Quick Ipon Stash Balance Snapshot */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Accumulated Ipon</span>
            <span className="flex items-center text-emerald-600 font-mono font-semibold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {savingsRate}%
            </span>
          </div>
          <div className="text-lg font-mono font-semibold text-slate-900 mt-1">
            {formatCurrency(totalSavings, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Private client-side vault</span>
          </div>
        </div>

        {/* Section 1: Main Pages / Dedicated Feature Views */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Core Modules
          </div>
          {mainViews.map((item) => {
            const Icon = item.icon;
            const isSelected = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  if (isMobile) onClose();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer group min-h-[44px] ${
                  isSelected
                    ? 'bg-rose-50/90 text-slate-900 font-semibold border-l-3 border-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white shadow-xs text-primary'
                        : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="truncate font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Data & Storage Actions */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Storage & Tools
          </div>

          <button
            type="button"
            onClick={() => {
              onExportCSV();
              if (isMobile) onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => {
              onExportJSON();
              if (isMobile) onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON Backup</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => {
              onImportClick();
              if (isMobile) onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import Backup</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClearData();
              if (isMobile) onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Clear All Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar Footer: Base Currency Switcher & Version */}
      <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">FX:</span>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            aria-label="Sidebar Currency Selector"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[10px] font-mono text-slate-400">PiggyVault v1.0</span>
      </div>
    </div>
  );

  // Render collapsed icon-only rail (desktop)
  const renderCollapsedContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-800 items-center py-4 justify-between">
      {/* Brand Icon & Expand button */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-xs">
          <PiggyBank className="w-5 h-5" />
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary View Icons Rail */}
      <div className="flex flex-col items-center gap-2.5 my-auto">
        {mainViews.map((item) => {
          const Icon = item.icon;
          const isSelected = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-rose-50 text-primary font-semibold shadow-xs ring-1 ring-primary/30'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={`${item.label} (${item.sublabel})`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
              {/* Active indicator dot */}
              {isSelected && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-primary" />
              )}
              {/* Badge dot if goals > 0 */}
              {item.id === 'goals' && goalsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Collapsed Footer: Currency & Expand */}
      <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-slate-100 w-full px-2">
        <div
          className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 w-9 h-9 rounded-lg flex items-center justify-center"
          title={`Active currency: ${currency}`}
        >
          {CURRENCIES[currency]?.symbol || currency}
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Collapsible Sidebar */}
      <aside
        aria-label="Features Sidebar"
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 shrink-0 sticky top-0 h-screen z-20 shadow-xs transition-all duration-250 ease-in-out ${
          isCollapsed ? 'w-18' : 'w-64 xl:w-72'
        }`}
      >
        {isCollapsed ? renderCollapsedContent() : renderExpandedContent(false)}
      </aside>

      {/* 2. Mobile / Tablet Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Features Sidebar"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200 pb-safe"
          >
            {renderExpandedContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
