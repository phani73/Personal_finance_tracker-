import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TransactionForm } from './TransactionForm';
// import { transactionService } from '@/lib/transactionService';
import { Transaction, Budget } from '../../types/finance';
import { categories } from '../../data/mockData';
import { transactionService } from '../../services/transactionService';
// your API service
import { budgetService } from '../../services/budgetService'; 
import {
  DollarSign, TrendingUp, TrendingDown, Calendar, Target, Wallet,
  ArrowUpRight, ArrowDownRight, Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  budgets: Budget[];
}



export const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const netWorth = totalIncome - totalExpenses;
  const monthlyNet = monthlyIncome - monthlyExpenses;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          amount: 0,
          count: 0,
          color: categories.find(c => c.name === transaction.category)?.color || '#85929E'
        };
      }
      acc[transaction.category].amount += transaction.amount;
      acc[transaction.category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number; color: string }>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .slice(0, 4);

  const getCategoryColor = (categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.color || '#85929E';
  };

  const formatAmount = (amount: number, type?: 'income' | 'expense') => {
    const color = type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-foreground';
    const sign = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    return <span className={color}>{sign}${amount.toFixed(2)}</span>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txns, budgetList] = await Promise.all([
          transactionService.getAllTransactions(),
          budgetService.getBudgetsByMonth(currentMonth)
        ]);
  
        console.log("Transactions fetched:", Array.isArray(txns) ? txns : txns?.data);
 // <- Add this
        console.log("Budgets fetched:", budgetList);
  
        setTransactions(txns);
        setBudgets(budgetList);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const currentBudgets = budgets.filter(b => b.month === currentMonth);
  const budgetInsights = currentBudgets.map(budget => {
    const spent = categoryBreakdown[budget.category]?.amount || 0;
    const percentage = (spent / budget.amount) * 100;
    let status: 'over' | 'warning' | 'good' = 'good';
    if (percentage > 100) status = 'over';
    else if (percentage > 80) status = 'warning';
    return { ...budget, spent, percentage, status };
  });

  const overBudgetCount = budgetInsights.filter(b => b.status === 'over').length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Monthly Income</CardTitle>
            <div className="p-2 bg-green-200 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${monthlyIncome.toFixed(2)}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight size={12} />
              This month
            </p>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Monthly Expenses</CardTitle>
            <div className="p-2 bg-red-200 rounded-full">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <ArrowDownRight size={12} />
              This month
            </p>
          </CardContent>
        </Card>

        {/* Monthly Net */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Monthly Net</CardTitle>
            <div className="p-2 bg-blue-200 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyNet >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
              ${monthlyNet.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600">Income - Expenses</p>
          </CardContent>
        </Card>

        {/* Net Worth */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Net Worth</CardTitle>
            <div className="p-2 bg-purple-200 rounded-full">
              <Wallet className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
              ${netWorth.toFixed(2)}
            </div>
            <p className="text-xs text-purple-600">Total balance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your first transaction to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(transaction.category) }} />
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{format(new Date(transaction.date), 'MMM dd')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Spending Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Top Spending Categories
            </CardTitle>
            <CardDescription>This month's biggest expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <div className="text-center py-8">
                <Target size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No expenses this month</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your spending breakdown will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-medium">
                        {category.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                          <span className="font-medium text-sm">{category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {data.count} transaction{data.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">${data.amount.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((data.amount / monthlyExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      {currentBudgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Budget Overview
            </CardTitle>
            <CardDescription>
              Track your progress against this month's budgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetInsights.map(budget => (
                <div key={budget.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(budget.category) }} />
                      <span className="font-medium text-sm">{budget.category}</span>
                    </div>
                    <Badge variant={
                      budget.status === 'over' ? 'destructive' :
                      budget.status === 'warning' ? 'secondary' : 'default'
                    }>
                      {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent</span>
                      <span>${budget.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Budget</span>
                      <span>${budget.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-300 ${
                        budget.status === 'over' ? 'bg-red-500' :
                        budget.status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} style={{ width: `${Math.min(budget.percentage, 100)}%` }} />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {budget.percentage.toFixed(1)}% used
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {overBudgetCount > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Budget Alert:</strong> You're over budget in {overBudgetCount} categor{overBudgetCount === 1 ? 'y' : 'ies'} this month.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
