// Shared CRM States Component
import { Button } from '@/components/ui/button';
import { RefreshCw, Building } from 'lucide-react';

interface CRMStatesProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage: string;
  onRetry: () => void;
  onAddNew: () => void;
  children: React.ReactNode;
}

export function CRMStates({ 
  loading, 
  error, 
  isEmpty, 
  emptyMessage, 
  onRetry, 
  onAddNew, 
  children 
}: CRMStatesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Items Found</h3>
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        <Button onClick={onAddNew}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
