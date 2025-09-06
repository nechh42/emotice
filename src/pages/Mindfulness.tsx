import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer,
  Waves,
  Wind,
  Leaf,
  Mountain,
  Heart,
  Sparkles
} from 'lucide-react';

export const Mindfulness = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Meditation exercises data
  const meditationExercises = [
    {
      id: 'breathing',
      title: 'Guided Breathing',
      duration: 300, // 5 minutes
      description: 'Simple breathing exercise to center yourself',
      icon: Wind,
      color: 'text-blue-500',
      level: 'Beginner'
    },
    {
      id: 'body-scan',
      title: 'Body Scan Meditation',
      duration: 600, // 10 minutes
      description: 'Progressive relaxation through body awareness',
      icon: Heart,
      color: 'text-pink-500',
      level: 'Intermediate'
    },
    {
      id: 'mindfulness',
      title: 'Mindful Awareness',
      duration: 900, // 15 minutes
      description: 'Develop present-moment awareness',
      icon: Brain,
      color: 'text-purple-500',
      level: 'Intermediate'
    },
    {
      id: 'nature',
      title: 'Nature Sounds',
      duration: 1200, // 20 minutes
      description: 'Relax with calming nature sounds',
      icon: Leaf,
      color: 'text-green-500',
      level: 'All Levels'
    }
  ];

  const ambientSounds = [
    { id: 'rain', name: 'Rain Drops', icon: '🌧️' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
    { id: 'forest', name: 'Forest Sounds', icon: '🌲' },
    { id: 'fire', name: 'Crackling Fire', icon: '🔥' },
    { id: 'birds', name: 'Birds Chirping', icon: '🐦' },
    { id: 'wind', name: 'Gentle Wind', icon: '💨' }
  ];

  const quickExercises = [
    {
      id: 'box-breathing',
      title: '4-7-8 Breathing',
      duration: 240, // 4 minutes
      description: 'Inhale 4, hold 7, exhale 8'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Moment',
      duration: 180, // 3 minutes
      description: 'Focus on three things you\'re grateful for'
    },
    {
      id: 'tension-release',
      title: 'Tension Release',
      duration: 300, // 5 minutes
      description: 'Tense and release muscle groups'
    }
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedExercise) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const exercise = meditationExercises.find(e => e.id === selectedExercise);
          if (prev >= (exercise?.duration || 0)) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedExercise, meditationExercises]);

  // Breathing animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedExercise === 'breathing') {
      interval = setInterval(() => {
        setBreathingPhase((prev) => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (exerciseId: string) => {
    if (selectedExercise !== exerciseId) {
      setSelectedExercise(exerciseId);
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setBreathingPhase('inhale');
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return t('mindfulness.inhale', 'Breathe In...');
      case 'hold': return t('mindfulness.hold', 'Hold...');
      case 'exhale': return t('mindfulness.exhale', 'Breathe Out...');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
            {t('mindfulness.title', 'Mindfulness & Meditation')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('mindfulness.subtitle', 'Find your inner peace with guided meditation and breathing exercises')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Session */}
            {selectedExercise && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const exercise = meditationExercises.find(e => e.id === selectedExercise);
                        const Icon = exercise?.icon || Brain;
                        return <Icon className={`h-5 w-5 ${exercise?.color}`} />;
                      })()}
                      <span>{meditationExercises.find(e => e.id === selectedExercise)?.title}</span>
                    </div>
                    <Badge variant="secondary">
                      {meditationExercises.find(e => e.id === selectedExercise)?.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Breathing Animation (for breathing exercise) */}
                  {selectedExercise === 'breathing' && isPlaying && (
                    <div className="text-center py-8">
                      <div className={`mx-auto rounded-full bg-gradient-primary transition-all duration-4000 ${
                        breathingPhase === 'inhale' 
                          ? 'w-32 h-32' 
                          : breathingPhase === 'hold' 
                          ? 'w-32 h-32' 
                          : 'w-16 h-16'
                      }`}></div>
                      <p className="text-lg font-medium mt-6">{getBreathingInstruction()}</p>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(meditationExercises.find(e => e.id === selectedExercise)?.duration || 0)}</span>
                    </div>
                    <Progress 
                      value={(currentTime / (meditationExercises.find(e => e.id === selectedExercise)?.duration || 1)) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => handlePlayPause(selectedExercise)}
                      className="px-8"
                    >
                      {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                      {isPlaying ? t('mindfulness.pause', 'Pause') : t('mindfulness.play', 'Play')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meditation Exercises */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>{t('mindfulness.guidedMeditations', 'Guided Meditations')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {meditationExercises.map((exercise) => {
                    const Icon = exercise.icon;
                    const isActive = selectedExercise === exercise.id;
                    
                    return (
                      <div
                        key={exercise.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-soft ${
                          isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedExercise(exercise.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-accent'}`}>
                            <Icon className={`h-5 w-5 ${exercise.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium">{exercise.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {Math.floor(exercise.duration / 60)}m
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                            <Badge variant="secondary" className="text-xs">
                              {exercise.level}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant={isActive && isPlaying ? "outline" : "ghost"}
                          size="sm"
                          className="w-full mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(exercise.id);
                          }}
                        >
                          {isActive && isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {isActive && isPlaying ? t('mindfulness.pause', 'Pause') : t('mindfulness.start', 'Start')}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Exercises */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-secondary" />
                  <span>{t('mindfulness.quickExercises', 'Quick Relief Exercises')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {quickExercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50">
                      <div>
                        <h4 className="font-medium">{exercise.title}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">{Math.floor(exercise.duration / 60)}m</span>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ambient Sounds */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Waves className="h-5 w-5 text-blue-500" />
                  <span>{t('mindfulness.ambientSounds', 'Ambient Sounds')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {ambientSounds.map((sound) => (
                    <Button
                      key={sound.id}
                      variant="outline"
                      className="h-20 flex-col space-y-2"
                    >
                      <span className="text-2xl">{sound.icon}</span>
                      <span className="text-xs">{sound.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="shadow-soft bg-gradient-light">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>{t('mindfulness.dailyChallenge', 'Daily Challenge')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🧘‍♀️</div>
                  <h3 className="font-semibold">{t('mindfulness.challengeTitle', '5-Minute Morning Meditation')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('mindfulness.challengeDesc', 'Start your day with mindful breathing')}
                  </p>
                </div>
                <Button variant="hero" className="w-full">
                  {t('mindfulness.startChallenge', 'Start Challenge')}
                </Button>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5 text-wellness" />
                  <span>{t('mindfulness.progress', 'Your Progress')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">{t('mindfulness.sessionsCompleted', 'Sessions Completed')}</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-sm text-muted-foreground">{t('mindfulness.dayStreak', 'Day Streak')}</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-wellness">47m</div>
                  <div className="text-sm text-muted-foreground">{t('mindfulness.totalTime', 'Total Time')}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};