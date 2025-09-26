// src/data/fortune/numerologyData.js

export const letterValues = {
  // İngilizce harfler
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
  // Türkçe harfler
  'Ç': 3, 'Ğ': 7, 'İ': 9, 'Ö': 6, 'Ş': 1, 'Ü': 3
}

export const vowels = 'AEIOUÇĞİÖŞÜ'

export const numerologyMeanings = {
  1: {
    title: "Lider",
    emoji: "👑",
    element: "Ateş",
    planet: "Güneş",
    color: "Kırmızı",
    description: "Doğal lider, bağımsız, yaratıcı ve girişimci kişilik",
    traits: ["Liderlik", "Bağımsızlık", "Yaratıcılık", "Girişimcilik", "Cesaret"],
    strengths: [
      "Güçlü liderlik yetenekleri",
      "Yaratıcı ve yenilikçi düşünce",
      "Bağımsız hareket etme becerisi",
      "Girişimci ruhu",
      "Cesur ve kararlı"
    ],
    challenges: [
      "Bazen fazla egoist olabilir",
      "İşbirliği yapmakta zorlanabilir",
      "Sabırsızlık gösterebilir",
      "Kontrolcü olma eğilimi",
      "Eleştiriye karşı hassas"
    ],
    love: "İlişkilerde dominant, sadık ama bazen kontrolcü olabilir. Partner seçiminde bağımsızlığına saygı gösterecek birini arar.",
    career: "CEO, girişimci, sanatçı, mimar, politik lider, sporcu olmaya uygun. Liderlik gerektiren tüm alanlarda başarılı.",
    health: "Kalp ve dolaşım sistemi dikkat edilmeli. Stres yönetimi önemli. Düzenli egzersiz ve meditasyon faydalı.",
    luckyNumbers: [1, 10, 19, 28],
    luckyDays: ["Pazar"],
    luckyColors: ["Kırmızı", "Turuncu", "Altın"],
    compatibleNumbers: [3, 5, 6, 9],
    tips: [
      "Liderlik özelliklerinizi geliştirin",
      "Takım çalışması becerilerinizi artırın",
      "Sabırlı olmayı öğrenin",
      "Başkalarının fikirlerini dinleyin"
    ]
  },
  
  2: {
    title: "Barışçıl",
    emoji: "🕊️",
    element: "Su",
    planet: "Ay",
    color: "Mavi",
    description: "İşbirlikçi, diplomatik, hassas ve destekleyici kişilik",
    traits: ["İşbirliği", "Diplomasi", "Hassaslık", "Destekleyicilik", "Uyum"],
    strengths: [
      "Mükemmel diplomasi becerileri",
      "Empati ve anlayış",
      "İşbirliği yapma yeteneği",
      "Barışçıl çözümler bulma",
      "İyi dinleme becerileri"
    ],
    challenges: [
      "Karar vermekte zorlanabilir",
      "Çok hassas olabilir",
      "Konfrontasyondan kaçabilir",
      "Özgüven eksikliği yaşayabilir",
      "Başkalarını memnun etme takıntısı"
    ],
    love: "İlişkilerde uyumlu, fedakar ve romantik. Duygusal bağ ve uyum çok önemli. Partner ile derin empati kurar.",
    career: "Danışman, terapi, öğretmenlik, müzik, diplomasi, sosyal hizmet alanlarında başarılı. İnsan ilişkileri gerektiren işler ideal.",
    health: "Sinir sistemi hassas. Stres yönetimi kritik. Rahatlatıcı aktiviteler, yoga ve meditasyon çok faydalı.",
    luckyNumbers: [2, 11, 20, 29],
    luckyDays: ["Pazartesi"],
    luckyColors: ["Mavi", "Yeşil", "Gümüş"],
    compatibleNumbers: [1, 6, 8, 9],
    tips: [
      "Özgüveninizi geliştirin",
      "Karar verme becerilerinizi artırın",
      "Sınırlarınızı korumayı öğrenin",
      "Stress yönetimi teknikleri uygulayın"
    ]
  },

  3: {
    title: "Sanatçı",
    emoji: "🎨",
    element: "Hava",
    planet: "Jüpiter",
    color: "Sarı",
    description: "Yaratıcı, eğlenceli, sosyal ve iletişim odaklı kişilik",
    traits: ["Yaratıcılık", "Sosyallik", "İletişim", "Eğlence", "İfade Gücü"],
    strengths: [
      "Güçlü yaratıcılık ve sanat yeteneği",
      "Mükemmel iletişim becerileri",
      "Sosyal ve çekici kişilik",
      "Pozitif enerji ve neşe",
      "İfade gücü ve hayal kurma"
    ],
    challenges: [
      "Odaklanmakta zorlanabilir",
      "Yüzeysel olabilir",
      "Aşırı duygusal dalgalanmalar",
      "Disiplin eksikliği",
      "Eleştiriye karşı hassaslık"
    ],
    love: "Şen, eğlenceli ilişkiler kurar. Çeşitlilik ve heyecan arar. İletişim ve paylaşım çok önemli.",
    career: "Yazarlık, oyunculuk, pazarlama, sanat, medya, eğlence sektöründe başarılı. Yaratıcılık gerektiren tüm alanlar uygun.",
    health: "Boğaz ve nefes alma sistemi dikkat edilmeli. Konuşma organları hassas. Yaratıcı aktiviteler ruh sağlığı için önemli.",
    luckyNumbers: [3, 12, 21, 30],
    luckyDays: ["Perşembe"],
    luckyColors: ["Sarı", "Turuncu", "Mor"],
    compatibleNumbers: [1, 5, 6, 9],
    tips: [
      "Yaratıcı yeteneklerinizi geliştirin",
      "Odaklanma becerilerinizi artırın",
      "Disiplinli olmayı öğrenin",
      "Derinlemesine düşünme pratiği yapın"
    ]
  },

  4: {
    title: "İnşaatçı",
    emoji: "🏗️",
    element: "Toprak",
    planet: "Uranüs",
    color: "Yeşil",
    description: "Sistemli, güvenilir, pratik ve çalışkan kişilik",
    traits: ["Düzen", "Güvenilirlik", "Pratiklik", "Çalışkanlık", "Kararlılık"],
    strengths: [
      "Güçlü örgütlenme becerileri",
      "Güvenilir ve sadık kişilik",
      "Pratik çözümler bulma",
      "Çok çalışkan ve azimli",
      "Detaylara dikkat"
    ],
    challenges: [
      "Çok katı ve esnek olmayabilir",
      "Değişime direnç gösterebilir",
      "Mükemmeliyetçilik",
      "Monotonluktan sıkılabilir",
      "Risk almaktan çekinebilir"
    ],
    love: "Kararlı, güvenilir partner. Geleneksel değerleri sever. Uzun vadeli, istikrarlı ilişkiler kurar.",
    career: "Mühendislik, muhasebe, inşaat, bankacılık, yönetim, organizasyon alanlarında başarılı. Sistemli çalışma gerektiren işler ideal.",
    health: "Kemik ve kas sistemi güçlü. Fiziksel aktivite önemli. Stres nedeniyle kasılmalar olabilir.",
    luckyNumbers: [4, 13, 22, 31],
    luckyDays: ["Çarşamba"],
    luckyColors: ["Yeşil", "Kahverengi", "Gri"],
    compatibleNumbers: [2, 6, 7, 8],
    tips: [
      "Esneklik geliştirin",
      "Değişime açık olun",
      "Yaratıcılığınızı artırın",
      "Dinlenmeyi ihmal etmeyin"
    ]
  },

  5: {
    title: "Maceracı",
    emoji: "🌍",
    element: "Hava",
    planet: "Merkür",
    color: "Mavi",
    description: "Özgür ruhlu, macera seven, meraklı ve değişken kişilik",
    traits: ["Özgürlük", "Macera", "Merak", "Değişkenlik", "Esneklik"],
    strengths: [
      "Güçlü adaptasyon yeteneği",
      "Çok yönlü yetenekler",
      "Macera ve keşif ruhu",
      "İletişim becerileri",
      "Özgürlük sevgisi"
    ],
    challenges: [
      "Kararsızlık ve değişkenlik",
      "Sorumluluktan kaçabilir",
      "Sabırsızlık",
      "Yüzeysel olabilir",
      "Bağlılık konusunda zorluk"
    ],
    love: "Çeşitlilik arar, monotonluktan sıkılır. Özgür ilişkiler tercih eder. Partner ile birlikte keşfetmeyi sever.",
    career: "Seyahat, medya, satış, ulaştırma, iletişim sektörlerinde başarılı. Değişkenlik ve hareket gerektiren işler ideal.",
    health: "Sinir sistemi aktif. Çok çeşitli beslenme gerekli. Düzenli egzersiz ve hareket önemli.",
    luckyNumbers: [5, 14, 23, 32],
    luckyDays: ["Çarşamba"],
    luckyColors: ["Mavi", "Gri", "Beyaz"],
    compatibleNumbers: [1, 3, 7, 9],
    tips: [
      "Odaklanma becerilerinizi geliştirin",
      "Sorumluluk almayı öğrenin",
      "Sabırlı olmaya çalışın",
      "Derinlemesine öğrenmeye odaklanın"
    ]
  },

  6: {
    title: "Şefkatli",
    emoji: "💝",
    element: "Toprak",
    planet: "Venüs",
    color: "Pembe",
    description: "Bakım odaklı, şefkatli, aile yönelimli ve sorumlu kişilik",
    traits: ["Şefkat", "Sorumluluk", "Aile", "Bakım", "Uyum"],
    strengths: [
      "Güçlü şefkat ve empati",
      "Aile ve arkadaş odaklılık",
      "Sorumluluk alma becerisi",
      "İyileştirici ve destekleyici",
      "Estetik ve güzellik anlayışı"
    ],
    challenges: [
      "Aşırı fedakarlık yapabilir",
      "Sınırlarını koruyamayabilir",
      "Mükemmeliyetçilik",
      "Kontrolcü olabilir",
      "Kendini ihmal edebilir"
    ],
    love: "Aile odaklı, koruyucu ve besleyici partner. Uzun vadeli, şefkat dolu ilişkiler kurar.",
    career: "Hemşirelik, öğretmenlik, psikoloji, sosyal hizmet, estetik, tasarım alanlarında başarılı.",
    health: "Kalp ve göğüs bölgesi dikkat edilmeli. Duygusal sağlık önemli. Stress nedeniyle sorunlar olabilir.",
    luckyNumbers: [6, 15, 24, 33],
    luckyDays: ["Cuma"],
    luckyColors: ["Pembe", "Mavi", "Yeşil"],
    compatibleNumbers: [2, 3, 4, 9],
    tips: [
      "Sınırlarınızı korumayı öğrenin",
      "Kendinize zaman ayırın",
      "Mükemmeliyetçilikten uzaklaşın",
      "Başkalarının sorumluluklarını almayın"
    ]
  },

  7: {
    title: "Mistik",
    emoji: "🔮",
    element: "Su",
    planet: "Neptün",
    color: "Mor",
    description: "Analitik, sezgisel, derin düşünen ve araştırmacı kişilik",
    traits: ["Analiz", "Sezgi", "Derinlik", "Araştırma", "Maneviyat"],
    strengths: [
      "Güçlü analitik düşünce",
      "Yüksek sezgi ve algı",
      "Derin araştırma yeteneği",
      "Maneviyat ve felsefe ilgisi",
      "Bağımsız düşünce"
    ],
    challenges: [
      "Sosyal ilişkilerde zorlanabilir",
      "Aşırı analiz yapabilir",
      "İçe kapanma eğilimi",
      "Mükemmeliyetçilik",
      "Güvensizlik"
    ],
    love: "Derin, anlamlı ilişkiler arar. Manevi bağ çok önemli. Yüzeysel ilişkilerden kaçınır.",
    career: "Araştırma, bilim, felsefe, din, psikoloji, analiz gerektiren alanlar. Akademik kariyerler ideal.",
    health: "Zihinsel sağlık önemli. Meditasyon ve rahatlama gerekli. Sinir sistemi hassas olabilir.",
    luckyNumbers: [7, 16, 25, 34],
    luckyDays: ["Pazartesi"],
    luckyColors: ["Mor", "İndigo", "Gümüş"],
    compatibleNumbers: [4, 5, 8, 9],
    tips: [
      "Sosyal becerilerinizi geliştirin",
      "Aşırı analizden kaçının",
      "Güven inşa etmeye çalışın",
      "Meditasyon ve ruhsal pratikler yapın"
    ]
  },

  8: {
    title: "İktidar",
    emoji: "👑",
    element: "Toprak",
    planet: "Satürn",
    color: "Siyah",
    description: "Güçlü, başarı odaklı, organizatör ve maddi odaklı kişilik",
    traits: ["Güç", "Başarı", "Organizasyon", "Maddi Başarı", "Liderlik"],
    strengths: [
      "Güçlü liderlik ve yöneticilik",
      "Başarı odaklı düşünce",
      "Mükemmel organizasyon becerisi",
      "Maddi konularda başarı",
      "Kararlılık ve azim"
    ],
    challenges: [
      "Aşırı güç odaklı olabilir",
      "Maddi konulara takılabilir",
      "İlişkileri ihmal edebilir",
      "Stresli yaşam tarzı",
      "Kontrolcü olabilir"
    ],
    love: "Güçlü partner arar. Statü ve başarı ilişkilerde önemli. Maddi güvenlik öncelikli.",
    career: "İş dünyası, finans, yöneticilik, emlak, bankacılık sektörlerinde başarılı. Üst düzey yöneticilik ideal.",
    health: "Stres kaynaklı sorunlar olabilir. Dinlenme ve denge önemli. Kalp ve tansiyon dikkat edilmeli.",
    luckyNumbers: [8, 17, 26, 35],
    luckyDays: ["Cumartesi"],
    luckyColors: ["Siyah", "Koyu Mavi", "Gri"],
    compatibleNumbers: [2, 4, 6, 7],
    tips: [
      "İş-yaşam dengesi kurun",
      "İlişkilere daha çok odaklanın",
      "Stress yönetimi öğrenin",
      "Maddi değerler dışında değerleri keşfedin"
    ]
  },

  9: {
    title: "İnsancıl",
    emoji: "🌍",
    element: "Ateş",
    planet: "Mars",
    color: "Altın",
    description: "Evrensel sevgi, şefkat, insancıl ve fedakar kişilik",
    traits: ["Evrensel Sevgi", "Şefkat", "İnsancıllık", "Fedakarlık", "Bilgelik"],
    strengths: [
      "Güçlü empati ve şefkat",
      "Evrensel bakış açısı",
      "İnsancıl değerler",
      "Bilgelik ve olgunluk",
      "Fedakarlık ruhu"
    ],
    challenges: [
      "Aşırı fedakar olabilir",
      "Kendini ihmal edebilir",
      "Duygusal dalgalanmalar",
      "İdealist olmaktan kaynaklı hayal kırıklıkları",
      "Sınır koyma zorluğu"
    ],
    love: "Evrensel sevgi arar. Tüm insanlığı kucaklayan yaklaşım. Derin, anlamlı bağlar kurar.",
    career: "Sosyal hizmet, hayırseverlik, sanat, terapi, öğretmenlik alanlarında başarılı. İnsanlığa hizmet eden işler ideal.",
    health: "Genel sağlık iyi. Duygusal denge çok önemli. Başkalarına hizmet ederken kendini unutmamalı.",
    luckyNumbers: [9, 18, 27, 36],
    luckyDays: ["Salı"],
    luckyColors: ["Altın", "Kırmızı", "Turuncu"],
    compatibleNumbers: [1, 2, 3, 6],
    tips: [
      "Kendine de zaman ayırın",
      "Sınırlarınızı belirleyin",
      "Gerçekçi hedefler koyun",
      "Kendinizi de sevin"
    ]
  },

  11: {
    title: "Sezgisel Öğretmen",
    emoji: "✨",
    element: "Hava",
    planet: "Uranüs",
    color: "Gümüş",
    description: "Yüksek sezgi, ilham verici, ruhsal ve vizyoner kişilik",
    traits: ["Yüksek Sezgi", "İlham", "Ruhsallık", "Vizyon", "Hassaslık"],
    strengths: [
      "Olağanüstü sezgi gücü",
      "İlham verici kişilik",
      "Ruhsal derinlik",
      "Vizyoner düşünce",
      "Yüksek hassaslık"
    ],
    challenges: [
      "Aşırı hassaslık",
      "Sinir sistemi kırılganlığı",
      "Gerçek dünyaya adaptasyon zorluğu",
      "Duygusal dalgalanmalar",
      "Mükemmeliyetçilik"
    ],
    love: "Ruhsal bağ arar. Derin, manevi ilişkiler kurar. Yüksek empati ve anlayış gösterir.",
    career: "Öğretmenlik, terapi, sanat, ruhsal rehberlik, yaratıcı alanlar. İnsanlara ilham veren işler ideal.",
    health: "Sinir sistemi hassas. Meditasyon ve ruhsal pratikler önemli. Dengeli yaşam kritik.",
    luckyNumbers: [11, 29, 38, 47],
    luckyDays: ["Pazartesi", "Perşembe"],
    luckyColors: ["Gümüş", "Beyaz", "Mor"],
    compatibleNumbers: [2, 6, 9],
    tips: [
      "Sezgilerinize güvenin",
      "Sinir sisteminizi koruyun",
      "Meditasyon yapın",
      "Dengeli yaşam tarzı benimseyin"
    ]
  },

  22: {
    title: "Ustası İnşaatçı",
    emoji: "🏛️",
    element: "Toprak",
    planet: "Uranüs",
    color: "Koyu Mavi",
    description: "Büyük vizyonlar, pratik uygulama, liderlik ve değişim yaratma",
    traits: ["Büyük Vizyon", "Pratik Liderlik", "Değişim", "İnşa Etme", "Usta Beceri"],
    strengths: [
      "Büyük projeleri hayata geçirme",
      "Vizyon ile pratiği birleştirme",
      "Liderlik ve organizasyon",
      "Toplumsal değişim yaratma",
      "Usta düzeyinde beceriler"
    ],
    challenges: [
      "Aşırı büyük hedefler",
      "Perfectionist eğilimler",
      "Yoğun stres ve baskı",
      "İş-yaşam dengesi zorluğu",
      "Sabırsızlık"
    ],
    love: "Büyük hedefleri olan, destekleyici partner arar. İlişkide de büyük vizyonlar paylaşır.",
    career: "Büyük projeler, uluslararası işler, sosyal değişim, mimarlık, mühendislik alanlarında başarılı.",
    health: "Yüksek enerji gerekir. Fiziksel ve mental denge kritik. Düzenli dinlenme şart.",
    luckyNumbers: [22, 31, 40, 49],
    luckyDays: ["Çarşamba"],
    luckyColors: ["Koyu Mavi", "Altın", "Gümüş"],
    compatibleNumbers: [4, 6, 8],
    tips: [
      "Gerçekçi hedefler belirleyin",
      "Dinlenmeyi ihmal etmeyin",
      "Ekip çalışmasına odaklanın",
      "Adım adım ilerleyin"
    ]
  },

  33: {
    title: "Usta Öğretmen",
    emoji: "🕊️",
    element: "Su",
    planet: "Neptün",
    color: "Altın",
    description: "Şefkat ustası, iyileştirici, öğretici ve rehber kişilik",
    traits: ["Usta Şefkat", "İyileştirme", "Öğreticilik", "Rehberlik", "Evrensel Sevgi"],
    strengths: [
      "Olağanüstü şefkat ve empati",
      "İyileştirici güç",
      "Öğreticilik yeteneği",
      "Rehberlik becerisi",
      "Evrensel sevgi"
    ],
    challenges: [
      "Kendini ihmal etme eğilimi",
      "Aşırı fedakarlık",
      "Duygusal tükenmişlik",
      "Sınır belirleme zorluğu",
      "Yüksek beklentiler"
    ],
    love: "Şefkat dolu, iyileştirici, destekleyici ilişkiler kurar. Partnere rehberlik eder.",
    career: "Terapi, iyileştirme, öğretmenlik, rehberlik, manevi liderlik alanlarında başarılı.",
    health: "Duygusal sağlık kritik. Başkalarına hizmet ederken kendini ihmal etmemeli. Düzenli dinlenme şart.",
    luckyNumbers: [33, 42, 51, 60],
    luckyDays: ["Cuma"],
    luckyColors: ["Altın", "Beyaz", "Açık Mavi"],
    compatibleNumbers: [6, 9, 11],
    tips: [
      "Kendine de zaman ayırın",
      "Sınırlarınızı koruyun",
      "Duygusal sağlığınızı öncelendirin",
      "Dengeli bir yaşam sürdürün"
    ]
  }
}

