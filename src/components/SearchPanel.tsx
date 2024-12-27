import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        duration: 2000,
      });
      return;
    }

    const results = sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (results.length > 0) {
      const earliestEntry = results.reduce((earliest, current) => 
        current.timestamp < earliest.timestamp ? current : earliest
      );
      onDateSelect(earliestEntry.date);
      setShowSearch(false);
      setSearchQuery('');
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

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateInput) {
      onDateSelect(dateInput);
      setShowCalendar(false);
      setDateInput('');
    }
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2">
      <Button
        onClick={() => setShowCalendar(true)}
        className="retro-button w-12 h-12 flex items-center justify-center"
      >
        <Calendar className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => setShowSearch(true)}
        className="retro-button w-12 h-12 flex items-center justify-center"
      >
        <Search className="h-6 w-6" />
      </Button>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="terminal-window">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-terminal-green">Search Entries</h2>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search your entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <p className="text-sm text-terminal-gray">
                Search through your journal entries by title or content
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowSearch(false)}
                className="retro-button"
              >
                Cancel
              </Button>
              <Button onClick={handleSearch} className="retro-button">
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="terminal-window">
          <form onSubmit={handleDateSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-terminal-green">Select Date</h2>
            <div>
              <Input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="retro-input"
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-terminal-gray mt-2">
                Select a date to view or create entries
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="retro-button"
              >
                Cancel
              </Button>
              <Button type="submit" className="retro-button">
                Go to Date
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};