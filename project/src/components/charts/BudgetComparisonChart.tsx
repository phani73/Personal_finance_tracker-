import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Budget } from '../../types/finance';
import { Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetComparisonChart = ({ transactions, budgets }: BudgetComparisonChartProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = budgets
    .filter(b => b.month === currentMonth)
    .map(budget => {
      const actual = monthlyExpenses[budget.category] || 0;
      const percentage = (actual / budget.amount) * 100;
      let status: 'over' | 'under' | 'on-track' = 'under';
      
      if (percentage > 100) status = 'over';
      else if (percentage > 80) status = 'on-track';
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        percentage: Math.min(percentage, 150), // Cap at 150% for chart display
        status,
        over: actual > budget.amount,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'over': return '#EF4444';
      case 'on-track': return '#F59E0B';
      case 'under': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <AlertTriangle size={16} className="text-red-500" />;
      case 'on-track': return <TrendingUp size={16} className="text-yellow-500" />;
      case 'under': return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string, percentage: number) => {
    const variant = status === 'over' ? 'destructive' : status === 'on-track' ? 'secondary' : 'default';
    const text = status === 'over' ? 'Over Budget' : status === 'on-track' ? 'On Track' : 'Under Budget';
    
    return (
      <Badge variant={variant} className="gap-1">
        {getStatusIcon(status)}
        {text}
      </Badge>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Budget: ${data.budget.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Actual: ${data.actual.toFixed(2)}
          </p>
          <p className="text-sm font-medium">
            {(data.actual / data.budget * 100).toFixed(1)}% of budget
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Budget vs Actual
          </CardTitle>
          <CardDescription>
            Track your spending against your budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No budgets set for this month</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create a budget to start tracking your spending
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalBudget = chartData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = chartData.reduce((sum, item) => sum + item.actual, 0);
  const overallPercentage = (totalActual / totalBudget) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={20} />
          Budget vs Actual
        </CardTitle>
        <CardDescription>
          Your spending compared to budget for {new Date(currentMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              ${totalBudget.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              ${totalActual.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${overallPercentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
              {overallPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Budget Used</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="budget" fill="hsl(var(--muted))" name="Budget" radius={[2, 2, 0, 0]} />
            <Bar dataKey="actual" name="Actual" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-sm">Category Status</h4>
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.category}</span>
                  {getStatusBadge(item.status, (item.actual / item.budget) * 100)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    ${item.actual.toFixed(2)} / ${item.budget.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((item.actual / item.budget) * 100).toFixed(1)}% used
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};