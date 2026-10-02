import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Plus, X } from 'lucide-react';
import { EmergencyContact } from '@/lib/types/employeeForm';
import { useTranslations } from 'next-intl';

interface EmergencyContactSectionProps {
  emergencyContacts: EmergencyContact[];
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (index: number, field: keyof EmergencyContact, value: string) => void;
}

export function EmergencyContactSection({
  emergencyContacts,
  onAddContact,
  onRemoveContact,
  onUpdateContact,
}: EmergencyContactSectionProps) {
  const t = useTranslations('Employee.form.emergency');
  
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          {t('title')}
        </CardTitle>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-lg space-y-3 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('contactTitle')} {index + 1}</h4>
              {emergencyContacts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveContact(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('fields.name')}</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => onUpdateContact(index, 'name', e.target.value)}
                  placeholder={t('placeholders.name')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('fields.phone')}</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => onUpdateContact(index, 'phone', e.target.value)}
                  placeholder={t('placeholders.phone')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('fields.relation')}</Label>
                <Select
                  value={contact.relation}
                  onValueChange={(value) => onUpdateContact(index, 'relation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholders.relation')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">{t('relations.father')}</SelectItem>
                    <SelectItem value="Mother">{t('relations.mother')}</SelectItem>
                    <SelectItem value="Spouse">{t('relations.spouse')}</SelectItem>
                    <SelectItem value="Brother">{t('relations.brother')}</SelectItem>
                    <SelectItem value="Sister">{t('relations.sister')}</SelectItem>
                    <SelectItem value="Son">{t('relations.son')}</SelectItem>
                    <SelectItem value="Daughter">{t('relations.daughter')}</SelectItem>
                    <SelectItem value="Friend">{t('relations.friend')}</SelectItem>
                    <SelectItem value="Other">{t('relations.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('fields.occupation')}</Label>
                <Input
                  value={contact.occupation}
                  onChange={(e) => onUpdateContact(index, 'occupation', e.target.value)}
                  placeholder={t('placeholders.occupation')}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddContact}
          className="w-full border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.add')}
        </Button>
      </CardContent>
    </Card>
  );
} 