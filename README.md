# 🐖 PiggyVault — Smart Ipon & Expense Logging Dashboard

PiggyVault is an automated financial logging web application tailored for tracking accumulated savings ("ipon"), monitoring multi-horizon expenditures (past 24h/today, weekly 7-day, monthly 30-day, and all-time), and recording transactions with automated precise timestamps.

---

## ✨ Key Features

1. **Dynamic Financial Metrics Dashboard**
   - **Total Accumulated Savings / Ipon Balance**: Real-time tracking of money saved to date.
   - **Spending Totals**:
     - *Past 24 Hours / Today*: Dynamic calendar-day and rolling expenditure.
     - *Past 7 Days*: Rolling weekly expenditure.
     - *Past 30 Days*: Rolling monthly expenditure.
     - *All-Time*: Overall spending history.
   - **Remaining Liquidity & Cash Flow Indicator**: Real-time net flow comparing savings deposits against total expenditures with surplus/deficit status.

2. **Dual Transaction Workflows**
   - **Mode A: Expense Entry**
     - Fields: Amount, Purchase/Item Name, Category, Destination/Merchant (where & how money was spent), Editable Auto-Timestamp (`YYYY-MM-DD HH:mm:ss`), and Notes.
     - Live deduction and real-time recalculation of daily/weekly/monthly metrics.
   - **Mode B: Savings ("Piggy Bank / Ipon") Entry**
     - Fields: Deposit Amount, Deposit Title/Goal, Storage Location (Physical Piggy Bank, High-Yield Digital Vault, etc.), Auto-Timestamp, and Notes.
     - Celebration micro-interaction with animated confetti and instant balance increment.
     - Quick preset chips (`+50`, `+100`, `+200`, `+500`, `+1000`, `+2000`).

3. **Savings Goals & Ipon Targets**
   - Create and manage custom milestones (Emergency Fund, Travel/Vacation Stash, Gadget Fund).
   - Visual progress bars with completion percentages and remaining amounts needed.

4. **Visual Analytics & UI/UX**
   - **Category Breakdown**: Dynamic percentage bars and count of items per expense category.
   - **7-Day Cash Flow Dynamics**: Interactive responsive bar chart comparing daily savings deposits (emerald) vs expenses (rose) with hover tooltips.
   - **Multi-Currency Support**: Switch between PHP (₱), USD ($), EUR (€), GBP (£), JPY (¥), and SGD (S$).

5. **Automated Record & History Tracking**
   - Exact timestamps logged for every transaction (`YYYY-MM-DD HH:mm:ss`) alongside friendly relative time.
   - Live Search across Title, Merchant, Category, and Notes.
   - Filter by Transaction Type (All, Expense, Savings), Time Horizon (Today, Past 7 Days, Past 30 Days, Custom Date Range), and Category.
   - Sort by Date (Newest/Oldest), Amount (Highest/Lowest), and Title (A-Z).
   - Edit modal to update any transaction details with immediate recalculation.
   - Delete transactions with confirmation.

6. **Data Persistence & Portability**
   - Full client-side `localStorage` persistence across page reloads.
   - Initial demo sample data on first launch.
   - Export to CSV format.
   - Export to JSON backup and Import from JSON backup.
   - One-click Reset to Demo Data or Clear All Data.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + Vitest
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Micro-interactions**: Canvas Confetti

---

## 🚀 Getting Started

### Development
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```
