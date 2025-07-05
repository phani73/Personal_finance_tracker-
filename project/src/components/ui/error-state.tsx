import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  retryLabel = "Try Again"
}: ErrorStateProps) => {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6">
          <AlertTriangle size={64} className="text-destructive" />
        </div>
        <CardTitle className="mb-2 text-xl text-destructive">
          {title}
        </CardTitle>
        <CardDescription className="mb-6 max-w-sm">
          {message}
        </CardDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw size={16} />
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const TransactionErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="text-center py-12">
      <AlertTriangle size={64} className="mx-auto text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-destructive">Failed to load transactions</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        We couldn't load your transaction data. Please check your connection and try again.
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw size={16} />
        Reload Transactions
      </Button>
    </div>
  );
};

export const ChartErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} />
          Chart Error
        </CardTitle>
        <CardDescription>
          Unable to load chart data
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          There was an error loading the chart. Please try refreshing the data.
        </p>
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw size={16} />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};