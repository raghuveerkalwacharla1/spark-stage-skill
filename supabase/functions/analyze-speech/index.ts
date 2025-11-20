import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, wordCount, duration } = await req.json();
    
    if (!transcript) {
      throw new Error('No transcript provided');
    }

    console.log('Analyzing speech...');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Analyze the transcript using Lovable AI
    const analysisPrompt = `Analyze this public speaking transcript and provide:
1. Count of filler words (um, uh, like, you know, basically, actually, etc.)
2. Three specific, actionable improvement suggestions
3. Three scores (0-100):
   - Clarity: How clear and articulate is the speech?
   - Confidence: Does the speaker sound confident and authoritative?
   - Vocal Variety: Does the speech have good pacing and energy?

Transcript (${wordCount} words, ${Math.round(duration)}s):
"${transcript}"

Respond in JSON format:
{
  "fillerWordCount": number,
  "suggestions": ["tip1", "tip2", "tip3"],
  "scores": {
    "clarity": number,
    "confidence": number,
    "vocalVariety": number
  }
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert public speaking coach. Analyze speeches and provide specific, actionable feedback. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`Analysis failed: ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Provide fallback analysis
      analysis = {
        fillerWordCount: 0,
        suggestions: [
          'Practice your delivery to improve clarity',
          'Work on vocal variety and pacing',
          'Focus on confident body language'
        ],
        scores: {
          clarity: 70,
          confidence: 70,
          vocalVariety: 70
        }
      };
    }

    console.log('Analysis complete');

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-speech:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});