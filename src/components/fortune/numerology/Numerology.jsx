// src/components/fortune/Numerology.jsx
import React, { useState } from 'react'
import { Calculator, Star, Heart, Briefcase, Activity, Calendar, ArrowRight } from 'lucide-react'

const Numerology = () => {
  const [birthDate, setBirthDate] = useState('')
  const [fullName, setFullName] = useState('')
  const [results, setResults] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Numeroloji hesaplama fonksiyonları
  const calculateLifePath = (date) => {
    const digits = date.replace(/\D/g, '').split('').map(Number)
    let sum = digits.reduce((acc, digit) => acc + digit, 0)
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    return sum
  }

  const calculateDestiny = (name) => {
    const letterValues = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
      'Ç': 3, 'Ğ': 7, 'İ': 9, 'Ö': 6, 'Ş': 1, 'Ü': 3
    }
    
    let sum = 0
    for (let char of name.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '')) {
      sum += letterValues[char] || 0
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    return sum
  }

  const calculateSoul = (name) => {
    const vowels = 'AEIOUÇĞİÖŞÜ'
    const letterValues = {
      'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3,
      'Ç': 3, 'Ğ': 7, 'İ': 9, 'Ö': 6, 'Ş': 1, 'Ü': 3
    }
    
    let sum = 0
    for (let char of name.toUpperCase()) {
      if (vowels.includes(char)) {
        sum += letterValues[char] || 0
      }
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    return sum
  }

  const calculatePersonality = (name) => {
    const vowels = 'AEIOUÇĞİÖŞÜ'
    const letterValues = {
      'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1, 'K': 2, 'L': 3,
      'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9, 'S': 1, 'T': 2, 'V': 4, 'W': 5,
      'X': 6, 'Y': 7, 'Z': 8
    }
    
    let sum = 0
    for (let char of name.toUpperCase()) {
      if (!vowels.includes(char) && letterValues[char]) {
        sum += letterValues[char]
      }
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
    }
    return sum
  }

  // Numeroloji anlamları
  const numerologyMeanings = {
    1: {
      title: "Lider",
      description: "Doğal lider, bağımsız, yaratıcı ve girişimci",
      traits: ["Liderlik", "Bağımsızlık", "Yaratıcılık", "Girişimcilik"],
      love: "İlişkilerde dominant, sadık ama bazen kontrolcü olabilir",
      career: "CEO, girişimci, sanatçı, mimar olmaya uygun",
      health: "Kalp ve dolaşım sistemi dikkat. Stres yönetimi önemli",
      color: "bg-red-500"
    },
    2: {
      title: "Barışçıl",
      description: "İşbirlikçi, diplomatik, hassas ve destekleyici",
      traits: ["İşbirliği", "Diplomasi", "Hassaslık", "Destekleyicilik"],
      love: "İlişkilerde uyumlu, fedakar ve romantik",
      career: "Danışman, terapi, öğretmenlik, müzik alanında başarılı",
      health: "Sinir sistemi hassas. Rahatlatıcı aktiviteler önemli",
      color: "bg-orange-500"
    },
    3: {
      title: "Sanatçı",
      description: "Yaratıcı, eğlenceli, sosyal ve iletişim odaklı",
      traits: ["Yaratıcılık", "Sosyallik", "İletişim", "Eğlence"],
      love: "Şen, eğlenceli ilişkiler kurar. Çeşitlilik arar",
      career: "Yazarlık, oyunculuk, pazarlama, sanat alanında başarılı",
      health: "Boğaz ve nefes alma sistemi dikkat. Konuşma organları",
      color: "bg-yellow-500"
    },
    4: {
      title: "İnşaatçı",
      description: "Sistemli, güvenilir, pratik ve çalışkan",
      traits: ["Düzen", "Güvenilirlik", "Pratiklik", "Çalışkanlık"],
      love: "Kararlı, güvenilir partner. Geleneksel değerleri sever",
      career: "Mühendislik, muhasebe, inşaat, bankacılık alanında başarılı",
      health: "Kemik ve kas sistemi güçlü. Fiziksel aktivite önemli",
      color: "bg-green-500"
    },
    5: {
      title: "Maceracı",
      description: "Özgür ruhlu, macera seven, meraklı ve değişken",
      traits: ["Özgürlük", "Macera", "Merak", "Değişkenlik"],
      love: "Çeşitlilik arar, monotonluktan sıkılır. Özgür ilişkiler",
      career: "Seyahat, medya, satış, ulaştırma sektörlerinde başarılı",
      health: "Sinir sistemi aktif. Çok çeşitli beslenme gerekli",
      color: "bg-blue-500"
    },
    6: {
      title: "Şefkatli",
      description: "Bakım odaklı, şefkatli, aile yönelimli ve sorumlu",
      traits: ["Şefkat", "Sorumluluk", "Aile", "Bakım"],
      love: "Aile odaklı, koruyucu ve besleyici partner",
      career: "Hemşirelik, öğretmenlik, psikoloji, sosyal hizmet alanında başarılı",
      health: "Kalp ve göğüs bölgesi dikkat. Duygusal sağlık önemli",
      color: "bg-pink-500"
    },
    7: {
      title: "Mistik",
      description: "Analitik, sezgisel, derin düşünen ve araştırmacı",
      traits: ["Analiz", "Sezgi", "Derinlik", "Araştırma"],
      love: "Derin, anlamlı ilişkiler arar. Manevi bağ önemli",
      career: "Araştırma, bilim, felsefe, din alanlarında başarılı",
      health: "Zihinsel sağlık önemli. Meditasyon ve rahatlama gerekli",
      color: "bg-purple-500"
    },
    8: {
      title: "İktidar",
      description: "Güçlü, başarı odaklı, organizatör ve maddi odaklı",
      traits: ["Güç", "Başarı", "Organizasyon", "Maddi Başarı"],
      love: "Güçlü partner arar. Statü ve başarı ilişkilerde önemli",
      career: "İş dünyası, finans, yöneticilik, emlak sektörlerinde başarılı",
      health: "Stres kaynaklı sorunlar. Dinlenme ve denge önemli",
      color: "bg-gray-700"
    },
    9: {
      title: "İnsancıl",
      description: "Evrensel sevgi, şefkat, insancıl ve fedakar",
      traits: ["Evrensel Sevgi", "Şefkat", "İnsancıllık", "Fedakarlık"],
      love: "Evrensel sevgi arar. Tüm insanlığı kucaklayan yaklaşım",
      career: "Sosyal hizmet, hayırseverlik, sanat, terapi alanlarında başarılı",
      health: "Genel sağlık iyi. Duygusal denge çok önemli",
      color: "bg-indigo-500"
    },
    11: {
      title: "Sezgisel Öğretmen",
      description: "Yüksek sezgi, ilham verici, ruhsal ve vizyoner",
      traits: ["Yüksek Sezgi", "İlham", "Ruhsallık", "Vizyon"],
      love: "Ruhsal bağ arar. Derin, manevi ilişkiler kurar",
      career: "Öğretmenlik, terapi, sanat, ruhsal rehberlik alanlarında başarılı",
      health: "Sinir sistemi hassas. Meditasyon ve ruhsal pratikler önemli",
      color: "bg-violet-500"
    },
    22: {
      title: "Ustası İnşaatçı",
      description: "Büyük vizyonlar, pratik uygulama, liderlik ve değişim yaratma",
      traits: ["Büyük Vizyon", "Pratik Liderlik", "Değişim", "İnşa Etme"],
      love: "Büyük hedefleri olan, destekleyici partner arar",
      career: "Büyük projeler, uluslararası işler, sosyal değişim alanlarında başarılı",
      health: "Yüksek enerji gerekir. Fiziksel ve mental denge kritik",
      color: "bg-amber-600"
    },
    33: {
      title: "Usta Öğretmen",
      description: "Şefkat ustası, iyileştirici, öğretici ve rehber",
      traits: ["Usta Şefkat", "İyileştirme", "Öğreticilik", "Rehberlik"],
      love: "Şefkat dolu, iyileştirici, destekleyici ilişkiler kurar",
      career: "Terapi, iyileştirme, öğretmenlik, rehberlik alanlarında başarılı",
      health: "Duygusal sağlık kritik. Başkalarına hizmet ederken kendini ihmal etmemeli",
      color: "bg-rose-500"
    }
  }

  const handleCalculate = async () => {
    if (!birthDate || !fullName.trim()) {
      alert('Lütfen doğum tarihinizi ve tam adınızı girin')
      return
    }

    setIsCalculating(true)
    
    // Hesaplama simülasyonu
    await new Promise(resolve => setTimeout(resolve, 2000))

    const lifePathNumber = calculateLifePath(birthDate)
    const destinyNumber = calculateDestiny(fullName)
    const soulNumber = calculateSoul(fullName)
    const personalityNumber = calculatePersonality(fullName)

    setResults({
      lifePath: lifePathNumber,
      destiny: destinyNumber,
      soul: soulNumber,
      personality: personalityNumber,
      lifePathMeaning: numerologyMeanings[lifePathNumber],
      destinyMeaning: numerologyMeanings[destinyNumber],
      soulMeaning: numerologyMeanings[soulNumber],
      personalityMeaning: numerologyMeanings[personalityNumber]
    })

    setIsCalculating(false)
  }

  const resetCalculation = () => {
    setResults(null)
    setBirthDate('')
    setFullName('')
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Numeroloji Analiziniz</h1>
          <p className="text-gray-600">
            {fullName} - {new Date(birthDate).toLocaleDateString('tr-TR')}
          </p>
          <button
            onClick={resetCalculation}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Yeni Analiz Yap
          </button>
        </div>

        {/* Ana Sayılar */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Yaşam Yolu */}
          <div className={`${results.lifePathMeaning.color} rounded-2xl p-6 text-white`}>
            <div className="text-center space-y-3">
              <Star className="w-8 h-8 mx-auto" />
              <div className="text-4xl font-bold">{results.lifePath}</div>
              <div className="font-semibold">Yaşam Yolu</div>
              <div className="text-sm opacity-90">{results.lifePathMeaning.title}</div>
            </div>
          </div>

          {/* Kader Sayısı */}
          <div className={`${results.destinyMeaning.color} rounded-2xl p-6 text-white`}>
            <div className="text-center space-y-3">
              <Briefcase className="w-8 h-8 mx-auto" />
              <div className="text-4xl font-bold">{results.destiny}</div>
              <div className="font-semibold">Kader Sayısı</div>
              <div className="text-sm opacity-90">{results.destinyMeaning.title}</div>
            </div>
          </div>

          {/* Ruh Sayısı */}
          <div className={`${results.soulMeaning.color} rounded-2xl p-6 text-white`}>
            <div className="text-center space-y-3">
              <Heart className="w-8 h-8 mx-auto" />
              <div className="text-4xl font-bold">{results.soul}</div>
              <div className="font-semibold">Ruh Sayısı</div>
              <div className="text-sm opacity-90">{results.soulMeaning.title}</div>
            </div>
          </div>

          {/* Kişilik Sayısı */}
          <div className={`${results.personalityMeaning.color} rounded-2xl p-6 text-white`}>
            <div className="text-center space-y-3">
              <Activity className="w-8 h-8 mx-auto" />
              <div className="text-4xl font-bold">{results.personality}</div>
              <div className="font-semibold">Kişilik Sayısı</div>
              <div className="text-sm opacity-90">{results.personalityMeaning.title}</div>
            </div>
          </div>
        </div>

        {/* Detaylı Analizler */}
        <div className="space-y-8">
          {/* Yaşam Yolu Detayı */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">Yaşam Yolu Sayısı: {results.lifePath}</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Genel Özellikler</h4>
                <p className="text-gray-600">{results.lifePathMeaning.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Güçlü Yanlarınız</h4>
                <div className="flex flex-wrap gap-2">
                  {results.lifePathMeaning.traits.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Aşk Hayatı
                  </h4>
                  <p className="text-gray-600 text-sm">{results.lifePathMeaning.love}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    Kariyer
                  </h4>
                  <p className="text-gray-600 text-sm">{results.lifePathMeaning.career}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    Sağlık
                  </h4>
                  <p className="text-gray-600 text-sm">{results.lifePathMeaning.health}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diğer Sayıların Özeti */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Kader Sayısı */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold">Kader Sayısı: {results.destiny}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">{results.destinyMeaning.description}</p>
              <p className="text-gray-600 text-sm">
                <strong>Kariyer:</strong> {results.destinyMeaning.career}
              </p>
            </div>

            {/* Ruh Sayısı */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-red-600" />
                <h4 className="font-bold">Ruh Sayısı: {results.soul}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">{results.soulMeaning.description}</p>
              <p className="text-gray-600 text-sm">
                <strong>Aşk:</strong> {results.soulMeaning.love}
              </p>
            </div>

            {/* Kişilik Sayısı */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h4 className="font-bold">Kişilik Sayısı: {results.personality}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">{results.personalityMeaning.description}</p>
              <p className="text-gray-600 text-sm">
                <strong>Sağlık:</strong> {results.personalityMeaning.health}
              </p>
            </div>
          </div>
        </div>

        {/* Genel Öneriler */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🌟 Kişisel Öneriler
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Yaşam amacınız:</strong> {results.lifePath} numaralı yaşam yolunda {results.lifePathMeaning.title.toLowerCase()} rolü oynamaya geldiniz.
            </p>
            <p>
              • <strong>Güçlü yönleriniz:</strong> {results.lifePathMeaning.traits.join(', ').toLowerCase()} konularında doğal yetenekleriniz var.
            </p>
            <p>
              • <strong>Odaklanmanız gereken alan:</strong> {results.destinyMeaning.career.toLowerCase()}
            </p>
            <p>
              • <strong>İçsel motivasyonunuz:</strong> Ruh sayınız {results.soul}, {results.soulMeaning.description.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Numeroloji Analizi</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Doğum tarihiniz ve tam adınızla kişisel numeroloji analizinizi keşfedin
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Doğum Tarihiniz
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 inline mr-2" />
            Tam Adınız (Ad Soyad)
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Örnek: Ahmet Yılmaz"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            En doğru sonuç için nüfus cüzdanınızdaki isminizi kullanın
          </p>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating || !birthDate || !fullName.trim()}
          className={`w-full p-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isCalculating || !birthDate || !fullName.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Numeroloji Hesaplanıyor...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Numeroloji Analizini Başlat
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Bilgi Kutusu */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">🔢 Numeroloji Nedir?</h3>
          <p className="text-purple-700 text-sm">
            Numeroloji, sayıların insanların kişilik özelliklerini, yaşam amacını ve kaderini nasıl etkilediğini inceleyen antik bir bilimdir. 
            Doğum tarihiniz ve adınızdaki harflerin sayısal değerleri analiz edilerek kişisel özellikleriniz ortaya çıkarılır.
          </p>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-2">
            <Star className="w-6 h-6 text-purple-600 mx-auto" />
            <div className="text-sm font-medium">Yaşam Yolu</div>
            <div className="text-xs text-gray-600">Ana kişilik özellik</div>
          </div>
          <div className="space-y-2">
            <Heart className="w-6 h-6 text-red-500 mx-auto" />
            <div className="text-sm font-medium">Ruh Sayısı</div>
            <div className="text-xs text-gray-600">İçsel motivasyon</div>
          </div>
          <div className="space-y-2">
            <Briefcase className="w-6 h-6 text-blue-500 mx-auto" />
            <div className="text-sm font-medium">Kader Sayısı</div>
            <div className="text-xs text-gray-600">Yaşam amacı</div>
          </div>
          <div className="space-y-2">
            <Activity className="w-6 h-6 text-green-500 mx-auto" />
            <div className="text-sm font-medium">Kişilik Sayısı</div>
            <div className="text-xs text-gray-600">Dış görünüm</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Numerology