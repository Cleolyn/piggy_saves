import { useState } from 'react';
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
import { Sparkles, Heart } from 'lucide-react';

export function App() {
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
    resetToDefaults,
    clearAllData,
  } = usePiggyVault();

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleImportData = (newTransactions: Transaction[], newGoals: typeof savingsGoals) => {
    // Reset or append
    localStorage.setItem('piggyvault_transactions_v1', JSON.stringify(newTransactions));
    localStorage.setItem('piggyvault_goals_v1', JSON.stringify(newGoals));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        totalSavings={metrics.totalSavings}
        savingsRate={metrics.savingsRate}
        transactions={transactions}
        savingsGoals={savingsGoals}
        onResetData={resetToDefaults}
        onClearData={clearAllData}
        onImportData={handleImportData}
        showToast={showToast}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Financial Metrics Dashboard (Stat Cards) */}
        <section aria-label="Financial Summary Metrics">
          <MetricCards metrics={metrics} currency={currency} />
        </section>

        {/* Primary Action Zone: Dual Transaction Entry & Savings Goals Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dual Transaction Form (Mode A: Expense vs Mode B: Piggy Bank Savings) */}
          <section className="lg:col-span-7" aria-label="Transaction Entry Form">
            <TransactionForm
              currency={currency}
              savingsGoals={savingsGoals}
              onAddTransaction={addTransaction}
            />
          </section>

          {/* Savings Goals & Ipon Targets Card */}
          <section className="lg:col-span-5" aria-label="Savings Goals">
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
        <section aria-label="Visual Analytics">
          <AnalyticsView
            categories={categoryBreakdown}
            dailyTrends={dailyTrends}
            currency={currency}
            totalSavings={metrics.totalSavings}
            totalExpenses={metrics.allTimeExpenses}
          />
        </section>

        {/* Automated Record & History Tracking (Search, Filter, Sort, Edit, Delete) */}
        <section aria-label="Transaction History Feed">
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>PiggyVault Financial Dashboard</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Built for smart ipon & budgeting
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with care</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>· All data saved locally</span>
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
