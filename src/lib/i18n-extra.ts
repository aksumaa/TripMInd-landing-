import type { CityKey } from "./destinations";
import type { Lang } from "./i18n";

type Place = { name: string; country: string };
type Dest = { desc: string; best: string; style: string };
type PlanItem = { title: string; place: string; transport: string; alt: string };

type Extra = {
  places: Record<CityKey, Place>;
  dest: Partial<Record<CityKey, Dest>>;
  ui: {
    about: string; getStarted: string; theme: string;
    carouselEyebrow: string; carouselTitle: string; carouselSub: string;
    from: string; perPerson: string; best: string; style: string; explore: string; save: string; saved: string;
    exploreDest: string; hoverHint: string;
    km: string; h: string;
  };
  planner: {
    steps: string[]; ready: string; summary: string; hotel: string; hotelName: string;
    transport: string; alt: string; cost: string; time: string; total: string; day: string;
    items: PlanItem[]; you: string; prompt: string;
  };
};

const en: Extra = {
  places: {
    tashkent: { name: "Tashkent", country: "Uzbekistan" }, istanbul: { name: "Istanbul", country: "Türkiye" },
    paris: { name: "Paris", country: "France" }, tokyo: { name: "Tokyo", country: "Japan" },
    dubai: { name: "Dubai", country: "UAE" }, rome: { name: "Rome", country: "Italy" },
    samarkand: { name: "Samarkand", country: "Uzbekistan" }, marrakech: { name: "Marrakech", country: "Morocco" },
    reykjavik: { name: "Iceland", country: "Reykjavík" }, alps: { name: "Swiss Alps", country: "Switzerland" },
    bali: { name: "Bali", country: "Indonesia" }, maldives: { name: "Maldives", country: "Indian Ocean" },
    newyork: { name: "New York", country: "United States" }, london: { name: "London", country: "United Kingdom" },
    cairo: { name: "Cairo", country: "Egypt" },
  },
  dest: {
    istanbul: { desc: "Two continents, Ottoman palaces and the best street food on the Bosphorus.", best: "Apr – Jun, Sep – Oct", style: "Culture · Food" },
    paris: { desc: "Museums, cafés and walkable neighbourhoods that reward slow days.", best: "May – Jun, Sep", style: "Art · Food" },
    tokyo: { desc: "Quiet temples and neon streets, connected by the world's best transit.", best: "Mar – Apr, Nov", style: "Culture · City" },
    samarkand: { desc: "Blue-tiled madrasas of the Silk Road, close to home and great value.", best: "Apr – May, Sep – Oct", style: "History · Architecture" },
    dubai: { desc: "Desert, beaches and skyline — easy for a short winter escape.", best: "Nov – Mar", style: "Luxury · Beach" },
    rome: { desc: "Three thousand years of history between espresso stops.", best: "Apr – Jun, Oct", style: "History · Food" },
    marrakech: { desc: "Riads, souks and the Atlas mountains a day trip away.", best: "Mar – May, Oct", style: "Culture · Markets" },
    reykjavik: { desc: "Waterfalls, glaciers and northern lights on a road trip loop.", best: "Jun – Aug, Feb – Mar", style: "Nature · Road trip" },
    bali: { desc: "Rice terraces, temples and surf, from calm to social.", best: "Apr – Oct", style: "Nature · Wellness" },
    alps: { desc: "Scenic trains, alpine lakes and hikes with mountain huts.", best: "Jun – Sep, Dec – Mar", style: "Nature · Active" },
    maldives: { desc: "Overwater stays and reef snorkelling for a true slow-down.", best: "Nov – Apr", style: "Beach · Relax" },
  },
  ui: {
    about: "About", getStarted: "Get started", theme: "Toggle dark mode",
    carouselEyebrow: "Destinations", carouselTitle: "Where will you go next?", carouselSub: "Where, why, what it costs — then let TripMind plan it.",
    from: "from", perPerson: "per person · 5 days", best: "Best time", style: "Travel style", explore: "Explore", save: "Save", saved: "Saved",
    exploreDest: "Explore destination", hoverHint: "Hover a marker to explore", km: "km", h: "h",
  },
  planner: {
    steps: ["Understanding your preferences", "Finding relevant destinations", "Comparing options", "Building your route", "Optimizing your budget", "Your trip is ready"],
    ready: "Your trip is ready", summary: "5 days · 2 adults · Balanced", hotel: "Stay", hotelName: "Boutique hotel · Sultanahmet",
    transport: "Getting there", alt: "Alternative", cost: "Cost", time: "Time", total: "Day total", day: "Day",
    you: "You", prompt: "5 calm days in Istanbul for two, around $500. We love history and food.",
    items: [
      { title: "Topkapı Palace", place: "Sultanahmet", transport: "Walk · 6 min", alt: "Hagia Sophia" },
      { title: "Lunch at a local lokanta", place: "Sirkeci", transport: "Walk · 10 min", alt: "Street food at Eminönü" },
      { title: "Old City walk & Grand Bazaar", place: "Beyazıt", transport: "Tram T1 · 8 min", alt: "Basilica Cistern" },
      { title: "Dinner with a Bosphorus view", place: "Karaköy", transport: "Tram T1 · 12 min", alt: "Kadıköy by ferry" },
    ],
  },
};