// Hesaplama fonksiyonları
export const calculateNumber = (total) => {
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = total.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0)
  }
  return total
}

export const calculateLifePath = (birthDate) => {
  const digits = birthDate.replace(/\D/g, '').split('').map(Number)
  const total = digits.reduce((acc, digit) => acc + digit, 0)
  return calculateNumber(total)
}

export const calculateDestiny = (fullName) => {
  let total = 0
  for (let char of fullName.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '')) {
    total += letterValues[char] || 0
  }
  return calculateNumber(total)
}

export const calculateSoul = (fullName) => {
  let total = 0
  for (let char of fullName.toUpperCase()) {
    if (vowels.includes(char)) {
      total += letterValues[char] || 0
    }
  }
  return calculateNumber(total)
}

export const calculatePersonality = (fullName) => {
  let total = 0
  for (let char of fullName.toUpperCase()) {
    if (!vowels.includes(char) && letterValues[char]) {
      total += letterValues[char]
    }
  }
  return calculateNumber(total)
}

// Uyumluluk hesaplama
export const calculateCompatibility = (number1, number2) => {
  const meaning1 = numerologyMeanings[number1]
  const meaning2 = numerologyMeanings[number2]
  
  if (!meaning1 || !meaning2) return { score: 0, description: "Bilinmeyen sayı" }
  
  const compatible1 = meaning1.compatibleNumbers || []
  const compatible2 = meaning2.compatibleNumbers || []
  
  let score = 50 // Base score
  
  if (compatible1.includes(number2)) score += 30
  if (compatible2.includes(number1)) score += 30
  if (number1 === number2) score += 20
  
  // Element uyumluluğu
  if (meaning1.element === meaning2.element) score += 10
  
  let description = ""
  if (score >= 90) description = "Mükemmel uyum! Çok uyumlu bir çift."
  else if (score >= 70) description = "Çok iyi uyum. Güçlü bir bağ kurabilirsiniz."
  else if (score >= 50) description = "Orta düzey uyum. Çaba ile güzel ilişki kurabilirsiniz."
  else description = "Zor uyum. Anlayış ve sabır gerektirir."
  
  return { score: Math.min(score, 100), description }
}

