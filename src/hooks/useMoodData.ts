import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
  activities?: string[];
  tags?: string[];
  location?: string;
  weather?: string;
  date_part: string;
  created_at: string;
  updated_at: string;
}

export const useMoodData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mood entries
  const { data: moodEntries = [], isLoading } = useQuery({
    queryKey: ['moodEntries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as MoodEntry[];
    },
    enabled: !!user,
  });

  // Get today's mood
  const todaysMood = moodEntries.find(entry => {
    const entryDate = new Date(entry.date_part).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });

  // Add mood mutation
  const addMoodMutation = useMutation({
    mutationFn: async (moodData: {
      mood: string;
      emoji: string;
      intensity: number;
      note?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: moodData.mood,
          emoji: moodData.emoji,
          intensity: moodData.intensity,
          note: moodData.note,
          date_part: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI insight generation
      try {
        await supabase.functions.invoke('generate-mood-insights', {
          body: { 
            user_id: user.id,
            mood_entry_id: data.id,
            mood: moodData.mood,
            intensity: moodData.intensity,
            note: moodData.note 
          }
        });
      } catch (aiError) {
        console.warn('AI insight generation failed:', aiError);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood logged! 🎉",
        description: "Your mood has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error logging mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mood mutation
  const updateMoodMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<MoodEntry>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mood_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood updated!",
        description: "Your mood entry has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mood mutation
  const deleteMoodMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood deleted",
        description: "Your mood entry has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    moodEntries,
    todaysMood,
    isLoading,
    addMood: addMoodMutation.mutate,
    updateMood: updateMoodMutation.mutate,
    deleteMood: deleteMoodMutation.mutate,
    isAddingMood: addMoodMutation.isPending,
    isUpdatingMood: updateMoodMutation.isPending,
    isDeletingMood: deleteMoodMutation.isPending,
  };
};