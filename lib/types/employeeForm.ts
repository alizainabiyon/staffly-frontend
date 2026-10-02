import { Employee } from './index';

// Form-specific interfaces
export interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  employee?: Employee | null;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
  occupation: string;
}

export interface Experience {
  title: string;
  description: string;
  address: string;
  from: string;
  to: string;
}

export interface DocumentUpload {
  type: string;
  file: File | null;
  url?: string;
}

// Form values interface
export interface EmployeeFormValues {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  address2: string;
  age: number;
  study: string;
  cast: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  joinDate: string;
  bankAccount: string;
}

// Form state interface
export interface EmployeeFormState {
  activeTab: string;
  profilePic: File | null;
  profilePicPreview: string;
  documents: DocumentUpload[];
  emergencyContacts: EmergencyContact[];
  experiences: Experience[];
} 