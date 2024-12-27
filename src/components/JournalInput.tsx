import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JournalInputProps {
  title: string;
  content: string;
  selectedEntryId?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onDelete?: () => void;
}

export const JournalInput = ({
  title,
  content,
  selectedEntryId,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete
}: JournalInputProps) => {
  return (
    <div className="space-y-4">
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
        className="retro-input min-h-[calc(100vh-300px)] resize-none"
      />

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