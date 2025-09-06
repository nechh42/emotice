import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useMoodData } from '@/hooks/useMoodData';
import { useTranslation } from 'react-i18next';

interface CalendarDay {
  date: Date;
  mood?: {
    emoji: string;
    mood: string;
    intensity: number;
    note?: string;
  };
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarProps {
  moodEntries: any[];
}

export const MoodCalendar: React.FC<CalendarProps> = ({ moodEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();

  // Create calendar grid
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the beginning of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End at the end of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = new Date();
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const moodEntry = moodEntries.find(entry => 
        entry.date_part === dateStr || 
        new Date(entry.created_at).toISOString().split('T')[0] === dateStr
      );
      
      days.push({
        date: new Date(current),
        mood: moodEntry ? {
          emoji: moodEntry.emoji,
          mood: moodEntry.mood,
          intensity: moodEntry.intensity,
          note: moodEntry.note || undefined
        } : undefined,
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === today.toDateString()
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate monthly stats
  const currentMonthEntries = moodEntries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    return entryDate.getMonth() === currentDate.getMonth() && 
           entryDate.getFullYear() === currentDate.getFullYear();
  });

  const averageIntensity = currentMonthEntries.length > 0 
    ? currentMonthEntries.reduce((sum, entry) => sum + entry.intensity, 0) / currentMonthEntries.length 
    : 0;

  const moodCounts = currentMonthEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodCounts).reduce((max, [mood, count]) => 
    count > ((max as any).count || 0) ? { mood, count } : max, {} as { mood?: string; count?: number }
  );

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{t('calendar.mood_calendar')}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-semibold min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monthly Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-light rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{currentMonthEntries.length}</div>
            <div className="text-xs text-muted-foreground">{t('calendar.entries')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{averageIntensity.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">{t('calendar.avg_intensity')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-wellness">
              {mostFrequentMood.mood?.replace('_', ' ') || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">{t('calendar.top_mood')}</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  relative h-12 border rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer
                  transition-all duration-200 hover:shadow-md group
                  ${day.isCurrentMonth 
                    ? 'bg-background border-border hover:bg-accent' 
                    : 'bg-muted/30 border-muted text-muted-foreground'
                  }
                  ${day.isToday ? 'ring-2 ring-primary bg-primary/5' : ''}
                  ${day.mood ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : ''}
                `}
                title={day.mood ? `${day.mood.emoji} ${day.mood.mood.replace('_', ' ')} - Intensity: ${day.mood.intensity}/10${day.mood.note ? ` - ${day.mood.note}` : ''}` : ''}
              >
                <div className={`text-xs ${day.isToday ? 'font-bold text-primary' : ''}`}>
                  {day.date.getDate()}
                </div>
                
                {day.mood && (
                  <div className="text-lg group-hover:scale-110 transition-transform">
                    {day.mood.emoji}
                  </div>
                )}
                
                {day.mood && (
                  <div className={`
                    absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                    ${day.mood.intensity >= 8 ? 'bg-green-500' : 
                      day.mood.intensity >= 6 ? 'bg-yellow-500' : 
                      day.mood.intensity >= 4 ? 'bg-orange-500' : 'bg-red-500'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t('calendar.high_mood')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{t('calendar.good_mood')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>{t('calendar.low_mood')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t('calendar.very_low')}</span>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>{t('calendar.view_analytics')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};