// Günlük rehberlik
export const getDailyGuidance = (lifePathNumber) => {
  const meaning = numerologyMeanings[lifePathNumber]
  if (!meaning) return "Bugün kendinize odaklanın."
  
  const guidances = {
    1: [
      "Bugün liderlik özelliklerinizi gösterme zamanı. Yeni bir projeye başlayın.",
      "Yaratıcılığınızı kullanarak özgün çözümler bulun.",
      "Bağımsızlığınızı korurken başkalarıyla işbirliği yapın.",
      "Cesur adımlar atın, korkularınızın üstesinden gelin.",
      "Girişimci ruhunuzu harekete geçirin."
    ],
    2: [
      "Bugün empati gösterin ve başkalarını dinleyin.",
      "İşbirliği yaparak büyük başarılar elde edin.",
      "Diplomatik yaklaşımınızla sorunları çözün.",
      "Uyum ve denge arayışınızı sürdürün.",
      "Hassasiyetinizi güç olarak kullanın."
    ],
    3: [
      "Yaratıcı enerjinizi sanatsal projelerde kullanın.",
      "Sosyal çevrenizi genişletin, yeni insanlarla tanışın.",
      "İletişim becerilerinizle ilham verin.",
      "Neşenizi ve optimizminizi paylaşın.",
      "Kendini ifade etmek için yeni yollar bulun."
    ],
    4: [
      "Planlı ve sistemli çalışın, hedeflerinize odaklanın.",
      "Güvenilirliğinizle çevrenizdekilere örnek olun.",
      "Pratik çözümler üreterek sorunları çözün.",
      "Sabır ve kararlılıkla ilerleyin.",
      "Temel atın, gelecek için sağlam adımlar atın."
    ],
    5: [
      "Yeni deneyimlere açık olun, macera arayın.",
      "Özgürlüğünüzü koruyarak esnek davranın.",
      "Değişimleri fırsat olarak görün.",
      "Merakınızı takip edin, yeni şeyler öğrenin.",
      "Çeşitliliği hayatınıza katın."
    ],
    6: [
      "Sevdiklerinize zaman ayırın, şefkat gösterin.",
      "Başkalarına yardım ederken kendinizi de unutmayın.",
      "Aile ve arkadaşlarınızla güçlü bağlar kurun.",
      "Güzellik ve uyumu çevrenizde yaratın.",
      "Sorumluluk alın ama sınırlarınızı koruyun."
    ],
    7: [
      "İç dünyanıza odaklanın, meditasyon yapın.",
      "Araştırma ve öğrenmeye zaman ayırın.",
      "Sezgilerinizi dinleyin ve güvenin.",
      "Manevi gelişiminize odaklanın.",
      "Yalnızlık vaktini verimli kullanın."
    ],
    8: [
      "Hedeflerinize odaklanın, başarı için çalışın.",
      "Liderlik yeteneklerinizi gösterin.",
      "Maddi hedeflerinizi gerçekleştirmek için adım atın.",
      "Organizasyon becerilerinizi kullanın.",
      "Güç ve sorumluluğu dengeleyin."
    ],
    9: [
      "İnsanlara hizmet edin, iyilik yapın.",
      "Evrensel sevgiyi yayın, şefkat gösterin.",
      "Bilgeliğinizi başkalarıyla paylaşın.",
      "Fedakarlık yaparken kendinizi de sevin.",
      "Büyük resmi görün, vizyoner düşünün."
    ],
    11: [
      "Sezgilerinize güvenin, ilham alın.",
      "Ruhsal pratiklarınızı derinleştirin.",
      "Başkalarına ilham verin, öğretin.",
      "Vizyonlarınızı hayata geçirin.",
      "Hassasiyetinizi güç olarak kullanın."
    ],
    22: [
      "Büyük projelerinizi planlayın ve hayata geçirin.",
      "Vizyonunuzu pratik adımlarla destekleyin.",
      "Liderlik yapın, değişim yaratın.",
      "Ustaca becerilerinizi geliştirin.",
      "Sabırla büyük hedeflere ilerleyin."
    ],
    33: [
      "Şefkat gösterin, iyileştirin.",
      "Öğreticilik yeteneğinizi kullanın.",
      "Başkalarına rehberlik edin.",
      "Evrensel sevgiyi yaşayın.",
      "Kendinize de şefkat gösterin."
    ]
  }
  
  const dailyGuidances = guidances[lifePathNumber] || ["Bugün kendinize odaklanın."]
  const today = new Date()
  const dayIndex = today.getDate() % dailyGuidances.length
  
  return dailyGuidances[dayIndex]
}

