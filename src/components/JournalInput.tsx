import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface JournalInputProps {
  title: string;
  content: string;
  selectedDate: string;
  selectedEntryId?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete?: () => void;
  isCreating: boolean;
  onStartCreating: () => void;
}

export const JournalInput = ({
  title,
  content,
  selectedDate,
  selectedEntryId,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  isCreating,
  onStartCreating
}: JournalInputProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isViewingPastDate = selectedDate !== today;

  if (!isCreating) {
    return (
      <Button 
        onClick={onStartCreating}
        className="w-full bg-transparent border border-terminal-green text-terminal-green hover:bg-terminal-green/10 transition-colors flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Entry
      </Button>
    );
  }

  return (
    <div className="w-[600px] space-y-4">
      <Input
        type="text"
        placeholder="New section title..."
        value={title}
        onChange={onTitleChange}
        className="retro-input"
      />
      
      <Textarea
        placeholder="Write your thoughts..."
        value={content}
        onChange={onContentChange}
        className="retro-input min-h-[300px] resize-none"
      />

      {isViewingPastDate && !selectedEntryId && (
        <div className="text-terminal-green text-sm">
          Note: New entries will be added to Today's journal
        </div>
      )}

      <Button onClick={onSave} className="retro-button w-full">
        {selectedEntryId ? 'Update Entry' : 'Add Entry'}
      </Button>

      {selectedEntryId && (
        <Button 
          onClick={onDelete} 
          variant="destructive" 
          className="retro-button w-full"
        >
          Delete Entry
        </Button>
      )}
    </div>
  );
};