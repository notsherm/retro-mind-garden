import React from 'react';
import { format } from 'date-fns';

interface EditHistoryProps {
  updatedAt: string | null;
}

export const EditHistory = ({ updatedAt }: EditHistoryProps) => {
  if (!updatedAt) return null;

  // Get creation date from the entry's timestamp
  const creationDate = new Date(updatedAt).toISOString().split('T')[0];
  const updateDate = new Date(updatedAt).toISOString().split('T')[0];

  // Only show edit history if the update date is different from creation date
  if (creationDate === updateDate) return null;

  return (
    <div className="text-xs text-terminal-gray mt-2">
      Edited on {format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}
    </div>
  );
};