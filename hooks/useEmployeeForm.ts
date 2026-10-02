import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from '@/lib/hooks';
import { Employee } from '@/lib/types';
import { 
  EmployeeFormValues, 
  EmployeeFormState, 
  EmergencyContact, 
  Experience, 
  DocumentUpload 
} from '@/lib/types/employeeForm';
import { employeeFormValidationSchema } from '@/lib/validation/employeeFormValidation';
import { 
  uploadSingleFile, 
  uploadMultipleFiles, 
  deleteMultipleFiles 
} from '@/lib/utils/fileHandler';
import { toast } from 'sonner';

interface UseEmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const useEmployeeForm = ({ employee, onSubmit, onClose }: UseEmployeeFormProps) => {
  const dispatch = useAppDispatch();
  
  const [formState, setFormState] = useState<EmployeeFormState>({
    activeTab: 'basic',
    profilePic: null,
    profilePicPreview: employee?.profilePic || '',
    documents: employee?.documents?.map(doc => ({
      type: doc.type,
      file: null,
      url: doc.url
    })) || [
      { type: 'CNIC', file: null },
      { type: 'CV/Resume', file: null },
      { type: 'Educational Certificate', file: null },
    ],
    emergencyContacts: employee?.emergencyContacts || [{ name: '', phone: '', relation: '', occupation: '' }],
    experiences: employee?.experiences || [{ title: '', description: '', address: '', from: '', to: '' }],
  });

