import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const SearchDialog = ({ open, onOpenChange, onSearch }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [exactMatches, setExactMatches] = useState<SearchResult[]>([]);
  const [semanticMatches, setSemanticMatches] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query empty",
        description: "Please enter a search term",
        duration: 2000,
      });
      return;
    }

    setIsSearching(true);
    try {
      // Get all entries for the current user
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*');

      if (error) throw error;

      // Perform semantic search using the Edge Function
      const { data: searchResults, error: searchError } = await supabase.functions
        .invoke('semantic-search', {
          body: { query: searchQuery, entries },
        });

      if (searchError) throw searchError;

      setExactMatches(searchResults.exactMatches);
      setSemanticMatches(searchResults.semanticMatches.filter(
        (semantic: SearchResult) => !searchResults.exactMatches.find(
          (exact: SearchResult) => exact.id === semantic.id
        )
      ));

      if (searchResults.exactMatches.length === 0 && searchResults.semanticMatches.length === 0) {
        toast({
          title: "No matches found",
          description: "Try a different search term",
          duration: 2000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Search error",
        description: error.message,
        duration: 2000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const ResultSection = ({ title, results }: { title: string; results: SearchResult[] }) => (
    results.length > 0 && (
      <div className="mt-4">
        <h3 className="text-terminal-green font-bold mb-2">{title}</h3>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="border border-terminal-green p-3 rounded cursor-pointer hover:bg-terminal-green/5"
              onClick={() => {
                onSearch(result.date);
                onOpenChange(false);
              }}
            >
              <h4 className="font-bold">{result.title}</h4>
              <p className="text-terminal-gray text-sm line-clamp-2">{result.content}</p>
              <p className="text-terminal-gray text-xs mt-1">Date: {result.date}</p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-terminal-black border border-terminal-green max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-terminal-green">Search Entries</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="retro-input"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
          </div>
          
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-terminal-green" />
            </div>
          ) : (
            <>
              <ResultSection title="Exact Matches" results={exactMatches} />
              <ResultSection title="Related Entries" results={semanticMatches} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};