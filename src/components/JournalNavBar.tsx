import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Search, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { SearchDialog } from './dialogs/SearchDialog';
import { CalendarDialog } from './dialogs/CalendarDialog';

interface JournalNavBarProps {
  onDateChange: (date: string) => void;
  onSearch: (query: string) => void;
}

export const JournalNavBar = ({ onDateChange, onSearch }: JournalNavBarProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-terminal-black z-50 flex justify-between items-center px-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setCalendarDialogOpen(true)}
          className="retro-button"
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button
            onClick={() => setSearchDialogOpen(true)}
            className="retro-button"
          >
            <Search className="h-4 w-4" />
          </Button>
          {showSearch && (
            <div className="absolute top-full mt-2 left-0">
              <Input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-input w-48"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}
        </div>
      </div>
      <Button onClick={handleSignOut} className="retro-button">
        <LogOut className="h-4 w-4" />
      </Button>

      <SearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSearch={onSearch}
      />
      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        onDateSelect={onDateChange}
      />
    </div>
  );
};