import { Section, AnalysisCache } from '@/types/journal';

export interface JournalState {
  sections: Section[];
  newSectionTitle: string;
  newContent: string;
  analysis: string;
  showAnalysis: boolean;
  isAnalyzing: boolean;
  analysisCache: AnalysisCache;
  selectedDate: string;
}

export interface JournalActions {
  setSections: (sections: Section[]) => void;
  setNewSectionTitle: (title: string) => void;
  setNewContent: (content: string) => void;
  setAnalysis: (analysis: string) => void;
  setShowAnalysis: (show: boolean) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisCache: (cache: AnalysisCache | ((prev: AnalysisCache) => AnalysisCache)) => void;
  setSelectedDate: (date: string) => void;
}