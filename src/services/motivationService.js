// src/services/motivationService.js
import { motivationMessages, getMessagesByCategory, getRandomMessage } from '../data/motivation/messages';

class MotivationService {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.messageHistory = this.loadMessageHistory();
    this.feedbackData = this.loadFeedbackData();
  }

  // Ana mesaj seçim fonksiyonu
  selectMessage(options = {}) {
    const {
      userMood = 'neutral',
      currentTime = new Date(),
      language = 'tr',
      preferredLength = 'medium',
      context = 'general',
      userId = null
    } = options;

    // 1. Mood-based kategori seçimi
    const categories = this.selectCategoriesByMood(userMood);
    
    // 2. Zaman bazlı ağırlıklandırma
    const timeWeightedCategories = this.applyTimeWeights(categories, currentTime);
    
    // 3. Kullanıcı geçmişi kontrolü
    const filteredCategories = this.filterByHistory(timeWeightedCategories, userId);
    
    // 4. Mesaj seçimi
    const selectedCategory = this.weightedRandomSelect(filteredCategories);
    const messages = this.getMessagesFromCategory(selectedCategory, language, preferredLength);
    
    // 5. Son filtreleme ve seçim
    const finalMessage = this.selectFinalMessage(messages, userId);
    
    // 6. Seçimi kaydet
    this.recordSelection(finalMessage, userId, {
      mood: userMood,
      time: currentTime,
      category: selectedCategory
    });

    return {
      message: finalMessage,
      category: selectedCategory,
      metadata: {
        mood: userMood,
        language,
        length: this.getMessageLength(finalMessage),
        timestamp: currentTime.toISOString()
      }
    };
  }

  // Mood-based kategori seçimi
  selectCategoriesByMood(mood) {
    const moodWeights = motivationMessages.selectionCriteria.moodWeights;
    const defaultWeights = { motivation: 0.4, relaxation: 0.3, self_improvement: 0.3 };
    
    return moodWeights[mood] || defaultWeights;
  }

  // Zaman bazlı ağırlıklandırma
  applyTimeWeights(categories, currentTime) {
    const hour = currentTime.getHours();
    const timeKey = this.getTimeKey(hour);
    const timeWeights = motivationMessages.selectionCriteria.timeWeights[timeKey] || {};
    
    const combinedWeights = { ...categories };
    
    // Zaman ağırlıklarını uygula
    Object.keys(timeWeights).forEach(category => {
      if (combinedWeights[category]) {
        combinedWeights[category] *= 1.5; // Zaman uyumlu kategorileri güçlendir
      } else {
        combinedWeights[category] = timeWeights[category] * 0.3;
      }
    });

    return this.normalizeWeights(combinedWeights);
  }

  // Kullanıcı geçmişine göre filtreleme
  filterByHistory(categories, userId) {
    if (!userId || !this.messageHistory[userId]) {
      return categories;
    }

    const userHistory = this.messageHistory[userId];
    const recentMessages = userHistory.slice(-10); // Son 10 mesaj
    const recentCategories = recentMessages.map(msg => msg.category);
    
    // Çok tekrar eden kategorilerin ağırlığını azalt
    const adjustedCategories = { ...categories };
    const categoryCount = {};
    
    recentCategories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    Object.keys(adjustedCategories).forEach(category => {
      const count = categoryCount[category] || 0;
      if (count > 3) {
        adjustedCategories[category] *= 0.3; // Çok tekrar edenleri azalt
      } else if (count > 1) {
        adjustedCategories[category] *= 0.7;
      }
    });

    return this.normalizeWeights(adjustedCategories);
  }

  // Ağırlıklı rastgele seçim
  weightedRandomSelect(weights) {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [category, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return category;
      }
    }
    
    // Fallback
    return Object.keys(weights)[0];
  }

  // Kategoriden mesaj getirme
  getMessagesFromCategory(category, language, preferredLength) {
    let messages = getMessagesByCategory(category, language);
    
    if (messages.length === 0) {
      // Fallback to motivation category
      messages = getMessagesByCategory('motivation', language);
    }

    // Uzunluk filtrelemesi
    if (preferredLength !== 'any') {
      const lengthFiltered = this.filterByLength(messages, preferredLength);
      if (lengthFiltered.length > 0) {
        messages = lengthFiltered;
      }
    }

    return messages;
  }

  // Uzunluk filtrelemesi
  filterByLength(messages, preferredLength) {
    const lengthRanges = {
      short: { min: 0, max: 100 },
      medium: { min: 80, max: 200 },
      long: { min: 150, max: 400 }
    };

    const range = lengthRanges[preferredLength];
    if (!range) return messages;

    return messages.filter(msg => 
      msg.length >= range.min && msg.length <= range.max
    );
  }

  // Son mesaj seçimi
  selectFinalMessage(messages, userId) {
    if (messages.length === 0) {
      return "Bugün harika bir gün! Sen yapabilirsin! 🌟";
    }

    if (!userId) {
      return messages[Math.floor(Math.random() * messages.length)];
    }

    // Kullanıcı feedback'ine göre seçim
    const userFeedback = this.feedbackData[userId] || {};
    const weightedMessages = messages.map(message => ({
      message,
      weight: this.calculateMessageWeight(message, userFeedback)
    }));

    // Ağırlıklı seçim
    const totalWeight = weightedMessages.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedMessages) {
      random -= item.weight;
      if (random <= 0) {
        return item.message;
      }
    }

    return messages[0];
  }

  // Mesaj ağırlığı hesaplama
  calculateMessageWeight(message, userFeedback) {
    let weight = 1.0;

    // Kullanıcının beğendiği mesajlara benzer olanları güçlendir
    if (userFeedback.liked && userFeedback.liked.length > 0) {
      const similarity = this.calculateSimilarity(message, userFeedback.liked);
      weight *= (1 + similarity);
    }

    // Beğenilmeyen mesajlara benzer olanları zayıflatır
    if (userFeedback.disliked && userFeedback.disliked.length > 0) {
      const similarity = this.calculateSimilarity(message, userFeedback.disliked);
      weight *= (1 - similarity * 0.5);
    }

    return Math.max(weight, 0.1); // Minimum ağırlık
  }

  // Mesaj benzerliği hesaplama (basit)
  calculateSimilarity(message, referenceMessages) {
    const messageWords = this.extractKeywords(message);
    let maxSimilarity = 0;

    referenceMessages.forEach(refMsg => {
      const refWords = this.extractKeywords(refMsg);
      const commonWords = messageWords.filter(word => refWords.includes(word));
      const similarity = commonWords.length / Math.max(messageWords.length, refWords.length);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });

    return maxSimilarity;
  }

  // Anahtar kelime çıkarma
  extractKeywords(message) {
    const stopWords = ['bir', 'bu', 'şu', 've', 'ile', 'için', 'gibi', 'daha', 'çok', 'en'];
    return message.toLowerCase()
      .replace(/[^\w\s]/g, '') // Noktalama işaretlerini kaldır
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }

  // Feedback kaydetme
  recordFeedback(messageId, userId, type, message) {
    if (!userId) return;

    if (!this.feedbackData[userId]) {
      this.feedbackData[userId] = { liked: [], disliked: [] };
    }

    const feedback = this.feedbackData[userId];
    
    if (type === 'like') {
      feedback.liked.push(message);
      // Maksimum 20 mesaj tut
      if (feedback.liked.length > 20) {
        feedback.liked.shift();
      }
    } else if (type === 'dislike') {
      feedback.disliked.push(message);
      if (feedback.disliked.length > 20) {
        feedback.disliked.shift();
      }
    }

    this.saveFeedbackData();
  }

  // Seçim kaydetme
  recordSelection(message, userId, metadata) {
    const record = {
      message,
      metadata,
      timestamp: new Date().toISOString(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    if (userId) {
      if (!this.messageHistory[userId]) {
        this.messageHistory[userId] = [];
      }
      
      this.messageHistory[userId].push(record);
      
      // Maksimum 50 mesaj geçmişi tut
      if (this.messageHistory[userId].length > 50) {
        this.messageHistory[userId].shift();
      }
      
      this.saveMessageHistory();
    }
  }

  // Yardımcı fonksiyonlar
  getTimeKey(hour) {
    if (hour >= 6 && hour < 12) return "06:00-11:59";
    if (hour >= 12 && hour < 18) return "12:00-17:59";
    if (hour >= 18 && hour < 22) return "18:00-21:59";
    return "22:00-05:59";
  }

  getMessageLength(message) {
    const length = message.length;
    if (length <= 100) return 'short';
    if (length <= 200) return 'medium';
    return 'long';
  }

  normalizeWeights(weights) {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const normalized = {};
    
    Object.keys(weights).forEach(key => {
      normalized[key] = weights[key] / total;
    });
    
    return normalized;
  }

  // Veri yönetimi
  loadUserPreferences() {
    try {
      return JSON.parse(localStorage.getItem('motivation_preferences') || '{}');
    } catch {
      return {};
    }
  }

  loadMessageHistory() {
    try {
      return JSON.parse(localStorage.getItem('motivation_history') || '{}');
    } catch {
      return {};
    }
  }

  loadFeedbackData() {
    try {
      return JSON.parse(localStorage.getItem('motivation_feedback') || '{}');
    } catch {
      return {};
    }
  }

  saveMessageHistory() {
    try {
      localStorage.setItem('motivation_history', JSON.stringify(this.messageHistory));
    } catch (error) {
      console.error('Failed to save message history:', error);
    }
  }

  saveFeedbackData() {
    try {
      localStorage.setItem('motivation_feedback', JSON.stringify(this.feedbackData));
    } catch (error) {
      console.error('Failed to save feedback data:', error);
    }
  }

  // Analytics
  getUserStats(userId) {
    if (!userId || !this.messageHistory[userId]) {
      return null;
    }

    const history = this.messageHistory[userId];
    const feedback = this.feedbackData[userId] || { liked: [], disliked: [] };
    
    const categoryStats = {};
    const moodStats = {};
    
    history.forEach(record => {
      const category = record.metadata.category;
      const mood = record.metadata.mood;
      
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      moodStats[mood] = (moodStats[mood] || 0) + 1;
    });

    return {
      totalMessages: history.length,
      favoriteCategory: Object.keys(categoryStats).reduce((a, b) => 
        categoryStats[a] > categoryStats[b] ? a : b, 'motivation'),
      commonMood: Object.keys(moodStats).reduce((a, b) => 
        moodStats[a] > moodStats[b] ? a : b, 'neutral'),
      engagementRate: feedback.liked.length / Math.max(history.length, 1),
      categoryStats,
      moodStats,
      lastActivity: history.length > 0 ? history[history.length - 1].timestamp : null
    };
  }
}

// Singleton instance
export const motivationService = new MotivationService();

// Export fonksiyonlar
export const getMotivationMessage = (options) => motivationService.selectMessage(options);
export const recordMessageFeedback = (messageId, userId, type, message) => 
  motivationService.recordFeedback(messageId, userId, type, message);
export const getUserMotivationStats = (userId) => motivationService.getUserStats(userId);

export default MotivationService;