import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  Target,
  Calendar,
  Trophy,
  Flame,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const HabitTracker = ({ embedded = false }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Önceden tanımlı alışkanlık önerileri
  const habitSuggestions = [
    '💧 Su içmek (8 bardak)',
    '🚶 Günlük yürüyüş',
    '📚 Kitap okumak',
    '🧘 Meditasyon yapmak',
    '💪 Egzersiz yapmak',
    '🌅 Erken kalkmak',
    '📱 Telefon kullanımını azaltmak',
    '🥗 Sağlıklı beslenme',
    '😴 Erken yatmak',
    '📝 Günlük yazmak'
  ];

  useEffect(() => {
    loadHabits();
  }, [user]);

  const loadHabits = () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const savedHabits = JSON.parse(
        localStorage.getItem(`habits_${user.id}`) || '[]'
      );
      setHabits(savedHabits);
    } catch (error) {
      console.error('Alışkanlık yükleme hatası:', error);
      toast.error('Alışkanlıklar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = (updatedHabits) => {
    if (!user?.id) return;

    try {
      localStorage.setItem(`habits_${user.id}`, JSON.stringify(updatedHabits));
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Alışkanlık kayıt hatası:', error);
      toast.error('Kayıt sırasında hata oluştu');
    }
  };

  const addHabit = () => {
    if (!newHabitName.trim()) {
      toast.error('Alışkanlık adı gerekli');
      return;
    }

    if (habits.length >= 10) {
      toast.error('Maksimum 10 alışkanlık ekleyebilirsiniz');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      createdAt: new Date().toISOString(),
      completions: [], // [{ date: 'YYYY-MM-DD', completed: true }]
      streak: 0,
      bestStreak: 0
    };

    const updatedHabits = [...habits, newHabit];
    saveHabits(updatedHabits);
    setNewHabitName('');
    setShowAddForm(false);
    toast.success('Alışkanlık başarıyla eklendi!');
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    saveHabits(updatedHabits);
    toast.success('Alışkanlık silindi');
  };

  const toggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const existingCompletion = habit.completions.find(c => c.date === today);
      let newCompletions;

      if (existingCompletion) {
        // Bugünkü kaydı değiştir
        newCompletions = habit.completions.map(c => 
          c.date === today 
            ? { ...c, completed: !c.completed }
            : c
        );
      } else {
        // Yeni kayıt ekle
        newCompletions = [...habit.completions, { date: today, completed: true }];
      }

      // Streak hesapla
      const { streak, bestStreak } = calculateStreak(newCompletions);

      return {
        ...habit,
        completions: newCompletions,
        streak,
        bestStreak: Math.max(bestStreak, habit.bestStreak)
      };
    });

    saveHabits(updatedHabits);
    
    const habit = habits.find(h => h.id === habitId);
    const todayCompleted = getTodayCompletion(habitId);
    
    if (!todayCompleted) {
      toast.success(`${habit.name} tamamlandı! 🎉`);
    }
  };

  const calculateStreak = (completions) => {
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate = new Date();

    for (let completion of sortedCompletions) {
      const completionDate = new Date(completion.date);
      const diffDays = Math.floor((lastDate - completionDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        tempStreak++;
        if (diffDays === 0 || diffDays === 1) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }

      bestStreak = Math.max(bestStreak, tempStreak);
      lastDate = completionDate;
    }

    return { streak: currentStreak, bestStreak };
  };

  const getTodayCompletion = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;

    const today = new Date().toISOString().split('T')[0];
    const todayCompletion = habit.completions.find(c => c.date === today);
    return todayCompletion?.completed || false;
  };

  const getWeeklyCompletion = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { completed: 0, total: 7 };

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const completedDays = last7Days.filter(date => 
      habit.completions.find(c => c.date === date && c.completed)
    ).length;

    return { completed: completedDays, total: 7 };
  };

  const getCompletionRate = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completions.length === 0) return 0;

    const totalDays = habit.completions.length;
    const completedDays = habit.completions.filter(c => c.completed).length;
    return Math.round((completedDays / totalDays) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const HabitContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alışkanlık Takibi</h2>
          <p className="text-gray-600">Günlük alışkanlıklarınızı takip edin ve güçlü kalın</p>
        </div>
        {habits.length < 10 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Alışkanlık
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Yeni Alışkanlık Ekle
          </h3>
          
          {/* Input */}
          <div className="mb-4">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Alışkanlık adı (örn: Su içmek)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={50}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
          </div>

          {/* Öneriler */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Popüler alışkanlıklar:</p>
            <div className="flex flex-wrap gap-2">
              {habitSuggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setNewHabitName(suggestion)}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={addHabit}
              disabled={!newHabitName.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ekle
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewHabitName('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Henüz alışkanlığınız yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk alışkanlığınızı ekleyerek başlayın
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            İlk Alışkanlığımı Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const todayCompleted = getTodayCompletion(habit.id);
            const weeklyStats = getWeeklyCompletion(habit.id);
            const completionRate = getCompletionRate(habit.id);

            return (
              <div
                key={habit.id}
                className={`bg-white rounded-xl p-6 border-2 transition-all ${
                  todayCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        todayCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {todayCompleted && <Check className="w-4 h-4" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold ${
                        todayCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                      }`}>
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          {habit.streak} gün serisi
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          En iyi: {habit.bestStreak}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          Bu hafta: {weeklyStats.completed}/{weeklyStats.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        %{completionRate}
                      </div>
                      <div className="text-xs text-gray-500">başarı</div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      todayCompleted ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {habits.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bugünkü Özet
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {habits.filter(h => getTodayCompletion(h.id)).length}
              </div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {habits.length}
              </div>
              <div className="text-sm text-gray-600">Toplam</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {habits.reduce((sum, h) => sum + h.streak, 0)}
              </div>
              <div className="text-sm text-gray-600">Toplam Seri</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  habits.reduce((sum, h) => sum + getCompletionRate(h.id), 0) / 
                  (habits.length || 1)
                )}%
              </div>
              <div className="text-sm text-gray-600">Ortalama</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!embedded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <HabitContent />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <HabitContent />
    </div>
  );
};

export default HabitTracker;