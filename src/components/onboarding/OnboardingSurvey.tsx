import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Target, 
  Palette, 
  Globe, 
  Calendar,
  Brain,
  Music,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface OnboardingSurveyProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [surveyData, setSurveyData] = useState({
    // Step 1: Basic Information
    age: '',
    gender: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Step 2: Mental Health & Wellness Goals
    currentMoodState: 'neutral',
    mentalHealthHistory: '',
    wellnessGoals: [] as string[],
    stressLevel: '5',
    
    // Step 3: Preferences & Habits
    preferredLanguage: 'tr',
    dailyCheckInTime: '18:00',
    notificationPreferences: [] as string[],
    privacyLevel: 'balanced',
    
    // Step 4: Interests & Features
    musicPreferences: [] as string[],
    astrologyInterest: false,
    motivationStyle: 'gentle',
    trackingFrequency: 'daily',
    
    // Step 5: Personal Insights
    moodTriggers: '',
    copingMechanisms: '',
    supportSystem: '',
    additionalInfo: ''
  });

  const updateSurveyData = (field: string, value: any) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setSurveyData(prev => {
      const currentValue = prev[field as keyof typeof prev] as string[];
      const isIncluded = currentValue.includes(value);
      
      return {
        ...prev,
        [field]: isIncluded
          ? currentValue.filter(item => item !== value)
          : [...currentValue, value]
      };
    });
  };

  const submitSurvey = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user profile with comprehensive onboarding data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          onboarding_completed: true,
          preferred_language: surveyData.preferredLanguage,
          timezone: surveyData.timezone,
          notification_preferences: {
            daily_reminder: surveyData.notificationPreferences.includes('daily_reminders'),
            weekly_summary: surveyData.notificationPreferences.includes('weekly_summary'),
            mood_insights: surveyData.notificationPreferences.includes('mood_insights'),
            motivation_messages: surveyData.notificationPreferences.includes('motivation_messages')
          },
          onboarding_data: {
            // Demographics
            age: surveyData.age,
            gender: surveyData.gender,
            location: surveyData.location,
            
            // Wellness Goals
            wellnessGoals: surveyData.wellnessGoals,
            currentMoodState: surveyData.currentMoodState,
            mentalHealthHistory: surveyData.mentalHealthHistory,
            stressLevel: parseInt(surveyData.stressLevel),
            
            // Preferences
            dailyCheckInTime: surveyData.dailyCheckInTime,
            privacyLevel: surveyData.privacyLevel,
            
            // Interests
            musicPreferences: surveyData.musicPreferences,
            astrologyInterest: surveyData.astrologyInterest,
            motivationStyle: surveyData.motivationStyle,
            trackingFrequency: surveyData.trackingFrequency,
            
            // Personal Insights
            moodTriggers: surveyData.moodTriggers,
            copingMechanisms: surveyData.copingMechanisms,
            supportSystem: surveyData.supportSystem,
            additionalInfo: surveyData.additionalInfo
          },
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      toast({
        title: "Welcome to Emotice! 🎉",
        description: "Your personalized wellness journey begins now.",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Let's Get to Know You</h2>
        <p className="text-muted-foreground">Help us personalize your wellness experience</p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label>Age Range</Label>
          <RadioGroup value={surveyData.age} onValueChange={(value) => updateSurveyData('age', value)}>
            {['18-24', '25-34', '35-44', '45-54', '55+'].map(age => (
              <div key={age} className="flex items-center space-x-2">
                <RadioGroupItem value={age} id={age} />
                <Label htmlFor={age}>{age}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label>Gender Identity</Label>
          <RadioGroup value={surveyData.gender} onValueChange={(value) => updateSurveyData('gender', value)}>
            {['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other'].map(gender => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender} id={gender} />
                <Label htmlFor={gender}>{gender}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="location">Location (City, Country)</Label>
          <Input
            id="location"
            value={surveyData.location}
            onChange={(e) => updateSurveyData('location', e.target.value)}
            placeholder="e.g., Istanbul, Turkey"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-8 w-8 text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Wellness Goals</h2>
        <p className="text-muted-foreground">What do you hope to achieve with Emotice?</p>
      </div>

      <div>
        <Label>Current Mood State</Label>
        <RadioGroup value={surveyData.currentMoodState} onValueChange={(value) => updateSurveyData('currentMoodState', value)}>
          {[
            { value: 'very_happy', label: '😄 Very Happy', desc: 'Feeling amazing!' },
            { value: 'happy', label: '😊 Happy', desc: 'Generally positive' },
            { value: 'good', label: '🙂 Good', desc: 'Content and stable' },
            { value: 'neutral', label: '😐 Neutral', desc: 'Neither good nor bad' },
            { value: 'sad', label: '😔 Sad', desc: 'Feeling down' },
            { value: 'worried', label: '😟 Worried', desc: 'Anxious or concerned' },
            { value: 'very_sad', label: '😢 Very Sad', desc: 'Struggling emotionally' }
          ].map(mood => (
            <div key={mood.value} className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
              <RadioGroupItem value={mood.value} id={mood.value} />
              <Label htmlFor={mood.value} className="flex-1">
                <div className="font-medium">{mood.label}</div>
                <div className="text-xs text-muted-foreground">{mood.desc}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>Wellness Goals (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            'Better Sleep', 'Stress Management', 'Emotional Awareness', 'Mood Stability',
            'Anxiety Relief', 'Self-Care', 'Personal Growth', 'Mindfulness',
            'Energy Boost', 'Social Connection', 'Work-Life Balance', 'Confidence Building'
          ].map(goal => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                checked={surveyData.wellnessGoals.includes(goal)}
                onCheckedChange={() => handleArrayToggle('wellnessGoals', goal)}
              />
              <Label htmlFor={goal} className="text-sm">{goal}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Current Stress Level (1-10)</Label>
        <RadioGroup value={surveyData.stressLevel} onValueChange={(value) => updateSurveyData('stressLevel', value)}>
          <div className="flex space-x-2">
            {Array.from({length: 10}, (_, i) => i + 1).map(level => (
              <div key={level} className="flex flex-col items-center">
                <RadioGroupItem value={level.toString()} id={`stress-${level}`} />
                <Label htmlFor={`stress-${level}`} className="text-xs mt-1">{level}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Globe className="h-8 w-8 text-wellness mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
        <p className="text-muted-foreground">Customize your Emotice experience</p>
      </div>

      <div>
        <Label>Preferred Language</Label>
        <RadioGroup value={surveyData.preferredLanguage} onValueChange={(value) => updateSurveyData('preferredLanguage', value)}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { code: 'tr', name: 'Türkçe' },
              { code: 'en', name: 'English' },
              { code: 'es', name: 'Español' },
              { code: 'fr', name: 'Français' },
              { code: 'de', name: 'Deutsch' },
              { code: 'it', name: 'Italiano' }
            ].map(lang => (
              <div key={lang.code} className="flex items-center space-x-2">
                <RadioGroupItem value={lang.code} id={lang.code} />
                <Label htmlFor={lang.code}>{lang.name}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="checkInTime">Preferred Daily Check-in Time</Label>
        <Input
          id="checkInTime"
          type="time"
          value={surveyData.dailyCheckInTime}
          onChange={(e) => updateSurveyData('dailyCheckInTime', e.target.value)}
        />
      </div>

      <div>
        <Label>Notification Preferences</Label>
        <div className="space-y-2 mt-2">
          {[
            { id: 'daily_reminders', label: 'Daily mood check-in reminders' },
            { id: 'weekly_summary', label: 'Weekly mood summaries' },
            { id: 'mood_insights', label: 'AI-powered mood insights' },
            { id: 'motivation_messages', label: 'Daily motivation messages' }
          ].map(pref => (
            <div key={pref.id} className="flex items-center space-x-2">
              <Checkbox
                id={pref.id}
                checked={surveyData.notificationPreferences.includes(pref.id)}
                onCheckedChange={() => handleArrayToggle('notificationPreferences', pref.id)}
              />
              <Label htmlFor={pref.id} className="text-sm">{pref.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Privacy Level</Label>
        <RadioGroup value={surveyData.privacyLevel} onValueChange={(value) => updateSurveyData('privacyLevel', value)}>
          {[
            { value: 'private', label: 'Private', desc: 'Keep all data completely private' },
            { value: 'balanced', label: 'Balanced', desc: 'Anonymous insights sharing for better AI' },
            { value: 'open', label: 'Open', desc: 'Help improve the community experience' }
          ].map(level => (
            <div key={level.value} className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
              <RadioGroupItem value={level.value} id={level.value} />
              <Label htmlFor={level.value} className="flex-1">
                <div className="font-medium">{level.label}</div>
                <div className="text-xs text-muted-foreground">{level.desc}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Star className="h-8 w-8 text-calm mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Interests</h2>
        <p className="text-muted-foreground">Help us personalize your content</p>
      </div>

      <div>
        <Label>Music Preferences (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip-Hop',
            'Ambient', 'World Music', 'Folk', 'R&B', 'Indie', 'Nature Sounds'
          ].map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={genre}
                checked={surveyData.musicPreferences.includes(genre)}
                onCheckedChange={() => handleArrayToggle('musicPreferences', genre)}
              />
              <Label htmlFor={genre} className="text-sm">{genre}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="astrology"
          checked={surveyData.astrologyInterest}
          onCheckedChange={(checked) => updateSurveyData('astrologyInterest', checked)}
        />
        <Label htmlFor="astrology">I'm interested in astrology and cosmic insights</Label>
      </div>

      <div>
        <Label>Motivation Style</Label>
        <RadioGroup value={surveyData.motivationStyle} onValueChange={(value) => updateSurveyData('motivationStyle', value)}>
          {[
            { value: 'gentle', label: 'Gentle & Supportive', desc: 'Soft encouragement and understanding' },
            { value: 'energetic', label: 'Energetic & Upbeat', desc: 'High-energy motivation and excitement' },
            { value: 'wise', label: 'Wise & Reflective', desc: 'Thoughtful insights and deep wisdom' },
            { value: 'practical', label: 'Practical & Direct', desc: 'Straightforward advice and actionable tips' }
          ].map(style => (
            <div key={style.value} className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
              <RadioGroupItem value={style.value} id={style.value} />
              <Label htmlFor={style.value} className="flex-1">
                <div className="font-medium">{style.label}</div>
                <div className="text-xs text-muted-foreground">{style.desc}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>How often would you like to track your mood?</Label>
        <RadioGroup value={surveyData.trackingFrequency} onValueChange={(value) => updateSurveyData('trackingFrequency', value)}>
          {[
            { value: 'multiple', label: 'Multiple times per day' },
            { value: 'daily', label: 'Once per day' },
            { value: 'few_times', label: 'A few times per week' },
            { value: 'weekly', label: 'Once per week' }
          ].map(freq => (
            <div key={freq.value} className="flex items-center space-x-2">
              <RadioGroupItem value={freq.value} id={freq.value} />
              <Label htmlFor={freq.value}>{freq.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Personal Insights</h2>
        <p className="text-muted-foreground">Help us understand you better (optional)</p>
      </div>

      <div>
        <Label htmlFor="triggers">What typically affects your mood? (triggers, situations, etc.)</Label>
        <Textarea
          id="triggers"
          value={surveyData.moodTriggers}
          onChange={(e) => updateSurveyData('moodTriggers', e.target.value)}
          placeholder="e.g., work stress, social situations, weather changes..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="coping">What helps you feel better when you're down?</Label>
        <Textarea
          id="coping"
          value={surveyData.copingMechanisms}
          onChange={(e) => updateSurveyData('copingMechanisms', e.target.value)}
          placeholder="e.g., listening to music, talking to friends, exercise..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="support">Tell us about your support system</Label>
        <Textarea
          id="support"
          value={surveyData.supportSystem}
          onChange={(e) => updateSurveyData('supportSystem', e.target.value)}
          placeholder="e.g., family, friends, therapist, support groups..."
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="additional">Anything else you'd like us to know?</Label>
        <Textarea
          id="additional"
          value={surveyData.additionalInfo}
          onChange={(e) => updateSurveyData('additionalInfo', e.target.value)}
          placeholder="Share anything that might help us personalize your experience..."
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Welcome to Emotice</CardTitle>
            </div>
            <Badge variant="outline">Step {currentStep} of 5</Badge>
          </div>
          <div className="w-full bg-accent rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button onClick={nextStep} variant="hero">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitSurvey} variant="hero" disabled={loading}>
                {loading ? 'Setting up your profile...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};