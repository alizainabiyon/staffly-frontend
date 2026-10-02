// Profile Types for Staffly SaaS Application

export interface Profile {
  _id: string;
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicUrl: string | null;
  companyName: string | null;
  companyLogoUrl: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  companyTaxNumber: string | null;
}

export interface ProfileResponse {
  status: {
    code: number;
    success: boolean;
  };
  response: {
    message: string;
    data: Profile;
  };
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicUrl?: string;
}

export interface CompanyUpdateData {
  companyName?: string;
  companyLogoUrl?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyTaxNumber?: string;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  companyUpdateLoading: boolean;
  companyUpdateError: string | null;
}
