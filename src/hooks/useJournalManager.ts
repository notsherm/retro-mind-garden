import { useState, useEffect } from 'react';
import { Section, AnalysisCache } from '@/types/journal';
import { useEntries } from './journal/useEntries';
import { useAnalysis } from './journal/useAnalysis';

export const useJournalManager = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCache, setAnalysisCache] = useState<AnalysisCache>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const state = {
    sections,
    newSectionTitle,
    newContent,
    analysis,
    showAnalysis,
    isAnalyzing,
    analysisCache,
    selectedDate
  };

  const actions = {
    setSections,
    setNewSectionTitle,
    setNewContent,
    setAnalysis,
    setShowAnalysis,
    setIsAnalyzing,
    setAnalysisCache,
    setSelectedDate
  };

  const { loadEntries, addNewSection, updateEntry, deleteEntry } = useEntries(state, actions);
  const { analyzeEntries } = useAnalysis(state, actions);

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

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
    setSelectedDate,
    addNewSection,
    updateEntry,
    deleteEntry,
    analyzeEntries,
    navigateDate
  };
};