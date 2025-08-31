import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { emoji: '😰', label: 'Anxious', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { emoji: '😴', label: 'Tired', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { emoji: '😌', label: 'Calm', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
];

interface MoodSelectorProps {
  onMoodSubmit?: (mood: { emoji: string; label: string; note: string }) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSubmit }) => {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (selectedMood && onMoodSubmit) {
      onMoodSubmit({
        emoji: selectedMood.emoji,
        label: selectedMood.label,
        note: note,
      });
      setSelectedMood(null);
      setNote('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft">
      <CardHeader>
        <CardTitle className="text-center text-2xl gradient-text">
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood, index) => (
            <Button
              key={index}
              variant={selectedMood?.label === mood.label ? 'default' : 'mood'}
              className={`h-20 flex-col space-y-2 ${
                selectedMood?.label === mood.label 
                  ? 'bg-gradient-primary text-white scale-105' 
                  : mood.color
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>

        {/* Note Section */}
        <div className="space-y-2">
          <Label htmlFor="mood-note">Add a note (optional)</Label>
          <Textarea
            id="mood-note"
            placeholder="What's on your mind? Share your thoughts..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedMood}
        >
          Save Mood Entry
        </Button>
      </CardContent>
    </Card>
  );
};