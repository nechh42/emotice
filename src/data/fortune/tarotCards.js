// src/data/fortune/tarotCards.js
export const tarotCards = [
  // Major Arcana (0-21)
  {
    id: 0,
    name: "The Fool",
    nameTr: "Deli",
    suit: "major",
    image: "🃏",
    keywords: ["başlangıç", "macera", "risk", "masumiyet"],
    upright: {
      general: "Yeni başlangıçlar, spontanlık ve macera zamanı. Korkularınızı bırakın ve yeni bir yolculuğa çıkın.",
      love: "Aşkta yeni bir sayfa açılabilir. Kalbirinizin sesini dinleyin.",
      career: "Yeni iş fırsatları veya kariyer değişikliği kapıda. Risk almaktan korkmayın.",
      health: "Enerjiniz yüksek, yeni aktivitelere başlamak için ideal zaman."
    },
    reversed: {
      general: "Düşüncesiz kararlar ve risk alma konusunda dikkatli olun. Plan yapın.",
      love: "Aşkta aceleci davranmayın. Duygularınızı analiz edin.",
      career: "İş hayatında sabırlı olun. Ani kararlardan kaçının.",
      health: "Sağlığınıza daha dikkatli yaklaşın."
    }
  },
  {
    id: 1,
    name: "The Magician",
    nameTr: "Büyücü",
    suit: "major",
    image: "🎩",
    keywords: ["güç", "yaratıcılık", "irade", "manifest"],
    upright: {
      general: "İçinizdeki güçleri keşfedin. Hedeflerinize ulaşmak için gereken her şeye sahipsiniz.",
      love: "Çekicilik ve karizma yüksek. İlişkilerinizde liderlik alın.",
      career: "Yeteneklerinizi sergilemek için mükemmel zaman. Yaratıcı projeler başlatın.",
      health: "İyileşme süreci hızlanacak. Pozitif enerji yüksek."
    },
    reversed: {
      general: "Yeteneklerinizi kötüye kullanma riski. Etik değerleri unutmayın.",
      love: "Manipülasyondan kaçının. Dürüst iletişim kurun.",
      career: "Güç mücadelelerinden uzak durun. Takım çalışmasına odaklanın.",
      health: "Aşırılıklardan kaçının, denge kurun."
    }
  },
  {
    id: 2,
    name: "The High Priestess",
    nameTr: "Yüksek Rahibe",
    suit: "major",
    image: "🌙",
    keywords: ["sezgi", "gizem", "bilgelik", "içgörü"],
    upright: {
      general: "İçsel sesinizi dinleyin. Sezgileriniz sizi doğru yönlendirecek.",
      love: "Duygusal derinlik ve anlayış döneminde. Kalp kararları verin.",
      career: "Araştırma ve öğrenme ile ilgili işlerde başarılı olacaksınız.",
      health: "Ruhsal dengenize odaklanın. Meditasyon yapın."
    },
    reversed: {
      general: "İçsel sesinizi ihmal etme riski. Sezgilerinizi dinleyin.",
      love: "İletişim eksikliği var. Açık konuşun.",
      career: "Gizli bilgilere dikkat edin. Şeffaf olun.",
      health: "Stres yönetimi önemli. Dinlenmeyi ihmal etmeyin."
    }
  },
  {
    id: 3,
    name: "The Empress",
    nameTr: "İmparatoriçe",
    suit: "major",
    image: "👸",
    keywords: ["bereket", "yaratıcılık", "annelik", "doğa"],
    upright: {
      general: "Bereket ve bolluk dönemi. Yaratıcı projeleriniz meyve verecek.",
      love: "Aile kurma veya ilişkiyi derinleştirme zamanı. Sevgi dolu dönem.",
      career: "Yaratıcı işlerde başarı. Ekip çalışması verilir.",
      health: "Doğal yöntemleri deneyin. Beslenmenize dikkat edin."
    },
    reversed: {
      general: "Yaratıcılığınızı engelleme riski. Kendini ifade edin.",
      love: "Bağımlılık eğilimi. Özgürlük alanlarını koruyun.",
      career: "Yaratıcı blok yaşayabilirsiniz. Mola verin.",
      health: "Kadın sağlığı konularında dikkatli olun."
    }
  },
  {
    id: 4,
    name: "The Emperor",
    nameTr: "İmparator",
    suit: "major",
    image: "👑",
    keywords: ["otorite", "disiplin", "kontrol", "liderlik"],
    upright: {
      general: "Liderlik yetiniz öne çıkacak. Disiplinli yaklaşım başarı getirir.",
      love: "İlişkilerinizde güven ve istikrar arayın. Koruyucu yaklaşım.",
      career: "Yöneticilik pozisyonları için uygun zaman. Sorumluluk alın.",
      health: "Düzenli yaşam tarzı benimseyin. Egzersiz önemli."
    },
    reversed: {
      general: "Aşırı kontrolcülük riski. Esneklik gösterin.",
      love: "Baskıcı davranışlardan kaçının. Eşitlik önemli.",
      career: "Otoriter yaklaşım sorun çıkarabilir. Demokratik olun.",
      health: "Stres kaynaklı sağlık sorunları olabilir."
    }
  },
  {
    id: 5,
    name: "The Hierophant",
    nameTr: "Aziz",
    suit: "major",
    image: "⛪",
    keywords: ["gelenek", "öğretim", "maneviyat", "kurum"],
    upright: {
      general: "Geleneksel değerlere dönüş zamanı. Akıl hocalarından öğrenin.",
      love: "Evlilik veya nişan gibi resmi adımlar gündemde.",
      career: "Eğitim sektörü veya danışmanlıkta başarı. Bilgi paylaşın.",
      health: "Uzman doktor önerilerini takip edin."
    },
    reversed: {
      general: "Gelenekleri sorgulama zamanı. Kendi yolunuzu çizin.",
      love: "Konvansiyonel olmayan ilişki biçimleri keşfedin.",
      career: "Yenilikçi yaklaşımlar deneyin. Kurallara takılmayın.",
      health: "Alternatif tedavi yöntemlerini araştırın."
    }
  },
  {
    id: 6,
    name: "The Lovers",
    nameTr: "Aşıklar",
    suit: "major",
    image: "💕",
    keywords: ["aşk", "seçim", "birleşme", "uyum"],
    upright: {
      general: "Önemli seçimler yapma zamanı. Kalbinizin sesini dinleyin.",
      love: "Derin bir bağ kurma fırsatı. Ruh eşinizle tanışabilirsiniz.",
      career: "İş ortaklıkları başarılı olacak. Takım çalışması önemli.",
      health: "Dengeye odaklanın. Sevdiklerinizle zaman geçirin."
    },
    reversed: {
      general: "İlişkilerde uyumsuzluk. İç çelişkiler yaşıyorsunuz.",
      love: "İletişim sorunları var. Dürüst olun.",
      career: "İş ortaklıklarında problemler çıkabilir.",
      health: "Stres yönetimi gerekli. İç barış arayın."
    }
  },
  {
    id: 7,
    name: "The Chariot",
    nameTr: "Savaş Arabası",
    suit: "major",
    image: "🏇",
    keywords: ["zafer", "iradelik", "hareket", "kontrol"],
    upright: {
      general: "Zorlukları aşma gücünüz yüksek. Hedeflerinize odaklanın.",
      love: "İlişkilerinizde kararlılık gösterin. Uzun mesafeli aşk mümkün.",
      career: "Büyük projelerde başarı. Rekabette öne çıkacaksınız.",
      health: "Fiziksel gücünüz arttı. Spor aktiviteleri yapın."
    },
    reversed: {
      general: "Kontrol kaybı riski var. Sabırlı olun.",
      love: "İlişkilerinizde çatışma eğilimi. Uzlaşma arayın.",
      career: "Projeler aksayabilir. Plan B hazır olsun.",
      health: "Aşırı zorlanmayın. Dinlenme önemli."
    }
  },
  {
    id: 8,
    name: "Strength",
    nameTr: "Güç",
    suit: "major",
    image: "🦁",
    keywords: ["cesaret", "sabır", "merhamet", "içsel güç"],
    upright: {
      general: "İçsel gücünüzü keşfedin. Naziklikle büyük işler başarırsınız.",
      love: "Sabırla yaklaştığınız ilişkiler gelişecek. Şefkatli olun.",
      career: "Zor müşteriler ve durumlarla başa çıkma yetiniz gelişti.",
      health: "İyileşme sürecindesiniz. Mental gücünüz yüksek."
    },
    reversed: {
      general: "Özgüven eksikliği yaşıyorsunuz. İçinizdeki gücü hatırlayın.",
      love: "Aşırı duygusallık ilişkilerinizi etkileyebilir.",
      career: "Zor durumlardan kaçma eğilimi. Cesur olun.",
      health: "Ruhsal destek alın. Tek başınıza mücadele etmeyin."
    }
  },
  {
    id: 9,
    name: "The Hermit",
    nameTr: "Ermiş",
    suit: "major",
    image: "🏮",
    keywords: ["içsel arayış", "yalnızlık", "bilgelik", "rehberlik"],
    upright: {
      general: "İçe dönük bir dönemdesiniz. Kendi kendinizi keşfedin.",
      love: "Yalnızlık döneminde kendinizi tanıyın. Aşk beklemede.",
      career: "Mentor bulun veya mentor olun. Bilgi paylaşımı önemli.",
      health: "Ruhsal arınma dönemi. Meditasyon ve introspeksiyon yapın."
    },
    reversed: {
      general: "İzolasyon eğilimi çok güçlü. Sosyalleşmeyi ihmal etmeyin.",
      love: "Aşırı çekingenlik ilişkileri engelliyor. Açılın.",
      career: "Ekip çalışmasından kaçınma. İşbirliği yapın.",
      health: "Dışarı çıkın, güneş ışığı alın. Vitimin D önemli."
    }
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameTr: "Talih Çarkı",
    suit: "major",
    image: "☸️",
    keywords: ["döngü", "şans", "kader", "değişim"],
    upright: {
      general: "Şansınız döndü! Pozitif değişimler yaşayacaksınız.",
      love: "Kaderin size getireceği bir aşk var. Açık olun.",
      career: "Beklenmedik fırsatlar doğabilir. Hazır olun.",
      health: "İyileşme süreci hızlanacak. Umudunu kaybetmeyin."
    },
    reversed: {
      general: "Şanssızlık dönemi geçici. Sabırlı olun.",
      love: "Aşkta kötü timing. Beklemeyi öğrenin.",
      career: "İş hayatında dalgalanmalar var. Esnek olun.",
      health: "Kronik sorunlar tekrar edebilir. Takip önemli."
    }
  },
  // Minor Arcana örnekleri (sadece birkaç tanesi - tam liste çok uzun)
  {
    id: 22,
    name: "Ace of Cups",
    nameTr: "Kadeh Ası",
    suit: "cups",
    image: "🏆",
    keywords: ["yeni aşk", "duygusal başlangıç", "sezgi", "maneviyat"],
    upright: {
      general: "Duygusal yenilenme zamanı. Kalbiniz sevgi ile dolu.",
      love: "Yeni aşk kapıda. Duygularınızı ifade edin.",
      career: "Yaratıcı projeler başarılı olacak. İlham geldi.",
      health: "Duygusal iyileşme başladı. Pozitif düşünce önemli."
    },
    reversed: {
      general: "Duygusal blok yaşıyorsunuz. Açılmaya çalışın.",
      love: "Aşkta hayal kırıklığı riski. Gerçekçi olun.",
      career: "Yaratıcı blok var. Mola verin.",
      health: "Duygusal stres sağlığı etkiliyor."
    }
  },
  {
    id: 23,
    name: "Two of Cups",
    nameTr: "İki Kadeh",
    suit: "cups",
    image: "🥂",
    keywords: ["ortaklık", "birleşme", "karşılıklı aşk", "uyum"],
    upright: {
      general: "Güzel bir ortaklık veya dostluk gelişiyor.",
      love: "Karşılıklı aşk ve anlayış. İdeal birleşme.",
      career: "İş ortaklıkları başarılı. Takım ruhu yüksek.",
      health: "Sevdiklerinizin desteği iyileşmenizi hızlandırıyor."
    },
    reversed: {
      general: "İlişkilerde dengesizlik var. İletişimi güçlendirin.",
      love: "Tek taraflı aşk riski. Karşılıklılık önemli.",
      career: "İş ortaklığında problemler. Açık konuşun.",
      health: "Destek sisteminizi güçlendirin."
    }
  },
  {
    id: 24,
    name: "Three of Cups",
    nameTr: "Üç Kadeh",
    suit: "cups",
    image: "🎉",
    keywords: ["kutlama", "dostluk", "topluluk", "başarı"],
    upright: {
      general: "Kutlama zamanı! Başarılarınızı sevdiklerinizle paylaşın.",
      love: "Sosyal çevreniz aşkınızı destekliyor. Tanışma fırsatları.",
      career: "Takım başarısı. Tebrikler ve takdir alacaksınız.",
      health: "Sosyal aktiviteler ruh halinizi iyileştiriyor."
    },
    reversed: {
      general: "Yalnızlık hissi veya grup dinamiklerinde sorun.",
      love: "Sosyal baskı ilişkinizi etkiliyor. Sınır çizin.",
      career: "Ekip içinde çatışmalar var. Arabulucu olun.",
      health: "Sosyal destek eksikliği stres yaratıyor."
    }
  }
];

