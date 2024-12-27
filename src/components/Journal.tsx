import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { HamburgerMenu } from './HamburgerMenu';
import { Analysis } from './Analysis';
import { useJournalManager } from '@/hooks/useJournalManager';

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
    analyzeEntries,
    navigateDate
  } = useJournalManager();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen h-screen p-4 bg-terminal-black relative">
      <HamburgerMenu
        onSignOut={handleSignOut}
        onSearch={() => {}}
        onCalendar={(date) => setSelectedDate(date)}
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