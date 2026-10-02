'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchDirectors, deleteDirector } from '@/lib/store/slices/directorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
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
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Director } from '@/lib/types/director';
import { DirectorForm } from './DirectorForm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  createTextColumn, 
  createBadgeColumn, 
  createEditAction,
  createDeleteAction,
  createSelectFilter,
  createDataTableConfig,
  createViewAction
} from '@/lib/utils/dataTableUtils';
import { useTranslations } from 'next-intl';

export function DirectorManagement() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { directors, loading, error } = useAppSelector((state) => state.director);
  const t = useTranslations('Director');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [directorToDelete, setDirectorToDelete] = useState<Director | null>(null);

  useEffect(() => {
    dispatch(fetchDirectors({}));
  }, [dispatch]);

  const handleCreateDirector = async (directorData: any) => {
    // The hook now handles the API call directly
    setIsFormOpen(false);
    dispatch(fetchDirectors({}));
  };

  const handleUpdateDirector = async (directorData: any) => {
    // The hook now handles the API call directly
    setEditingDirector(null);
    dispatch(fetchDirectors({}));
  };

  const handleViewDirector = (director: Director) => {
    router.push(`/dashboard/directors/${director.directorId}`);
  };

  const handleDeleteDirector = (director: Director) => {
    setDirectorToDelete(director);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDirector = async () => {
    if (!directorToDelete) return;
    
    try {
      await dispatch(deleteDirector(directorToDelete.directorId)).unwrap();
        toast.success(t('messages.directorDeleted'));
      dispatch(fetchDirectors({}));
      } catch (error: any) {
        toast.error(error.message || t('messages.deleteFailed'));
    } finally {
      setShowDeleteConfirmation(false);
      setDirectorToDelete(null);
    }
  };

  const startEditing = (director: Director) => {
    setEditingDirector(director);
  };

  // Define table columns
  const columns = [
    createTextColumn<Director>('name', t('table.name'), (director) => director.name, { 
      width: 'w-48' 
    }),
    createTextColumn<Director>('email', t('table.email'), (director) => director.email, { 
      width: 'w-64' 
    }),
    createTextColumn<Director>('phone', t('table.phone'), (director) => director.phone || 'N/A', { 
      width: 'w-32' 
    }),
    createTextColumn<Director>('city', 'City', (director) => director.city || 'N/A', { 
      width: 'w-32' 
    }),
    createTextColumn<Director>('country', 'Country', (director) => director.country || 'N/A', { 
      width: 'w-32' 
    }),
    createTextColumn<Director>('status', t('table.status'), (director) => director.status, { 
      width: 'w-24' 
    }),
  ];

  // Define table actions
  const actions = [
    createEditAction<Director>((director) => startEditing(director), t('editDirector')),
    createDeleteAction<Director>((director) => handleDeleteDirector(director), t('deleteDirector')),
    createViewAction<Director>((director) => handleViewDirector(director), t('viewDirector')),
  ];


  // Create table configuration
  const tableConfig = createDataTableConfig(columns, actions, {
    title: t('title'),
    subtitle: t('subtitle'),
    searchable: true,
    searchPlaceholder: 'Search directors...',
    pagination: {
      enabled: true,
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100]
    },
    sortable: true,
    exportOptions: {
      enablePrint: false,
      enablePDF: false,
      enableCSV: false,
      filename: 'directors-export'
    }
  });

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          {t('addDirector')}
        </Button>
      </div>

      {/* Directors DataTable */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardContent className="p-0">
          <DataTable
            data={directors}
            {...tableConfig}
            loading={loading}
            emptyMessage={t('table.emptyMessage')}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Director Form */}
      <DirectorForm
        open={isFormOpen || !!editingDirector}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingDirector(null);
          }
        }}
        onSubmit={editingDirector ? handleUpdateDirector : handleCreateDirector}
        directorId={editingDirector?.directorId || null}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation.description', { name: directorToDelete?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteConfirmation.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDirector} className="bg-red-600 hover:bg-red-700">
              {t('deleteConfirmation.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