const uz: Extra = {
  places: {
    tashkent: { name: "Toshkent", country: "O‘zbekiston" }, istanbul: { name: "Istanbul", country: "Turkiya" },
    paris: { name: "Parij", country: "Fransiya" }, tokyo: { name: "Tokio", country: "Yaponiya" },
    dubai: { name: "Dubay", country: "BAA" }, rome: { name: "Rim", country: "Italiya" },
    samarkand: { name: "Samarqand", country: "O‘zbekiston" }, marrakech: { name: "Marrakesh", country: "Marokash" },
    reykjavik: { name: "Islandiya", country: "Reykyavik" }, alps: { name: "Shveysariya Alplari", country: "Shveysariya" },
    bali: { name: "Bali", country: "Indoneziya" }, maldives: { name: "Maldiv orollari", country: "Hind okeani" },
    newyork: { name: "Nyu-York", country: "AQSh" }, london: { name: "London", country: "Buyuk Britaniya" },
    cairo: { name: "Qohira", country: "Misr" },
  },
  dest: {
    istanbul: { desc: "Ikki qit’a, Usmonli saroylari va Bosfor bo‘yidagi eng mazali ko‘cha taomlari.", best: "Apr – Iyun, Sen – Okt", style: "Madaniyat · Taom" },
    paris: { desc: "Muzeylar, kafelar va sekin sayr uchun yaratilgan mahallalar.", best: "May – Iyun, Sen", style: "San’at · Taom" },
    tokyo: { desc: "Sokin ibodatxonalar va neon ko‘chalar, dunyodagi eng yaxshi transport bilan.", best: "Mar – Apr, Noy", style: "Madaniyat · Shahar" },
    samarkand: { desc: "Buyuk Ipak yo‘lining moviy madrasalari — yaqin va hamyonbop.", best: "Apr – May, Sen – Okt", style: "Tarix · Me’morchilik" },
    dubai: { desc: "Cho‘l, plyajlar va osmono‘par binolar — qisqa qishki dam olish uchun.", best: "Noy – Mar", style: "Hashamat · Plyaj" },
    rome: { desc: "Espresso oralig‘ida uch ming yillik tarix.", best: "Apr – Iyun, Okt", style: "Tarix · Taom" },
    marrakech: { desc: "Riadlar, bozorlar va bir kunlik masofadagi Atlas tog‘lari.", best: "Mar – May, Okt", style: "Madaniyat · Bozorlar" },
    reykjavik: { desc: "Sharsharalar, muzliklar va shimoliy yog‘du — avtosayohatda.", best: "Iyun – Avg, Fev – Mar", style: "Tabiat · Avtosayohat" },
    bali: { desc: "Sholi terrasalari, ibodatxonalar va serfing.", best: "Apr – Okt", style: "Tabiat · Sog‘lomlik" },
    alps: { desc: "Manzarali poyezdlar, tog‘ ko‘llari va piyoda yo‘llar.", best: "Iyun – Sen, Dek – Mar", style: "Tabiat · Faol" },
    maldives: { desc: "Suv ustidagi uylar va marjon riflari — haqiqiy dam olish.", best: "Noy – Apr", style: "Plyaj · Dam olish" },
  },
  ui: {
    about: "Biz haqimizda", getStarted: "Boshlash", theme: "Tungi rejim",
    carouselEyebrow: "Manzillar", carouselTitle: "Keyingi safar qayerga?", carouselSub: "Qayerga, nega, qancha turadi — keyin TripMind rejalashtiradi.",
    from: "dan", perPerson: "bir kishi · 5 kun", best: "Eng yaxshi vaqt", style: "Uslub", explore: "Ko‘rish", save: "Saqlash", saved: "Saqlandi",
    exploreDest: "Manzilni o‘rganish", hoverHint: "Belgi ustiga olib boring", km: "km", h: "soat",
  },
  planner: {
    steps: ["Istaklaringizni tushunish", "Mos manzillarni topish", "Variantlarni solishtirish", "Marshrut tuzish", "Byudjetni optimallashtirish", "Sayohatingiz tayyor"],
    ready: "Sayohatingiz tayyor", summary: "5 kun · 2 kattalar · Muvozanatli", hotel: "Turar joy", hotelName: "Butik mehmonxona · Sultanahmet",
    transport: "Yo‘l", alt: "Muqobil", cost: "Narx", time: "Vaqt", total: "Kun jami", day: "Kun",
    you: "Siz", prompt: "Istanbulda ikki kishi uchun 5 kunlik sokin sayohat, taxminan $500. Tarix va taomni yaxshi ko‘ramiz.",
    items: [
      { title: "Topkapı saroyi", place: "Sultanahmet", transport: "Piyoda · 6 daq", alt: "Ayasofiya" },
      { title: "Mahalliy lokantada tushlik", place: "Sirkeci", transport: "Piyoda · 10 daq", alt: "Eminönüda ko‘cha taomi" },
      { title: "Eski shahar va Katta bozor", place: "Beyazıt", transport: "T1 tramvay · 8 daq", alt: "Yerosti sardobasi" },
      { title: "Bosfor manzarali kechki ovqat", place: "Karaköy", transport: "T1 tramvay · 12 daq", alt: "Paromda Kadıköy" },
    ],
  },
};