  // Track files to be deleted when updating
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize formik configuration to prevent recreation
  const formikConfig = useMemo(() => ({
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
    validationSchema: employeeFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values: EmployeeFormValues) => {
      setIsSubmitting(true);
      try {
        let profilePicUrl = employee?.profilePic || '';
        let documentUrls: { type: string; url: string; uploadedAt: string }[] = [];

        // Upload profile picture if new file is selected
        if (formState.profilePic) {
          try {
            const profilePicResponse = await uploadSingleFile(formState.profilePic);
            profilePicUrl = profilePicResponse.response.data;
            toast.success('Profile picture uploaded successfully');
          } catch (error) {
            toast.error('Failed to upload profile picture');
            setIsSubmitting(false);
            return;
          }
        }

        // Upload documents
        const documentsToUpload = formState.documents.filter(doc => doc.file);
        if (documentsToUpload.length > 0) {
          try {
            const documentResponses = await uploadMultipleFiles(documentsToUpload.map(doc => doc.file!));
            // Handle the response structure based on your API
            if (documentResponses && documentResponses.response && documentResponses.response.data) {
              const urls = Array.isArray(documentResponses.response.data) 
                ? documentResponses.response.data 
                : [documentResponses.response.data];
              
              documentUrls = documentsToUpload.map((doc, index) => ({
                type: doc.type,
                url: urls[index] || '',
                uploadedAt: new Date().toISOString()
              }));
            }
            toast.success('Documents uploaded successfully');
          } catch (error) {
            toast.error('Failed to upload documents');
            setIsSubmitting(false);
            return;
          }
        }

        // Delete old files if updating
        if (employee && filesToDelete.length > 0) {
          try {
            await deleteMultipleFiles(filesToDelete);
            toast.success('Old files deleted successfully');
          } catch (error) {
            console.error('Failed to delete old files:', error);
            // Continue with submission even if file deletion fails
          }
        }

        // Prepare employee data
        const employeeData = {
          ...values,
          profilePic: profilePicUrl,
          documents: [
            ...documentUrls,
            ...formState.documents
              .filter(doc => doc.url && !doc.file)
              .map(doc => ({
                type: doc.type,
                url: doc.url!,
                uploadedAt: new Date().toISOString()
              }))
          ],
          emergencyContacts: formState.emergencyContacts.filter(contact => 
            contact.name && contact.phone && contact.relation
          ),
          experiences: formState.experiences.filter(exp => 
            exp.title && exp.description && exp.from
          ),
        };

        // Let the parent component handle the API call
        await onSubmit(employeeData);
        
        // Only close and reset after successful submission
        onClose();
        formik.resetForm();
      } catch (error: any) {
        // If there's an error, don't close the form
        console.error('Error submitting employee:', error);
        toast.error(error.message || 'Failed to save employee');
      } finally {
        setIsSubmitting(false);
      }
    },
  }), [employee, formState, filesToDelete, onSubmit, onClose]);

  const formik = useFormik<EmployeeFormValues>(formikConfig);

  // Auto-generate employeeId if empty - moved after formik is declared
  useEffect(() => {
    if (!employee && !formik.values.employeeId) {
      generateEmployeeId();
    }
  }, [employee, formik.values.employeeId]);

  const resetForm = useCallback(() => {
    formik.resetForm();
    setFormState({
      activeTab: 'basic',
      profilePic: null,
      profilePicPreview: '',
      documents: [
        { type: 'CNIC', file: null },
        { type: 'CV/Resume', file: null },
        { type: 'Educational Certificate', file: null },
      ],
      emergencyContacts: [{ name: '', phone: '', relation: '', occupation: '' }],
      experiences: [{ title: '', description: '', address: '', from: '', to: '' }],
    });
    setFilesToDelete([]);
  }, [formik]);

  const handleProfilePicUpload = useCallback((file: File) => {
    setFormState(prev => ({
      ...prev,
      profilePic: file,
      profilePicPreview: URL.createObjectURL(file)
    }));
  }, []);

  const handleFileUpload = useCallback((file: File, type: string) => {
    setFormState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.type === type ? { ...doc, file } : doc
      )
    }));
  }, []);

  const addDocumentType = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      documents: [...prev.documents, { type: '', file: null, url: '' }]
    }));
  }, []);

  const removeDocument = useCallback((index: number) => {
    const documentToRemove = formState.documents[index];
    
    // If there's a URL for this document, mark it for deletion
    const urlToDelete = documentToRemove.url;
    if (urlToDelete && urlToDelete !== '') {
      setFilesToDelete(prev => [...prev, urlToDelete]);
    }
    
    setFormState(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  }, [formState.documents]);

  const updateDocumentType = useCallback((index: number, type: string) => {
    const newDocuments = [...formState.documents];
    newDocuments[index].type = type;
    setFormState(prev => ({ ...prev, documents: newDocuments }));
  }, [formState.documents]);

  // Emergency contact handlers
  const addEmergencyContact = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relation: '', occupation: '' }]
    }));
  }, []);

  const removeEmergencyContact = useCallback((index: number) => {
    if (formState.emergencyContacts.length > 1) {
      setFormState(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
      }));
    }
  }, [formState.emergencyContacts.length]);

  const updateEmergencyContact = useCallback((index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...formState.emergencyContacts];
    newContacts[index][field] = value;
    setFormState(prev => ({ ...prev, emergencyContacts: newContacts }));
  }, [formState.emergencyContacts]);

  // Experience handlers
  const addExperience = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      experiences: [...prev.experiences, { title: '', description: '', address: '', from: '', to: '' }]
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    if (formState.experiences.length > 1) {
      setFormState(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
    }
  }, [formState.experiences.length]);

  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...formState.experiences];
    newExperiences[index][field] = value;
    setFormState(prev => ({ ...prev, experiences: newExperiences }));
  }, [formState.experiences]);

  // Utility functions
  const generateEmployeeId = useCallback(() => {
    const timestamp = Date.now().toString().slice(-4);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const generatedId = `EMP${timestamp}${randomNum}`;
    formik.setFieldValue('employeeId', generatedId);
  }, [formik]);

  const setActiveTab = useCallback((tab: string) => {
    setFormState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  return {
    formik,
    formState,
    isSubmitting,
    handleProfilePicUpload,
    handleFileUpload,
    addDocumentType,
    removeDocument,
    updateDocumentType,
    addEmergencyContact,
    removeEmergencyContact,
    updateEmergencyContact,
    addExperience,
    removeExperience,
    updateExperience,
    generateEmployeeId,
    setActiveTab,
  };
};