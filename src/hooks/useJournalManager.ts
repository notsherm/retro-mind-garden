import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Section, AnalysisCache } from '@/types/journal';

export const useJournalManager = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCache, setAnalysisCache] = useState<AnalysisCache>({});
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

  const analyzeEntries = async () => {
    if (analysisCache[selectedDate]) {
      setAnalysis(analysisCache[selectedDate]);
      setShowAnalysis(true);
      return;
    }

    try {
      setIsAnalyzing(true);
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

      setAnalysisCache(prev => ({
        ...prev,
        [selectedDate]: response.analysis
      }));

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
    } finally {
      setIsAnalyzing(false);
    }
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

  return {
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
    addNewSection,
    updateEntry,
    analyzeEntries,
    navigateDate
  };
};