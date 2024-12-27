import React, { useState } from 'react';
import { EntryList } from './EntryList';
import { JournalInput } from './JournalInput';
import { Analysis } from './Analysis';
import { SearchPanel } from './SearchPanel';
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
      <SearchPanel 
        sections={sections}
        onDateSelect={setSelectedDate}
      />
      
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