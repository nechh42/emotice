import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { emoji: '😄', label: 'Very Happy', value: 'very_happy', color: 'text-green-500' },
  { emoji: '😊', label: 'Happy', value: 'happy', color: 'text-green-400' },
  { emoji: '🙂', label: 'Good', value: 'good', color: 'text-blue-400' },
  { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'text-gray-400' },
  { emoji: '😔', label: 'Sad', value: 'sad', color: 'text-yellow-500' },
  { emoji: '😟', label: 'Worried', value: 'worried', color: 'text-orange-500' },
  { emoji: '😢', label: 'Very Sad', value: 'very_sad', color: 'text-red-400' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'text-red-500' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: {
    mood: string;
    emoji: string;
    intensity: number;
    note?: string;
  }) => void;
  isLoading?: boolean;
  defaultMood?: {
    mood: string;
    emoji: string;
    intensity: number;
    note?: string;
  };
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, isLoading, defaultMood }) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(
    defaultMood ? moodOptions.find(m => m.value === defaultMood.mood) || null : null
  );
  const [intensity, setIntensity] = useState<number[]>([defaultMood?.intensity || 5]);
  const [note, setNote] = useState(defaultMood?.note || '');

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    onMoodSelect({
      mood: selectedMood.value,
      emoji: selectedMood.emoji,
      intensity: intensity[0],
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">How are you feeling?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood?.value === mood.value ? 'default' : 'outline'}
              className={`h-20 flex-col space-y-2 ${
                selectedMood?.value === mood.value 
                  ? 'bg-gradient-primary text-white border-primary shadow-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedMood && (
        <>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Intensity Level: {intensity[0]}/10
              </Label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <Textarea
                placeholder="How are you feeling? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {note.length}/500
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!selectedMood || isLoading} 
            className="w-full" 
            variant="hero"
            size="lg"
          >
            {isLoading ? 'Saving...' : 'Save Mood'}
          </Button>
        </>
      )}
    </div>
  );
};