import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Circle, 
  Edit2, 
  Trash2,
  Clock,
  TrendingUp,
  Flag,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const GoalSetting = ({ embedded = false }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    targetDate: '',
    milestones: []
  });

  const categories = [
    { id: 'personal', label: 'Kişisel', color: 'bg-purple-500' },
    { id: 'health', label: 'Sağlık', color: 'bg-green-500' },
    { id: 'career', label: 'Kariyer', color: 'bg-blue-500' },
    { id: 'finance', label: 'Finans', color: 'bg-yellow-500' },
    { id: 'education', label: 'Eğitim', color: 'bg-indigo-500' },
    { id: 'relationships', label: 'İlişkiler', color: 'bg-pink-500' }
  ];

  const priorities = [
    { id: 'low', label: 'Düşük', color: 'text-gray-500' },
    { id: 'medium', label: 'Orta', color: 'text-yellow-600' },
    { id: 'high', label: 'Yüksek', color: 'text-red-600' }
  ];

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const savedGoals = JSON.parse(
        localStorage.getItem(`goals_${user.id}`) || '[]'
      );
      setGoals(savedGoals);
    } catch (error) {
      console.error('Hedef yükleme hatası:', error);
      toast.error('Hedefler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = (updatedGoals) => {
    if (!user?.id) return;

    try {
      localStorage.setItem(`goals_${user.id}`, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Hedef kayıt hatası:', error);
      toast.error('Kayıt sırasında hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
      milestones: []
    });
    setEditingGoal(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Hedef başlığı gerekli');
      return;
    }

    if (!formData.targetDate) {
      toast.error('Hedef tarihi seçin');
      return;
    }

    const goalData = {
      id: editingGoal?.id || Date.now().toString(),
      ...formData,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: editingGoal?.status || 'active',
      progress: editingGoal?.progress || 0,
      completedMilestones: editingGoal?.completedMilestones || []
    };

    let updatedGoals;
    if (editingGoal) {
      updatedGoals = goals.map(g => g.id === editingGoal.id ? goalData : g);
      toast.success('Hedef güncellendi');
    } else {
      updatedGoals = [...goals, goalData];
      toast.success('Yeni hedef eklendi');
    }

    saveGoals(updatedGoals);
    resetForm();
  };

  const deleteGoal = (goalId) => {
    if (!confirm('Bu hedefi silmek istediğinize emin misiniz?')) return;
    
    const updatedGoals = goals.filter(g => g.id !== goalId);
    saveGoals(updatedGoals);
    toast.success('Hedef silindi');
  };

  const updateProgress = (goalId, progress) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newStatus = progress >= 100 ? 'completed' : 'active';
        return { ...goal, progress, status: newStatus };
      }
      return goal;
    });
    saveGoals(updatedGoals);
    
    if (progress >= 100) {
      toast.success('Tebrikler! Hedefinizi tamamladınız! 🎉');
    }
  };

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: '', completed: false }]
    });
  };

  const updateMilestone = (index, title) => {
    const newMilestones = formData.milestones.map((m, i) => 
      i === index ? { ...m, title } : m
    );
    setFormData({ ...formData, milestones: newMilestones });
  };

  const removeMilestone = (index) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  const getPriorityInfo = (priorityId) => {
    return priorities.find(p => p.id === priorityId) || priorities[1];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const GoalContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hedef Belirleme</h2>
          <p className="text-gray-600">SMART hedefler belirleyin ve ilerleyişinizi takip edin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Hedef
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingGoal) && (
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {editingGoal ? 'Hedefi Düzenle' : 'Yeni Hedef Ekle'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Örn: 10 kg vermek, Yeni iş bulmak"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Hedefiniz hakkında detay verin..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Kategori ve Öncelik */}
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
                  {priorities.map(pri => (
                    <option key={pri.id} value={pri.id}>{pri.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hedef Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hedef Tarihi *
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Alt Hedefler */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Alt Hedefler (İsteğe bağlı)
                </label>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  + Ekle
                </button>
              </div>
              
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, e.target.value)}
                    placeholder={`Alt hedef ${index + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingGoal ? 'Güncelle' : 'Hedef Ekle'}
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

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Henüz hedefiniz yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk SMART hedefinizi belirleyerek başlayın
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            İlk Hedefimi Belirle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const categoryInfo = getCategoryInfo(goal.category);
            const priorityInfo = getPriorityInfo(goal.priority);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isOverdue = daysRemaining < 0;
            const isCompleted = goal.status === 'completed';

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl p-6 border-2 transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isOverdue 
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`}></div>
                      <h3 className={`text-lg font-semibold ${
                        isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                      }`}>
                        {goal.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color} bg-gray-100`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.targetDate).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {isOverdue 
                          ? `${Math.abs(daysRemaining)} gün gecikme` 
                          : `${daysRemaining} gün kaldı`
                        }
                      </span>
                      <span className="flex items-center gap-1">
                        <Flag className="w-4 h-4" />
                        {categoryInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setFormData({
                          title: goal.title,
                          description: goal.description || '',
                          category: goal.category,
                          priority: goal.priority,
                          targetDate: goal.targetDate,
                          milestones: goal.milestones || []
                        });
                        setShowAddForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      İlerleme: %{goal.progress || 0}
                    </span>
                    {!isCompleted && (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={goal.progress || 0}
                          onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Alt Hedefler:</h4>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-sm ${
                            milestone.completed ? 'text-green-700 line-through' : 'text-gray-600'
                          }`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Hedef İstatistikleri
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {goals.length}
              </div>
              <div className="text-sm text-gray-600">Toplam Hedef</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {goals.filter(g => g.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Aktif</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  goals.reduce((sum, g) => sum + (g.progress || 0), 0) / 
                  (goals.length || 1)
                )}%
              </div>
              <div className="text-sm text-gray-600">Ortalama İlerleme</div>
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
          <GoalContent />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GoalContent />
    </div>
  );
};

export default GoalSetting;