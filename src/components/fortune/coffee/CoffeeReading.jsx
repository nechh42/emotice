import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Eye, 
  Sparkles, 
  Share2, 
  Save, 
  RotateCcw,
  Camera,
  Upload,
  Zap,
  Heart,
  Star
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-toastify';

const CoffeeReading = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('intro'); // intro, upload, analyze, result
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);

  // Coffee fortune patterns and interpretations
  const coffeePatterns = {
    circle: {
      name: 'Daire',
      meanings: [
        'Tamamlanma ve bütünlük',
        'Döngüsel değişimler',
        'Aile ve yakın çevre uyumu',
        'Para ve bolluk'
      ]
    },
    line: {
      name: 'Çizgi',
      meanings: [
        'Yolculuk ve seyahat',
        'Yeni yollar ve fırsatlar', 
        'Düz ve net ilişkiler',
        'Kararlılık'
      ]
    },
    triangle: {
      name: 'Üçgen',
      meanings: [
        'Başarı ve yükselme',
        'Üç kişilik durumlar',
        'Dengelenmiş güçler',
        'Maneviyat ve bilgelik'
      ]
    },
    heart: {
      name: 'Kalp',
      meanings: [
        'Aşk ve romantizm',
        'Duygusal bağlılık',
        'Aile sevgisi',
        'İçsel mutluluk'
      ]
    },
    bird: {
      name: 'Kuş',
      meanings: [
        'Özgürlük ve bağımsızlık',
        'Haber ve mesaj',
        'Ruhsal yükselme',
        'Seyahat ve değişim'
      ]
    },
    flower: {
      name: 'Çiçek',
      meanings: [
        'Güzellik ve estetik',
        'Yeni başlangıçlar',
        'Sanat ve yaratıcılık',
        'Sevgi dolu ilişkiler'
      ]
    },
    star: {
      name: 'Yıldız',
      meanings: [
        'Umut ve rehberlik',
        'Şans ve talih',
        'Yüksek idealler',
        'Maneviyat'
      ]
    },
    moon: {
      name: 'Ay',
      meanings: [
        'Kadınsılık ve sezgi',
        'Gizli bilgi',
        'Döngüsel değişimler',
        'Ruh hali dalgalanmaları'
      ]
    },
    eye: {
      name: 'Göz',
      meanings: [
        'Koruma ve gözetim',
        'Sezgi ve anlayış',
        'Dikkat ve uyanıklık',
        'Nazar ve korunma'
      ]
    },
    tree: {
      name: 'Ağaç',
      meanings: [
        'Büyüme ve gelişim',
        'Aile kökenleri',
        'Güç ve dayanıklılık',
        'Doğal süreçler'
      ]
    }
  };

  // Sample interpretations for different cup areas
  const cupAreas = {
    rim: 'Fincanın Kenarı - Yakın gelecek (1-2 hafta)',
    upper: 'Üst Kısım - Orta vadeli gelecek (1-3 ay)', 
    middle: 'Orta Kısım - Uzak gelecek (3-12 ay)',
    bottom: 'Alt Kısım - Geçmiş ve kökler'
  };

  useEffect(() => {
    if (user?.id) {
      loadReadingHistory();
    }
  }, [user?.id]);

  const loadReadingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('coffee_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReadingHistory(data || []);
    } catch (error) {
      console.error('Error loading coffee reading history:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resim boyutu 5MB\'dan küçük olmalı');
        return;
      }

      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setCurrentStep('analyze');
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate coffee reading analysis
  const analyzeCoffee = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analyze');

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate random but meaningful reading
    const patterns = Object.keys(coffeePatterns);
    const detectedPatterns = patterns
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 3));

    const reading = {
      patterns: detectedPatterns.map(pattern => ({
        name: coffeePatterns[pattern].name,
        meanings: coffeePatterns[pattern].meanings,
        area: Object.keys(cupAreas)[Math.floor(Math.random() * 4)]
      })),
      generalReading: generateGeneralReading(detectedPatterns),
      timeFrame: {
        near: generatePrediction('Yakın gelecek'),
        medium: generatePrediction('Orta vadeli'),
        far: generatePrediction('Uzak gelecek')
      },
      advice: generateAdvice()
    };

    setAnalysis(reading);
    setIsAnalyzing(false);
    setCurrentStep('result');
  };

  const generateGeneralReading = (patterns) => {
    const readings = [
      'Fincanınızda güzel şekiller görüyorum. Yakın zamanda olumlu değişimler yaşayacaksınız.',
      'Kahve telveleriniz umut verici işaretler gösteriyor. Sabırla beklediğiniz müjdeli haber yakında gelecek.',
      'Fincanınızdaki desenler, hayatınızda yeni bir dönemin başlangıcını işaret ediyor.',
      'Telveler size sevgi dolu günlerin yaklaştığını müjdeliyor.',
      'Kahve falınız, hedeflerinize ulaşmak için doğru yolda olduğunuzu gösteriyor.'
    ];
    return readings[Math.floor(Math.random() * readings.length)];
  };

  const generatePrediction = (timeFrame) => {
    const predictions = {
      'Yakın gelecek': [
        'Beklenmedik bir hediye veya sürpriz alacaksınız',
        'Yakın çevrenizden güzel bir haber gelecek',
        'Yeni bir tanışıklık hayatınızı olumlu etkileyecek',
        'Mali durumunuzda iyileşme başlayacak'
      ],
      'Orta vadeli': [
        'Kariyer hayatınızda önemli bir fırsat doğacak',
        'Uzun süredir planladığınız bir proje gerçekleşecek',
        'Aile hayatınızda mutlu değişiklikler olacak',
        'Sağlık konularında olumlu gelişmeler yaşanacak'
      ],
      'Uzak gelecek': [
        'Büyük hayalleriniz gerçekleşme yolunda ilerleyecek',
        'Uzak bir yerden gelen fırsat hayatınızı değiştirecek',
        'Maddi durumunuzda büyük iyileşme olacak',
        'Ailede önemli bir kutlama yaşanacak'
      ]
    };
    
    const timeFramePredictions = predictions[timeFrame] || predictions['Yakın gelecek'];
    return timeFramePredictions[Math.floor(Math.random() * timeFramePredictions.length)];
  };

  const generateAdvice = () => {
    const advices = [
      'Sezgilerinize güvenin ve kalbinizin sesini dinleyin.',
      'Yakın çevrenizden gelen tavsiyeleri dikkate alın.',
      'Sabırlı olun, güzel şeyler zaman alır.',
      'Yeni fırsatlara açık olmayı unutmayın.',
      'Sevdiklerinizle daha fazla zaman geçirmeye özen gösterin.'
    ];
    return advices[Math.floor(Math.random() * advices.length)];
  };

  // Save reading to database
  const saveReading = async () => {
    if (!user?.id || !analysis) return;

    try {
      const reading = {
        user_id: user.id,
        analysis: analysis,
        image_url: imagePreview, // In production, upload to storage first
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('coffee_readings')
        .insert([reading]);

      if (error) throw error;

      toast.success('Kahve falınız kaydedildi!');
      loadReadingHistory();
    } catch (error) {
      console.error('Error saving coffee reading:', error);
      toast.error('Fal kaydedilirken hata oluştu');
    }
  };

  // Share reading
  const shareReading = () => {
    if (!analysis) return;

    const shareText = `☕ Emotice Kahve Falım:\n\n${analysis.generalReading}\n\n🔮 Sen de falına bak: https://emotice.com/fortune/coffee`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Kahve Falım',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Fal panoya kopyalandı!');
    }
  };

  const startNewReading = () => {
    setCurrentStep('intro');
    setUploadedImage(null);
    setImagePreview('');
    setAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Türk Kahvesi Falı</h1>
            <p className="text-gray-600">Kahve telvenizle geleceğinizi keşfedin</p>
          </div>
        </div>

        {/* Scientific Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
          <p className="text-amber-700 text-sm">
            ☕ <strong>Eğlence Amaçlıdır:</strong> Kahve falı Türk kültürünün geleneksel eğlence aktivitesidir. 
            Ciddi kararlarınızı alırken uzman görüşü alın.
          </p>
        </div>
      </div>

      {/* Step 1: Intro */}
      {currentStep === 'intro' && (
        <div className="text-center">
          {/* Coffee preparation guide */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kahve Falı Nasıl Hazırlanır?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Kahve Hazırlığı</h3>
                    <p className="text-sm text-gray-600">Türk kahvesini geleneksel yöntemle demleyin ve için.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Fincan Çevirme</h3>
                    <p className="text-sm text-gray-600">Kahve bittikten sonra fincanı tabağa ters çevirin ve 5-10 dakika bekleyin.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Fincanı Kaldırın</h3>
                    <p className="text-sm text-gray-600">Fincanı kaldırdıktan sonra telve desenlerini fotoğraflayın.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Fotoğraf Çekin</h3>
                    <p className="text-sm text-gray-600">Fincanın içini net bir şekilde fotoğraflayın ve yükleyin.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">☕</div>
                  <p className="text-gray-600 italic">Geleneksel Türk kahvesi falı</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload button */}
          <div>
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-amber-300 rounded-2xl cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Kahve Fincanı Fotoğrafını Yükleyin</h3>
                <p className="text-gray-600 mb-4">JPG, PNG formatında, maksimum 5MB</p>
                <div className="flex items-center gap-2 text-amber-600">
                  <Camera className="w-5 h-5" />
                  <span className="font-medium">Fotoğraf Seç</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Analyze */}
      {currentStep === 'analyze' && (
        <div className="text-center">
          {imagePreview && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Yüklenen Fotoğraf</h2>
              <div className="max-w-md mx-auto mb-6">
                <img 
                  src={imagePreview} 
                  alt="Coffee cup" 
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          )}

          {!isAnalyzing ? (
            <div>
              <p className="text-gray-600 mb-6">Fotoğrafınız hazır! Falınızı analiz etmeye başlayalım.</p>
              <button
                onClick={analyzeCoffee}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Eye className="w-5 h-5" />
                Falımı Analiz Et
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Falınız Analiz Ediliyor...</h3>
              <p className="text-gray-600 mb-4">Telve desenleriniz inceleniyor</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === 'result' && analysis && (
        <div>
          {/* General Reading */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              Kahve Falınız
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {analysis.generalReading}
            </p>
          </div>

          {/* Detected Patterns */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Tespit Edilen Desenler</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.patterns.map((pattern, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-600" />
                    {pattern.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{cupAreas[pattern.area]}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pattern.meanings.slice(0, 2).map((meaning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        {meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Time Predictions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Zaman Çizelgesi</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Yakın Gelecek (1-2 hafta)
                </h4>
                <p className="text-sm text-green-700">{analysis.timeFrame.near}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Orta Vadeli (1-3 ay)
                </h4>
                <p className="text-sm text-blue-700">{analysis.timeFrame.medium}</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Uzak Gelecek (3-12 ay)
                </h4>
                <p className="text-sm text-purple-700">{analysis.timeFrame.far}</p>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Tavsiye
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {analysis.advice}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={saveReading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Falı Kaydet
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
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Yeni Fal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading History */}
      {readingHistory.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            <Coffee className="w-6 h-6 inline mr-2" />
            Geçmiş Kahve Fallarım
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {readingHistory.slice(0, 4).map((reading) => (
              <div key={reading.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">Kahve Falı</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(reading.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {reading.analysis?.generalReading}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{reading.analysis?.patterns?.length || 0} desen tespit edildi</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>☕ Türk kahvesi falı</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeReading;