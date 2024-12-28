import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Section } from '@/types/journal';
import { JournalState, JournalActions } from './types';
import { useToast } from "@/hooks/use-toast";
import { useEntryOperations } from './useEntryOperations';

export const useEntries = (
  state: Pick<JournalState, 'selectedDate' | 'newSectionTitle' | 'newContent'>,
  actions: Pick<JournalActions, 'setSections' | 'setNewSectionTitle' | 'setNewContent'>
) => {
  const { toast } = useToast();
  const { createEntry, updateEntry, deleteEntry } = useEntryOperations();

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('date', state.selectedDate);

    if (error) {
      toast({
        title: "Error loading entries",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    if (data) {
      actions.setSections(data.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        timestamp: entry.timestamp,
        date: entry.date,
        user_id: entry.user_id,
        updated_at: entry.updated_at
      })));
    }
  };

  const addNewSection = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please sign in to add entries",
        duration: 2000,
      });
      return;
    }

    const success = await createEntry(
      state.newSectionTitle,
      state.newContent,
      user.id,
      state.selectedDate
    );

    if (success) {
      if (state.selectedDate === new Date().toISOString().split('T')[0]) {
        await loadEntries();
      }
      actions.setNewSectionTitle("");
      actions.setNewContent("");
    }
  };

  const handleUpdateEntry = async (section: Section) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const success = await updateEntry(
      section,
      state.newSectionTitle,
      state.newContent
    );

    if (success) {
      await loadEntries();
      actions.setNewSectionTitle("");
      actions.setNewContent("");
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const success = await deleteEntry(entryId);
    if (success) {
      await loadEntries();
    }
  };

  return {
    loadEntries,
    addNewSection,
    updateEntry: handleUpdateEntry,
    deleteEntry: handleDeleteEntry
  };
};