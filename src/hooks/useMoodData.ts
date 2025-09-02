import { useState, useEffect } from 'react';
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
    const today = new Date().toISOString().split('T')[0];
    return entry.date_part === today;
  });

  // Add mood entry mutation
  const addMoodMutation = useMutation({
    mutationFn: async (newMood: {
      mood: string;
      emoji: string;
      intensity: number;
      note?: string;
      activities?: string[];
      tags?: string[];
      location?: string;
      weather?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          ...newMood,
          user_id: user.id,
          date_part: today,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood recorded!",
        description: "Your mood has been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error recording mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mood entry mutation
  const updateMoodMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MoodEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      toast({
        title: "Mood updated!",
        description: "Your mood has been successfully updated.",
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

  // Delete mood entry mutation
  const deleteMoodMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id);

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