// Tarot spreads (düzenler)
export const tarotSpreads = {
  threeCard: {
    name: "3 Kart Açılımı",
    description: "Geçmiş, Şimdi, Gelecek",
    positions: [
      { id: 1, name: "Geçmiş", description: "Durumu etkileyen geçmiş olaylar" },
      { id: 2, name: "Şimdi", description: "Mevcut durum ve etkiler" },
      { id: 3, name: "Gelecek", description: "Olası gelecek ve sonuçlar" }
    ]
  },
  love: {
    name: "Aşk Açılımı",
    description: "İlişki durumu analizi",
    positions: [
      { id: 1, name: "Sen", description: "Senin durumun ve hislerin" },
      { id: 2, name: "O", description: "Karşı tarafın durumu ve hisleri" },
      { id: 3, name: "İlişki", description: "İlişkinizin genel durumu" }
    ]
  },
  career: {
    name: "Kariyer Açılımı", 
    description: "İş hayatı rehberliği",
    positions: [
      { id: 1, name: "Mevcut Durum", description: "Şu anki iş durumunuz" },
      { id: 2, name: "Engeller", description: "Karşılaşacağınız zorluklar" },
      { id: 3, name: "Fırsatlar", description: "Yaklaşan fırsatlar" },
      { id: 4, name: "Sonuç", description: "Bu yolda gideceğiniz yer" }
    ]
  }
};

// Helper functions
export const getRandomCards = (count = 3, excludeIds = []) => {
  const availableCards = tarotCards.filter(card => !excludeIds.includes(card.id));
  const shuffled = availableCards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCardById = (id) => {
  return tarotCards.find(card => card.id === id);
};

export const getCardsBysuit = (suit) => {
  return tarotCards.filter(card => card.suit === suit);
};