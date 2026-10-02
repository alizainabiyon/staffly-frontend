// Shared CRM Header Component
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CRMHeaderProps {
  title: string;
  description: string;
  onAddClick: () => void;
  addButtonText: string;
}

export function CRMHeader({ title, description, onAddClick, addButtonText }: CRMHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  );
}
