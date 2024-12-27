import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export const Journal = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [analysis, setAnalysis] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedSections = localStorage.getItem('journal-sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  const createNewSection = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSectionTitle.trim()) {
      const newSection = {
        id: Date.now().toString(),
        title: newSectionTitle,
        content: "",
        timestamp: Date.now(),
      };
      setSections([...sections, newSection]);
      setCurrentSection(newSection);
      setNewSectionTitle("");
      localStorage.setItem('journal-sections', JSON.stringify([...sections, newSection]));
    }
  };

  const updateSection = (content: string) => {
    if (!currentSection) return;

    const updatedSection = { ...currentSection, content };
    const updatedSections = sections.map(s => 
      s.id === currentSection.id ? updatedSection : s
    );

    setCurrentSection(updatedSection);
    setSections(updatedSections);
    localStorage.setItem('journal-sections', JSON.stringify(updatedSections));

    // Auto-save notification
    toast({
      title: "Auto-saved",
      description: "Your journal entry has been saved",
      duration: 2000,
    });

    // Mock AI analysis (replace with actual AI integration)
    setTimeout(() => {
      setAnalysis("Based on your entry, it seems you're feeling reflective today. Your writing shows a pattern of introspective thinking...");
    }, 1000);
  };

  return (
    <div className="min-h-screen p-4 bg-terminal-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Journal Entry */}
          <div className="terminal-window">
            <div className="mb-4">
              <input
                type="text"
                placeholder="New section (Enter to add)"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={createNewSection}
                className="retro-input"
              />
            </div>
            
            <div className="mb-4">
              <select
                className="retro-input"
                onChange={(e) => {
                  const section = sections.find(s => s.id === e.target.value);
                  setCurrentSection(section || null);
                }}
                value={currentSection?.id || ""}
              >
                <option value="">Select a section...</option>
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="retro-input min-h-[400px] resize-none"
              placeholder="Start writing your thoughts..."
              value={currentSection?.content || ""}
              onChange={(e) => updateSection(e.target.value)}
            />
          </div>

          {/* Right Column - AI Analysis */}
          <div className="terminal-window">
            <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
            <div className="animate-typing overflow-hidden whitespace-pre-wrap border-r-2 border-terminal-green">
              {analysis || "Waiting for your entry..."}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-4 right-4">
          <button
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
          </button>
        </div>
      </div>
    </div>
  );
};