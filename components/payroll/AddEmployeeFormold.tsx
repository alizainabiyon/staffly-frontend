'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Plus, User, FileText, Phone, Mail, MapPin, Building, Calendar, DollarSign, GraduationCap, Users, Clock, Briefcase } from 'lucide-react';
import { DEPARTMENTS, PAKISTANI_CITIES } from '@/lib/utils/constants';
import { Employee } from '@/lib/types';
import { toast } from 'sonner';

interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  employee?: Employee | null;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
  occupation: string;
}

interface Experience {
  title: string;
  description: string;
  address: string;
  from: string;
  to: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number').required('Phone is required'),
  cnic: Yup.string().matches(/^[0-9]{5}-[0-9]{7}-[0-9]$/, 'Invalid CNIC format (12345-1234567-1)').required('CNIC is required'),
  address: Yup.string().required('Address is required'),
  address2: Yup.string(),
  age: Yup.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100').required('Age is required'),
  study: Yup.string().required('Study/Education is required'),
  cast: Yup.string().required('Cast is required'),
  position: Yup.string().required('Position is required'),
  department: Yup.string().required('Department is required'),
  salary: Yup.number().min(1, 'Salary must be greater than 0').required('Salary is required'),
  joinDate: Yup.string().required('Join date is required'),
  bankAccount: Yup.string(),
  emergencyContacts: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Emergency contact name is required'),
      phone: Yup.string().matches(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number').required('Emergency contact phone is required'),
      relation: Yup.string().required('Relation is required'),
      occupation: Yup.string().required('Occupation is required'),
    })
  ).min(1, 'At least one emergency contact is required'),
  experiences: Yup.array().of(
    Yup.object({
      title: Yup.string().required('Job title is required'),
      description: Yup.string().required('Job description is required'),
      address: Yup.string().required('Company address is required'),
      from: Yup.string().required('Start date is required'),
      to: Yup.string().required('End date is required'),
    })
  ),
});

