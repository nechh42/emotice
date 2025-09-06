import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodChart } from '@/components/analytics/MoodChart';
import { MoodCalendar } from '@/components/analytics/MoodCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { useMoodData } from '@/hooks/useMoodData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Target,
  Download,
  Share2
} from 'lucide-react';

export const Analytics = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { moodEntries, isLoading } = useMoodData();

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Calculate analytics
  const calculateStats = () => {
    if (moodEntries.length === 0) {
      return {
        averageMood: 0,
        streak: 0,
        mostCommonMood: 'neutral',
        moodVariance: 0,
        weeklyTrend: 0,
        totalEntries: 0
      };
    }

    const totalIntensity = moodEntries.reduce((sum, entry) => sum + entry.intensity, 0);
    const averageMood = totalIntensity / moodEntries.length;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodEntries.some(entry => 
        new Date(entry.date_part).toDateString() === checkDate.toDateString()
      );
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    // Most common mood
    const moodCounts = moodEntries.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0] || 'neutral';

    // Calculate variance (mood stability)
    const variance = moodEntries.reduce((sum, entry) => 
      sum + Math.pow(entry.intensity - averageMood, 2), 0
    ) / moodEntries.length;

    // Weekly trend (last 7 days vs previous 7 days)
    const last7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date_part);
      const daysAgo = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysAgo <= 7;
    });
    
    const previous7Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date_part);
      const daysAgo = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysAgo > 7 && daysAgo <= 14;
    });

    const lastWeekAvg = last7Days.length > 0 ? 
      last7Days.reduce((sum, entry) => sum + entry.intensity, 0) / last7Days.length : 0;
    const previousWeekAvg = previous7Days.length > 0 ? 
      previous7Days.reduce((sum, entry) => sum + entry.intensity, 0) / previous7Days.length : 0;
    
    const weeklyTrend = lastWeekAvg - previousWeekAvg;

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      streak,
      mostCommonMood,
      moodVariance: Math.round(variance * 10) / 10,
      weeklyTrend: Math.round(weeklyTrend * 10) / 10,
      totalEntries: moodEntries.length
    };
  };

  const stats = calculateStats();

  const exportData = () => {
    const csvContent = [
      ['Date', 'Mood', 'Intensity', 'Note'],
      ...moodEntries.map(entry => [
        entry.date_part,
        entry.mood,
        entry.intensity.toString(),
        entry.note || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mood-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
              {t('analytics.title', 'Analytics & Insights')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('analytics.subtitle', 'Deep insights into your emotional patterns and wellness journey')}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              {t('analytics.export', 'Export Data')}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              {t('analytics.share', 'Share Report')}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground">{t('analytics.totalEntries', 'Total Entries')}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-wellness">{stats.averageMood}/10</div>
              <div className="text-xs text-muted-foreground">{t('analytics.avgMood', 'Avg Mood')}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">{t('analytics.streak', 'Day Streak')}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className="text-lg font-bold capitalize">{stats.mostCommonMood.replace('_', ' ')}</div>
              <div className="text-xs text-muted-foreground">{t('analytics.topMood', 'Most Common')}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-calm">{stats.moodVariance}</div>
              <div className="text-xs text-muted-foreground">{t('analytics.stability', 'Stability')}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6 text-center">
              <div className={`text-2xl font-bold ${stats.weeklyTrend >= 0 ? 'text-success' : 'text-warning'}`}>
                {stats.weeklyTrend >= 0 ? '+' : ''}{stats.weeklyTrend}
              </div>
              <div className="text-xs text-muted-foreground">{t('analytics.weeklyTrend', 'Weekly Trend')}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Chart */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>{t('analytics.moodTrends', 'Mood Trends')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodChart data={moodEntries} />
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <span>{t('analytics.moodCalendar', 'Mood Calendar')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MoodCalendar moodEntries={moodEntries} />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>{t('analytics.aiInsights', 'AI-Powered Insights')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.totalEntries > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>{t('analytics.patterns', 'Patterns Detected')}</span>
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-accent rounded-lg">
                        <strong>{t('analytics.moodStability', 'Mood Stability:')}</strong>
                        <span className="ml-2">
                          {stats.moodVariance < 2 
                            ? t('analytics.veryStable', 'Very stable emotional patterns')
                            : stats.moodVariance < 4 
                            ? t('analytics.stable', 'Generally stable with some variation')
                            : t('analytics.variable', 'High mood variability - consider stress management')
                          }
                        </span>
                      </div>
                      <div className="p-3 bg-accent rounded-lg">
                        <strong>{t('analytics.weeklyProgress', 'Weekly Progress:')}</strong>
                        <span className="ml-2">
                          {stats.weeklyTrend > 0.5 
                            ? t('analytics.improving', 'Significant improvement this week! 📈')
                            : stats.weeklyTrend > 0 
                            ? t('analytics.slightImprovement', 'Slight improvement this week 📊')
                            : stats.weeklyTrend > -0.5
                            ? t('analytics.stable', 'Stable mood patterns')
                            : t('analytics.declining', 'Consider self-care strategies 💙')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Target className="h-4 w-4 text-secondary" />
                      <span>{t('analytics.recommendations', 'Personalized Recommendations')}</span>
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gradient-light rounded-lg">
                        <strong>{t('analytics.consistency', 'Consistency:')}</strong>
                        <span className="ml-2">
                          {stats.streak >= 7 
                            ? t('analytics.excellentStreak', 'Excellent tracking streak! Keep it up!')
                            : t('analytics.improveStreak', 'Try to log daily for better insights')
                          }
                        </span>
                      </div>
                      <div className="p-3 bg-gradient-light rounded-lg">
                        <strong>{t('analytics.focus', 'Focus Areas:')}</strong>
                        <span className="ml-2">
                          {stats.averageMood < 5 
                            ? t('analytics.selfCare', 'Consider mindfulness and self-care activities')
                            : t('analytics.maintain', 'Maintain current positive habits')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('analytics.noData', 'Start Tracking for Insights')}</h3>
                  <p className="text-muted-foreground">
                    {t('analytics.needData', 'Log your moods for at least a week to see AI-powered insights and patterns.')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};