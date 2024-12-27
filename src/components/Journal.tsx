import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { Analysis } from './Analysis';
import { useJournalManager } from '@/hooks/useJournalManager';
import { Button } from './ui/button';
import { Calendar, Search, LogOut } from 'lucide-react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export const Journal = () => {
  const {
    sections,
    newSectionTitle,
    setNewSectionTitle,
    newContent,
    setNewContent,
    analysis,
    showAnalysis,
    setShowAnalysis,
    isAnalyzing,
    selectedDate,
    setSelectedDate,
    addNewSection,
    updateEntry,
    deleteEntry,
    analyzeEntries,
    navigateDate
  } = useJournalManager();

  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSearch = () => {
    const results = sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (results.length > 0) {
      const earliestEntry = results.reduce((earliest, current) => 
        current.timestamp < earliest.timestamp ? current : earliest
      );
      setSelectedDate(earliestEntry.date);
      toast({
        title: "Entries found",
        description: `Found ${results.length} matching entries`,
        duration: 2000,
      });
    } else {
      toast({
        title: "No entries found",
        description: "Try different search terms",
        duration: 2000,
      });
    }
  };

  const handleDelete = async () => {
    if (selectedEntryId) {
      await deleteEntry(selectedEntryId);
      setSelectedEntryId(undefined);
      setNewSectionTitle('');
      setNewContent('');
    }
  };

  return (
    <div className="min-h-screen h-screen p-4 bg-terminal-black relative">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-terminal-black z-50 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const date = prompt('Enter date (YYYY-MM-DD)');
              if (date) setSelectedDate(date);
            }}
            className="retro-button"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button
              onClick={() => setShowSearch(!showSearch)}
              className="retro-button"
            >
              <Search className="h-4 w-4" />
            </Button>
            {showSearch && (
              <div className="absolute top-full mt-2 left-0">
                <Input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="retro-input w-48"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            )}
          </div>
        </div>
        <Button onClick={handleSignOut} className="retro-button">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
        <div className="terminal-window h-full">
          <JournalInput
            title={newSectionTitle}
            content={newContent}
            selectedEntryId={selectedEntryId}
            onTitleChange={(e) => setNewSectionTitle(e.target.value)}
            onContentChange={(e) => setNewContent(e.target.value)}
            onSave={() => {
              if (selectedEntryId) {
                const entry = sections.find(s => s.id === selectedEntryId);
                if (entry) {
                  updateEntry(entry);
                  setSelectedEntryId(undefined);
                }
              } else {
                addNewSection();
              }
            }}
            onDelete={handleDelete}
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
                  setSelectedEntryId(entry.id);
                }}
              />
              
              <Analysis
                sections={sections}
                isAnalyzing={isAnalyzing}
                onAnalyze={analyzeEntries}
                analysis={analysis}
                showAnalysis={showAnalysis}
                onBack={() => setShowAnalysis(false)}
              />
            </>
          ) : (
            <Analysis
              sections={sections}
              isAnalyzing={isAnalyzing}
              onAnalyze={analyzeEntries}
              analysis={analysis}
              showAnalysis={showAnalysis}
              onBack={() => setShowAnalysis(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};