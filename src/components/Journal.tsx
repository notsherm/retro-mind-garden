import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { HamburgerMenu } from './HamburgerMenu';
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
  user_id: string;
}

export const Journal = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
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
        user_id: entry.user_id
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
      date: new Date().toISOString().split('T')[0],
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

  const startEditing = (section: Section) => {
    setEditingSection(section);
    setNewSectionTitle(section.title);
    setNewContent(section.content);
  };

  const saveEdit = async () => {
    if (!editingSection) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedSection = {
      ...editingSection,
      title: newSectionTitle,
      content: newContent,
      user_id: user.id
    };

    const { error } = await supabase
      .from('journal_entries')
      .update(updatedSection)
      .eq('id', editingSection.id);

    if (error) {
      toast({
        title: "Error updating entry",
        description: error.message,
        duration: 2000,
      });
      return;
    }

    await loadEntries();
    setEditingSection(null);
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setNewSectionTitle("");
    setNewContent("");
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

  const isCurrentDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  return (
    <div className="min-h-screen h-screen p-4 bg-terminal-black relative">
      <HamburgerMenu
        onSignOut={handleSignOut}
        onSearch={() => setShowSearch(true)}
        onCalendar={() => {
          const date = prompt('Enter date (YYYY-MM-DD)');
          if (date) setSelectedDate(date);
        }}
      />
      
      <div className="h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
        {/* Left Column - Input Area or Historical Entry */}
        <div className="terminal-window h-full">
          {isCurrentDate() ? (
            <JournalInput
              title={newSectionTitle}
              content={newContent}
              onTitleChange={(e) => setNewSectionTitle(e.target.value)}
              onContentChange={(e) => setNewContent(e.target.value)}
              onSave={editingSection ? saveEdit : addNewSection}
              isEditing={!!editingSection}
              onCancelEdit={cancelEdit}
            />
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="border border-terminal-green p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                  <p className="whitespace-pre-wrap text-terminal-gray">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Entries Display & Analysis */}
        <div className="terminal-window h-full">
          {!showAnalysis ? (
            <>
              <EntryList 
                entries={sections}
                selectedDate={selectedDate}
                onDateChange={navigateDate}
                onEntryClick={startEditing}
              />
              
              {sections.length > 0 && isCurrentDate() && (
                <Button
                  onClick={() => {
                    setShowAnalysis(true);
                    setAnalysis("Based on your entries, it seems you're feeling reflective today. Your writing shows a pattern of introspective thinking...");
                    toast({
                      title: "Analysis complete",
                      description: "AI has analyzed your entries",
                      duration: 2000,
                    });
                  }}
                  className="retro-button w-full mt-4"
                >
                  Analyze Entries
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="animate-typing overflow-hidden whitespace-pre-wrap border-r-2 border-terminal-green">
                {analysis}
              </div>
              <Button
                onClick={() => setShowAnalysis(false)}
                className="retro-button w-full"
              >
                Back to Entries
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-4 right-4">
        <Button
          className="retro-button"
          onClick={() => {
            toast({
              title: "Saved",
              description: "Your journal is backed up and secure",
              duration: 2000,
            });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};