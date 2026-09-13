import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useUser, UserButton } from '@clerk/react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Sidebar, type FeatureKey } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { TransactionForm } from './components/TransactionForm';
import { HistoryList } from './components/HistoryList';
import { AnalyticsView } from './components/AnalyticsView';
import { SavingsGoalsCard } from './components/SavingsGoalsCard';
import { EditTransactionModal } from './components/EditTransactionModal';
import { ToastContainer } from './components/Toast';
import { GoogleIcon } from './components/GoogleIcon';
import { usePiggyVault } from './hooks/usePiggyVault';
import type { Transaction, TransactionType, MainView, CurrencyCode } from './types';
import { formatCurrency, CURRENCIES } from './utils/formatters';
import { saveTransactions, saveSavingsGoals, exportToCSV, exportToJSON } from './utils/storage';
import {
  registerOrLoginUser,
  findUserByEmail,
  type UserProfileRecord,
  type AuthProviderType,
} from './utils/userRegistry';
import {
  PiggyBank,
  TrendingDown,
  PieChart,
  ShieldCheck,
  Target,
  PlusCircle,
  LayoutDashboard,
  Settings,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  Upload,
  Trash2,
  Lock,
  ArrowRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export function App() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  // Extract user email as primary unique key
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    (userId ? `${userId}@piggyvault.local` : '');

  // Detect whether session authenticated via Google OAuth
  const isGoogleAccount = Boolean(
    user?.externalAccounts?.some(
      (acc) => acc.provider === 'google' || (acc.provider && acc.provider.includes('google'))
    )
  );
  const currentProvider: AuthProviderType = isGoogleAccount ? 'google' : 'email_password';

  const {
    transactions,
    savingsGoals,
    currency,
    setCurrency,
    filter,
    setFilter,
    filteredTransactions,
    metrics,
    categoryBreakdown,
    dailyTrends,
    toasts,
    showToast,
    removeToast,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    clearAllData,
  } = usePiggyVault(primaryEmail);

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfileRecord | null>(
    () => (primaryEmail ? findUserByEmail(primaryEmail) : null)
  );
  const sessionInitializedRef = useRef<string | null>(null);

  // Authentication Guard & Provider Account Linker
  useEffect(() => {
    if (!isSignedIn || !primaryEmail) {
      sessionInitializedRef.current = null;
      return;
    }

    if (sessionInitializedRef.current === primaryEmail) {
      return;
    }

    sessionInitializedRef.current = primaryEmail;

    // Run account guard: prevents duplicate profiles and ensures seamless account linking
    const result = registerOrLoginUser({
      userId: userId || user?.id || `user_${Date.now()}`,
      email: primaryEmail,
      provider: currentProvider,
    });

    setCurrentUserProfile(result.user);

    if (!result.isNewUser) {
      // Existing user handling: automatically logged in, existing data preserved
      showToast('Welcome back! Logged into your existing account.', 'success');
      if (result.wasLinked) {
        setTimeout(() => {
          showToast(
            `Linked ${currentProvider === 'google' ? 'Google' : 'email'} credentials to your profile.`,
            'info'
          );
        }, 1200);
      }
    } else {
      showToast(result.message, 'success');
    }
  }, [isSignedIn, primaryEmail, userId, user, currentProvider, showToast]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentView, setCurrentView] = useState<MainView>('dashboard');
  const [formTab, setFormTab] = useState<TransactionType>('EXPENSE');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = (newTransactions: Transaction[], newGoals: typeof savingsGoals) => {
    saveTransactions(newTransactions, primaryEmail);
    saveSavingsGoals(newGoals, primaryEmail);
    window.location.reload();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.transactions)) {
          handleImportData(parsed.transactions, parsed.goals || []);
          showToast(`Imported ${parsed.transactions.length} transactions`, 'success');
        } else if (Array.isArray(parsed)) {
          handleImportData(parsed, []);
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

  const handleSelectView = (view: MainView) => {
    setCurrentView(view);
    if (view === 'expense') {
      setFormTab('EXPENSE');
    } else if (view === 'savings') {
      setFormTab('SAVINGS');
    }
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFeature = (feature: FeatureKey) => {
    switch (feature) {
      case 'dashboard':
      case 'horizons':
        setCurrentView('dashboard');
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
        break;
      case 'expense':
        setCurrentView('expense');
        setFormTab('EXPENSE');
        setTimeout(() => {
          const formElem = document.getElementById('transaction-section');
          formElem?.scrollIntoView?.({ behavior: 'smooth' });
          const amountInput = formElem?.querySelector('input[type="number"]') as HTMLInputElement | null;
          amountInput?.focus();
        }, 50);
        break;
      case 'savings':
        setCurrentView('savings');
        setFormTab('SAVINGS');
        setTimeout(() => {
          const formElem = document.getElementById('transaction-section');
          formElem?.scrollIntoView?.({ behavior: 'smooth' });
          const amountInput = formElem?.querySelector('input[type="number"]') as HTMLInputElement | null;
          amountInput?.focus();
        }, 50);
        break;
      case 'ledger':
        setCurrentView('expense');
        setTimeout(() => {
          document.getElementById('history-feed')?.scrollIntoView?.({ behavior: 'smooth' });
        }, 50);
        break;
      case 'analytics':
        setCurrentView('dashboard');
        setTimeout(() => {
          document.getElementById('visual-analytics')?.scrollIntoView?.({ behavior: 'smooth' });
        }, 50);
        break;
      case 'goals':
        setCurrentView('goals');
        setTimeout(() => {
          document.getElementById('savings-goals')?.scrollIntoView?.({ behavior: 'smooth' });
        }, 50);
        break;
      case 'health':
        setCurrentView('goals');
        setTimeout(() => {
          document.getElementById('treasury-health')?.scrollIntoView?.({ behavior: 'smooth' });
        }, 50);
        break;
      case 'settings':
        setCurrentView('settings');
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
        break;
    }
  };

  const activeFeature: FeatureKey =
    currentView === 'dashboard'
      ? 'horizons'
      : currentView === 'expense'
      ? 'expense'
      : currentView === 'savings'
      ? 'savings'
      : currentView === 'goals'
      ? 'goals'
      : 'settings';

  const viewTitles: Record<MainView, string> = {
    dashboard: 'Dashboard Overview',
    expense: 'Expense Tracking',
    savings: 'Ipon Savings',
    goals: 'Milestone Goals',
    settings: 'Settings & Auth',
  };

  const isSurplus = metrics.netLiquidity >= 0;

  // Filtered transactions for specific views
  const expenseTransactions = filteredTransactions.filter((t) => t.type === 'EXPENSE');
  const savingsTransactions = filteredTransactions.filter((t) => t.type === 'SAVINGS');

  // Loading state while Clerk initializes session
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-canvas text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary animate-pulse">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono text-slate-500">Authenticating PiggyVault...</p>
        </div>
      </div>
    );
  }

  // Auth Wall: Unauthenticated visitors only see the clean landing page
  if (!isSignedIn) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-900 flex selection:bg-rose-100 selection:text-rose-900">
      {/* Sidebar: Collapsible Desktop Rail + Mobile Slide-out Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={currentView}
        onSelectView={handleSelectView}
        activeFeature={activeFeature}
        onSelectFeature={handleSelectFeature}
        totalSavings={metrics.totalSavings}
        savingsRate={metrics.savingsRate}
        netLiquidity={metrics.netLiquidity}
        transactionsCount={transactions.length}
        goalsCount={savingsGoals.length}
        currency={currency}
        onCurrencyChange={setCurrency}
        onExportCSV={() => {
          exportToCSV(transactions);
          showToast('Exported transactions to CSV', 'info');
        }}
        onExportJSON={() => {
          exportToJSON(transactions, savingsGoals);
          showToast('Exported backup JSON file', 'info');
        }}
        onImportClick={() => fileInputRef.current?.click()}
        onClearData={() => {
          if (
            window.confirm(
              'Are you sure you want to clear all transactions and reset to a clean slate?'
            )
          ) {
            clearAllData();
          }
        }}
      />

      {/* Hidden file input for sidebar import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sleek Minimalist Header */}
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          totalSavings={metrics.totalSavings}
          savingsRate={metrics.savingsRate}
          transactions={transactions}
          savingsGoals={savingsGoals}
          onClearData={clearAllData}
          onImportData={handleImportData}
          showToast={showToast}
          onToggleSidebar={() => {
            setIsSidebarOpen((prev) => !prev);
            setIsSidebarCollapsed((prev) => !prev);
          }}
          activeViewTitle={viewTitles[currentView]}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 lg:pb-10">
          {/* =========================================================================
              VIEW 1: DASHBOARD / OVERVIEW (MAIN SUMMARY)
              ========================================================================= */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Structured Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Treasury Horizons
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-primary border border-rose-100">
                      Overview
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Multi-horizon spending overview & net liquidity indicator
                  </p>
                </div>

                {/* Quick Action Navigation Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSelectView('expense')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Expense</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView('savings')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <PiggyBank className="w-3.5 h-3.5 text-primary" />
                    <span>Deposit Ipon</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView('goals')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-500" />
                    <span>New Goal</span>
                  </button>
                </div>
              </div>

              {/* Multi-Horizon Metrics Cards */}
              <section id="horizons-section" aria-label="Financial Summary Metrics">
                <MetricCards metrics={metrics} currency={currency} />
              </section>

              {/* Visual Cash Flow Analytics */}
              <section id="visual-analytics" aria-label="Visual Analytics">
                <AnalyticsView
                  categories={categoryBreakdown}
                  dailyTrends={dailyTrends}
                  currency={currency}
                  totalSavings={metrics.totalSavings}
                  totalExpenses={metrics.allTimeExpenses}
                />
              </section>

              {/* 2-Column Dashboard Grid: Recent Activity & Goals Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Recent Activity Feed Preview */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-slate-900">
                          Recent Activity Feed
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectView('expense')}
                        className="text-xs text-primary hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Transactions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs font-normal">
                        <PiggyBank className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                        <p>No transactions found</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Log an expense or make an ipon deposit to begin tracking.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {transactions.slice(0, 5).map((tx) => {
                          const isExp = tx.type === 'EXPENSE';
                          return (
                            <div
                              key={tx.id}
                              className="py-3 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isExp ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
                                  }`}
                                >
                                  {isExp ? (
                                    <TrendingDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <PiggyBank className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <div className="font-semibold text-slate-900 truncate">
                                    {tx.title}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate">
                                    {tx.destination} · {tx.category}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`font-mono font-semibold shrink-0 ${
                                  isExp ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {isExp ? '-' : '+'}
                                {formatCurrency(tx.amount, currency)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Milestone Goals & Treasury Health */}
                <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                  {/* Goals Snapshot */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-semibold text-slate-900">
                          Target Milestones
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectView('goals')}
                        className="text-xs text-primary hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {savingsGoals.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs font-normal">
                        <p>No savings goals created yet.</p>
                        <button
                          type="button"
                          onClick={() => handleSelectView('goals')}
                          className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          + Set your first milestone
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {savingsGoals.slice(0, 3).map((goal) => {
                          const pct = Math.min(
                            100,
                            Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100)
                          );
                          return (
                            <div key={goal.id} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-medium text-slate-800 truncate">
                                  {goal.title}
                                </span>
                                <span className="font-mono text-slate-500">{pct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Treasury Health Card */}
                  <div
                    id="treasury-health"
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold text-slate-900">Treasury Health</h3>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                          isSurplus
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isSurplus ? 'Healthy Surplus' : 'Net Deficit'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[11px]">Net Cash Flow</span>
                        <span
                          className={`font-mono font-semibold text-sm mt-0.5 block truncate ${
                            isSurplus ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {isSurplus ? '+' : ''}
                          {formatCurrency(metrics.netLiquidity, currency)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[11px]">Savings Ratio</span>
                        <span className="font-mono font-semibold text-sm text-slate-900 mt-0.5 block truncate">
                          {metrics.savingsRate}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                      100% private client-side vault. Data resides securely in local storage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: EXPENSE TRACKING (MULTI-HORIZON EXPENSES)
              ========================================================================= */}
          {currentView === 'expense' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Expense Tracking
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                      Mode A
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Multi-horizon outlays, operating disbursements & searchable ledger
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400">All-Time: </span>
                    <span className="font-semibold text-rose-600">
                      {formatCurrency(metrics.allTimeExpenses, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column: Expense Form & Outlays Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-7">
                  <section id="transaction-section" aria-label="Transaction Entry Form">
                    <TransactionForm
                      currency={currency}
                      savingsGoals={savingsGoals}
                      onAddTransaction={addTransaction}
                      formTab={formTab}
                      onFormTabChange={setFormTab}
                    />
                  </section>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  {/* Expense Horizons Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                      Spending Horizons
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500">Today</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatCurrency(metrics.todayExpenses, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500">7-Day Outlays</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatCurrency(metrics.weeklyExpenses, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50">
                        <span className="text-slate-500">30-Day Outlays</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatCurrency(metrics.monthlyExpenses, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                        <span className="text-rose-700 font-medium">All-Time Expenses</span>
                        <span className="font-mono font-semibold text-rose-700">
                          {formatCurrency(metrics.allTimeExpenses, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Expense Ledger */}
              <section id="history-feed" aria-label="Transaction History Feed">
                <HistoryList
                  transactions={expenseTransactions}
                  filter={filter}
                  onFilterChange={setFilter}
                  currency={currency}
                  onEdit={(tx) => setEditingTransaction(tx)}
                  onDelete={deleteTransaction}
                />
              </section>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: IPON SAVINGS (PIGGY BANK DEPOSITS & VAULTS)
              ========================================================================= */}
          {currentView === 'savings' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Piggy Bank Ipon
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Mode B
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Capital accumulation, coin jars, untouchable reserves & goal allocations
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400">Total Ipon: </span>
                    <span className="font-semibold text-emerald-700">
                      {formatCurrency(metrics.totalSavings, currency)}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400">Savings Rate: </span>
                    <span className="font-semibold text-slate-900">{metrics.savingsRate}%</span>
                  </div>
                </div>
              </div>

              {/* 2-Column: Savings Form & Stash Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-7">
                  <section id="transaction-section" aria-label="Transaction Entry Form">
                    <TransactionForm
                      currency={currency}
                      savingsGoals={savingsGoals}
                      onAddTransaction={addTransaction}
                      formTab={formTab}
                      onFormTabChange={setFormTab}
                    />
                  </section>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  {/* Ipon Stash Summary Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <PiggyBank className="w-4 h-4 text-primary" />
                      Accumulated Capital Stash
                    </h3>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-rose-50/40 border border-slate-200/80">
                      <span className="text-xs text-slate-500 font-medium block">Total Ipon Stash</span>
                      <div className="text-2xl font-mono font-semibold text-slate-900 mt-1">
                        {formatCurrency(metrics.totalSavings, currency)}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-mono font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{metrics.savingsRate}% disciplined savings rate</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <span>Recorded Ipon Deposits</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {savingsTransactions.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                        <span>Active Goals Linked</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {savingsGoals.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Savings Ledger */}
              <section id="history-feed" aria-label="Transaction History Feed">
                <HistoryList
                  transactions={savingsTransactions}
                  filter={filter}
                  onFilterChange={setFilter}
                  currency={currency}
                  onEdit={(tx) => setEditingTransaction(tx)}
                  onDelete={deleteTransaction}
                />
              </section>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: MILESTONE GOALS
              ========================================================================= */}
          {currentView === 'goals' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Target Milestones
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                      Goals
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Capital milestones, automated progress calculation & liquidity health
                  </p>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {savingsGoals.length} active target{savingsGoals.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* 2-Column: Goals Card & Treasury Health */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-7">
                  <section id="savings-goals" aria-label="Savings Goals">
                    <SavingsGoalsCard
                      goals={savingsGoals}
                      currency={currency}
                      onAddGoal={addSavingsGoal}
                      onUpdateGoal={updateSavingsGoal}
                      onDeleteGoal={deleteSavingsGoal}
                    />
                  </section>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  {/* Treasury Health Card */}
                  <div
                    id="treasury-health"
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold text-slate-900">Treasury Health</h3>
                      </div>
                      <span
                        className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${
                          isSurplus
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isSurplus ? 'Healthy Surplus' : 'Net Deficit'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[11px]">Net Cash Flow</span>
                        <span
                          className={`font-mono font-semibold text-sm mt-0.5 block truncate ${
                            isSurplus ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {isSurplus ? '+' : ''}
                          {formatCurrency(metrics.netLiquidity, currency)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 block text-[11px]">Savings Ratio</span>
                        <span className="font-mono font-semibold text-sm text-slate-900 mt-0.5 block truncate">
                          {metrics.savingsRate}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                      Goal allocations are backed by your client-side ipon stash. Deposits linked to goals automatically update progress meters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: SETTINGS & AUTH MANAGEMENT
              ========================================================================= */}
          {currentView === 'settings' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Settings & Auth Management
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                      System
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Session identity, base currency, and backup disaster recovery
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* 1. Authentication & Profile Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-slate-900">Session & Identity</h2>
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Authenticated
                    </span>
                  </div>

                  {/* User Profile Overview */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <UserButton />
                    <div className="text-xs min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 truncate">
                        {primaryEmail || 'Authenticated User'}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate">
                        UID: {userId || 'Local Session'}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      Primary Unique Key
                    </span>
                  </div>

                  {/* Linked Auth Providers & Shield */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Connected Authentication Methods
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Google Provider Badge */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                          <GoogleIcon className="w-4 h-4" />
                          <span className="font-medium text-slate-800">Google OAuth</span>
                        </div>
                        {currentUserProfile?.authProviders.includes('google') || isGoogleAccount ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Linked
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Email/Password Provider Badge */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-600" />
                          <span className="font-medium text-slate-800">Email & Password</span>
                        </div>
                        {currentUserProfile?.authProviders.includes('email_password') || !isGoogleAccount ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Linked
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Guard Guarantee */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Duplicate Account Shield Active</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed font-normal">
                      Google logins with existing emails automatically link and log in to your existing profile. Financial transactions and savings goals are partitioned privately per email account.
                    </p>
                  </div>
                </div>

                {/* 2. Currency Selector Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-slate-900">Regional Currency</h2>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-700">
                      {currency}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="settings-currency-select" className="text-xs text-slate-600 block">
                      Base Standard Currency:
                    </label>
                    <select
                      id="settings-currency-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                      className="w-full text-sm font-mono font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                      {Object.values(CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.symbol} {c.code} — {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-xs flex justify-between items-center">
                    <span className="text-slate-500">Live Sample Format:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(12345.67, currency)}
                    </span>
                  </div>
                </div>

                {/* 3. Data Backup & Storage Tools */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-slate-900">
                        Data Backup & Recovery
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {transactions.length} entries · {savingsGoals.length} goals
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        exportToCSV(transactions);
                        showToast('Exported transactions to CSV', 'info');
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-slate-500 mb-1.5" />
                      <div className="text-xs font-semibold text-slate-900">Export CSV</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Spreadsheet ledger</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        exportToJSON(transactions, savingsGoals);
                        showToast('Exported JSON backup file', 'info');
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <FileCode className="w-5 h-5 text-slate-500 mb-1.5" />
                      <div className="text-xs font-semibold text-slate-900">Export JSON Backup</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Full vault snapshot</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-slate-500 mb-1.5" />
                      <div className="text-xs font-semibold text-slate-900">Restore Backup</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Import JSON file</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to clear all transactions and reset to a clean slate?'
                          )
                        ) {
                          clearAllData();
                        }
                      }}
                      className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5 text-rose-500 mb-1.5" />
                      <div className="text-xs font-semibold text-rose-700">Clear All Data</div>
                      <div className="text-[11px] text-rose-500 mt-0.5">Reset database</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Clean Minimalist Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-6 sm:py-8 text-xs text-slate-500 mt-8 mb-16 lg:mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-semibold text-slate-900">PiggyVault</span>
                <span>·</span>
                <span>Personal Treasury Operating System</span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                Zero cloud tracking · 100% client-side privacy · Inter & JetBrains Mono
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          aria-label="Mobile Navigation"
          className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 lg:hidden px-3 py-1.5 pb-safe shadow-lg"
        >
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                handleSelectView('dashboard');
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
                currentView === 'dashboard'
                  ? 'text-primary font-semibold'
                  : 'text-slate-500 hover:text-slate-800 active:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Overview</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectView('expense');
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
                currentView === 'expense'
                  ? 'text-primary font-semibold'
                  : 'text-slate-500 hover:text-slate-800 active:text-slate-900'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Activity</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectView('dashboard');
                setTimeout(() => {
                  document.getElementById('visual-analytics')?.scrollIntoView?.({ behavior: 'smooth' });
                }, 50);
              }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer min-w-[56px] text-slate-500 hover:text-slate-800 active:text-slate-900"
            >
              <PieChart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectView('goals');
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
                currentView === 'goals'
                  ? 'text-primary font-semibold'
                  : 'text-slate-500 hover:text-slate-800 active:text-slate-900'
              }`}
            >
              <Target className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Milestones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSelectView('expense');
                setTimeout(() => {
                  const formElem = document.getElementById('transaction-section');
                  formElem?.scrollIntoView?.({ behavior: 'smooth' });
                  const amountInput = formElem?.querySelector('input[type="number"]') as HTMLInputElement | null;
                  amountInput?.focus();
                }, 50);
              }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-primary font-semibold transition-colors cursor-pointer min-w-[56px]"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5">Quick Log</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        currency={currency}
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        onSave={(id, updates) => {
          updateTransaction(id, updates);
          setEditingTransaction(null);
        }}
      />

      {/* Micro-interaction Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
