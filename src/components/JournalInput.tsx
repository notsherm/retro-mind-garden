import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JournalInputProps {
  title: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}

export const JournalInput = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isEditing,
  onCancelEdit
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

      {isEditing ? (
        <div className="flex gap-2">
          <Button onClick={onSave} className="retro-button flex-1">
            Save Changes
          </Button>
          <Button onClick={onCancelEdit} className="retro-button flex-1">
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={onSave} className="retro-button w-full">
          Add Entry
        </Button>
      )}
    </div>
  );
};