import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { Calendar, TrendingUp, Heart, BarChart3, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMoodData } from '@/hooks/useMoodData';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moodEntries, todaysMood, addMood, isAddingMood } = useMoodData();
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleMoodSubmit = (mood: {
    mood: string;
    emoji: string;
    intensity: number;
    note?: string;
  }) => {
    addMood(mood);
    setShowMoodSelector(false);
  };

  const stats = {
    totalEntries: moodEntries.length,
    streak: 5, // TODO: Calculate actual streak
    mostFrequentMood: moodEntries.length > 0 ? moodEntries[0].emoji : '😊',
    weeklyAverage: 7.5, // TODO: Calculate actual average
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            {todaysMood 
              ? `You're feeling ${todaysMood.mood} today ${todaysMood.emoji}` 
              : "How are you feeling today? Let's track your mood!"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalEntries}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl">{stats.mostFrequentMood}</div>
              <div className="text-sm text-muted-foreground">Top Mood</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft hover-lift">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-wellness">{stats.weeklyAverage}</div>
              <div className="text-sm text-muted-foreground">Weekly Avg</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Mood */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Today's Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysMood ? (
                  <div className="flex items-center space-x-4 p-4 bg-gradient-light rounded-lg">
                    <div className="text-4xl">{todaysMood.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold capitalize">{todaysMood.mood.replace('_', ' ')}</h3>
                      <p className="text-muted-foreground">{todaysMood.note || 'No note'}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Intensity: {todaysMood.intensity}/10 • Logged at {new Date(todaysMood.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🤔</div>
                    <h3 className="text-xl font-semibold mb-2">No mood logged today</h3>
                    <p className="text-muted-foreground mb-4">Track your mood to start building insights</p>
                    <Button 
                      variant="hero" 
                      onClick={() => setShowMoodSelector(true)}
                      className="group"
                    >
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      Log Today's Mood
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mood Chart Placeholder */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  <span>7-Day Mood Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-light rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chart Coming Soon</h3>
                    <p className="text-muted-foreground">Beautiful mood charts and insights will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowMoodSelector(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Mood Entry
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{entry.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium capitalize">{entry.mood.replace('_', ' ')}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {entry.note || 'No note'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()} • Intensity: {entry.intensity}/10
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold gradient-text">Log Your Mood</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowMoodSelector(false)}
              >
                ✕
              </Button>
            </div>
            <MoodSelector 
              onMoodSelect={handleMoodSubmit} 
              isLoading={isAddingMood}
            />
          </div>
        </div>
      )}
    </div>
  );
};