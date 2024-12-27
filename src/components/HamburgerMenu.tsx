import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, Calendar, LogOut } from "lucide-react";

interface HamburgerMenuProps {
  onSignOut: () => void;
  onSearch: () => void;
  onCalendar: () => void;
}

export const HamburgerMenu = ({ onSignOut, onSearch, onCalendar }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="retro-button"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className={`fixed top-4 left-16 flex gap-4 transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <Button onClick={onSignOut} className="retro-button w-24">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <Button onClick={onSearch} className="retro-button w-24">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button onClick={onCalendar} className="retro-button w-24">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </div>
    </div>
  );
};