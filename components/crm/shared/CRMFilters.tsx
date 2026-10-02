// Shared CRM Filters Component
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { FilterOptions } from '@/lib/types/crm';

interface CRMFiltersProps {
  filters: FilterOptions;
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  filterOptions: {
    type: 'status' | 'type' | 'customerType';
    label: string;
    options: { value: string; label: string }[];
  }[];
}

export function CRMFilters({ 
  filters, 
  onSearchChange, 
  onFilterChange, 
  filterOptions 
}: CRMFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={filters.search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      
      {filterOptions.map((filter) => (
        <Select
          key={filter.type}
          value={filters[filter.type] || 'all'}
          onValueChange={(value) => onFilterChange(filter.type, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
