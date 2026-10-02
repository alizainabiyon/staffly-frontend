import { FormikProps } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { EmployeeFormValues } from '@/lib/types/employeeForm';
import { useTranslations } from 'next-intl';

interface BasicInfoSectionProps {
  formik: FormikProps<EmployeeFormValues>;
  profilePicPreview: string;
  onProfilePicUpload: (file: File) => void;
}

export function BasicInfoSection({ formik, profilePicPreview, onProfilePicUpload }: BasicInfoSectionProps) {
  const t = useTranslations('Employee.form.basicInfo');
  
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Profile Picture Upload */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicPreview} />
              <AvatarFallback className="text-lg">
                {formik.values.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="profilePic" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Upload className="h-4 w-4" />
                {t('uploadPhoto')}
              </div>
            </Label>
            <Input
              id="profilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onProfilePicUpload(file);
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              {t('photoDescription')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fields.fullName')} *</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.fullName')}
              className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnic">{t('fields.cnic')} *</Label>
            <Input
              id="cnic"
              name="cnic"
              value={formik.values.cnic}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.cnic')}
              className={formik.touched.cnic && formik.errors.cnic ? 'border-red-500' : ''}
            />
            {formik.touched.cnic && formik.errors.cnic && (
              <p className="text-sm text-red-500">{formik.errors.cnic}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{t('fields.age')} *</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.age')}
              className={formik.touched.age && formik.errors.age ? 'border-red-500' : ''}
            />
            {formik.touched.age && formik.errors.age && (
              <p className="text-sm text-red-500">{formik.errors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cast">{t('fields.cast')} *</Label>
            <Input
              id="cast"
              name="cast"
              value={formik.values.cast}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('placeholders.cast')}
              className={formik.touched.cast && formik.errors.cast ? 'border-red-500' : ''}
            />
            {formik.touched.cast && formik.errors.cast && (
              <p className="text-sm text-red-500">{formik.errors.cast}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="study">{t('fields.study')} *</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="study"
                name="study"
                value={formik.values.study}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.study')}
                className={`pl-10 ${formik.touched.study && formik.errors.study ? 'border-red-500' : ''}`}
              />
            </div>
            {formik.touched.study && formik.errors.study && (
              <p className="text-sm text-red-500">{formik.errors.study}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('fields.email')} *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.email')}
                className={`pl-10 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('fields.phone')} *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.phone')}
                className={`pl-10 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-red-500">{formik.errors.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">{t('fields.address')} *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('placeholders.address')}
                className={`pl-10 ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                rows={3}
              />
            </div>
            {formik.touched.address && formik.errors.address && (
              <p className="text-sm text-red-500">{formik.errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">{t('fields.address2')}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address2"
                name="address2"
                value={formik.values.address2}
                onChange={formik.handleChange}
                placeholder={t('placeholders.address2')}
                className="pl-10"
                rows={2}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 