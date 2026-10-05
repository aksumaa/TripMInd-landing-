import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const en = {
  nav: { discover: "Discover", how: "How it works", planner: "AI Planner", tours: "Ready Tours", agencies: "For Agencies", start: "Start planning", menu: "Menu" },
  cities: { tashkent: "Tashkent", istanbul: "Istanbul", paris: "Paris", dubai: "Dubai", tokyo: "Tokyo", newyork: "New York", rome: "Rome", bali: "Bali", london: "London", cairo: "Cairo" },
  countries: { tashkent: "Uzbekistan", istanbul: "Türkiye", paris: "France", dubai: "UAE", tokyo: "Japan", newyork: "United States", rome: "Italy", bali: "Indonesia", london: "United Kingdom", cairo: "Egypt" },
  hero: {
    eyebrow: "AI travel operating system",
    title1: "Your journey.", title2: "One intelligent workspace.",
    sub: "Discover destinations, build personalized trips, compare real travel options and adapt your journey with AI.",
    cta1: "Start planning", cta2: "Explore TripMind", scroll: "Scroll", live: "Live route", loop: "Discover · Plan · Compare · Travel · Adapt",
  },
  problem: {
    eyebrow: "The problem", title: "Travel planning is fragmented.", together: "TripMind brings everything together.",
    chips: ["Hotels", "Maps", "Tours", "Transport", "Restaurants", "Reviews", "Weather", "Budgets"],
    points: ["Too many services", "Generic recommendations", "Hard to compare options", "Plans break when reality changes"],
  },
  workspace: {
    eyebrow: "The workspace", title1: "One workspace.", title2: "The whole journey.",
    sub: "Every decision, from the first idea to the last day, lives in one place.",
    fields: { destination: "Destination", dates: "Dates", travelers: "Travelers", budget: "Budget", style: "Travel style", interests: "Interests" },
    values: { dates: "12 – 17 May · 5 days", travelers: "2 adults", style: "Balanced", interests: "Culture, Food, History" },
    panels: { map: "Map", calendar: "Calendar", itinerary: "Daily itinerary", budget: "Budget", ai: "AI suggestions" },
    day: "Day", spent: "planned", left: "remaining",
    budgetRows: ["Stay", "Food", "Transport", "Activities"],
    tips: ["Visit Hagia Sophia before 10:00 to avoid queues.", "Group Balat and Fener on Day 3 — 12 min apart.", "Use the ferry to Kadıköy instead of a taxi."],
  },
  globe: {
    eyebrow: "Destination discovery", title: "See the world differently.",
    sub: "Search a destination. The globe focuses, draws your route and opens the place.",
    placeholder: "Search a destination…", go: "Focus",
    explore: "Explore destination", from: "Route from Tashkent", flight: "Approx. flight", hint: "Try Istanbul, Paris, Tokyo or tap a marker",
    notFound: "Destination not in demo — try one of the suggestions.",
  },
  stages: {
    eyebrow: "How it works", title: "One loop for every journey.",
    items: [
      { name: "Discover", desc: "Explore destinations through the globe." },
      { name: "Plan", desc: "AI builds a personalized itinerary." },
      { name: "Compare", desc: "Compare independent planning with Ready Tours." },
      { name: "Travel", desc: "Use maps, routes, budget and daily itinerary." },
      { name: "Adapt", desc: "AI changes the plan when reality changes." },
    ],
  },
  planner: {
    eyebrow: "AI Planner", title: "AI that plans around you.", sub: "Not a chatbot. A decision and optimization layer.",
    generate: "Generate plan", regenerate: "Generate again", generating: "Optimizing routes, hours and budget…",
    dayTitle: "Day 1 · Old City", items: ["Topkapı Palace Museum", "Lunch in Sultanahmet", "Old City walk", "Dinner in Karaköy"],
    route: "Route", travel: "Travel time", budget: "Day budget", walk: "4.2 km walking",
  },
  trust: {
    eyebrow: "Principle", title: "AI doesn't make things up.", sub: "TripMind uses available real travel data and optimizes decisions on top of it.",
    cols: [
      { name: "Real data", items: ["Places", "Routes", "Maps", "Opening hours", "Travel information"] },
      { name: "AI decision layer", items: ["Optimizes", "Explains choices", "Shows trade-offs", "Adapts plans"] },
      { name: "Transparent limits", items: ["Doesn't invent hotels", "Doesn't invent prices", "Doesn't invent availability"] },
    ],
    unavailable: "Information unavailable", whenMissing: "When data is missing, TripMind says so:",
  },
  adapt: {
    eyebrow: "In-trip adaptation", title1: "Plans change.", title2: "TripMind adapts.",
    sub: "Pick what happens. Watch the existing plan adjust — not a new chat answer.",
    base: ["Bosphorus walk", "Street food tour", "Galata Tower climb", "Rooftop dinner"],
    events: [
      { name: "Rain", msg: "Outdoor activities replaced with indoor options.", plan: ["Hagia Sophia (indoor)", "Street food tour", "Istanbul Modern museum", "Rooftop dinner"] },
      { name: "Fatigue", msg: "Walking reduced and nearby places grouped.", plan: ["Bosphorus ferry ride", "Street food tour", "Galata café break", "Dinner nearby"] },
      { name: "Low budget", msg: "Cheaper alternatives suggested.", plan: ["Bosphorus walk", "Local lokanta lunch", "Galata Tower climb", "Kadıköy market dinner"] },
      { name: "Time", msg: "Route optimized around remaining time.", plan: ["Bosphorus walk", "Quick simit lunch", "Galata Tower climb", "Rooftop dinner"] },
    ],
    original: "Original plan", updated: "Updated by AI", changed: "changed",
  },
  tours: {
    eyebrow: "Ready Tours", title: "AI finds tours that actually fit.", sub: "Matched to your style, budget and interests.",
    match: "match", hotel: "Hotel", transfer: "Transfer", meals: "Meals", agency: "Agency", why: "Why it matches",
    cta: "Compare tours", disclaimer: "Sample cards for demonstration. Not real current prices or availability.",
    cards: [
      { name: "Istanbul: Culture & Food", duration: "5 days / 4 nights", hotel: "4★ Sultanahmet", transfer: "Included", meals: "Breakfast", agency: "Silk Road Travel", why: "Covers 3 of your interests and stays under budget." },
      { name: "Istanbul Essentials", duration: "4 days / 3 nights", hotel: "4★ Taksim", transfer: "Included", meals: "Half board", agency: "Anatolia Tours", why: "Classic highlights with a relaxed pace." },
      { name: "Bosphorus Slow Journey", duration: "5 days / 4 nights", hotel: "5★ Beşiktaş", transfer: "Private", meals: "Breakfast", agency: "Blue Strait Co.", why: "Slow pace and water views; slightly over budget." },
    ],
  },
  compare: {
    eyebrow: "Compare", title: "Make a better travel decision.",
    left: "TripMind AI itinerary", right: "Agency package", better: "Better fit",
    rows: ["Price", "Duration", "Hotel", "Transfer", "Meals", "Guide", "Style", "Match score"],
    leftVals: ["", "5 days", "Boutique, your choice", "Airport metro", "Flexible", "Self-guided + audio", "Balanced, your pace", "92%"],
    rightVals: ["", "4 days", "4★ Taksim", "Included", "Half board", "Licensed guide", "Group, fixed", "88%"],
  },
  eco: {
    eyebrow: "Ecosystem", title: "Built for everyone in the journey.",
    groups: [
      { name: "Traveler", items: ["Plan", "Save", "Compare", "Travel", "Adapt"] },
      { name: "Agency", items: ["Create tours", "Receive qualified leads", "Manage packages", "Analytics"] },
      { name: "Admin", items: ["Verification", "Moderation", "Platform management"] },
    ],
    core: "TripMind core",
  },
  roadmap: {
    eyebrow: "Vision", title: "Where TripMind is going.",
    phases: [
      { name: "Today", items: ["AI Planner", "Trip Workspace", "Map", "Budget", "Ready Tours", "AI Trip Agent"] },
      { name: "Next", items: ["Community Trips", "Reviews", "Travel Friends", "Near Me", "City Guide"] },
      { name: "Future", items: ["Bookings", "Payments", "Deeper personalization", "More travel providers"] },
    ],
  },
  final: { title: "Your next journey starts with one decision.", sub: "Discover. Plan. Compare. Travel. Adapt.", cta1: "Start planning", cta2: "Explore TripMind" },
  footer: {
    tagline: "Practical travel operating system.", nav: "Navigation", company: "Company",
    companyItems: ["About", "Contact", "Privacy", "Terms"], language: "Language", rights: "All rights reserved.",
  },
};
export type Dict = typeof en;

