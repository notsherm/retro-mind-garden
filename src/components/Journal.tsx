import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export const Journal = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSections = localStorage.getItem('journal-sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  const addNewSection = () => {
    if (!newSectionTitle.trim() || !newContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your entry",
        duration: 2000,
      });
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      content: newContent,
      timestamp: Date.now(),
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    localStorage.setItem('journal-sections', JSON.stringify(updatedSections));
    
    // Reset inputs
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry added",
      description: "Your journal entry has been saved",
      duration: 2000,
    });
  };

  const analyzeEntries = () => {
    setShowAnalysis(true);
    // Mock AI analysis (replace with actual AI integration)
    setAnalysis("Based on your entries, it seems you're feeling reflective today. Your writing shows a pattern of introspective thinking...");
    
    toast({
      title: "Analysis complete",
      description: "AI has analyzed your entries",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-terminal-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Input Area */}
        <div className="terminal-window">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="New section title..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="retro-input"
            />
            
            <Textarea
              placeholder="Write your thoughts..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="retro-input min-h-[300px] resize-none"
            />

            <Button
              onClick={addNewSection}
              className="retro-button w-full"
            >
              Add Entry
            </Button>
          </div>
        </div>

        {/* Right Column - Entries Display & Analysis */}
        <div className="terminal-window">
          {!showAnalysis ? (
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="border border-terminal-green p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                  <p className="whitespace-pre-wrap text-terminal-gray">{section.content}</p>
                  <div className="text-xs text-terminal-gray mt-2">
                    {new Date(section.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              
              {sections.length > 0 && (
                <Button
                  onClick={analyzeEntries}
                  className="retro-button w-full"
                >
                  Analyze Entries
                </Button>
              )}
            </div>
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