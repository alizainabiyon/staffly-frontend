import { FormikProps } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Calendar, DollarSign } from 'lucide-react';
import { EmployeeFormValues } from '@/lib/types/employeeForm';
import { DEPARTMENTS } from '@/lib/utils/constants';
import { useTranslations } from 'next-intl';

interface EmploymentSectionProps {
  formik: FormikProps<EmployeeFormValues>;
  onGenerateEmployeeId: () => void;
}

export function EmploymentSection({ formik, onGenerateEmployeeId }: EmploymentSectionProps) {
  const t = useTranslations('Employee.form.employment');
  
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <Building className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">{t('fields.employeeId')} *</Label>
            <div className="flex gap-2">
              <Input
                id="employeeId"
                name="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.employeeId')}
                className={formik.touched.employeeId && formik.errors.employeeId ? 'border-red-500' : ''}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={onGenerateEmployeeId}
                className="border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
              >
                {t('actions.generate')}
              </Button>
            </div>
            {formik.touched.employeeId && formik.errors.employeeId && (
              <p className="text-sm text-red-500">{formik.errors.employeeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">{t('fields.position')} *</Label>
            <Input
              id="position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.position')}
              className={formik.touched.position && formik.errors.position ? 'border-red-500' : ''}
            />
            {formik.touched.position && formik.errors.position && (
              <p className="text-sm text-red-500">{formik.errors.position}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">{t('fields.department')} *</Label>
            <Select
              value={formik.values.department}
              onValueChange={(value) => formik.setFieldValue('department', value)}
            >
              <SelectTrigger className={formik.touched.department && formik.errors.department ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('placeholders.department')} />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.department && formik.errors.department && (
              <p className="text-sm text-red-500">{formik.errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">{t('fields.salary')} *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formik.values.salary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.salary')}
                className={`pl-10 ${formik.touched.salary && formik.errors.salary ? 'border-red-500' : ''}`}
              />
            </div>
            {formik.touched.salary && formik.errors.salary && (
              <p className="text-sm text-red-500">{formik.errors.salary}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">{t('fields.joinDate')} *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formik.values.joinDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`pl-10 ${formik.touched.joinDate && formik.errors.joinDate ? 'border-red-500' : ''}`}
              />
            </div>
            {formik.touched.joinDate && formik.errors.joinDate && (
              <p className="text-sm text-red-500">{formik.errors.joinDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccount">{t('fields.bankAccount')}</Label>
            <Input
              id="bankAccount"
              name="bankAccount"
              value={formik.values.bankAccount}
              onChange={formik.handleChange}
              placeholder={t('placeholders.bankAccount')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t('fields.status')}</Label>
          <Select
            value={formik.values.status}
            onValueChange={(value) => formik.setFieldValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              <SelectItem value="terminated">{t('status.terminated')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
} 