'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loadingText?: string;
  disableCancelOnLoading?: boolean;
}

const variantStyles = {
  default: 'bg-blue-600 hover:bg-blue-700',
  destructive: 'bg-red-600 hover:bg-red-700',
  success: 'bg-green-600 hover:bg-green-700',
  warning: 'bg-orange-600 hover:bg-orange-700',
};

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  size = 'md',
  loadingText = 'Processing...',
  disableCancelOnLoading = true,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
      // Keep dialog open on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading || !disableCancelOnLoading) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCancel}>
      <AlertDialogContent className={sizeStyles[size]}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading && disableCancelOnLoading}
            className={isLoading && disableCancelOnLoading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className={`${variantStyles[variant]} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
