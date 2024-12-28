import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Section } from '@/types/journal';
import { JournalState, JournalActions } from './types';
import { format } from 'date-fns';

export const useEntries = (
  state: Pick<JournalState, 'selectedDate' | 'newSectionTitle' | 'newContent'>,
  actions: Pick<JournalActions, 'setSections' | 'setNewSectionTitle' | 'setNewContent'>
) => {
  const { toast } = useToast();

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
    if (!state.newSectionTitle.trim() || !state.newContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your entry",
        duration: 2000,
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please sign in to add entries",
        duration: 2000,
      });
      return;
    }

    // Always use today's date for new entries, regardless of selected date
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const newSection = {
      title: state.newSectionTitle,
      content: state.newContent,
      timestamp: Date.now(),
      date: todayStr, // Use today's date instead of selected date
      user_id: user.id
    };

    const { error } = await supabase
      .from('journal_entries')
      .insert([newSection]);

    if (error) {
      toast({
        title: "Error saving entry",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    // If we're viewing today's date, reload entries
    if (state.selectedDate === todayStr) {
      await loadEntries();
    } else {
      // If viewing a past date, notify user that entry was added to today
      toast({
        title: "Entry added to today",
        description: "New entries are always added to today's date",
        duration: 3000,
      });
    }
    
    actions.setNewSectionTitle("");
    actions.setNewContent("");
  };

  const updateEntry = async (section: Section) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedSection = {
      ...section,
      title: state.newSectionTitle,
      content: state.newContent,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('journal_entries')
      .update(updatedSection)
      .eq('id', section.id);

    if (error) {
      toast({
        title: "Error updating entry",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    await loadEntries();
    actions.setNewSectionTitle("");
    actions.setNewContent("");

    toast({
      title: "Entry updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const deleteEntry = async (entryId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      toast({
        title: "Error deleting entry",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    await loadEntries();
    toast({
      title: "Entry deleted",
      description: "Your entry has been removed",
      duration: 2000,
    });
  };

  return {
    loadEntries,
    addNewSection,
    updateEntry,
    deleteEntry
  };
};
