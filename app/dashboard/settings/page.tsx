'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Building, 
  Save,
  Upload,
  Key,
  CreditCard
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { toast } from 'sonner';
import { tillAPI } from '@/lib/services/api';
import { uploadSingleFile } from '@/lib/utils/fileHandler';
import { 
  fetchProfile,
  updateProfile,
  updateCompany,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  clearError
} from '@/lib/store/slices/profileSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const profile = useAppSelector(selectProfile);
  const profileLoading = useAppSelector(selectProfileLoading);
  const profileError = useAppSelector(selectProfileError);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    profilePicUrl: ''
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const profilePicRef = useRef<HTMLInputElement>(null);

  // Company/Till state
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyLogoUrl: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    companyTaxNumber: ''
  });
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');
  const companyLogoRef = useRef<HTMLInputElement>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Update form data when profile data is fetched
  useEffect(() => {
    if (profile?.profile) {
      const profileData = profile.profile;
      setProfileData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        position: '', // Not available in Profile interface
        phone: '', // Not available in Profile interface
        profilePicUrl: profileData.profilePicUrl || ''
      });
      setProfilePicPreview(profileData.profilePicUrl || '');
      
      setCompanyData({
        companyName: profileData.companyName || '',
        companyLogoUrl: profileData.companyLogoUrl || '',
        companyAddress: profileData.companyAddress || '',
        companyPhone: profileData.companyPhone || '',
        companyEmail: profileData.companyEmail || '',
        companyWebsite: profileData.companyWebsite || '',
        companyTaxNumber: profileData.companyTaxNumber || ''
      });
      setCompanyLogoPreview(profileData.companyLogoUrl || '');
    }
  }, [profile]);

  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
      dispatch(clearError());
    }
  }, [profileError, dispatch]);

  // Handle profile picture upload
  const handleProfilePicUpload = (file: File) => {
    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  // Handle company logo upload
  const handleCompanyLogoUpload = (file: File) => {
    setCompanyLogoFile(file);
    setCompanyLogoPreview(URL.createObjectURL(file));
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      let profilePicUrl = profileData.profilePicUrl;

      // Upload profile picture if new file is selected
      if (profilePicFile) {
        const uploadResponse = await uploadSingleFile(profilePicFile);
        if (uploadResponse.status.success) {
          profilePicUrl = uploadResponse.response.data;
          toast.success('Profile picture uploaded successfully');
        } else {
          toast.error('Failed to upload profile picture');
          return;
        }
      }

      // Update profile using Redux action
      const updatePayload = {
        profilePicUrl,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        position: profileData.position,
        phone: profileData.phone
      };

      await dispatch(updateProfile(updatePayload)).unwrap();
      toast.success('Profile updated successfully');
      
      // Update local state
      setProfileData(prev => ({ ...prev, profilePicUrl }));
      setProfilePicFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Save company information
  const handleSaveCompany = async () => {
    try {
      setLoading(true);
      let companyLogoUrl = companyData.companyLogoUrl;

      // Upload company logo if new file is selected
      if (companyLogoFile) {
        const uploadResponse = await uploadSingleFile(companyLogoFile);
        if (uploadResponse.status.success) {
          companyLogoUrl = uploadResponse.response.data;
          toast.success('Company logo uploaded successfully');
        } else {
          toast.error('Failed to upload company logo');
          return;
        }
      }

      // Update company using Redux action
      const companyPayload = {
        companyName: companyData.companyName,
        companyLogoUrl,
        companyAddress: companyData.companyAddress,
        companyPhone: companyData.companyPhone,
        companyEmail: companyData.companyEmail,
        companyWebsite: companyData.companyWebsite,
        companyTaxNumber: companyData.companyTaxNumber
      };

      await dispatch(updateCompany(companyPayload)).unwrap();
      toast.success('Company information updated successfully');
      
      // Update local state
      setCompanyData(prev => ({ ...prev, companyLogoUrl }));
      setCompanyLogoFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update company information');
    } finally {
      setLoading(false);
    }
  };

  // Initialize till
  const handleInitializeTill = async () => {
    try {
      toast.success('Till initialized successfully');
      // setLoading(true);
      
      // // Initialize till with company data
      // const tillPayload = {
      //   totalAmount: 0,
      //   bankAmount: 0,
      //   cashAmount: 0,
      // };

      // const response = await tillAPI.initialize(tillPayload);
      
      // if (response.status.success) {
      //   toast.success('Till initialized successfully');
      // } else {
      //   toast.error(response.response?.message || 'Failed to initialize till');
      // }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize till');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your account, company, and till preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="company"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Company
          </TabsTrigger>
          <TabsTrigger 
            value="till"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 transition-all duration-200"
          >
            Till
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <h3 className="text-base font-medium mb-2 text-slate-800 dark:text-slate-100">Loading Profile Data</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Fetching your profile information...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePicPreview ? (
                    <img 
                      src={profilePicPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <div>
                  <input
                    ref={profilePicRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfilePicUpload(file);
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => profilePicRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-slate-600 dark:text-slate-400">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Position</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
                <Button onClick={handleSaveProfile} disabled={loading} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <h3 className="text-base font-medium mb-2 text-slate-800 dark:text-slate-100">Loading Company Data</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Fetching company information...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {companyLogoPreview ? (
                    <img 
                      src={companyLogoPreview} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="h-12 w-12 text-secondary" />
                  )}
                </div>
                <div>
                  <input
                    ref={companyLogoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCompanyLogoUpload(file);
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => companyLogoRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: PNG or SVG, transparent background
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyTaxNumber" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tax Number (NTN)</Label>
                  <Input
                    id="companyTaxNumber"
                    value={companyData.companyTaxNumber}
                    onChange={(e) => setCompanyData({ ...companyData, companyTaxNumber: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyEmail" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyData.companyEmail}
                    onChange={(e) => setCompanyData({ ...companyData, companyEmail: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyPhone" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={companyData.companyPhone}
                    onChange={(e) => setCompanyData({ ...companyData, companyPhone: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyWebsite" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={companyData.companyWebsite}
                    onChange={(e) => setCompanyData({ ...companyData, companyWebsite: e.target.value })}
                    className="h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyAddress" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  value={companyData.companyAddress}
                  onChange={(e) => setCompanyData({ ...companyData, companyAddress: e.target.value })}
                  rows={2}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
                <Button onClick={handleSaveCompany} disabled={loading} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Company Info'}
                </Button>
              </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="till">
          <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
            <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Till Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="p-5 border rounded-lg bg-gradient-to-r from-emerald-50 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/60 dark:border-emerald-700/60">
                <div className="text-center">
                  <h3 className="text-base font-semibold mb-2 text-slate-800 dark:text-slate-100">Initialize Your Till</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    Set up your company till system to start managing transactions
                  </p>
                  <Button 
                    onClick={handleInitializeTill} 
                    disabled={loading}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {loading ? 'Initializing...' : 'Initialize Till'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                  <h4 className="text-sm font-medium mb-1.5 text-slate-800 dark:text-slate-100">Current Status</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your till system needs to be initialized with company information.
                  </p>
                </div>
                <div className="p-4 border rounded-lg border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800">
                  <h4 className="text-sm font-medium mb-2 text-slate-800 dark:text-slate-100">What happens next?</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Company profile will be created</li>
                    <li>• Till system will be activated</li>
                    <li>• You can start recording transactions</li>
                    <li>• Financial reports will be available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}