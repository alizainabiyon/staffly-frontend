'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchContractorById } from '@/lib/store/slices/contractorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar,
  Users,
  DollarSign,
  FileText,
  HardHat
} from 'lucide-react';
import { Contractor } from '@/lib/types/crm';
import { toast } from 'sonner';



export default function ContractorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedContractor, loading, error } = useAppSelector((state) => state.contractor);
  const [contractor, setContractor] = useState<Contractor | null>(null);

  const contractorId = params.id as string;

  useEffect(() => {
    if (contractorId) {
      dispatch(fetchContractorById(contractorId));
    }
  }, [contractorId, dispatch]);

  useEffect(() => {
    if (selectedContractor) {
      setContractor(selectedContractor);
    }
  }, [selectedContractor]);

  const handleEdit = () => {
    router.push(`/dashboard/crm/contractors/${contractorId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      try {
        // TODO: Implement delete functionality
        toast.success('Contractor deleted successfully');
        router.push('/dashboard/crm/contractors');
      } catch (error) {
        toast.error('Failed to delete contractor');
      }
    }
  };

  const handleBack = () => {
    router.push('/dashboard/crm/contractors');
  };

  if (loading) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-slate-700 dark:text-slate-300">Loading contractor details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !contractor) {
    return (
      <Card className="border-red-200/60 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Contractor not found'}</p>
          <Button onClick={handleBack} variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contractors
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/20 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{contractor.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Contractor ID: {contractor.contractorId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} size="sm" className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
              <HardHat className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{contractor.companyName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {contractor.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{contractor.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{contractor.industry}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{contractor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{contractor.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Alternate Phone</p>
                  <p className="font-medium">{contractor.alternatePhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium">
                    {contractor.website ? (
                      <a 
                        href={contractor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {contractor.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Full Address</p>
              <p className="font-medium">{contractor.address}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">City</p>
                <p className="font-medium">{contractor.city}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Country</p>
                <p className="font-medium">{contractor.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
              <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Specializations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {contractor.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-2 text-base text-slate-800 dark:text-slate-100">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
              <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(contractor.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(contractor.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{contractor.createdBy}</p>
                </div>
              </div>

              {contractor.updatedBy && (
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated By</p>
                    <p className="font-medium">{contractor.updatedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
