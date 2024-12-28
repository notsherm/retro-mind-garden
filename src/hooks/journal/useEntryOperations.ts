import { supabase } from "@/integrations/supabase/client";
import { Section } from '@/types/journal';
import { formatEntryDate, formatDisplayDate, getEntryTimestamp } from '@/utils/dateUtils';
import { useToast } from "@/hooks/use-toast";

export const useEntryOperations = () => {
  const { toast } = useToast();

  const createEntry = async (
    title: string,
    content: string,
    userId: string,
    selectedDate: string
  ): Promise<boolean> => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your entry",
        duration: 2000,
      });
      return false;
    }

    const now = new Date();
    const entryDate = formatEntryDate(now);

    const newEntry = {
      title,
      content,
      timestamp: getEntryTimestamp(now),
      date: entryDate,
      user_id: userId
    };

    const { error } = await supabase
      .from('journal_entries')
      .insert([newEntry]);

    if (error) {
      toast({
        title: "Error saving entry",
        description: error.message,
        duration: 2000,
      });
      return false;
    }

    if (selectedDate !== entryDate) {
      toast({
        title: "Entry added",
        description: `Entry has been added to ${formatDisplayDate(now)}`,
        duration: 3000,
      });
    }

    return true;
  };

  const updateEntry = async (
    section: Section,
    title: string,
    content: string
  ): Promise<boolean> => {
    const updatedSection = {
      ...section,
      title,
      content,
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
      return false;
    }

    toast({
      title: "Entry updated",
      description: "Your changes have been saved",
      duration: 2000,
    });

    return true;
  };

  const deleteEntry = async (entryId: string): Promise<boolean> => {
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
      return false;
    }

    toast({
      title: "Entry deleted",
      description: "Your entry has been removed",
      duration: 2000,
    });

    return true;
  };

  return {
    createEntry,
    updateEntry,
    deleteEntry
  };
};