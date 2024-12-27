import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('Received semantic search request');
    const { query, entries } = await req.json();
    console.log('Query:', query);
    console.log('Number of entries:', entries.length);

    // Create embedding for the search query using GPT
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes journal entries. Given a search query and journal entries, identify entries that semantically match the query. Consider themes, emotions, and underlying meanings. Return only the most relevant matches."
          },
          {
            role: "user",
            content: `Search Query: "${query}"\n\nJournal Entries:\n${entries.map(e => `Title: ${e.title}\nContent: ${e.content}\n---`).join('\n')}`
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log('OpenAI API response status:', response.status);
    const aiResponse = await response.json();
    console.log('OpenAI API response received');

    if (!response.ok) {
      console.error('OpenAI API error:', aiResponse);
      throw new Error('Failed to process semantic search');
    }

    const analysis = aiResponse.choices[0].message.content;
    console.log('Analysis completed');

    // Get exact matches
    const exactMatches = entries.filter(entry => 
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.content.toLowerCase().includes(query.toLowerCase())
    );

    // Get semantic matches
    const relevantEntries = entries.filter(entry => 
      analysis.toLowerCase().includes(entry.title.toLowerCase()) || 
      analysis.toLowerCase().includes(entry.content.toLowerCase())
    );

    // Remove duplicates from semantic matches
    const semanticMatches = relevantEntries.filter(
      semantic => !exactMatches.some(exact => exact.id === semantic.id)
    );

    console.log('Number of exact matches:', exactMatches.length);
    console.log('Number of semantic matches:', semanticMatches.length);

    return new Response(
      JSON.stringify({
        exactMatches,
        semanticMatches,
        analysis
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in semantic-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});