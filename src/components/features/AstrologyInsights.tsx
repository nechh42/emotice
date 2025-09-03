import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Star, Sparkles } from 'lucide-react';

interface AstrologyInsightsProps {
  currentMood?: string;
}

export const AstrologyInsights: React.FC<AstrologyInsightsProps> = ({ currentMood = 'happy' }) => {
  // Get current moon phase (simplified for demo)
  const getMoonPhase = () => {
    const phases = [
      { name: 'New Moon', emoji: '🌑', description: 'Perfect time for new beginnings and setting intentions' },
      { name: 'Waxing Crescent', emoji: '🌒', description: 'Energy is building, focus on growth and manifestation' },
      { name: 'First Quarter', emoji: '🌓', description: 'Time for decision making and taking action' },
      { name: 'Waxing Gibbous', emoji: '🌔', description: 'Refine your goals and stay committed to your path' },
      { name: 'Full Moon', emoji: '🌕', description: 'Peak energy time, perfect for reflection and release' },
      { name: 'Waning Gibbous', emoji: '🌖', description: 'Time for gratitude and sharing your achievements' },
      { name: 'Last Quarter', emoji: '🌗', description: 'Release what no longer serves you' },
      { name: 'Waning Crescent', emoji: '🌘', description: 'Rest, reflect, and prepare for the next cycle' }
    ];
    
    // Simple calculation based on date (for demo purposes)
    const dayOfMonth = new Date().getDate();
    const phaseIndex = Math.floor((dayOfMonth / 31) * 8);
    return phases[phaseIndex] || phases[0];
  };

  // Get daily astrology insight based on mood
  const getAstrologyInsight = (mood: string) => {
    const insights = {
      very_happy: {
        message: "Your joy radiates like the sun! The universe is aligned with your positive energy today.",
        element: "Fire",
        color: "Golden Yellow",
        stone: "Citrine"
      },
      happy: {
        message: "Venus is smiling upon you today. Your cheerful energy attracts abundance and love.",
        element: "Air",
        color: "Light Blue",
        stone: "Rose Quartz"
      },
      good: {
        message: "Mercury brings clarity to your thoughts. Trust your intuition and inner wisdom.",
        element: "Earth",
        color: "Sage Green",
        stone: "Green Aventurine"
      },
      neutral: {
        message: "The cosmic energies are balanced around you. Perfect time for meditation and self-reflection.",
        element: "Water",
        color: "Silver",
        stone: "Moonstone"
      },
      sad: {
        message: "The moon's gentle energy embraces you. Allow yourself to feel and heal with cosmic support.",
        element: "Water",
        color: "Deep Blue",
        stone: "Lapis Lazuli"
      },
      worried: {
        message: "Saturn reminds you that challenges bring growth. Ground yourself with earth's stability.",
        element: "Earth",
        color: "Brown",
        stone: "Hematite"
      },
      very_sad: {
        message: "Pluto's transformative energy is working with you. From darkness comes profound rebirth.",
        element: "Water",
        color: "Deep Purple",
        stone: "Amethyst"
      },
      anxious: {
        message: "Neptune's calming waves wash over your worries. Breathe deeply and trust the flow.",
        element: "Water",
        color: "Ocean Blue",
        stone: "Aquamarine"
      }
    };

    return insights[mood as keyof typeof insights] || insights.neutral;
  };

  const moonPhase = getMoonPhase();
  const astrologyInsight = getAstrologyInsight(currentMood);

  // Get today's zodiac guidance (simplified)
  const getTodaysGuidance = () => {
    const guidances = [
      "Trust your intuition today - it's especially strong",
      "Focus on self-care and nurturing your inner world",
      "Communication flows easily - have that important conversation",
      "Your creativity is heightened - express yourself freely",
      "Patience with others will bring unexpected rewards",
      "A moment of stillness will reveal important insights",
      "Your empathy is your superpower today",
      "Balance work with play for optimal energy"
    ];
    
    const today = new Date().getDate();
    return guidances[today % guidances.length];
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-purple-400" />
          <span>Cosmic Insights</span>
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Daily
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Moon Phase */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
          <div className="text-3xl">{moonPhase.emoji}</div>
          <div className="flex-1">
            <h3 className="font-semibold flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <span>{moonPhase.name}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{moonPhase.description}</p>
          </div>
        </div>

        {/* Astrology Insight for Current Mood */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span>For Your Current Energy</span>
          </h3>
          <p className="text-sm">{astrologyInsight.message}</p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-accent rounded-lg">
              <div className="text-xs text-muted-foreground">Element</div>
              <div className="font-medium text-sm">{astrologyInsight.element}</div>
            </div>
            <div className="p-2 bg-accent rounded-lg">
              <div className="text-xs text-muted-foreground">Color</div>
              <div className="font-medium text-sm">{astrologyInsight.color}</div>
            </div>
            <div className="p-2 bg-accent rounded-lg">
              <div className="text-xs text-muted-foreground">Stone</div>
              <div className="font-medium text-sm">{astrologyInsight.stone}</div>
            </div>
          </div>
        </div>

        {/* Daily Guidance */}
        <div className="p-4 border-l-4 border-purple-400 bg-accent/50">
          <h3 className="font-semibold text-sm mb-2">Today's Cosmic Guidance</h3>
          <p className="text-sm italic">"{getTodaysGuidance()}"</p>
        </div>

        {/* Quick Manifestation */}
        <div className="text-center p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">✨ Quick Manifestation</h3>
          <p className="text-xs text-muted-foreground">
            Take a moment to set an intention aligned with today's cosmic energy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};