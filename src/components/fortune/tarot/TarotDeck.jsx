import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  RotateCcw, 
  Save, 
  Share2, 
  Sparkles, 
  Clock, 
  Heart,
  Briefcase,
  Activity,
  Star,
  Moon,
  Sun
} from 'lucide-react';
import TarotCard from './TarotCard';
import { tarotCards, tarotSpreads, getRandomCards } from '../../../data/fortune/tarotCards';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';

const TarotDeck = ({ spreadType = 'threeCard' }) => {
  const { user } = useAuth();
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentStep, setCurrentStep] = useState('shuffle'); // shuffle, pick, reveal, interpret
  const [selectedSpread, setSelectedSpread] = useState(tarotSpreads[spreadType]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load user's reading history
  useEffect(() => {
    if (user?.id) {
      loadReadingHistory();
    }
  }, [user?.id]);

  const loadReadingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('tarot_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReadingHistory(data || []);
    } catch (error) {
      console.error('Error loading reading history:', error);
    }
  };

  // Shuffle animation
  const shuffleCards = async () => {
    setIsShuffling(true);
    setCurrentStep('shuffle');
    
    // Simulate shuffling animation
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      // You could add visual shuffling effects here
    }
    
    setIsShuffling(false);
    setCurrentStep('pick');
    toast.info('Kartlar karıştırıldı! Şimdi kartlarınızı seçin.');
  };

  // Card selection
  const selectCards = () => {
    const cards = getRandomCards(selectedSpread.positions.length);
    const cardsWithReversed = cards.map(card => ({
      ...card,
      isReversed: Math.random() < 0.3 // 30% chance of being reversed
    }));
    
    setSelectedCards(cardsWithReversed);
    setRevealedCards([]);
    setCurrentStep('reveal');
  };

  // Reveal cards one by one
  const revealCard = (index) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index]);
      
      // Auto-proceed to interpretation when all cards are revealed
      if (revealedCards.length + 1 === selectedCards.length) {
        setTimeout(() => {
          setCurrentStep('interpret');
        }, 1000);
      }
    }
  };

  // Save reading to database
  const saveReading = async () => {
    if (!user?.id || selectedCards.length === 0) return;

    try {
      setIsLoading(true);
      
      const reading = {
        user_id: user.id,
        spread_type: spreadType,
        question: question || null,
        cards: selectedCards.map((card, index) => ({
          position: index,
          card_id: card.id,
          is_reversed: card.isReversed,
          position_name: selectedSpread.positions[index]?.name
        })),
        interpretation: generateInterpretation(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tarot_readings')
        .insert([reading]);

      if (error) throw error;

      toast.success('Falınız kaydedildi!');
      loadReadingHistory();
    } catch (error) {
      console.error('Error saving reading:', error);
      toast.error('Fal kaydedilirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate interpretation
  const generateInterpretation = () => {
    if (selectedCards.length === 0) return '';

    let interpretation = `${selectedSpread.name} ile yapılan fal yorumu:\n\n`;
    
    selectedCards.forEach((card, index) => {
      const position = selectedSpread.positions[index];
      const cardData = card.isReversed ? card.reversed : card.upright;
      
      interpretation += `${position.name}: ${card.nameTr}\n`;
      interpretation += `${cardData.general}\n\n`;
    });

    return interpretation;
  };

  // Share reading
  const shareReading = () => {
    const shareText = `🔮 Emotice Tarot Falım:\n\n${generateInterpretation()}\n\n🌟 Sen de falına bak: https://emotice.com/fortune`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Tarot Falım',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Fal panoya kopyalandı!');
    }
  };

  // Start new reading
  const startNewReading = () => {
    setSelectedCards([]);
    setRevealedCards([]);
    setCurrentStep('shuffle');
    setQuestion('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Tarot Falı</h1>
            <p className="text-gray-600">{selectedSpread.description}</p>
          </div>
        </div>

        {/* Scientific Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
          <p className="text-amber-700 text-sm">
            ⚠️ <strong>Eğlence Amaçlıdır:</strong> Tarot falları eğlence ve introspeksiyon amaçlıdır. 
            Önemli kararlarınızı alırken profesyonel danışmanlık alın.
          </p>
        </div>
      </div>

      {/* Question Input */}
      {currentStep === 'shuffle' && (
        <div className="max-w-2xl mx-auto mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sorunuz (İsteğe bağlı)
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="3"
            placeholder="Falından öğrenmek istediğin konuyu yazabilirsin... (örn: Aşk hayatım nasıl gelişecek?)"
          />
        </div>
      )}

      {/* Spread Positions Guide */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {selectedSpread.name} Pozisyonları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedSpread.positions.map((position, index) => (
            <div key={position.id} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                {index + 1}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{position.name}</h3>
              <p className="text-sm text-gray-600">{position.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Card Area */}
      <div className="max-w-4xl mx-auto">
        {/* Shuffle Step */}
        {currentStep === 'shuffle' && (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600 rounded-xl shadow-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌟</div>
                  <div className="text-sm font-medium">TAROT DECK</div>
                </div>
              </div>
              <button
                onClick={shuffleCards}
                disabled={isShuffling}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
                {isShuffling ? 'Kartlar Karıştırılıyor...' : 'Kartları Karıştır'}
              </button>
            </div>
          </div>
        )}

        {/* Pick Step */}
        {currentStep === 'pick' && (
          <div className="text-center">
            <div className="mb-8">
              <p className="text-gray-600 mb-6">Kartlar hazır! Falınızı görmek için butona tıklayın.</p>
              <button
                onClick={selectCards}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Star className="w-5 h-5" />
                Kartları Seç
              </button>
            </div>
          </div>
        )}

        {/* Reveal & Interpret Steps */}
        {(currentStep === 'reveal' || currentStep === 'interpret') && selectedCards.length > 0 && (
          <div>
            {/* Cards Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {selectedCards.map((card, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {selectedSpread.positions[index]?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedSpread.positions[index]?.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <TarotCard
                      card={card}
                      isRevealed={revealedCards.includes(index)}
                      isReversed={card.isReversed}
                      onClick={() => currentStep === 'reveal' ? revealCard(index) : null}
                      size="large"
                      showDetails={currentStep === 'interpret'}
                    />
                  </div>

                  {/* Click to reveal message */}
                  {currentStep === 'reveal' && !revealedCards.includes(index) && (
                    <p className="text-sm text-purple-600 animate-pulse">
                      Kartı açmak için tıklayın
                    </p>
                  )}

                  {/* Card interpretation */}
                  {currentStep === 'interpret' && revealedCards.includes(index) && (
                    <div className="bg-white rounded-lg shadow-md p-4 text-left">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {card.nameTr} {card.isReversed && '(Ters)'}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {(card.isReversed ? card.reversed : card.upright).general}
                      </p>
                      
                      {/* Keywords */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {card.keywords.slice(0, 3).map((keyword) => (
                          <span 
                            key={keyword} 
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {currentStep === 'interpret' && (
              <div className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={saveReading}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Kaydediliyor...' : 'Falı Kaydet'}
                  </button>
                  
                  <button
                    onClick={shareReading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Paylaş
                  </button>
                  
                  <button
                    onClick={startNewReading}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Yeni Fal
                  </button>
                </div>

                {/* Overall interpretation */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Genel Yorum
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Falınıza göre, {selectedCards.length} kart size {selectedSpread.name.toLowerCase()} 
                    hakkında önemli mesajlar veriyor. Her kart farklı bir zamana ve duruma işaret ediyor. 
                    Bu kartlar rehberlik etmek için, kendi iç sesinizle birlikte değerlendirin.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reading History */}
      {readingHistory.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <Clock className="w-6 h-6 inline mr-2" />
            Geçmiş Fallarım
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {readingHistory.slice(0, 4).map((reading) => (
              <div key={reading.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{reading.spread_type}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(reading.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                {reading.question && (
                  <p className="text-sm text-gray-600 mb-2">"{reading.question}"</p>
                )}
                <div className="flex gap-1">
                  {reading.cards.slice(0, 3).map((cardData, index) => (
                    <div key={index} className="text-lg">
                      {tarotCards.find(c => c.id === cardData.card_id)?.image}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotDeck;