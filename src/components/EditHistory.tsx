import React from 'react';
import { format } from 'date-fns';

interface EditHistoryProps {
  updatedAt: string | null;
}

export const EditHistory = ({ updatedAt }: EditHistoryProps) => {
  if (!updatedAt) return null;

  return (
    <div className="text-xs text-terminal-gray mt-2">
      Edited on {format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}
    </div>
  );
};