export function AddEmployeeForm({ open, onOpenChange, onSubmit, employee }: AddEmployeeFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>('');
  const [documents, setDocuments] = useState<{ type: string; file: File | null; url?: string }[]>([
    { type: 'CNIC', file: null },
    { type: 'CV/Resume', file: null },
    { type: 'Educational Certificate', file: null },
    
  ]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', phone: '', relation: '', occupation: '' }
  ]);
  const [experiences, setExperiences] = useState<Experience[]>([
    { title: '', description: '', address: '', from: '', to: '' }
  ]);

  const formik = useFormik({
    initialValues: {
      employeeId: employee?.employeeId || '',
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      cnic: employee?.cnic || '',
      address: employee?.address || '',
      address2: '',
      age: employee?.age || 0,
      study: employee?.study || '',
      cast: employee?.cast || '',
      position: employee?.position || '',
      department: employee?.department || '',
      salary: employee?.salary || 0,
      status: employee?.status || 'active',
      joinDate: employee?.joinDate || '',
      bankAccount: employee?.bankAccount || '',
    },
    validationSchema,
    onSubmit: (values) => {
      const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        ...values,
        profilePic: profilePic ? `/profile-pics/${profilePic.name}` : employee?.profilePic || '',
        documents: documents
          .filter(doc => doc.file || doc.url)
          .map(doc => ({
            type: doc.type,
            url: doc.url || `/documents/${doc.file?.name}`,
            uploadedAt: new Date().toISOString(),
          })),
        emergencyContacts: emergencyContacts.filter(contact => contact.name && contact.phone),
        experiences: experiences.filter(exp => exp.title && exp.description),
       
       
      };

      onSubmit(employeeData);
      onOpenChange(false);
      formik.resetForm();
      setProfilePic(null);
      setProfilePicPreview('');
      setDocuments([
        { type: 'CNIC', file: null },
        { type: 'CV/Resume', file: null },
        { type: 'Educational Certificate', file: null },
      ]);
      setEmergencyContacts([{ name: '', phone: '', relation: '', occupation: '' }]);
      setExperiences([{ title: '', description: '', address: '', from: '', to: '' }]);
      // Toast message is now handled in the parent component
    },
  });

  const handleProfilePicUpload = (file: File) => {
    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (index: number, file: File) => {
    const newDocuments = [...documents];
    newDocuments[index].file = file;
    setDocuments(newDocuments);
  };

  const addDocumentType = () => {
    setDocuments([...documents, { type: '', file: null }]);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '', relation: '', occupation: '' }]);
  };

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...emergencyContacts];
    newContacts[index][field] = value;
    setEmergencyContacts(newContacts);
  };

  const addExperience = () => {
    setExperiences([...experiences, { title: '', description: '', address: '', from: '', to: '' }]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-4);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    formik.setFieldValue('employeeId', `EMP${timestamp}${randomNum}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                          Upload Photo
                        </div>
                      </Label>
                      <Input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfilePicUpload(file);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a professional photo for the employee profile. Recommended size: 400x400 pixels.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter full name"
                        className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-red-500">{formik.errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnic">CNIC *</Label>
                      <Input
                        id="cnic"
                        name="cnic"
                        value={formik.values.cnic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="12345-1234567-1"
                        className={formik.touched.cnic && formik.errors.cnic ? 'border-red-500' : ''}
                      />
                      {formik.touched.cnic && formik.errors.cnic && (
                        <p className="text-sm text-red-500">{formik.errors.cnic}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="25"
                        className={formik.touched.age && formik.errors.age ? 'border-red-500' : ''}
                      />
                      {formik.touched.age && formik.errors.age && (
                        <p className="text-sm text-red-500">{formik.errors.age}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cast">Cast *</Label>
                      <Input
                        id="cast"
                        name="cast"
                        value={formik.values.cast}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter cast"
                        className={formik.touched.cast && formik.errors.cast ? 'border-red-500' : ''}
                      />
                      {formik.touched.cast && formik.errors.cast && (
                        <p className="text-sm text-red-500">{formik.errors.cast}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="study">Study/Education *</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="study"
                          name="study"
                          value={formik.values.study}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g., BSc Computer Science"
                          className={`pl-10 ${formik.touched.study && formik.errors.study ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.study && formik.errors.study && (
                        <p className="text-sm text-red-500">{formik.errors.study}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="employee@pakbiz.com"
                          className={`pl-10 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="+92-300-1234567"
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
                      <Label htmlFor="address">Address Line 1 *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="address"
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Complete address with city"
                          className={`pl-10 ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                          rows={3}
                        />
                      </div>
                      {formik.touched.address && formik.errors.address && (
                        <p className="text-sm text-red-500">{formik.errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Address Line 2</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="address2"
                          name="address2"
                          value={formik.values.address2}
                          onChange={formik.handleChange}
                          placeholder="Additional address information (optional)"
                          className="pl-10"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="employeeId"
                          name="employeeId"
                          value={formik.values.employeeId}
                          onChange={formik.handleChange}
                          placeholder="Auto-generated"
                          readOnly
                        />
                        <Button type="button" variant="outline" onClick={generateEmployeeId}>
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formik.values.position}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Job title/position"
                        className={formik.touched.position && formik.errors.position ? 'border-red-500' : ''}
                      />
                      {formik.touched.position && formik.errors.position && (
                        <p className="text-sm text-red-500">{formik.errors.position}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={formik.values.department}
                        onValueChange={(value) => formik.setFieldValue('department', value)}
                      >
                        <SelectTrigger className={formik.touched.department && formik.errors.department ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select department" />
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
                      <Label htmlFor="salary">Monthly Salary (PKR) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="salary"
                          name="salary"
                          type="number"
                          value={formik.values.salary}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="50000"
                          className={`pl-10 ${formik.touched.salary && formik.errors.salary ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formik.touched.salary && formik.errors.salary && (
                        <p className="text-sm text-red-500">{formik.errors.salary}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date *</Label>
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
                      <Label htmlFor="bankAccount">Bank Account Number</Label>
                      <Input
                        id="bankAccount"
                        name="bankAccount"
                        value={formik.values.bankAccount}
                        onChange={formik.handleChange}
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Employment Status</Label>
                    <Select
                      value={formik.values.status}
                      onValueChange={(value) => formik.setFieldValue('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Emergency Contact {index + 1}</h4>
                        {emergencyContacts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmergencyContact(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Contact Name *</Label>
                          <Input
                            value={contact.name}
                            onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                            placeholder="Emergency contact name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Contact Phone *</Label>
                          <Input
                            value={contact.phone}
                            onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                            placeholder="+92-300-1234567"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Relation *</Label>
                          <Select
                            value={contact.relation}
                            onValueChange={(value) => updateEmergencyContact(index, 'relation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Father">Father</SelectItem>
                              <SelectItem value="Mother">Mother</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Brother">Brother</SelectItem>
                              <SelectItem value="Sister">Sister</SelectItem>
                              <SelectItem value="Son">Son</SelectItem>
                              <SelectItem value="Daughter">Daughter</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Occupation *</Label>
                          <Input
                            value={contact.occupation}
                            onChange={(e) => updateEmergencyContact(index, 'occupation', e.target.value)}
                            placeholder="e.g., Teacher, Engineer, Business"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmergencyContact}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Emergency Contact
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        {experiences.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title *</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            placeholder="e.g., Software Engineer"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Company Address *</Label>
                          <Input
                            value={exp.address}
                            onChange={(e) => updateExperience(index, 'address', e.target.value)}
                            placeholder="Company address"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>From Date *</Label>
                          <Input
                            type="date"
                            value={exp.from}
                            onChange={(e) => updateExperience(index, 'from', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>To Date *</Label>
                          <Input
                            type="date"
                            value={exp.to}
                            onChange={(e) => updateExperience(index, 'to', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Job Description *</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your role and responsibilities"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addExperience}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Experience
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder="Document type (e.g., CNIC, CV, Certificate)"
                          value={doc.type}
                          onChange={(e) => {
                            const newDocs = [...documents];
                            newDocs[index].type = e.target.value;
                            setDocuments(newDocs);
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                        />
                      </div>
                      {doc.file && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {doc.file.name}
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDocumentType}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document Type
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}