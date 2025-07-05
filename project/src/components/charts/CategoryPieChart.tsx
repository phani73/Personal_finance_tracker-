import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '../../types/finance';
import { categories } from '../../data/mockData';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0,
          color: categories.find(c => c.name === category)?.color || '#85929E'
        };
      }
      acc[category].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  const chartData = Object.values(categoryData)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 categories

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon size={20} />
          Category Breakdown
        </CardTitle>
        <CardDescription>
          Your spending by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            ${totalExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Expenses</div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground truncate">
                  {item.name}
                </span>
                <span className="text-sm font-medium ml-auto">
                  ${item.value.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};