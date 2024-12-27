import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, Calendar, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HamburgerMenuProps {
  onSignOut: () => void;
  onSearch: () => void;
  onCalendar: (date: string) => void;
}

export const HamburgerMenu = ({ onSignOut, onSearch, onCalendar }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [dateInput, setDateInput] = useState('');

  const handleCalendarClick = () => {
    setShowCalendarDialog(true);
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
          <Button onClick={onSearch} className="retro-button w-24">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button onClick={handleCalendarClick} className="retro-button w-24">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="terminal-window">
          <form onSubmit={handleDateSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-terminal-green mb-2">
                Enter date (YYYY-MM-DD)
              </label>
              <Input
                id="date"
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="retro-input"
                pattern="\d{4}-\d{2}-\d{2}"
                required
              />
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
                OK
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};