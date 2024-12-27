import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Section } from '@/types/journal';

interface AnalysisProps {
  sections: Section[];
  isAnalyzing: boolean;
  onAnalyze: () => void;
  analysis: string;
  showAnalysis: boolean;
  onBack: () => void;
}

export const Analysis = ({
  sections,
  isAnalyzing,
  onAnalyze,
  analysis,
  showAnalysis,
  onBack
}: AnalysisProps) => {
  if (!showAnalysis) {
    return sections.length > 0 ? (
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className={`retro-button mt-4 flex items-center justify-center gap-2 ${
          isAnalyzing ? 'opacity-70' : ''
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Entries'
        )}
      </button>
    ) : null;
  }

  return (
    <div className="space-y-4">
      <div className="animate-typing overflow-hidden whitespace-pre-wrap border-r-2 border-terminal-green">
        {analysis}
      </div>
      <Button
        onClick={onBack}
        className="retro-button w-full"
      >
        Back to Entries
      </Button>
    </div>
  );
};