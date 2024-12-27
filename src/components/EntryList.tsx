import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditHistory } from './EditHistory';

interface Entry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
  updated_at: string;
}

interface EntryListProps {
  entries: Entry[];
  selectedDate: string;
  onDateChange: (direction: 'prev' | 'next') => void;
  onEntryClick: (entry: Entry) => void;
}

export const EntryList = ({ entries, selectedDate, onDateChange, onEntryClick }: EntryListProps) => {
  const isCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  // Filter entries to only show entries from the selected date
  const filteredEntries = entries.filter(entry => entry.date === selectedDate);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => onDateChange('prev')} className="retro-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-terminal-green">{isCurrentDate() ? "Today" : selectedDate}</span>
        <Button 
          onClick={() => onDateChange('next')} 
          className={`retro-button ${!isCurrentDate() ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={isCurrentDate()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id} 
            className="border border-terminal-green p-4 rounded-lg cursor-pointer hover:bg-terminal-green/5 transition-colors"
            onClick={() => onEntryClick(entry)}
          >
            <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
            <p className="whitespace-pre-wrap text-terminal-gray">{entry.content}</p>
            <div className="text-xs text-terminal-gray mt-2">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
            <EditHistory updatedAt={entry.updated_at} />
          </div>
        ))}
      </div>
    </div>
  );
};