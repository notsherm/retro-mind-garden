import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Entry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
}

interface EntryListProps {
  entries: Entry[];
  selectedDate: string;
  onDateChange: (direction: 'prev' | 'next') => void;
  onEntryClick: (entry: Entry) => void;
}

export const EntryList = ({ entries, selectedDate, onDateChange, onEntryClick }: EntryListProps) => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => onDateChange('prev')} className="retro-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-terminal-green">{selectedDate}</span>
        <Button onClick={() => onDateChange('next')} className="retro-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {entries.map((entry) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};