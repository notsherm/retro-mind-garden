import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, entries } = await req.json()

    // Create embedding for the search query using GPT
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes journal entries. Given a search query and journal entries, return an array of entries that semantically match the query. Consider themes, emotions, and underlying meanings."
          },
          {
            role: "user",
            content: `Search Query: "${query}"\n\nJournal Entries:\n${entries.map(e => `Title: ${e.title}\nContent: ${e.content}\n---`).join('\n')}`
          }
        ],
        temperature: 0.7,
      }),
    })

    const aiResponse = await response.json()
    const analysis = aiResponse.choices[0].message.content

    // Parse the AI response to get relevant entries
    const relevantEntries = entries.filter(entry => 
      analysis.toLowerCase().includes(entry.title.toLowerCase()) || 
      analysis.toLowerCase().includes(entry.content.toLowerCase())
    )

    return new Response(
      JSON.stringify({
        exactMatches: entries.filter(entry => 
          entry.title.toLowerCase().includes(query.toLowerCase()) ||
          entry.content.toLowerCase().includes(query.toLowerCase())
        ),
        semanticMatches: relevantEntries,
        analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})