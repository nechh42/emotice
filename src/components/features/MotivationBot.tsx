import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, RefreshCw, Heart, Sparkles, Quote, Send, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MotivationBotProps {
  currentMood?: string;
  userName?: string;
}

export const MotivationBot: React.FC<MotivationBotProps> = ({ 
  currentMood = 'neutral', 
  userName = 'Friend' 
}) => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuote, setAiQuote] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mood-specific motivational quotes and affirmations
  const getMotivationalContent = (mood: string) => {
    const content = {
      very_happy: [
        "Your joy is contagious! Keep spreading that beautiful energy.",
        "You're absolutely radiant today! Your happiness lights up the world.",
        "This amazing energy you have? Bottle it up and remember this feeling!",
        "You're proof that happiness is a choice, and you're choosing brilliantly!",
        "Your smile could power a small city. Keep shining!"
      ],
      happy: [
        "Your positive energy is magnetic. People are drawn to your light!",
        "Happiness looks good on you. Wear it proudly!",
        "You're creating ripples of joy wherever you go.",
        "Your cheerful spirit is a gift to everyone around you.",
        "Keep nurturing this beautiful energy within you."
      ],
      good: [
        "You're in a wonderful place right now. Trust this feeling.",
        "Your balanced energy is perfect for making great decisions.",
        "You're exactly where you need to be in this moment.",
        "This peaceful feeling is your natural state. Return here often.",
        "Your calm confidence is inspiring."
      ],
      neutral: [
        "Every master was once a disaster. You're becoming who you're meant to be.",
        "Your potential is infinite. Today is another chance to unlock it.",
        "Neutral doesn't mean stagnant. You're gathering energy for what's next.",
        "In stillness, you find your power. Trust the process.",
        "You're not behind in life. You're exactly on time for your journey."
      ],
      sad: [
        "Your feelings are valid. Honor them, then let them teach you.",
        "This too shall pass. You've overcome challenges before.",
        "Tears water the garden of your growth. You're becoming stronger.",
        "Your sensitivity is a superpower, not a weakness.",
        "Tomorrow's sunrise is waiting for you. Hold on."
      ],
      worried: [
        "Your worries show how much you care. Channel that care into action.",
        "You've handled 100% of your worst days so far. You're stronger than you know.",
        "Worrying is like paying interest on trouble that may never come.",
        "Focus on what you can control. Release what you cannot.",
        "Your anxiety is lying to you. You're more capable than you realize."
      ],
      very_sad: [
        "You matter. Your story isn't over. This chapter is just particularly tough.",
        "Rock bottom became the solid foundation on which I rebuilt my life. - J.K. Rowling",
        "It's okay to not be okay. Healing isn't linear, and that's perfectly human.",
        "Your pain has purpose. You're becoming someone who can help others heal.",
        "The darkest hour is just before dawn. Your breakthrough is coming."
      ],
      anxious: [
        "Breathe. You are safe in this moment. One breath at a time.",
        "Your anxiety is temporary. Your strength is permanent.",
        "You don't have to control everything. Trust that things will work out.",
        "Peace begins the moment you choose not to allow anxiety to control you.",
        "Your nervous system is trying to protect you. Thank it, then choose calm."
      ]
    };

    return content[mood as keyof typeof content] || content.neutral;
  };

  // Digital totems/symbols based on mood
  const getDigitalTotem = (mood: string) => {
    const totems = {
      very_happy: { emoji: '🌟', meaning: 'You are a star - shine bright!' },
      happy: { emoji: '🌻', meaning: 'Like a sunflower, you turn toward the light' },
      good: { emoji: '🦋', meaning: 'You are transforming beautifully' },
      neutral: { emoji: '🌿', meaning: 'Growing steadily, rooted in strength' },
      sad: { emoji: '🌙', meaning: 'Like the moon, you go through phases and still shine' },
      worried: { emoji: '🌊', meaning: 'Like waves, your worries will pass' },
      very_sad: { emoji: '🕯️', meaning: 'A single candle defeats the darkness' },
      anxious: { emoji: '🌸', meaning: 'Cherry blossoms bloom after surviving winter' }
    };

    return totems[mood as keyof typeof totems] || totems.neutral;
  };

  const generateAIQuote = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to get AI-powered motivation.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mood-insights', {
        body: { 
          mood: currentMood,
          type: 'motivation',
          userName,
          context: `User is feeling ${currentMood} and needs personalized motivation` 
        }
      });

      if (error) throw error;
      
      if (data?.motivation) {
        setAiQuote(data.motivation);
        toast({
          title: "AI Motivation Generated! ✨",
          description: "Your personalized message is ready.",
        });
      }
    } catch (error) {
      console.error('Error generating AI quote:', error);
      toast({
        title: "Oops!",
        description: "Couldn't generate AI motivation. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const generateNewQuote = () => {
    setIsLoading(true);
    const quotes = getMotivationalContent(currentMood);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Simulate loading for better UX
    setTimeout(() => {
      setCurrentQuote(randomQuote);
      setIsLoading(false);
    }, 800);
  };

  // Initialize with a quote
  useEffect(() => {
    generateNewQuote();
  }, [currentMood]);

  const totem = getDigitalTotem(currentMood);

  const getBotPersonality = (mood: string) => {
    const personalities = {
      very_happy: "I'm absolutely thrilled to see you so happy!",
      happy: "Your positive energy is making my circuits sparkle!",
      good: "I can sense your peaceful energy through the screen.",
      neutral: "I'm here to help you discover your next breakthrough.",
      sad: "I'm sending you virtual hugs and gentle encouragement.",
      worried: "Let me help ease your mind with some perspective.",
      very_sad: "I'm here with you. You're not alone in this.",
      anxious: "Take a deep breath with me. We'll get through this together."
    };

    return personalities[mood as keyof typeof personalities] || personalities.neutral;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <span>Your Motivation Companion</span>
          <Badge variant="secondary" className="ml-auto">
            <Heart className="h-3 w-3 mr-1" />
            AI Buddy
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bot Greeting */}
        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
          <div className="text-2xl">🤖</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Hello, {userName}!</div>
            <div className="text-sm text-muted-foreground mt-1">
              {getBotPersonality(currentMood)}
            </div>
          </div>
        </div>

        {/* Digital Totem */}
        <div className="text-center p-4 bg-accent/50 rounded-lg">
          <div className="text-4xl mb-2">{totem.emoji}</div>
          <div className="text-sm font-medium">Your Digital Totem</div>
          <div className="text-xs text-muted-foreground mt-1">{totem.meaning}</div>
        </div>

        {/* Motivational Quote */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center space-x-2">
              <Quote className="h-4 w-4" />
              <span>Just for You</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateNewQuote}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="p-4 border-l-4 border-blue-400 bg-accent/30 rounded">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse text-sm">Generating personalized motivation...</div>
                <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
              </div>
            ) : (
              <p className="text-sm italic">"{currentQuote}"</p>
            )}
          </div>
        </div>

        {/* AI-Powered Quote Section */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>AI-Powered Motivation</span>
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateAIQuote}
                disabled={loadingAI}
                className="h-8"
              >
                <Send className={`h-3 w-3 ${loadingAI ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded">
              {loadingAI ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse text-sm">AI is crafting your personal message...</div>
                  <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
                </div>
              ) : aiQuote ? (
                <p className="text-sm italic font-medium">"{aiQuote}"</p>
              ) : (
                <p className="text-sm text-muted-foreground">Click the button to get a personalized AI-generated motivation message!</p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={generateNewQuote}>
            New Quote
          </Button>
          <Button variant="outline" size="sm">
            Share Totem
          </Button>
          <Button variant="outline" size="sm">
            Save Favorite
          </Button>
        </div>

        {/* Bot Stats */}
        <div className="text-center text-xs text-muted-foreground p-2">
          🔋 Powered by empathy • 💫 Trained on positivity • 🤝 Always here for you
        </div>
      </CardContent>
    </Card>
  );
};