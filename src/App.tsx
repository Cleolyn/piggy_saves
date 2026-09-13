import { useState } from 'react';
import { useAuth } from '@clerk/react';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TransactionForm } from './components/TransactionForm';
import { HistoryList } from './components/HistoryList';
import { AnalyticsView } from './components/AnalyticsView';
import { SavingsGoalsCard } from './components/SavingsGoalsCard';
import { EditTransactionModal } from './components/EditTransactionModal';
import { ToastContainer } from './components/Toast';
import { usePiggyVault } from './hooks/usePiggyVault';
import type { Transaction } from './types';
import { formatCurrency } from './utils/formatters';
import { saveTransactions, saveSavingsGoals } from './utils/storage';
import { ArrowRight, PiggyBank } from 'lucide-react';

export function App() {
  const { isLoaded, isSignedIn } = useAuth();

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
  } = usePiggyVault();

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleImportData = (newTransactions: Transaction[], newGoals: typeof savingsGoals) => {
    saveTransactions(newTransactions);
    saveSavingsGoals(newGoals);
    window.location.reload();
  };

  // Loading state while Clerk initializes session
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-strong border border-hairline flex items-center justify-center text-primary animate-pulse">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono text-muted">Authenticating PiggyVault...</p>
        </div>
      </div>
    );
  }

  // Auth Wall: Unauthenticated visitors only see the clean landing page
  if (!isSignedIn) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Header */}
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
      />

      {/* Signature Full-Bleed Dark Editorial Hero */}
      <section className="bg-surface-dark text-on-dark border-b border-surface-dark-elevated overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Editorial Pitch */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-surface-dark-elevated border border-white/10 text-xs font-mono text-on-dark-soft">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
                <span>INSTITUTIONAL IPON OS</span>
                <span className="text-white/20">|</span>
                <span>V2.4</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.05]">
                Save with institutional <br className="hidden sm:inline" />
                <span>precision.</span>
              </h1>

              <p className="text-base sm:text-lg text-on-dark-soft font-normal max-w-lg leading-relaxed">
                Quiet, automated personal treasury logging for multi-horizon expenditures and disciplined accumulated savings.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#transaction-section"
                  className="px-6 py-3 rounded-pill text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <span>Start Logging Free</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#history-feed"
                  className="px-6 py-3 rounded-pill text-sm font-semibold text-white bg-surface-dark-elevated hover:bg-white/10 border border-white/15 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore History Log</span>
                </a>
              </div>
            </div>

            {/* Right: Layered Floating Product-UI Mockup Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none min-h-[220px]">
                {/* Back card at angle */}
                <div className="bg-surface-dark-elevated/70 border border-white/10 rounded-xl p-6 shadow-2xl transform rotate-2 sm:rotate-3 translate-x-3 translate-y-2 opacity-50 pointer-events-none">
                  <div className="flex justify-between items-center text-xs text-on-dark-soft mb-3 font-mono">
                    <span>LIQUIDITY STATUS</span>
                    <span className="text-semantic-up">+SURPLUS</span>
                  </div>
                  <div className="h-16 bg-white/5 rounded-lg" />
                </div>

                {/* Main floating mockup card */}
                <div className="absolute inset-0 bg-surface-dark-elevated border border-white/15 rounded-xl p-6 sm:p-7 shadow-2xl transform -rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-primary">
                        <PiggyBank className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-on-dark-soft uppercase tracking-wider">Total Accumulated Ipon</span>
                        <h4 className="text-xl sm:text-2xl font-mono font-medium text-white">
                          {formatCurrency(metrics.totalSavings, currency)}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-semantic-up bg-semantic-up/10 px-2.5 py-1 rounded-pill border border-semantic-up/20">
                      +{metrics.savingsRate}% Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-on-dark-soft uppercase font-mono block">Today's Spend</span>
                      <span className="text-sm sm:text-base font-mono font-medium text-white mt-1 block">
                        {formatCurrency(metrics.todayExpenses, currency)}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[11px] text-on-dark-soft uppercase font-mono block">Net Cash Flow</span>
                      <span className="text-sm sm:text-base font-mono font-medium text-semantic-up mt-1 block">
                        +{formatCurrency(metrics.netLiquidity, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-on-dark-soft font-mono">
                    <span>Currency Standard</span>
                    <span className="text-white">{currency} Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Dashboard with 96px rhythm */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 sm:space-y-24">
        {/* Dynamic Financial Metrics Dashboard (Stat Cards) */}
        <section aria-label="Financial Summary Metrics">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Treasury Horizons</h2>
            <p className="text-xs text-muted mt-0.5">Multi-horizon spending overview & net liquidity indicator</p>
          </div>
          <MetricCards metrics={metrics} currency={currency} />
        </section>

        {/* Primary Action Zone: Dual Transaction Entry & Savings Goals Tracker */}
        <div id="transaction-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dual Transaction Form (Mode A: Expense vs Mode B: Piggy Bank Savings) */}
          <section className="lg:col-span-7" aria-label="Transaction Entry Form">
            <div className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Transaction Logging</h2>
              <p className="text-xs text-muted mt-0.5">Record multi-destination expenses or deposit directly to your piggy bank</p>
            </div>
            <TransactionForm
              currency={currency}
              savingsGoals={savingsGoals}
              onAddTransaction={addTransaction}
            />
          </section>

          {/* Savings Goals & Ipon Targets Card */}
          <section id="savings-goals" className="lg:col-span-5" aria-label="Savings Goals">
            <div className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Target Milestones</h2>
              <p className="text-xs text-muted mt-0.5">Automated progress tracking toward designated funds</p>
            </div>
            <SavingsGoalsCard
              goals={savingsGoals}
              currency={currency}
              onAddGoal={addSavingsGoal}
              onUpdateGoal={updateSavingsGoal}
              onDeleteGoal={deleteSavingsGoal}
            />
          </section>
        </div>

        {/* Visual Analytics: Category Breakdown & 7-Day Spending Trend */}
        <section id="visual-analytics" aria-label="Visual Analytics">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Liquidity & Cash Flow Analytics</h2>
            <p className="text-xs text-muted mt-0.5">Category distribution and 7-day comparative dynamics</p>
          </div>
          <AnalyticsView
            categories={categoryBreakdown}
            dailyTrends={dailyTrends}
            currency={currency}
            totalSavings={metrics.totalSavings}
            totalExpenses={metrics.allTimeExpenses}
          />
        </section>

        {/* Automated Record & History Tracking (Search, Filter, Sort, Edit, Delete) */}
        <section id="history-feed" aria-label="Transaction History Feed">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Historical Audit Trail</h2>
            <p className="text-xs text-muted mt-0.5">Searchable ledger with exact auto-timestamps</p>
          </div>
          <HistoryList
            transactions={filteredTransactions}
            filter={filter}
            onFilterChange={setFilter}
            currency={currency}
            onEdit={(tx) => setEditingTransaction(tx)}
            onDelete={deleteTransaction}
          />
        </section>
      </main>

      {/* Pre-Footer Dark CTA Band */}
      <section className="bg-surface-dark text-on-dark py-20 sm:py-24 border-t border-surface-dark-elevated">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
            Take total control of your personal treasury.
          </h2>
          <p className="text-base text-on-dark-soft max-w-xl mx-auto font-normal">
            Every transaction logged with exact timestamps, instant local persistence, and multi-horizon cash flow analytics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#transaction-section"
              className="px-7 py-3.5 rounded-pill text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <span>Start Your Ipon Stash</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Closing White-Canvas Footer */}
      <footer className="border-t border-hairline bg-canvas py-12 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">Product</h5>
              <ul className="space-y-2">
                <li><a href="#transaction-section" className="hover:text-ink transition-colors">Expense Logger</a></li>
                <li><a href="#transaction-section" className="hover:text-ink transition-colors">Ipon Stash Deposits</a></li>
                <li><a href="#savings-goals" className="hover:text-ink transition-colors">Milestone Targets</a></li>
                <li><a href="#visual-analytics" className="hover:text-ink transition-colors">7-Day Cash Flow</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">Currencies</h5>
              <ul className="space-y-2 font-mono text-[11px]">
                <li>PHP (₱) · Philippine Peso</li>
                <li>USD ($) · US Dollar</li>
                <li>EUR (€) · Euro</li>
                <li>JPY (¥) · Japanese Yen</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">Security & Privacy</h5>
              <ul className="space-y-2">
                <li>Client-Side Storage</li>
                <li>Zero Cloud Tracking</li>
                <li>Clerk Authentication</li>
                <li>JSON & CSV Backup</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">System</h5>
              <ul className="space-y-2 font-mono text-[11px]">
                <li>PiggyVault OS 2.4</li>
                <li>Inter Display 400</li>
                <li>JetBrains Mono Tabular</li>
                <li>Vite 8 & React 19</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-semibold text-ink">PiggyVault</span>
              <span>·</span>
              <span>All records stored locally in browser storage</span>
            </div>
            <div className="text-[11px] text-muted font-normal">
              Quiet institutional financial interface for smart ipon & budgeting.
            </div>
          </div>
        </div>
      </footer>

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
