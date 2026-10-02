import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, X } from 'lucide-react';
import { Experience } from '@/lib/types/employeeForm';
import { useTranslations } from 'next-intl';

interface ExperienceSectionProps {
  experiences: Experience[];
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  onUpdateExperience: (index: number, field: keyof Experience, value: string) => void;
}

export function ExperienceSection({
  experiences,
  onAddExperience,
  onRemoveExperience,
  onUpdateExperience,
}: ExperienceSectionProps) {
  const t = useTranslations('Employee.form.experience');
  
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
            <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          {t('title')}
        </CardTitle>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {experiences.map((exp, index) => (
          <div key={index} className="p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg space-y-3 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('experienceTitle')} {index + 1}</h4>
              {experiences.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExperience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('fields.title')}</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => onUpdateExperience(index, 'title', e.target.value)}
                  placeholder={t('placeholders.title')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('fields.address')}</Label>
                <Input
                  value={exp.address}
                  onChange={(e) => onUpdateExperience(index, 'address', e.target.value)}
                  placeholder={t('placeholders.address')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('fields.from')}</Label>
                <Input
                  type="date"
                  value={exp.from}
                  onChange={(e) => onUpdateExperience(index, 'from', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('fields.to')}</Label>
                <Input
                  type="date"
                  value={exp.to}
                  onChange={(e) => onUpdateExperience(index, 'to', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('fields.description')}</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => onUpdateExperience(index, 'description', e.target.value)}
                placeholder={t('placeholders.description')}
                rows={3}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddExperience}
          className="w-full border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.add')}
        </Button>
      </CardContent>
    </Card>
  );
} 