const ru: Extra = {
  places: {
    tashkent: { name: "Ташкент", country: "Узбекистан" }, istanbul: { name: "Стамбул", country: "Турция" },
    paris: { name: "Париж", country: "Франция" }, tokyo: { name: "Токио", country: "Япония" },
    dubai: { name: "Дубай", country: "ОАЭ" }, rome: { name: "Рим", country: "Италия" },
    samarkand: { name: "Самарканд", country: "Узбекистан" }, marrakech: { name: "Марракеш", country: "Марокко" },
    reykjavik: { name: "Исландия", country: "Рейкьявик" }, alps: { name: "Швейцарские Альпы", country: "Швейцария" },
    bali: { name: "Бали", country: "Индонезия" }, maldives: { name: "Мальдивы", country: "Индийский океан" },
    newyork: { name: "Нью-Йорк", country: "США" }, london: { name: "Лондон", country: "Великобритания" },
    cairo: { name: "Каир", country: "Египет" },
  },
  dest: {
    istanbul: { desc: "Два континента, османские дворцы и лучшая уличная еда у Босфора.", best: "Апр – Июн, Сен – Окт", style: "Культура · Еда" },
    paris: { desc: "Музеи, кафе и кварталы, созданные для неспешных прогулок.", best: "Май – Июн, Сен", style: "Искусство · Еда" },
    tokyo: { desc: "Тихие храмы и неоновые улицы, связанные лучшим транспортом мира.", best: "Мар – Апр, Ноя", style: "Культура · Город" },
    samarkand: { desc: "Голубые медресе Шёлкового пути — близко и выгодно.", best: "Апр – Май, Сен – Окт", style: "История · Архитектура" },
    dubai: { desc: "Пустыня, пляжи и небоскрёбы — для короткого зимнего отдыха.", best: "Ноя – Мар", style: "Люкс · Пляж" },
    rome: { desc: "Три тысячи лет истории между чашками эспрессо.", best: "Апр – Июн, Окт", style: "История · Еда" },
    marrakech: { desc: "Риады, базары и горы Атлас в одном дне пути.", best: "Мар – Май, Окт", style: "Культура · Рынки" },
    reykjavik: { desc: "Водопады, ледники и северное сияние в автопутешествии.", best: "Июн – Авг, Фев – Мар", style: "Природа · Автотур" },
    bali: { desc: "Рисовые террасы, храмы и сёрфинг.", best: "Апр – Окт", style: "Природа · Велнес" },
    alps: { desc: "Панорамные поезда, горные озёра и треккинг.", best: "Июн – Сен, Дек – Мар", style: "Природа · Актив" },
    maldives: { desc: "Виллы над водой и снорклинг на рифах.", best: "Ноя – Апр", style: "Пляж · Отдых" },
  },
  ui: {
    about: "О нас", getStarted: "Начать", theme: "Тёмная тема",
    carouselEyebrow: "Направления", carouselTitle: "Куда дальше?", carouselSub: "Куда, зачем и сколько стоит — а план составит TripMind.",
    from: "от", perPerson: "на человека · 5 дней", best: "Лучшее время", style: "Стиль", explore: "Смотреть", save: "Сохранить", saved: "Сохранено",
    exploreDest: "Изучить направление", hoverHint: "Наведите на метку", km: "км", h: "ч",
  },
  planner: {
    steps: ["Понимаем ваши предпочтения", "Ищем подходящие места", "Сравниваем варианты", "Строим маршрут", "Оптимизируем бюджет", "Поездка готова"],
    ready: "Поездка готова", summary: "5 дней · 2 взрослых · Сбалансированный", hotel: "Жильё", hotelName: "Бутик-отель · Султанахмет",
    transport: "Как добраться", alt: "Альтернатива", cost: "Цена", time: "Время", total: "Итого за день", day: "День",
    you: "Вы", prompt: "5 спокойных дней в Стамбуле на двоих, около $500. Любим историю и еду.",
    items: [
      { title: "Дворец Топкапы", place: "Султанахмет", transport: "Пешком · 6 мин", alt: "Айя-София" },
      { title: "Обед в местной локанте", place: "Сиркеджи", transport: "Пешком · 10 мин", alt: "Уличная еда в Эминёню" },
      { title: "Старый город и Гранд-базар", place: "Беязыт", transport: "Трамвай T1 · 8 мин", alt: "Цистерна Базилика" },
      { title: "Ужин с видом на Босфор", place: "Каракёй", transport: "Трамвай T1 · 12 мин", alt: "Кадыкёй на пароме" },
    ],
  },
};

export const EXTRA: Record<Lang, Extra> = { en, uz, ru };
