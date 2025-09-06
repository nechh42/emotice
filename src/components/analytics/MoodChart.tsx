import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Activity, Calendar } from 'lucide-react';
import { useMoodData } from '@/hooks/useMoodData';
import { useTranslation } from 'react-i18next';

interface ChartProps {
  data: any[];
  variant?: 'line' | 'bar';
  period?: 'week' | 'month' | 'year';
}

export const MoodChart: React.FC<ChartProps> = ({ 
  data = [],
  variant = 'line', 
  period = 'week' 
}) => {
  const { t } = useTranslation();

  // Process mood data for charts
  const processChartData = () => {
    const now = new Date();
    let startDate: Date;
    let dateFormat: (date: Date) => string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = (date) => date.toLocaleDateString('en', { weekday: 'short' });
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFormat = (date) => `${date.getDate()}/${date.getMonth() + 1}`;
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFormat = (date) => date.toLocaleDateString('en', { month: 'short' });
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = (date) => date.toLocaleDateString('en', { weekday: 'short' });
    }

    // Filter entries by period
    const filteredEntries = data.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startDate;
    });

    // Group entries by date
    const groupedData: Record<string, any[]> = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.created_at);
      const key = dateFormat(date);
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(entry);
    });

    // Convert to chart format
    const chartData = Object.entries(groupedData).map(([date, entries]) => {
      const avgIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
      const moodCounts = entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantMood = Object.entries(moodCounts).reduce((max, [mood, count]) => 
        count > ((max as any).count || 0) ? { mood, count } : max, {} as { mood?: string; count?: number }
      );

      return {
        date,
        intensity: Number(avgIntensity.toFixed(1)),
        entries: entries.length,
        dominantMood: dominantMood.mood || 'neutral',
        moodScore: getMoodScore(dominantMood.mood || 'neutral')
      };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  };

  // Convert mood to numeric score for visualization
  const getMoodScore = (mood: string): number => {
    const moodScores: Record<string, number> = {
      'very_happy': 10,
      'happy': 8,
      'good': 6,
      'neutral': 5,
      'sad': 3,
      'worried': 2,
      'very_sad': 1,
      'anxious': 1
    };
    return moodScores[mood] || 5;
  };

  const chartData = processChartData();

  // Calculate insights
  const averageIntensity = chartData.length > 0 
    ? chartData.reduce((sum, data) => sum + data.intensity, 0) / chartData.length 
    : 0;

  const trend = chartData.length >= 2 
    ? chartData[chartData.length - 1].intensity - chartData[0].intensity 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-primary">{`${t('chart.intensity')}: ${payload[0].value}/10`}</p>
          <p className="text-secondary">{`${t('chart.entries')}: ${payload[0].payload.entries}`}</p>
          <p className="text-muted-foreground">{`${t('chart.mood')}: ${payload[0].payload.dominantMood.replace('_', ' ')}`}</p>
        </div>
      );
    }
    return null;
  };

  const getPeriodIcon = () => {
    switch (period) {
      case 'week': return <Activity className="h-4 w-4" />;
      case 'month': return <Calendar className="h-4 w-4" />;
      case 'year': return <TrendingUp className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {getPeriodIcon()}
            <span>{t('chart.mood_trends')} - {t(`chart.${period}`)}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>{averageIntensity.toFixed(1)}</span>
            </Badge>
            <Badge 
              variant={trend >= 0 ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              <span>{trend >= 0 ? '↗' : '↘'}</span>
              <span>{Math.abs(trend).toFixed(1)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {variant === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="intensity" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-center">
            <div>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {t('chart.no_data')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('chart.start_tracking')}
              </p>
            </div>
          </div>
        )}

        {/* Insights */}
        {chartData.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">{t('chart.avg_intensity')}</div>
                <div className="text-lg font-bold text-primary">{averageIntensity.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('chart.total_entries')}</div>
                <div className="text-lg font-bold text-secondary">{chartData.reduce((sum, d) => sum + d.entries, 0)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('chart.trend')}</div>
                <div className={`text-lg font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('chart.consistency')}</div>
                <div className="text-lg font-bold text-wellness">
                  {((chartData.filter(d => d.entries > 0).length / chartData.length) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};