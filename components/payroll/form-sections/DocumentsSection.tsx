import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, X } from 'lucide-react';
import { DocumentUpload } from '@/lib/types/employeeForm';
import { useTranslations } from 'next-intl';

interface DocumentsSectionProps {
  documents: DocumentUpload[];
  onAddDocument: () => void;
  onRemoveDocument: (index: number) => void;
  onFileUpload: (index: number, file: File) => void;
  onDocumentTypeChange: (index: number, type: string) => void;
}

export function DocumentsSection({
  documents,
  onAddDocument,
  onRemoveDocument,
  onFileUpload,
  onDocumentTypeChange,
}: DocumentsSectionProps) {
  const t = useTranslations('Employee.form.documents');
  
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
            <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          {t('title')}
        </CardTitle>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg bg-white/50 dark:bg-slate-900/50">
            <div className="flex-1">
              <Input
                placeholder={t('fields.type')}
                value={doc.type}
                onChange={(e) => onDocumentTypeChange(index, e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload(index, file);
                }}
              />
            </div>
            {doc.file && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {doc.file.name}
              </Badge>
            )}
            {doc.url && !doc.file && (
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {t('existingFile')}
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveDocument(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAddDocument}
          className="w-full border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.add')}
        </Button>
      </CardContent>
    </Card>
  );
} 