import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDateSelect: (date: string) => void;
}

export const CalendarDialog = ({ open, onOpenChange, onDateSelect }: CalendarDialogProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert from HTML date format (YYYY-MM-DD) to desired format (MM/DD/YYYY)
    const date = new Date(e.target.value);
    const formattedDate = format(date, 'MM/dd/yyyy');
    onDateSelect(formattedDate);
    onOpenChange(false);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const formattedDate = format(today, 'MM/dd/yyyy');
    onDateSelect(formattedDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-terminal-black border border-terminal-green">
        <DialogHeader>
          <DialogTitle className="text-terminal-green">Select Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="date"
            onChange={handleDateChange}
            className="retro-input"
            max={new Date().toISOString().split('T')[0]}
            autoFocus
          />
          <Button 
            onClick={handleTodayClick}
            className="retro-button w-full"
          >
            Go to Today
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};