// Aylık rehberlik
export const getMonthlyGuidance = (lifePathNumber) => {
  const meaning = numerologyMeanings[lifePathNumber]
  if (!meaning) return "Bu ay kendinizi keşfedin."
  
  const monthlyGuidances = {
    1: "Bu ay liderlik becerilerinizi geliştirin. Yeni projeler başlatın ve bağımsızlığınızı güçlendirin.",
    2: "İşbirliği ve uyum üzerine odaklanın. İlişkilerinizi derinleştirin ve diplomasi becerilerinizi kullanın.",
    3: "Yaratıcılığınızı sergilemek için perfect bir ay. Sanat, iletişim ve sosyal aktivitelere odaklanın.",
    4: "Planlama ve organizasyon ayınız. Temel atın, sistemli çalışın ve uzun vadeli hedefler belirleyin.",
    5: "Değişim ve macera ayı. Yeni deneyimlere açık olun, seyahat edin ve özgürlüğünüzü yaşayın.",
    6: "Aile ve sevgi odaklı bir ay. İlişkilerinizi güçlendirin ve şefkat gösterin.",
    7: "İç dünyaya yolculuk ayı. Meditasyon, araştırma ve manevi gelişim için ideal zaman.",
    8: "Başarı ve materyal hedefler ayı. Kariyer odaklı çalışın ve liderlik gösterin.",
    9: "Hizmet ve şefkat ayı. İnsanlara yardım edin ve evrensel sevgiyi yaşayın.",
    11: "Sezgi ve ilham ayı. Ruhsal gelişiminize odaklanın ve vizyonlarınızı takip edin.",
    22: "Büyük projeler ayı. Vizyonlarınızı hayata geçirin ve değişim yaratın.",
    33: "Öğreticilik ve iyileştirme ayı. Başkalarına rehberlik edin ve şefkat gösterin."
  }
  
  return monthlyGuidances[lifePathNumber] || "Bu ay kendinizi keşfedin."
}

