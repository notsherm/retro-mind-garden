import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JournalInputProps {
  title: string;
  content: string;
  selectedDate: string;
  selectedEntryId?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export const JournalInput = ({
  title,
  content,
  selectedDate,
  selectedEntryId,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete
}: JournalInputProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isViewingPastDate = selectedDate !== today;

  return (
    <div className="w-full max-w-md space-y-4">
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