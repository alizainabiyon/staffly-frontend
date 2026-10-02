import { useState, useCallback } from 'react';

interface ConfirmationDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loadingText?: string;
  disableCancelOnLoading?: boolean;
}

interface UseConfirmationDialogReturn {
  dialogState: ConfirmationDialogState;
  showConfirmation: (config: Omit<ConfirmationDialogState, 'open'>) => Promise<boolean>;
  hideConfirmation: () => void;
}

export function useConfirmationDialog(): UseConfirmationDialogReturn {
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>({
    open: false,
    title: '',
    description: '',
    confirmText: '',
    cancelText: 'Cancel',
    variant: 'default',
    size: 'md',
    loadingText: 'Processing...',
    disableCancelOnLoading: true,
  });

  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showConfirmation = useCallback((config: Omit<ConfirmationDialogState, 'open'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
      setDialogState({
        ...config,
        open: true,
      });
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setDialogState(prev => ({ ...prev, open: false }));
  }, [resolvePromise]);

  return {
    dialogState,
    showConfirmation,
    hideConfirmation,
  }
}
