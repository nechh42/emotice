import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  Play, 
  Pause, 
  Square,
  ChevronLeft, 
  ChevronRight,
  Timer,
  Target,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const TimeBlocking = ({ embedded = false }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blocks, setBlocks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // day, week
  const [isLoading, setIsLoading] = useState(true);
  
  // Pomodoro Timer
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [pomodoroType, setPomodoroType] = useState('work'); // work, break
  const [pomodoroInterval, setPomodoroInterval] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'work',
    priority: 'medium',
    description: ''
  });

  const categories = [
    { id: 'work', label: 'İş', color: 'bg-blue-500' },
    { id: 'personal', label: 'Kişisel', color: 'bg-purple-500' },
    { id: 'health', label: 'Sağlık', color: 'bg-green-500' },
    { id: 'education', label: 'Eğitim', color: 'bg-indigo-500' },
    { id: 'social', label: 'Sosyal', color: 'bg-pink-500' },
    { id: 'break', label: 'Mola', color: 'bg-gray-500' }
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  useEffect(() => {
    loadBlocks();
  }, [user, currentDate]);

  useEffect(() => {
    return () => {
      if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
      }
    };
  }, [pomodoroInterval]);

  const loadBlocks = () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const dateKey = currentDate.toISOString().split('T')[0];
      const savedBlocks = JSON.parse(
        localStorage.getItem(`timeblocks_${user.id}_${dateKey}`) || '[]'
      );
      setBlocks(savedBlocks);
    } catch (error) {
      console.error('Time block yükleme hatası:', error);
      toast.error('Zaman blokları yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const saveBlocks = (updatedBlocks) => {
    if (!user?.id) return;

    try {
      const dateKey = currentDate.toISOString().split('T')[0];
      localStorage.setItem(
        `timeblocks_${user.id}_${dateKey}`, 
        JSON.stringify(updatedBlocks)
      );
      setBlocks(updatedBlocks);
    } catch (error) {
      console.error('Time block kayıt hatası:', error);
      toast.error('Kayıt sırasında hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      category: 'work',
      priority: 'medium',
      description: ''
    });
    setEditingBlock(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Başlık gerekli');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error('Başlangıç ve bitiş saati gerekli');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('Bitiş saati başlangıç saatinden sonra olmalı');
      return;
    }

    const blockData = {
      id: editingBlock?.id || Date.now().toString(),
      ...formData,
      date: currentDate.toISOString().split('T')[0],
      createdAt: editingBlock?.createdAt || new Date().toISOString(),
      completed: editingBlock?.completed || false
    };

    // Çakışma kontrolü
    const hasConflict = blocks.some(block => 
      block.id !== blockData.id &&
      ((formData.startTime >= block.startTime && formData.startTime < block.endTime) ||
       (formData.endTime > block.startTime && formData.endTime <= block.endTime) ||
       (formData.startTime <= block.startTime && formData.endTime >= block.endTime))
    );

    if (hasConflict) {
      toast.error('Bu saatlerde başka bir blok var!');
      return;
    }

    let updatedBlocks;
    if (editingBlock) {
      updatedBlocks = blocks.map(b => b.id === editingBlock.id ? blockData : b);
      toast.success('Zaman bloku güncellendi');
    } else {
      updatedBlocks = [...blocks, blockData].sort((a, b) => a.startTime.localeCompare(b.startTime));
      toast.success('Yeni zaman bloku eklendi');
    }

    saveBlocks(updatedBlocks);
    resetForm();
  };

  const deleteBlock = (blockId) => {
    if (!confirm('Bu zaman blokunu silmek istediğinize emin misiniz?')) return;
    
    const updatedBlocks = blocks.filter(b => b.id !== blockId);
    saveBlocks(updatedBlocks);
    toast.success('Zaman bloku silindi');
  };

  const toggleBlockCompletion = (blockId) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId 
        ? { ...block, completed: !block.completed }
        : block
    );
    saveBlocks(updatedBlocks);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Pomodoro Functions
  const startPomodoro = (type = 'work') => {
    const duration = type === 'work' ? 25 * 60 : 5 * 60; // 25 min work, 5 min break
    setPomodoroTime(duration);
    setPomodoroType(type);
    setPomodoroActive(true);
    
    const interval = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPomodoroActive(false);
          toast.success(`${type === 'work' ? 'Çalışma' : 'Mola'} süresi bitti!`);
          return type === 'work' ? 5 * 60 : 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    setPomodoroInterval(interval);
  };

  const pausePomodoro = () => {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      setPomodoroInterval(null);
    }
    setPomodoroActive(false);
  };

  const stopPomodoro = () => {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      setPomodoroInterval(null);
    }
    setPomodoroActive(false);
    setPomodoroTime(25 * 60);
    setPomodoroType('work');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const TimeBlockContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Zaman Yönetimi</h2>
          <p className="text-gray-600">Gününüzü planlayın ve verimli çalışın</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Pomodoro Timer */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
            <div className="text-lg font-mono font-bold">
              {formatTime(pomodoroTime)}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => pomodoroActive ? pausePomodoro() : startPomodoro(pomodoroType)}
                className="p-1 text-green-600 hover:text-green-700"
                title={pomodoroActive ? 'Duraklat' : 'Başlat'}
              >
                {pomodoroActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={stopPomodoro}
                className="p-1 text-red-600 hover:text-red-700"
                title="Durdur"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Zaman Bloku Ekle
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentDate.toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <button
            onClick={goToToday}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Bugüne Git
          </button>
        </div>
        
        <button
          onClick={() => navigateDate(1)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingBlock) && (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {editingBlock ? 'Zaman Blokunu Düzenle' : 'Yeni Zaman Bloku Ekle'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ne yapacaksınız?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Saati *
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Saat seçin</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Saati *
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Saat seçin</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detayları ekleyin..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={300}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingBlock ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Blocks Display */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Günlük Zaman Planı</h3>
        </div>
        
        {blocks.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              Henüz zaman blokunuz yok
            </h4>
            <p className="text-gray-500 mb-6">
              İlk zaman blokunuzu ekleyerek gününüzü planlamaya başlayın
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              İlk Blokumu Ekle
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-3">
              {blocks.map(block => {
                const categoryInfo = getCategoryInfo(block.category);
                const duration = (new Date(`2000-01-01 ${block.endTime}`) - new Date(`2000-01-01 ${block.startTime}`)) / (1000 * 60); // minutes
                
                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-lg border-l-4 ${categoryInfo.color} ${
                      block.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => toggleBlockCompletion(block.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              block.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-purple-500'
                            }`}
                          >
                            {block.completed && <Clock className="w-3 h-3" />}
                          </button>
                          
                          <h4 className={`font-semibold ${
                            block.completed ? 'text-green-800 line-through' : 'text-gray-800'
                          }`}>
                            {block.title}
                          </h4>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            block.priority === 'high' ? 'text-red-600 bg-red-100' :
                            block.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-gray-600 bg-gray-100'
                          }`}>
                            {block.priority === 'high' ? 'Yüksek' : block.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {block.startTime} - {block.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="w-4 h-4" />
                            {duration} dakika
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {categoryInfo.label}
                          </span>
                        </div>
                        
                        {block.description && (
                          <p className="text-sm text-gray-600">{block.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingBlock(block);
                            setFormData({
                              title: block.title,
                              startTime: block.startTime,
                              endTime: block.endTime,
                              category: block.category,
                              priority: block.priority,
                              description: block.description || ''
                            });
                            setShowAddForm(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Daily Summary */}
      {blocks.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Günlük Özet
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {blocks.length}
              </div>
              <div className="text-sm text-gray-600">Toplam Blok</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {blocks.filter(b => b.completed).length}
              </div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {blocks.reduce((total, block) => {
                  const duration = (new Date(`2000-01-01 ${block.endTime}`) - new Date(`2000-01-01 ${block.startTime}`)) / (1000 * 60);
                  return total + duration;
                }, 0)}
              </div>
              <div className="text-sm text-gray-600">Toplam Dakika</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {blocks.length > 0 ? Math.round((blocks.filter(b => b.completed).length / blocks.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Tamamlama Oranı</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!embedded) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TimeBlockContent />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <TimeBlockContent />
    </div>
  );
};

export default TimeBlocking;