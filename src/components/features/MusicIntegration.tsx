import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, Heart, Sparkles } from 'lucide-react';

interface MusicIntegrationProps {
  currentMood?: string;
  intensity?: number;
}

export const MusicIntegration: React.FC<MusicIntegrationProps> = ({ 
  currentMood = 'happy', 
  intensity = 5 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Mood-based playlist suggestions
  const getMoodPlaylists = (mood: string, intensity: number) => {
    const playlistsMap = {
      very_happy: [
        { name: 'Pure Joy', tracks: 45, description: 'Uplifting hits to amplify your happiness' },
        { name: 'Dance Party', tracks: 32, description: 'Get moving with energetic beats' },
        { name: 'Feel Good Vibes', tracks: 28, description: 'Songs that make you smile' }
      ],
      happy: [
        { name: 'Good Vibes Only', tracks: 38, description: 'Positive energy music' },
        { name: 'Sunny Day', tracks: 41, description: 'Perfect for a cheerful mood' },
        { name: 'Upbeat Classics', tracks: 35, description: 'Timeless happy songs' }
      ],
      good: [
        { name: 'Peaceful Moments', tracks: 29, description: 'Calm and content music' },
        { name: 'Easy Listening', tracks: 33, description: 'Relaxing background music' },
        { name: 'Gentle Acoustic', tracks: 26, description: 'Soft guitar and vocals' }
      ],
      neutral: [
        { name: 'Ambient Focus', tracks: 42, description: 'Background music for any activity' },
        { name: 'Balanced Beats', tracks: 36, description: 'Neither happy nor sad, just right' },
        { name: 'Instrumental Calm', tracks: 31, description: 'Wordless wonder' }
      ],
      sad: [
        { name: 'Healing Hearts', tracks: 24, description: 'Music for emotional processing' },
        { name: 'Gentle Recovery', tracks: 27, description: 'Soft songs for tough times' },
        { name: 'Emotional Journey', tracks: 33, description: 'Songs that understand' }
      ],
      worried: [
        { name: 'Anxiety Relief', tracks: 22, description: 'Calming music for worried minds' },
        { name: 'Breathing Space', tracks: 19, description: 'Music to help you relax' },
        { name: 'Peaceful Retreat', tracks: 25, description: 'Find your calm' }
      ],
      very_sad: [
        { name: 'Comfort Zone', tracks: 18, description: 'Music for the darkest days' },
        { name: 'Gentle Support', tracks: 21, description: 'Songs that hold you' },
        { name: 'Hope Returns', tracks: 15, description: 'Light in the darkness' }
      ],
      anxious: [
        { name: 'Deep Breathing', tracks: 20, description: 'Slow rhythms to match your breath' },
        { name: 'Mindful Moments', tracks: 16, description: 'Present-focused music' },
        { name: 'Calm Waves', tracks: 23, description: 'Ocean sounds and soft melodies' }
      ]
    };

    return playlistsMap[mood as keyof typeof playlistsMap] || playlistsMap.neutral;
  };

  const playlists = getMoodPlaylists(currentMood, intensity);

  const getMoodColor = (mood: string) => {
    const colorMap = {
      very_happy: 'text-green-500',
      happy: 'text-green-400',
      good: 'text-blue-400',
      neutral: 'text-gray-400',
      sad: 'text-yellow-500',
      worried: 'text-orange-500',
      very_sad: 'text-red-400',
      anxious: 'text-red-500'
    };
    return colorMap[mood as keyof typeof colorMap] || 'text-gray-400';
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Music className={`h-5 w-5 ${getMoodColor(currentMood)}`} />
          <span>Music for Your Mood</span>
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Curated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-6">
          Based on your current {currentMood.replace('_', ' ')} mood with intensity {intensity}/10
        </div>

        <div className="space-y-3">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Music className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{playlist.name}</div>
                <div className="text-xs text-muted-foreground">{playlist.description}</div>
                <div className="text-xs text-muted-foreground mt-1">{playlist.tracks} tracks</div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-muted-foreground">Connect your Spotify or Apple Music</span>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};