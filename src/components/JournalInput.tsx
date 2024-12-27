import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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
  onCancel: () => void;
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
  onCancel
}: JournalInputProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isViewingPastDate = selectedDate !== today;

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-terminal-green">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-terminal-green font-bold">
          {selectedEntryId ? 'Edit Entry' : 'New Entry'}
        </h3>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="text-terminal-green hover:bg-terminal-green/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

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
        className="retro-input min-h-[200px] resize-none"
      />

      {isViewingPastDate && !selectedEntryId && (
        <div className="text-terminal-green text-sm">
          Note: New entries will be added to Today's journal
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={onSave} className="retro-button flex-1">
          {selectedEntryId ? 'Update Entry' : 'Add Entry'}
        </Button>

        {selectedEntryId && (
          <Button 
            onClick={onDelete} 
            variant="destructive" 
            className="retro-button"
          >
            Delete Entry
          </Button>
        )}
      </div>
    </div>
  );
};