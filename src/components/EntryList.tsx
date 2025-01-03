import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { EditHistory } from './EditHistory';
import { JournalInput } from './JournalInput';

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
  onStartCreating: () => void;
  isCreating: boolean;
  // Add new props for input handling
  title: string;
  content: string;
  selectedEntryId?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export const EntryList = ({ 
  entries, 
  selectedDate, 
  onDateChange, 
  onEntryClick,
  onStartCreating,
  isCreating,
  title,
  content,
  selectedEntryId,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  onCancel
}: EntryListProps) => {
  const isCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

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

      {!isCreating ? (
        <Button 
          onClick={onStartCreating}
          className="w-full mb-6 bg-transparent border border-terminal-green text-terminal-green hover:bg-terminal-green/10 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      ) : (
        <div className="mb-6 new-entry-form">
          <JournalInput
            title={title}
            content={content}
            selectedDate={selectedDate}
            selectedEntryId={selectedEntryId}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onSave={onSave}
            onDelete={onDelete}
            isCreating={isCreating}
            onStartCreating={onStartCreating}
            onCancel={onCancel}
          />
        </div>
      )}

      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id} 
            className="journal-entry border border-terminal-green p-4 rounded-lg cursor-pointer hover:bg-terminal-green/5 transition-colors bg-card"
            onClick={() => onEntryClick(entry)}
          >
            <h3 className="text-lg font-bold mb-2 text-terminal-green">{entry.title}</h3>
            <p className="whitespace-pre-wrap text-foreground">{entry.content}</p>
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
            <EditHistory updatedAt={entry.updated_at} />
          </div>
        ))}
      </div>
    </div>
  );
};
