export interface CountdownTranslation {
  code: string;
  name: string;
  description: string;
  notify: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const countdownTranslations: CountdownTranslation[] = [
  {
    code: 'en',
    name: 'English',
    description: 'to the opening of the launch window. ISRO has officially published the NOTAM for PSLV-C62, confirming the launch window from December 25, 2025 to January 23, 2026.',
    notify: 'Notify me at launch',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds'
  },
  {
    code: 'pt-BR',
    name: 'Brazilian Portuguese',
    description: 'para a abertura da janela de lançamento. A ISRO publicou oficialmente o NOTAM para o PSLV-C62, confirmando a janela de lançamento de 25 de dezembro de 2025 a 23 de janeiro de 2026.',
    notify: 'Me avise no lançamento',
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos'
  },
  {
    code: 'hi',
    name: 'Hindi',
    description: 'लॉन्च विंडो खुलने तक। ISRO ने PSLV-C62 के लिए आधिकारिक तौर पर NOTAM प्रकाशित किया है, जिसमें 25 दिसंबर 2025 से 23 जनवरी 2026 तक की लॉन्च विंडो की पुष्टि की गई है।',
    notify: 'लॉन्च पर मुझे सूचित करें',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड'
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    description: '距离发射窗口开启。ISRO已正式发布PSLV-C62的NOTAM，确认发射窗口为2025年12月25日至2026年1月23日。',
    notify: '发射时通知我',
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒'
  },
  {
    code: 'es',
    name: 'Spanish',
    description: 'para la apertura de la ventana de lanzamiento. ISRO ha publicado oficialmente el NOTAM para PSLV-C62, confirmando la ventana de lanzamiento del 25 de diciembre de 2025 al 23 de enero de 2026.',
    notify: 'Notificarme en el lanzamiento',
    days: 'días',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos'
  },
  {
    code: 'fr',
    name: 'French',
    description: 'jusqu\'à l\'ouverture de la fenêtre de lancement. L\'ISRO a officiellement publié le NOTAM pour PSLV-C62, confirmant la fenêtre de lancement du 25 décembre 2025 au 23 janvier 2026.',
    notify: 'Me notifier au lancement',
    days: 'jours',
    hours: 'heures',
    minutes: 'minutes',
    seconds: 'secondes'
  },
  {
    code: 'ar',
    name: 'Modern Standard Arabic',
    description: 'حتى افتتاح نافذة الإطلاق. نشرت ISRO رسمياً إشعار NOTAM لـ PSLV-C62، مؤكدة نافذة الإطلاق من 25 ديسمبر 2025 إلى 23 يناير 2026.',
    notify: 'أخبرني عند الإطلاق',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني'
  },
  {
    code: 'bn',
    name: 'Bengali',
    description: 'অরবিটাল টেম্পল উৎক্ষেপণ পর্যন্ত, একটি শিল্পকর্ম এবং একটি উপগ্রহ, যার লক্ষ্য একটি আমূল অন্তর্ভুক্তিমূলক মন্দির হওয়া, এমন একটি জায়গায় যেখানে কোনো প্রাচীর পৌঁছাতে পারে না।',
    notify: 'উৎক্ষেপণে আমাকে জানান',
    days: 'দিন',
    hours: 'ঘন্টা',
    minutes: 'মিনিট',
    seconds: 'সেকেন্ড'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    description: 'para a abertura da janela de lançamento. A ISRO publicou oficialmente o NOTAM para o PSLV-C62, confirmando a janela de lançamento de 25 de dezembro de 2025 a 23 de janeiro de 2026.',
    notify: 'Notificar-me no lançamento',
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos'
  },
  {
    code: 'ru',
    name: 'Russian',
    description: 'до открытия окна запуска. ISRO официально опубликовала NOTAM для PSLV-C62, подтвердив окно запуска с 25 декабря 2025 года по 23 января 2026 года.',
    notify: 'Уведомить меня о запуске',
    days: 'дней',
    hours: 'часов',
    minutes: 'минут',
    seconds: 'секунд'
  },
  {
    code: 'ur',
    name: 'Urdu',
    description: 'آربیٹل ٹیمپل کی لانچنگ تک، ایک آرٹ ورک اور ایک سیٹلائٹ، جس کا مقصد ایک بنیاد پرست جامع مندر بننا ہے، ایسی جگہ پر جہاں کوئی دیوار نہیں پہنچ سکتی۔',
    notify: 'لانچ پر مجھے مطلع کریں',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ'
  },
  {
    code: 'id',
    name: 'Indonesian',
    description: 'hingga peluncuran Kuil Orbital, sebuah karya seni dan satelit, yang bertujuan menjadi kuil yang radikal inklusif, di tempat yang tidak dapat dijangkau oleh tembok manapun.',
    notify: 'Beritahu saya saat peluncuran',
    days: 'hari',
    hours: 'jam',
    minutes: 'menit',
    seconds: 'detik'
  },
  {
    code: 'de',
    name: 'German',
    description: 'bis zur Öffnung des Startfensters. ISRO hat offiziell das NOTAM für PSLV-C62 veröffentlicht und das Startfenster vom 25. Dezember 2025 bis 23. Januar 2026 bestätigt.',
    notify: 'Benachrichtige mich beim Start',
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden'
  },
  {
    code: 'ja',
    name: 'Japanese',
    description: '打ち上げウィンドウの開始まで。ISROはPSLV-C62のNOTAMを正式に発表し、2025年12月25日から2026年1月23日までの打ち上げウィンドウを確認しました。',
    notify: '打ち上げ時に通知する',
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒'
  },
  {
    code: 'pcm',
    name: 'Nigerian Pidgin',
    description: 'to di launch of di Orbital Temple, one artwork and satellite, wey aim to be radical inclusive temple, for place wey no wall fit reach.',
    notify: 'Tell me wen e launch',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds'
  },
  {
    code: 'mr',
    name: 'Marathi',
    description: 'ऑर्बिटल टेंपलच्या प्रक्षेपणापर्यंत, एक कलाकृती आणि एक उपग्रह, ज्याचे उद्दिष्ट एक मूलभूत समावेशक मंदिर असणे आहे, अशा ठिकाणी जिथे कोणतीही भिंत पोहोचू शकत नाही.',
    notify: 'प्रक्षेपणाच्या वेळी मला सूचित करा',
    days: 'दिवस',
    hours: 'तास',
    minutes: 'मिनिटे',
    seconds: 'सेकंद'
  },
  {
    code: 'te',
    name: 'Telugu',
    description: 'ఆర్బిటల్ టెంపుల్ ప్రయోగం వరకు, ఒక కళాఖండం మరియు ఉపగ్రహం, ఏ గోడ చేరలేని చోట, సమూల్యంగా సమ్మిళిత దేవాలయం కావాలని లక్ష్యంగా పెట్టుకుంది.',
    notify: 'ప్రయోగ సమయంలో నాకు తెలియజేయండి',
    days: 'రోజులు',
    hours: 'గంటలు',
    minutes: 'నిమిషాలు',
    seconds: 'సెకన్లు'
  },
  {
    code: 'tr',
    name: 'Turkish',
    description: 'Orbital Temple\'ın fırlatılmasına kadar, bir sanat eseri ve uydu, hiçbir duvarın ulaşamayacağı bir yerde radikal kapsayıcı bir tapınak olmayı hedefliyor.',
    notify: 'Fırlatma anında bana haber ver',
    days: 'gün',
    hours: 'saat',
    minutes: 'dakika',
    seconds: 'saniye'
  },
  {
    code: 'ta',
    name: 'Tamil',
    description: 'ஆர்பிடல் டெம்பிள் ஏவுகை வரை, ஒரு கலைப்படைப்பு மற்றும் செயற்கைக்கோள், எந்த சுவரும் எட்ட முடியாத இடத்தில், தீவிர உள்ளடக்கிய கோவிலாக இருப்பதை நோக்கமாகக் கொண்டுள்ளது.',
    notify: 'ஏவும்போது எனக்கு தெரிவிக்கவும்',
    days: 'நாட்கள்',
    hours: 'மணிநேரம்',
    minutes: 'நிமிடங்கள்',
    seconds: 'விநாடிகள்'
  },
  {
    code: 'yue',
    name: 'Cantonese',
    description: '到軌道聖殿發射，一件藝術品同一粒衛星，目標係成為一座激進包容嘅聖殿，喺一個冇牆可以去到嘅地方。',
    notify: '發射時通知我',
    days: '日',
    hours: '小時',
    minutes: '分鐘',
    seconds: '秒'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    description: 'đến khi phóng Ngôi Đền Quỹ Đạo, một tác phẩm nghệ thuật và vệ tinh, nhằm trở thành một ngôi đền bao trùm triệt để, ở nơi không bức tường nào có thể với tới.',
    notify: 'Thông báo cho tôi khi phóng',
    days: 'ngày',
    hours: 'giờ',
    minutes: 'phút',
    seconds: 'giây'
  },
  {
    code: 'it',
    name: 'Italian',
    description: 'all\'apertura della finestra di lancio. ISRO ha ufficialmente pubblicato il NOTAM per PSLV-C62, confermando la finestra di lancio dal 25 dicembre 2025 al 23 gennaio 2026.',
    notify: 'Notificami al lancio',
    days: 'giorni',
    hours: 'ore',
    minutes: 'minuti',
    seconds: 'secondi'
  },
  {
    code: 'jv',
    name: 'Javanese',
    description: 'kanggo peluncuran Candhi Orbital, sawijining karya seni lan satelit, kanthi tujuan dadi candhi sing radikal inklusif, ing panggonan sing ora bisa ditindakake tembok apa wae.',
    notify: 'Kabar aku nalika diluncurake',
    days: 'dina',
    hours: 'jam',
    minutes: 'menit',
    seconds: 'detik'
  },
  {
    code: 'ko',
    name: 'Korean',
    description: '발사 창 개막까지. ISRO가 PSLV-C62에 대한 NOTAM을 공식 발표하여 2025년 12월 25일부터 2026년 1월 23일까지의 발사 창을 확인했습니다.',
    notify: '발사 시 알림',
    days: '일',
    hours: '시간',
    minutes: '분',
    seconds: '초'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    description: 'ਆਰਬਿਟਲ ਟੈਂਪਲ ਦੀ ਲਾਂਚਿੰਗ ਤੱਕ, ਇੱਕ ਕਲਾਕਾਰੀ ਅਤੇ ਇੱਕ ਸੈਟੇਲਾਈਟ, ਜਿਸਦਾ ਉਦੇਸ਼ ਇੱਕ ਕੱਟੜਪੰਥੀ ਸਮਾਵੇਸ਼ੀ ਮੰਦਰ ਬਣਨਾ ਹੈ, ਉਸ ਥਾਂ ਜਿੱਥੇ ਕੋਈ ਕੰਧ ਨਹੀਂ ਪਹੁੰਚ ਸਕਦੀ।',
    notify: 'ਲਾਂਚ ਤੇ ਮੈਨੂੰ ਸੂਚਿਤ ਕਰੋ',
    days: 'ਦਿਨ',
    hours: 'ਘੰਟੇ',
    minutes: 'ਮਿੰਟ',
    seconds: 'ਸਕਿੰਟ'
  }
];
