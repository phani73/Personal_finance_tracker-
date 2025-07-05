import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { transactionService } from './services/transactionService';
import { budgetService } from './services/budgetService';
import { Dashboard } from './components/layout/Dashboard';
import { TransactionForm } from './components/forms/TransactionForm';
import { BudgetForm } from './components/forms/BudgetForm';
import { TransactionList } from './components/transactions/TransactionList';
import { CategoryPieChart } from './components/charts/CategoryPieChart';
import { MonthlyExpensesChart } from './components/charts/MonthlyExpensesChart';
import { BudgetComparisonChart } from './components/charts/BudgetComparisonChart';
import { LoadingSkeleton, ChartSkeleton } from './components/ui/loading-skeleton';
import { EmptyState, BudgetsEmptyState } from './components/ui/empty-state';
import { ErrorState } from './components/ui/error-state';
import { Transaction, Budget } from './types/finance';
import { Plus, LayoutDashboard, Receipt, Target, TrendingUp, BarChart3, Wallet } from 'lucide-react';
import './App.css';

function App() {
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching transactions...');
      setLoading(true);
      const res = await transactionService.getAllTransactions();
      console.log('✅ Transactions fetched:', res); // ✅ correct
      setTransactions(res); // ✅ correct
      
    } catch (err) {
      console.error('❌ Failed to load transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      console.log('🔄 Fetching budgets...');
      setLoadingBudgets(true);
      const res = await budgetService.getAllBudgets();
      console.log('✅ Budgets fetched:', res);
      setBudgets(res);
    } catch (error) {
      console.error('❌ Failed to fetch budgets:', error);
    } finally {
      setLoadingBudgets(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBudgets();
  }, []);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      console.log('➕ Adding transaction:', transaction);
      const savedTransaction = await transactionService.addTransaction(transaction);
      setTransactions(prev => [...prev, savedTransaction]);
      setShowTransactionDialog(false);
      toast({
        title: "Transaction added",
        description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} recorded.`,
      });
    } catch (error) {
      console.error('❌ Failed to add transaction:', error);
      toast({ title: "Error", description: "Failed to add transaction. Please try again.", variant: "destructive" });
    }
  };

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      console.log(`✏️ Updating transaction ${id} with`, updates);
      const updated = await transactionService.updateTransaction(id, updates);
      setTransactions(prev => prev.map(tx => tx.id === id ? updated.data : tx));
      toast({ title: "Transaction updated", description: "Updated successfully." });
    } catch (error) {
      console.error('❌ Failed to update transaction:', error);
      toast({ title: "Error", description: "Failed to update transaction.", variant: "destructive" });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      console.log(`🗑️ Deleting transaction: ${id}`);
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      toast({ title: "Transaction deleted", description: "The transaction has been removed from your records." });
    } catch (error) {
      console.error('❌ Failed to delete transaction:', error);
      toast({ title: "Error", description: "Failed to delete transaction.", variant: "destructive" });
    }
  };

  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      console.log('➕ Adding budget:', budget);
      const savedBudget = await budgetService.addBudget(budget);
      setBudgets(prev => [...prev, savedBudget]);
      setShowBudgetDialog(false);
      toast({ title: "Budget set", description: `Budget of $${budget.amount} set for ${budget.category}.` });
    } catch (error) {
      console.error('❌ Failed to set budget:', error);
      toast({ title: "Error", description: "Failed to set budget. Please try again.", variant: "destructive" });
    }
  };

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      console.log(`✏️ Updating budget ${id} with`, updates);
      const updated = await budgetService.updateBudget(id, updates);
      setBudgets(prev => prev.map(b => b.id === id ? updated : b));
      toast({ title: "Budget updated", description: "Updated successfully." });
    } catch (error) {
      console.error('❌ Failed to update budget:', error);
      toast({ title: "Error", description: "Failed to update budget.", variant: "destructive" });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      console.log(`🗑️ Deleting budget: ${id}`);
      await budgetService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      toast({ title: "Budget deleted", description: "The budget has been removed." });
    } catch (error) {
      console.error('❌ Failed to delete budget:', error);
      toast({ title: "Error", description: "Failed to delete budget.", variant: "destructive" });
    }
  };

  if (error) {
    return <div className="p-4"><ErrorState title="Failed to load application" message={error} onRetry={() => window.location.reload()} retryLabel="Reload App" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto max-w-7xl p-4 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                <Wallet size={24} />
              </div>
              Personal Finance Visualizer
            </h1>
            <p className="text-muted-foreground mt-2">Track your expenses, set budgets, and visualize your financial health</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowTransactionDialog(true)} className="gap-2">
              <Plus size={16} /> Add Transaction
            </Button>
            <Button variant="outline" onClick={() => setShowBudgetDialog(true)} className="gap-2">
              <Target size={16} /> Set Budget
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard size={16} /> Dashboard</TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2"><Receipt size={16} /> Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><TrendingUp size={16} /> Analytics</TabsTrigger>
            <TabsTrigger value="budgets" className="gap-2"><Target size={16} /> Budgets</TabsTrigger>
            <TabsTrigger value="reports" className="gap-2"><BarChart3 size={16} /> Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {loading ? <LoadingSkeleton /> : transactions.length === 0 ? <EmptyState type="dashboard" onAction={() => setShowTransactionDialog(true)} actionLabel="Add First Transaction" /> : <Dashboard transactions={transactions} budgets={budgets} />}
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList transactions={transactions} onUpdate={handleUpdateTransaction} onDelete={handleDeleteTransaction} loading={loading} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
          </TabsContent>

          <TabsContent value="budgets">
            {loadingBudgets ? <ChartSkeleton /> : budgets.length === 0 ? <BudgetsEmptyState onAddBudget={() => setShowBudgetDialog(true)} /> : <BudgetComparisonChart transactions={transactions} budgets={budgets} />}
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <BudgetComparisonChart transactions={transactions} budgets={budgets} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyExpensesChart transactions={transactions} />
                <CategoryPieChart transactions={transactions} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>Record a new income or expense transaction</DialogDescription>
            </DialogHeader>
            <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionDialog(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set Budget</DialogTitle>
              <DialogDescription>Create a monthly spending budget for a category</DialogDescription>
            </DialogHeader>
            <BudgetForm onSubmit={handleAddBudget} onCancel={() => setShowBudgetDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
