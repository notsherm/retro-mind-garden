import React, { useState } from 'react';
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { Analysis } from './Analysis';
import { JournalNavBar } from './JournalNavBar';
import { useJournalManager } from '@/hooks/useJournalManager';
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
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>();

  const handleSearch = (query: string) => {
    const results = sections.filter(section => 
      section.title.toLowerCase().includes(query.toLowerCase()) ||
      section.content.toLowerCase().includes(query.toLowerCase())
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

  if (!sections) {
    return (
      <div className="min-h-screen bg-terminal-black flex items-center justify-center">
        <div className="text-terminal-green">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black relative">
      <JournalNavBar 
        onDateChange={setSelectedDate}
        onSearch={handleSearch}
      />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 px-4 pb-4 relative">
        <div className="terminal-window left-panel sticky top-20 h-[calc(100vh-6rem)] z-[2]">
          <JournalInput
            title={newSectionTitle}
            content={newContent}
            selectedDate={selectedDate}
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

        <div className="terminal-window right-panel z-[1]">
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