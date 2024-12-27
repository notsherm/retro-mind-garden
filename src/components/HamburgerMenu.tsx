import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, Calendar, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface HamburgerMenuProps {
  onSignOut: () => void;
  onSearch: (query: string) => void;
  onCalendar: (date: string) => void;
}

export const HamburgerMenu = ({ onSignOut, onSearch, onCalendar }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateInput, setDateInput] = useState('');
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSearchDialog(false);
      setSearchQuery('');
    } else {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        duration: 2000,
      });
    }
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateInput) {
      onCalendar(dateInput);
      setShowCalendarDialog(false);
      setDateInput('');
    }
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="retro-button"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div 
          className={`fixed top-4 left-16 flex gap-4 transition-all duration-300 ${
            isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <Button onClick={onSignOut} className="retro-button w-24">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button onClick={() => setShowSearchDialog(true)} className="retro-button w-24">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button onClick={() => setShowCalendarDialog(true)} className="retro-button w-24">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
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
                onClick={() => setShowSearchDialog(false)}
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
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
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
                onClick={() => setShowCalendarDialog(false)}
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
    </>
  );
};