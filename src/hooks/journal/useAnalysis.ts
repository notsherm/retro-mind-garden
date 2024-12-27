import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JournalState, JournalActions } from './types';

export const useAnalysis = (
  state: Pick<JournalState, 'sections' | 'selectedDate' | 'analysisCache'>,
  actions: Pick<JournalActions, 'setAnalysis' | 'setShowAnalysis' | 'setIsAnalyzing' | 'setAnalysisCache'>
) => {
  const { toast } = useToast();

  const analyzeEntries = async () => {
    if (state.analysisCache[state.selectedDate]) {
      actions.setAnalysis(state.analysisCache[state.selectedDate]);
      actions.setShowAnalysis(true);
      return;
    }

    try {
      actions.setIsAnalyzing(true);
      const { data: response, error } = await supabase.functions.invoke('analyze-entries', {
        body: { entries: state.sections }
      });

      if (error) {
        toast({
          title: "Analysis Error",
          description: error.message,
          duration: 2000,
        });
        return;
      }

      actions.setAnalysisCache(prev => ({
        ...prev,
        [state.selectedDate]: response.analysis
      }));

      actions.setAnalysis(response.analysis);
      actions.setShowAnalysis(true);
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
      actions.setIsAnalyzing(false);
    }
  };

  return { analyzeEntries };
};