// Yıllık tahmin
export const getYearlyPrediction = (lifePathNumber, year) => {
  const personalYear = calculateNumber(year + lifePathNumber)
  
  const yearlyPredictions = {
    1: "Yeni başlangıçlar yılı. Liderlik fırsatları ve özgün projeler sizi bekliyor.",
    2: "İşbirliği ve ilişkiler yılı. Partnerlikler ve teamwork odaklı bir dönem.",
    3: "Yaratıcılık ve iletişim yılı. Sanatsal projeler ve sosyal başarılar.",
    4: "Çalışma ve istikrar yılı. Sağlam temeller atma ve organizasyon dönemi.",
    5: "Değişim ve özgürlük yılı. Seyahat, yeni deneyimler ve macera zamanı.",
    6: "Aile ve sorumluluk yılı. İlişki odaklı gelişmeler ve şefkat dönemi.",
    7: "İç gelişim yılı. Manevi büyüme, araştırma ve öğrenme zamanı.",
    8: "Başarı ve materyal kazanım yılı. Kariyer odaklı büyük adımlar.",
    9: "Tamamlama ve hizmet yılı. Döngülerin bitişi ve yeni başlangıçlara hazırlık."
  }
  
  return yearlyPredictions[personalYear] || "Büyüme ve gelişim yılı sizi bekliyor."
}

// Numeroloji raporu oluşturucu
export const generateNumerologyReport = (birthDate, fullName) => {
  const lifePath = calculateLifePath(birthDate)
  const destiny = calculateDestiny(fullName)
  const soul = calculateSoul(fullName)
  const personality = calculatePersonality(fullName)
  
  return {
    lifePath: {
      number: lifePath,
      meaning: numerologyMeanings[lifePath]
    },
    destiny: {
      number: destiny,
      meaning: numerologyMeanings[destiny]
    },
    soul: {
      number: soul,
      meaning: numerologyMeanings[soul]
    },
    personality: {
      number: personality,
      meaning: numerologyMeanings[personality]
    },
    dailyGuidance: getDailyGuidance(lifePath),
    monthlyGuidance: getMonthlyGuidance(lifePath),
    yearlyPrediction: getYearlyPrediction(lifePath, new Date().getFullYear())
  }
}