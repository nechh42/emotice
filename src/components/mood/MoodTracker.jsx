// src/components/mood/MoodTracker.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { Calendar, Clock, Tag, FileText, Save } from 'lucide-react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodLevel, setMoodLevel] = useState(5);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Mood seçenekleri (emoji + isim + renk)
  const moodOptions = [
    { id: 1, emoji: '😭', name: 'Very Sad', color: '#ef4444', value: 1 },
    { id: 2, emoji: '😢', name: 'Sad', color: '#f97316', value: 2 },
    { id: 3, emoji: '😐', name: 'Neutral', color: '#eab308', value: 3 },
    { id: 4, emoji: '🙂', name: 'İyi', color: '#22c55e', value: 4 },
    { id: 5, emoji: '😊', name: 'Mutlu', color: '#06b6d4', value: 5 },
    { id: 6, emoji: '😄', name: 'Çok Mutlu', color: '#8b5cf6', value: 6 },
    { id: 7, emoji: '🤗', name: 'Sevgi Dolu', color: '#ec4899', value: 7 },
    { id: 8, emoji: '😌', name: 'Huzurlu', color: '#10b981', value: 8 },
    { id: 9, emoji: '🤯', name: 'Heyecanlı', color: '#f59e0b', value: 9 },
    { id: 10, emoji: '🥳', name: 'Coşkulu', color: '#dc2626', value: 10 }
  ];

  // Önceden tanımlanmış etiketler
  const predefinedTags = [
    'İş', 'Aile', 'Arkadaş', 'Sağlık', 'Spor', 'Beslenme', 
    'Uyku', 'Stres', 'Aşk', 'Hobiler', 'Eğitim', 'Para'
  ];

  useEffect(() => {
    // Kullanıcı bilgilerini al
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Etiket ekleme
  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCustomTag('');
    }
  };

  // Etiket kaldırma
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Mood kaydetme
  const saveMoodEntry = async () => {
    if (!selectedMood || !user) {
      toast.error('Lütfen bir ruh hali seçin!');
      return;
    }

    setLoading(true);
    
    try {
      const moodData = {
        user_id: user.id,
        mood_type: selectedMood.name,
        mood_emoji: selectedMood.emoji,
        mood_level: selectedMood.value,
        intensity_score: moodLevel,
        notes: note,
        tags: tags,
        created_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData);

      if (error) throw error;

      toast.success('Ruh haliniz başarıyla kaydedildi! 🎉');
      
      // Form'u sıfırla
      setSelectedMood(null);
      setMoodLevel(5);
      setNote('');
      setTags([]);
      setCustomTag('');

    } catch (error) {
      console.error('Mood kayıt hatası:', error);
      toast.error('Kayıt sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bugünkü Ruh Halinizi Nasıl Hissediyorsunuz?
        </h2>
        <p className="text-gray-600">
          Duygularınızı takip edin ve kendinizi daha iyi tanıyın
        </p>
      </div>

      {/* Mood Seçici */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Calendar className="mr-2" size={20} />
          Ruh Halinizi Seçin
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMood?.id === mood.id
                  ? 'border-purple-500 bg-purple-50 scale-105'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-gray-600">{mood.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Yoğunluk Seviyesi */}
      {selectedMood && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="mr-2" size={20} />
            Bu Duyguyu Ne Kadar Yoğun Hissediyorsunuz? ({moodLevel}/10)
          </h3>
          <input
            type="range"
            min="1"
            max="10"
            value={moodLevel}
            onChange={(e) => setMoodLevel(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${selectedMood.color} 0%, ${selectedMood.color} ${moodLevel * 10}%, #e5e7eb ${moodLevel * 10}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Hafif</span>
            <span>Orta</span>
            <span>Yoğun</span>
          </div>
        </div>
      )}

      {/* Etiketler */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Tag className="mr-2" size={20} />
          Bu Ruh Halinin Sebebi Ne Olabilir?
        </h3>
        
        {/* Önceden tanımlanmış etiketler */}
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              disabled={tags.includes(tag) || tags.length >= 5}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                tags.includes(tag)
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-50'
              } ${tags.length >= 5 && !tags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Özel etiket ekleme */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag(customTag)}
            placeholder="Özel etiket ekle..."
            disabled={tags.length >= 5}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={() => addTag(customTag)}
            disabled={!customTag || tags.length >= 5}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ekle
          </button>
        </div>

        {/* Seçili etiketler */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">En fazla 5 etiket seçebilirsiniz</p>
      </div>

      {/* Not Ekleme */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FileText className="mr-2" size={20} />
          Ek Notlar (Opsiyonel)
        </h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Bugün neler oldu? Ne hissettiniz? Detaylarınızı paylaşın..."
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          maxLength="500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {note.length}/500 karakter
        </p>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={saveMoodEntry}
        disabled={!selectedMood || loading}
        className={`w-full p-4 rounded-lg font-semibold flex items-center justify-center transition-all ${
          !selectedMood || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Kaydediliyor...
          </div>
        ) : (
          <div className="flex items-center">
            <Save className="mr-2" size={20} />
            Ruh Halimi Kaydet
          </div>
        )}
      </button>

      {/* Bugünkü özet */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Bugünkü Seçiminiz:</h4>
        <div className="text-sm text-gray-600">
          {selectedMood ? (
            <div>
              <span className="text-2xl mr-2">{selectedMood.emoji}</span>
              <span className="font-medium">{selectedMood.name}</span>
              {moodLevel && <span> - Yoğunluk: {moodLevel}/10</span>}
              {tags.length > 0 && (
                <div className="mt-1">
                  Etiketler: {tags.join(', ')}
                </div>
              )}
            </div>
          ) : (
            <span>Henüz bir ruh hali seçmediniz.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
