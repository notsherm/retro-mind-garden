import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchPanelProps {
  sections: Array<{
    id: string;
    title: string;
    content: string;
    timestamp: number;
    date: string;
  }>;
  onDateSelect: (date: string) => void;
}

export const SearchPanel = ({ sections, onDateSelect }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    const results = sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (results.length > 0) {
      const earliestEntry = results.reduce((earliest, current) => 
        current.timestamp < earliest.timestamp ? current : earliest
      );
      onDateSelect(earliestEntry.date);
      toast({
        title: "Entries found",
        description: `Found ${results.length} matching entries`,
        duration: 2000,
      });
    } else {
      toast({
        title: "No entries found",
        description: "Try different search terms",
        duration: 2000,
      });
    }
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      {showSearch && (
        <Input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="retro-input w-48"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      )}
      <Button
        onClick={() => setShowSearch(!showSearch)}
        className="retro-button"
      >
        <Search className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          const date = prompt('Enter date (YYYY-MM-DD)');
          if (date) onDateSelect(date);
        }}
        className="retro-button"
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
};