import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute text-secondary h-4 w-4 top-1/2 left-3 -translate-y-1/2" />
      <Input
        className="border-gray-400 bg-gray-300/50 pl-10 text-secondary placeholder:text-gray-500 focus-visible:ring-lemon"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