const uz: Dict = {
  nav: { discover: "Kashf etish", how: "Qanday ishlaydi", planner: "AI Rejalashtiruvchi", tours: "Tayyor turlar", agencies: "Agentliklar uchun", start: "Rejalashni boshlash", menu: "Menyu" },
  cities: { tashkent: "Toshkent", istanbul: "Istanbul", paris: "Parij", dubai: "Dubay", tokyo: "Tokio", newyork: "Nyu-York", rome: "Rim", bali: "Bali", london: "London", cairo: "Qohira" },
  countries: { tashkent: "O‘zbekiston", istanbul: "Turkiya", paris: "Fransiya", dubai: "BAA", tokyo: "Yaponiya", newyork: "AQSh", rome: "Italiya", bali: "Indoneziya", london: "Buyuk Britaniya", cairo: "Misr" },
  hero: {
    eyebrow: "AI sayohat operatsion tizimi",
    title1: "Sizning sayohatingiz.", title2: "Bitta aqlli ish maydoni.",
    sub: "Manzillarni kashf eting, shaxsiy sayohatlar tuzing, haqiqiy variantlarni solishtiring va sayohatingizni AI bilan moslashtiring.",
    cta1: "Rejalashni boshlash", cta2: "TripMind bilan tanishish", scroll: "Pastga", live: "Jonli marshrut", loop: "Kashf et · Rejala · Solishtir · Sayohat qil · Moslash",
  },
  problem: {
    eyebrow: "Muammo", title: "Sayohatni rejalash tarqoq.", together: "TripMind hammasini birlashtiradi.",
    chips: ["Mehmonxonalar", "Xaritalar", "Turlar", "Transport", "Restoranlar", "Sharhlar", "Ob-havo", "Byudjetlar"],
    points: ["Juda ko‘p xizmatlar", "Umumiy tavsiyalar", "Variantlarni solishtirish qiyin", "Reja haqiqatga duch kelganda buziladi"],
  },
  workspace: {
    eyebrow: "Ish maydoni", title1: "Bitta ish maydoni.", title2: "Butun sayohat.",
    sub: "Birinchi g‘oyadan oxirgi kungacha har bir qaror bir joyda.",
    fields: { destination: "Manzil", dates: "Sanalar", travelers: "Sayohatchilar", budget: "Byudjet", style: "Sayohat uslubi", interests: "Qiziqishlar" },
    values: { dates: "12 – 17 may · 5 kun", travelers: "2 kattalar", style: "Muvozanatli", interests: "Madaniyat, Taom, Tarix" },
    panels: { map: "Xarita", calendar: "Kalendar", itinerary: "Kunlik reja", budget: "Byudjet", ai: "AI takliflari" },
    day: "Kun", spent: "rejalangan", left: "qoldi",
    budgetRows: ["Turar joy", "Taom", "Transport", "Faoliyatlar"],
    tips: ["Navbatdan qochish uchun Ayasofiyaga 10:00 gacha boring.", "Balat va Fenerni 3-kunga birlashtiring — 12 daqiqa masofa.", "Taksi o‘rniga Kadıköyga paromda boring."],
  },
  globe: {
    eyebrow: "Manzillarni kashf etish", title: "Dunyoni boshqacha ko‘ring.",
    sub: "Manzilni qidiring. Globus unga yo‘naladi, marshrutni chizadi va joyni ochadi.",
    placeholder: "Manzilni qidiring…", go: "Ko‘rsatish",
    explore: "Manzilni o‘rganish", from: "Toshkentdan marshrut", flight: "Taxminiy parvoz", hint: "Istanbul, Parij, Tokioni sinab ko‘ring yoki belgini bosing",
    notFound: "Bu manzil demoda yo‘q — takliflardan birini tanlang.",
  },
  stages: {
    eyebrow: "Qanday ishlaydi", title: "Har bir sayohat uchun bitta sikl.",
    items: [
      { name: "Kashf et", desc: "Manzillarni globus orqali o‘rganing." },
      { name: "Rejala", desc: "AI shaxsiy marshrut tuzadi." },
      { name: "Solishtir", desc: "Mustaqil rejani Tayyor turlar bilan solishtiring." },
      { name: "Sayohat qil", desc: "Xarita, marshrut, byudjet va kunlik rejadan foydalaning." },
      { name: "Moslash", desc: "Vaziyat o‘zgarsa, AI rejani o‘zgartiradi." },
    ],
  },
  planner: {
    eyebrow: "AI Rejalashtiruvchi", title: "Siz uchun rejalovchi AI.", sub: "Chatbot emas. Qaror va optimallashtirish qatlami.",
    generate: "Reja tuzish", regenerate: "Qayta tuzish", generating: "Marshrut, vaqt va byudjet optimallashtirilmoqda…",
    dayTitle: "1-kun · Eski shahar", items: ["Topkapı saroyi muzeyi", "Sultanahmetda tushlik", "Eski shahar bo‘ylab sayr", "Karaköyda kechki ovqat"],
    route: "Marshrut", travel: "Yo‘l vaqti", budget: "Kunlik byudjet", walk: "4,2 km piyoda",
  },
  trust: {
    eyebrow: "Tamoyil", title: "AI o‘ylab topmaydi.", sub: "TripMind mavjud haqiqiy sayohat ma’lumotlaridan foydalanadi va qarorlarni optimallashtiradi.",
    cols: [
      { name: "Haqiqiy ma’lumot", items: ["Joylar", "Marshrutlar", "Xaritalar", "Ish vaqti", "Sayohat ma’lumotlari"] },
      { name: "AI qaror qatlami", items: ["Optimallashtiradi", "Tanlovni tushuntiradi", "Afzallik va kamchiliklarni ko‘rsatadi", "Rejani moslaydi"] },
      { name: "Shaffof chegaralar", items: ["Mehmonxona o‘ylab topmaydi", "Narx o‘ylab topmaydi", "Mavjudlikni o‘ylab topmaydi"] },
    ],
    unavailable: "Ma’lumot mavjud emas", whenMissing: "Ma’lumot bo‘lmasa, TripMind buni ochiq aytadi:",
  },
  adapt: {
    eyebrow: "Sayohat davomida moslashuv", title1: "Rejalar o‘zgaradi.", title2: "TripMind moslashadi.",
    sub: "Nima bo‘lishini tanlang. Mavjud reja o‘zgarishini kuzating — yangi chat javobi emas.",
    base: ["Bosfor bo‘ylab sayr", "Ko‘cha taomlari turi", "Galata minorasi", "Tomdagi kechki ovqat"],
    events: [
      { name: "Yomg‘ir", msg: "Ochiq havodagi faoliyatlar yopiq joylarga almashtirildi.", plan: ["Ayasofiya (yopiq)", "Ko‘cha taomlari turi", "Istanbul Modern muzeyi", "Tomdagi kechki ovqat"] },
      { name: "Charchoq", msg: "Piyoda yurish kamaytirildi, yaqin joylar guruhlandi.", plan: ["Bosforda parom", "Ko‘cha taomlari turi", "Galatada qahva tanaffusi", "Yaqin atrofda kechki ovqat"] },
      { name: "Kam byudjet", msg: "Arzonroq muqobillar taklif qilindi.", plan: ["Bosfor bo‘ylab sayr", "Mahalliy lokantada tushlik", "Galata minorasi", "Kadıköy bozorida kechki ovqat"] },
      { name: "Vaqt", msg: "Marshrut qolgan vaqtga moslab optimallashtirildi.", plan: ["Bosfor bo‘ylab sayr", "Tezkor simit tushligi", "Galata minorasi", "Tomdagi kechki ovqat"] },
    ],
    original: "Asl reja", updated: "AI yangiladi", changed: "o‘zgardi",
  },
  tours: {
    eyebrow: "Tayyor turlar", title: "AI sizga mos turlarni topadi.", sub: "Uslubingiz, byudjetingiz va qiziqishlaringizga mos.",
    match: "moslik", hotel: "Mehmonxona", transfer: "Transfer", meals: "Ovqat", agency: "Agentlik", why: "Nega mos",
    cta: "Turlarni solishtirish", disclaimer: "Namoyish uchun namunaviy kartalar. Haqiqiy narx yoki mavjudlik emas.",
    cards: [
      { name: "Istanbul: Madaniyat va taom", duration: "5 kun / 4 tun", hotel: "4★ Sultanahmet", transfer: "Kiritilgan", meals: "Nonushta", agency: "Silk Road Travel", why: "3 ta qiziqishingizni qamraydi va byudjetdan oshmaydi." },
      { name: "Istanbul asoslari", duration: "4 kun / 3 tun", hotel: "4★ Taksim", transfer: "Kiritilgan", meals: "Yarim pansion", agency: "Anatolia Tours", why: "Klassik joylar, osoyishta sur’at." },
      { name: "Bosfor bo‘ylab sekin sayohat", duration: "5 kun / 4 tun", hotel: "5★ Beşiktaş", transfer: "Shaxsiy", meals: "Nonushta", agency: "Blue Strait Co.", why: "Sekin sur’at va dengiz manzarasi; byudjetdan biroz yuqori." },
    ],
  },
  compare: {
    eyebrow: "Solishtirish", title: "Yaxshiroq qaror qabul qiling.",
    left: "TripMind AI rejasi", right: "Agentlik paketi", better: "Yaxshiroq",
    rows: ["Narx", "Davomiylik", "Mehmonxona", "Transfer", "Ovqat", "Gid", "Uslub", "Moslik"],
    leftVals: ["", "5 kun", "Butik, o‘z tanlovingiz", "Aeroport metrosi", "Erkin", "Mustaqil + audio", "Muvozanatli, o‘z sur’atingiz", "92%"],
    rightVals: ["", "4 kun", "4★ Taksim", "Kiritilgan", "Yarim pansion", "Litsenziyali gid", "Guruh, belgilangan", "88%"],
  },
  eco: {
    eyebrow: "Ekotizim", title: "Sayohatdagi har bir ishtirokchi uchun.",
    groups: [
      { name: "Sayohatchi", items: ["Rejalash", "Saqlash", "Solishtirish", "Sayohat", "Moslash"] },
      { name: "Agentlik", items: ["Tur yaratish", "Sifatli mijozlar", "Paketlarni boshqarish", "Analitika"] },
      { name: "Admin", items: ["Tekshiruv", "Moderatsiya", "Platformani boshqarish"] },
    ],
    core: "TripMind yadrosi",
  },
  roadmap: {
    eyebrow: "Kelajak", title: "TripMind qayerga boryapti.",
    phases: [
      { name: "Bugun", items: ["AI Rejalashtiruvchi", "Sayohat maydoni", "Xarita", "Byudjet", "Tayyor turlar", "AI sayohat agenti"] },
      { name: "Keyingi", items: ["Hamjamiyat sayohatlari", "Sharhlar", "Sayohatdoshlar", "Yaqin atrofda", "Shahar gidi"] },
      { name: "Kelajak", items: ["Bronlash", "To‘lovlar", "Chuqurroq shaxsiylashtirish", "Ko‘proq provayderlar"] },
    ],
  },
  final: { title: "Keyingi sayohatingiz bitta qarordan boshlanadi.", sub: "Kashf et. Rejala. Solishtir. Sayohat qil. Moslash.", cta1: "Rejalashni boshlash", cta2: "TripMind bilan tanishish" },
  footer: {
    tagline: "Amaliy sayohat operatsion tizimi.", nav: "Navigatsiya", company: "Kompaniya",
    companyItems: ["Biz haqimizda", "Aloqa", "Maxfiylik", "Shartlar"], language: "Til", rights: "Barcha huquqlar himoyalangan.",
  },
};

