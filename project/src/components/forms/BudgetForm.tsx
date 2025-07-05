import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { categories } from '../../data/mockData';
import { Budget } from '../../types/finance';
import { Plus, X, Target } from 'lucide-react';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Budget>;
  isEditing?: boolean;
}

export const BudgetForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: BudgetFormProps) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    amount: initialData?.amount?.toString() || '',
    month: initialData?.month || new Date().toISOString().slice(0, 7),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.month) {
      newErrors.month = 'Please select a month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        category: formData.category,
        amount: Number(formData.amount),
        month: formData.month,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Filter out Income category for budgets
  const budgetCategories = categories.filter(c => c.name !== 'Income');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? 'Edit Budget' : 'Set Budget'}
          <Target size={20} />
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Update your budget details' : 'Set spending limits for your categories'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className={errors.month ? 'border-destructive' : ''}
            />
            {errors.month && (
              <p className="text-sm text-destructive">{errors.month}</p>
            )}
          </div>

          {formData.category && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Selected category:</span>
              <Badge variant="secondary" className="gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: budgetCategories.find(c => c.name === formData.category)?.color 
                  }}
                />
                {formData.category}
              </Badge>
            </div>
          )}

          <Separator />

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1 gap-2">
              <Target size={16} />
              {isEditing ? 'Update' : 'Set'} Budget
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};