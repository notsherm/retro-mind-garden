import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { HamburgerMenu } from './HamburgerMenu';

interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
  user_id: string;
  updated_at: string;
}

export const Journal = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('date', selectedDate);

    if (error) {
      toast({
        title: "Error loading entries",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    if (data) {
      setSections(data.map(entry => ({
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
    if (!newSectionTitle.trim() || !newContent.trim()) {
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

    const newSection = {
      title: newSectionTitle,
      content: newContent,
      timestamp: Date.now(),
      date: selectedDate,
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

    await loadEntries();
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry added",
      description: "Your journal entry has been saved",
      duration: 2000,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const updateEntry = async (section: Section) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedSection = {
      ...section,
      title: newSectionTitle,
      content: newContent,
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
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    } else if (direction === 'next' && currentDate < today) {
      newDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  const analyzeEntries = async () => {
    try {
      const { data: response, error } = await supabase.functions.invoke('analyze-entries', {
        body: { entries: sections }
      });

      if (error) {
        toast({
          title: "Analysis Error",
          description: error.message,
          duration: 2000,
        });
        return;
      }

      setAnalysis(response.analysis);
      setShowAnalysis(true);
      toast({
        title: "Analysis complete",
        description: "AI has analyzed your entries",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze entries",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen h-screen p-4 bg-terminal-black relative">
      <HamburgerMenu
        onSignOut={handleSignOut}
        onSearch={() => {}}
        onCalendar={() => {
          const date = prompt('Enter date (YYYY-MM-DD)');
          if (date) setSelectedDate(date);
        }}
      />
      
      <div className="h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
        <div className="terminal-window h-full">
          <JournalInput
            title={newSectionTitle}
            content={newContent}
            onTitleChange={(e) => setNewSectionTitle(e.target.value)}
            onContentChange={(e) => setNewContent(e.target.value)}
            onSave={addNewSection}
          />
        </div>

        <div className="terminal-window h-full flex flex-col">
          {!showAnalysis ? (
            <>
              <EntryList 
                entries={sections}
                selectedDate={selectedDate}
                onDateChange={navigateDate}
                onEntryClick={(entry) => {
                  setNewSectionTitle(entry.title);
                  setNewContent(entry.content);
                  toast({
                    title: "Editing entry",
                    description: "You are now editing a past entry",
                    duration: 2000,
                  });
                }}
              />
              
              {sections.length > 0 && (
                <button
                  onClick={analyzeEntries}
                  className="retro-button mt-4"
                >
                  Analyze Entries
                </button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="animate-typing overflow-hidden whitespace-pre-wrap border-r-2 border-terminal-green">
                {analysis}
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="retro-button w-full"
              >
                Back to Entries
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