const ru: Dict = {
  nav: { discover: "Открыть", how: "Как это работает", planner: "AI-планировщик", tours: "Готовые туры", agencies: "Агентствам", start: "Начать планировать", menu: "Меню" },
  cities: { tashkent: "Ташкент", istanbul: "Стамбул", paris: "Париж", dubai: "Дубай", tokyo: "Токио", newyork: "Нью-Йорк", rome: "Рим", bali: "Бали", london: "Лондон", cairo: "Каир" },
  countries: { tashkent: "Узбекистан", istanbul: "Турция", paris: "Франция", dubai: "ОАЭ", tokyo: "Япония", newyork: "США", rome: "Италия", bali: "Индонезия", london: "Великобритания", cairo: "Египет" },
  hero: {
    eyebrow: "AI-операционная система для путешествий",
    title1: "Ваше путешествие.", title2: "Одно интеллектуальное пространство.",
    sub: "Открывайте направления, создавайте персональные поездки, сравнивайте реальные варианты и адаптируйте маршрут с помощью AI.",
    cta1: "Начать планировать", cta2: "Узнать о TripMind", scroll: "Листайте", live: "Живой маршрут", loop: "Открыть · Спланировать · Сравнить · Путешествовать · Адаптировать",
  },
  problem: {
    eyebrow: "Проблема", title: "Планирование путешествий раздроблено.", together: "TripMind объединяет всё.",
    chips: ["Отели", "Карты", "Туры", "Транспорт", "Рестораны", "Отзывы", "Погода", "Бюджеты"],
    points: ["Слишком много сервисов", "Шаблонные рекомендации", "Сложно сравнивать варианты", "Планы ломаются при столкновении с реальностью"],
  },
  workspace: {
    eyebrow: "Рабочее пространство", title1: "Одно пространство.", title2: "Всё путешествие.",
    sub: "Каждое решение — от первой идеи до последнего дня — в одном месте.",
    fields: { destination: "Направление", dates: "Даты", travelers: "Путешественники", budget: "Бюджет", style: "Стиль", interests: "Интересы" },
    values: { dates: "12 – 17 мая · 5 дней", travelers: "2 взрослых", style: "Сбалансированный", interests: "Культура, Еда, История" },
    panels: { map: "Карта", calendar: "Календарь", itinerary: "План на день", budget: "Бюджет", ai: "Подсказки AI" },
    day: "День", spent: "запланировано", left: "осталось",
    budgetRows: ["Жильё", "Еда", "Транспорт", "Активности"],
    tips: ["Посетите Айя-Софию до 10:00, чтобы избежать очередей.", "Объедините Балат и Фенер в 3-й день — 12 минут пути.", "Плывите в Кадыкёй на пароме вместо такси."],
  },
  globe: {
    eyebrow: "Поиск направлений", title: "Посмотрите на мир иначе.",
    sub: "Найдите направление. Глобус сфокусируется, проложит маршрут и откроет место.",
    placeholder: "Найти направление…", go: "Показать",
    explore: "Изучить направление", from: "Маршрут из Ташкента", flight: "Примерный перелёт", hint: "Попробуйте Стамбул, Париж, Токио или нажмите на метку",
    notFound: "Этого направления нет в демо — выберите из подсказок.",
  },
  stages: {
    eyebrow: "Как это работает", title: "Один цикл для любого путешествия.",
    items: [
      { name: "Открыть", desc: "Исследуйте направления на глобусе." },
      { name: "Спланировать", desc: "AI строит персональный маршрут." },
      { name: "Сравнить", desc: "Сравните самостоятельный план с готовыми турами." },
      { name: "Путешествовать", desc: "Карты, маршруты, бюджет и план на каждый день." },
      { name: "Адаптировать", desc: "AI меняет план, когда меняется реальность." },
    ],
  },
  planner: {
    eyebrow: "AI-планировщик", title: "AI, который планирует под вас.", sub: "Не чат-бот. Слой решений и оптимизации.",
    generate: "Создать план", regenerate: "Создать заново", generating: "Оптимизируем маршрут, время и бюджет…",
    dayTitle: "День 1 · Старый город", items: ["Музей дворца Топкапы", "Обед в Султанахмете", "Прогулка по Старому городу", "Ужин в Каракёе"],
    route: "Маршрут", travel: "Время в пути", budget: "Бюджет дня", walk: "4,2 км пешком",
  },
  trust: {
    eyebrow: "Принцип", title: "AI ничего не выдумывает.", sub: "TripMind использует доступные реальные данные и оптимизирует решения на их основе.",
    cols: [
      { name: "Реальные данные", items: ["Места", "Маршруты", "Карты", "Часы работы", "Информация о поездке"] },
      { name: "Слой решений AI", items: ["Оптимизирует", "Объясняет выбор", "Показывает компромиссы", "Адаптирует планы"] },
      { name: "Прозрачные границы", items: ["Не выдумывает отели", "Не выдумывает цены", "Не выдумывает наличие"] },
    ],
    unavailable: "Информация недоступна", whenMissing: "Если данных нет, TripMind честно об этом говорит:",
  },
  adapt: {
    eyebrow: "Адаптация в пути", title1: "Планы меняются.", title2: "TripMind адаптируется.",
    sub: "Выберите, что произошло. Существующий план изменится — это не новый ответ чата.",
    base: ["Прогулка по Босфору", "Тур уличной еды", "Подъём на Галатскую башню", "Ужин на крыше"],
    events: [
      { name: "Дождь", msg: "Активности на улице заменены на варианты в помещении.", plan: ["Айя-София (в помещении)", "Тур уличной еды", "Музей Istanbul Modern", "Ужин на крыше"] },
      { name: "Усталость", msg: "Меньше ходьбы, близкие места сгруппированы.", plan: ["Паром по Босфору", "Тур уличной еды", "Кофе-пауза в Галате", "Ужин рядом"] },
      { name: "Мало бюджета", msg: "Предложены более дешёвые альтернативы.", plan: ["Прогулка по Босфору", "Обед в местной локанте", "Подъём на Галатскую башню", "Ужин на рынке Кадыкёя"] },
      { name: "Время", msg: "Маршрут оптимизирован под оставшееся время.", plan: ["Прогулка по Босфору", "Быстрый обед-симит", "Подъём на Галатскую башню", "Ужин на крыше"] },
    ],
    original: "Исходный план", updated: "Обновлено AI", changed: "изменено",
  },
  tours: {
    eyebrow: "Готовые туры", title: "AI находит туры, которые действительно подходят.", sub: "С учётом стиля, бюджета и интересов.",
    match: "совпадение", hotel: "Отель", transfer: "Трансфер", meals: "Питание", agency: "Агентство", why: "Почему подходит",
    cta: "Сравнить туры", disclaimer: "Демонстрационные карточки. Не реальные текущие цены или наличие.",
    cards: [
      { name: "Стамбул: культура и еда", duration: "5 дней / 4 ночи", hotel: "4★ Султанахмет", transfer: "Включён", meals: "Завтрак", agency: "Silk Road Travel", why: "Охватывает 3 ваших интереса и укладывается в бюджет." },
      { name: "Стамбул: главное", duration: "4 дня / 3 ночи", hotel: "4★ Таксим", transfer: "Включён", meals: "Полупансион", agency: "Anatolia Tours", why: "Классика в спокойном темпе." },
      { name: "Неспешный Босфор", duration: "5 дней / 4 ночи", hotel: "5★ Бешикташ", transfer: "Индивидуальный", meals: "Завтрак", agency: "Blue Strait Co.", why: "Медленный темп и виды на воду; чуть выше бюджета." },
    ],
  },
  compare: {
    eyebrow: "Сравнение", title: "Примите лучшее решение.",
    left: "План TripMind AI", right: "Пакет агентства", better: "Лучше",
    rows: ["Цена", "Длительность", "Отель", "Трансфер", "Питание", "Гид", "Стиль", "Совпадение"],
    leftVals: ["", "5 дней", "Бутик, на ваш выбор", "Метро из аэропорта", "Свободно", "Самостоятельно + аудио", "Сбалансированный, свой темп", "92%"],
    rightVals: ["", "4 дня", "4★ Таксим", "Включён", "Полупансион", "Лицензированный гид", "Группа, фиксированный", "88%"],
  },
  eco: {
    eyebrow: "Экосистема", title: "Для каждого участника путешествия.",
    groups: [
      { name: "Путешественник", items: ["Планировать", "Сохранять", "Сравнивать", "Путешествовать", "Адаптировать"] },
      { name: "Агентство", items: ["Создавать туры", "Получать качественные заявки", "Управлять пакетами", "Аналитика"] },
      { name: "Админ", items: ["Верификация", "Модерация", "Управление платформой"] },
    ],
    core: "Ядро TripMind",
  },
  roadmap: {
    eyebrow: "Видение", title: "Куда движется TripMind.",
    phases: [
      { name: "Сегодня", items: ["AI-планировщик", "Пространство поездки", "Карта", "Бюджет", "Готовые туры", "AI-агент поездки"] },
      { name: "Далее", items: ["Поездки сообщества", "Отзывы", "Попутчики", "Рядом со мной", "Гид по городу"] },
      { name: "Будущее", items: ["Бронирования", "Платежи", "Глубокая персонализация", "Больше провайдеров"] },
    ],
  },
  final: { title: "Ваше следующее путешествие начинается с одного решения.", sub: "Открыть. Спланировать. Сравнить. Путешествовать. Адаптировать.", cta1: "Начать планировать", cta2: "Узнать о TripMind" },
  footer: {
    tagline: "Практичная операционная система для путешествий.", nav: "Навигация", company: "Компания",
    companyItems: ["О нас", "Контакты", "Конфиденциальность", "Условия"], language: "Язык", rights: "Все права защищены.",
  },
};

export type Lang = "uz" | "ru" | "en";
export type Currency = "USD" | "EUR" | "UZS";
const DICTS: Record<Lang, Dict> = { uz, ru, en };
// Demonstration rates only.
const RATES: Record<Currency, number> = { USD: 1, EUR: 0.92, UZS: 12700 };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict; currency: Currency; setCurrency: (c: Currency) => void; money: (usd: number) => string };
const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurState] = useState<Currency>("USD");
  useEffect(() => {
    const saved = sessionStorage.getItem("tm-lang") as Lang | null;
    const l = saved ?? (navigator.language.toLowerCase().startsWith("uz") ? "uz" : "en");
    setLangState(l);
    const c = sessionStorage.getItem("tm-cur") as Currency | null;
    if (c) setCurState(c);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); sessionStorage.setItem("tm-lang", l); };
  const setCurrency = (c: Currency) => { setCurState(c); sessionStorage.setItem("tm-cur", c); };
  const money = (usd: number) => {
    const v = usd * RATES[currency];
    const locale = lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "uz-UZ";
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(currency === "UZS" ? Math.round(v / 1000) * 1000 : v);
  };
  return <I18n.Provider value={{ lang, setLang, t: DICTS[lang], currency, setCurrency, money }}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
