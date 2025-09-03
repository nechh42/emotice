import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AI insights generation...');
    
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client with service role key for writing
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.id);

    const { moodEntry } = await req.json();
    
    if (!moodEntry) {
      throw new Error('Mood entry is required');
    }

    console.log('Generating insights for mood:', moodEntry.mood);

    // Create AI prompt based on mood data
    const prompt = `As an emotional wellness AI assistant, provide personalized insights for this mood entry:

Mood: ${moodEntry.mood} (${moodEntry.emoji})
Intensity: ${moodEntry.intensity}/10
Note: ${moodEntry.note || 'No additional notes'}
Activities: ${moodEntry.activities?.join(', ') || 'None specified'}
Tags: ${moodEntry.tags?.join(', ') || 'None'}

Please provide:
1. A brief empathetic acknowledgment (1-2 sentences)
2. One practical suggestion for this mood
3. A positive affirmation or encouragement

Keep the response warm, supportive, and under 150 words total.`;

    // Call OpenAI API
    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a compassionate emotional wellness AI assistant. Provide supportive, practical insights for mood tracking data.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiInsight = data.choices[0].message.content;

    console.log('AI insight generated successfully');

    // Store the AI insight
    const { error: updateError } = await supabaseClient
      .from('mood_entries')
      .update({ 
        ai_suggestion: aiInsight,
        ai_processing_status: 'completed',
        ai_insights: {
          generated_at: new Date().toISOString(),
          model: 'gpt-4o-mini',
          prompt_type: 'mood_analysis'
        }
      })
      .eq('id', moodEntry.id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating mood entry:', updateError);
      throw updateError;
    }

    console.log('Mood entry updated with AI insights');

    return new Response(JSON.stringify({ 
      success: true, 
      aiInsight,
      message: 'AI insights generated successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-mood-insights:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate AI insights' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});