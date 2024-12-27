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
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);

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
      setIsCreatingEntry(false);
    }
  };

  const handleSave = () => {
    if (selectedEntryId) {
      const entry = sections.find(s => s.id === selectedEntryId);
      if (entry) {
        updateEntry(entry);
        setSelectedEntryId(undefined);
      }
    } else {
      addNewSection();
    }
    setIsCreatingEntry(false);
    setNewSectionTitle('');
    setNewContent('');
  };

  const handleCancel = () => {
    setIsCreatingEntry(false);
    setNewSectionTitle('');
    setNewContent('');
    setSelectedEntryId(undefined);
  };

  if (!sections) {
    return (
      <div className="min-h-screen bg-terminal-black flex items-center justify-center">
        <div className="text-terminal-green">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black relative flex flex-col">
      <JournalNavBar 
        onDateChange={setSelectedDate}
        onSearch={handleSearch}
      />
      
      <div className="flex-1 w-full max-w-7xl mx-auto pt-16 px-4 pb-4 overflow-hidden">
        <div className="flex flex-col items-center h-full">
          <div className="terminal-window right-panel w-full max-w-[600px] z-[1] relative min-h-0 flex-1 overflow-y-auto">
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
                    setIsCreatingEntry(true);
                  }}
                  onStartCreating={() => setIsCreatingEntry(true)}
                  isCreating={isCreatingEntry}
                  title={newSectionTitle}
                  content={newContent}
                  selectedEntryId={selectedEntryId}
                  onTitleChange={(e) => setNewSectionTitle(e.target.value)}
                  onContentChange={(e) => setNewContent(e.target.value)}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onCancel={handleCancel}
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
    </div>
  );
};