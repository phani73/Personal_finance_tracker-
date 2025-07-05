import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, PieChart, BarChart3, Target, Calendar } from "lucide-react";

interface EmptyStateProps {
  type: 'transactions' | 'charts' | 'budgets' | 'dashboard';
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState = ({ type, onAction, actionLabel }: EmptyStateProps) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'transactions':
        return {
          icon: <Calendar size={64} className="text-muted-foreground" />,
          title: "No transactions yet",
          description: "Start tracking your finances by adding your first transaction.",
          actionLabel: actionLabel || "Add Transaction"
        };
      case 'charts':
        return {
          icon: <BarChart3 size={64} className="text-muted-foreground" />,
          title: "No data to display",
          description: "Add some transactions to see your spending patterns and trends.",
          actionLabel: actionLabel || "Add Transaction"
        };
      case 'budgets':
        return {
          icon: <Target size={64} className="text-muted-foreground" />,
          title: "No budgets set",
          description: "Create budgets to track your spending and stay on top of your finances.",
          actionLabel: actionLabel || "Set Budget"
        };
      case 'dashboard':
        return {
          icon: <PieChart size={64} className="text-muted-foreground" />,
          title: "Welcome to your dashboard",
          description: "Add transactions and set budgets to see your financial overview here.",
          actionLabel: actionLabel || "Get Started"
        };
      default:
        return {
          icon: <Calendar size={64} className="text-muted-foreground" />,
          title: "No data available",
          description: "There's no data to display at the moment.",
          actionLabel: actionLabel || "Add Data"
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6">
          {content.icon}
        </div>
        <CardTitle className="mb-2 text-xl">
          {content.title}
        </CardTitle>
        <CardDescription className="mb-6 max-w-sm">
          {content.description}
        </CardDescription>
        {onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus size={16} />
            {content.actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const TransactionsEmptyState = ({ onAddTransaction }: { onAddTransaction: () => void }) => {
  return (
    <div className="text-center py-12">
      <Calendar size={64} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Start tracking your finances by adding your first income or expense transaction.
      </p>
      <Button onClick={onAddTransaction} className="gap-2">
        <Plus size={16} />
        Add Your First Transaction
      </Button>
    </div>
  );
};

export const BudgetsEmptyState = ({ onAddBudget }: { onAddBudget: () => void }) => {
  return (
    <div className="text-center py-12">
      <Target size={64} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No budgets set</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Create monthly budgets for your spending categories to track your financial goals.
      </p>
      <Button onClick={onAddBudget} className="gap-2">
        <Target size={16} />
        Set Your First Budget
      </Button>
    </div>
  );
};