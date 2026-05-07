export const collections = [
  { id: 'quranic-verses', name: 'Quranic Verses', arabic: 'الآيات القرآنية' },
  { id: '99-names', name: '99 Names', arabic: 'الأسماء الحسنى' },
  { id: 'sacred-geometry', name: 'Sacred Geometry', arabic: 'الهندسة المقدّسة' },
  { id: 'bridal-gift', name: 'Bridal & Gift', arabic: 'مجموعة العروس' },
  { id: 'limited-editions', name: 'Limited Editions', arabic: 'قطع فريدة' },
];

export const products = [
  {
    id: 'ayat-al-kursi',
    slug: 'ayat-al-kursi',
    name: 'Ayat al-Kursi',
    arabicName: 'آية الكرسي',
    collection: 'quranic-verses',
    script: 'Diwani',
    dimensions: '60 × 48″',
    price: 1890,
    description: 'The Verse of the Throne, composed in flowing Diwani script. Hand-gilded with 24k gold leaf on archival canvas.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/calligraphy-1.png'
  },
  {
    id: '99-names-of-allah',
    slug: '99-names-of-allah',
    name: '99 Names of Allah',
    arabicName: 'أسماء الله الحسنى',
    collection: '99-names',
    script: 'Thuluth',
    dimensions: '48 × 48″',
    price: 1580,
    description: 'The 99 beautiful names of Allah arranged in perfect radial symmetry. A testament to divine geometry and faith.',
    calligrapher: 'Ustad Tariq, Cairo',
    image: '/calligraphy-2.png'
  },
  {
    id: 'surah-al-fatiha',
    slug: 'surah-al-fatiha',
    name: 'Surah Al-Fatiha',
    arabicName: 'سورة الفاتحة',
    collection: 'quranic-verses',
    script: 'Naskh & Thuluth',
    dimensions: '40 × 30″',
    price: 1240,
    description: 'The Opening chapter of the Quran, written in a classical blend of Naskh for the body and Thuluth for the headers.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/logo-full-cream-square.png'
  },
  {
    id: 'al-ikhlas',
    slug: 'al-ikhlas',
    name: 'Al-Ikhlas',
    arabicName: 'سورة الإخلاص',
    collection: 'quranic-verses',
    script: 'Kufic',
    dimensions: '24 × 24″',
    price: 980,
    description: 'The chapter of Sincerity, structured in striking geometric Kufic script. Perfect for modern spaces.',
    calligrapher: 'Ustad Tariq, Cairo',
    image: '/logo-full-cream-square.png'
  },
  {
    id: 'bismillah',
    slug: 'bismillah',
    name: 'Bismillah',
    arabicName: 'بسم الله',
    collection: 'bridal-gift',
    script: 'Diwani',
    dimensions: '36 × 12″',
    price: 890,
    description: 'In the name of God, the Most Gracious, the Most Merciful. A beautiful piece for a new home or newlyweds.',
    calligrapher: 'Master Ali, Lahore',
    image: '/logo-full-cream-square.png'
  },
  {
    id: 'surah-ar-rahman',
    slug: 'surah-ar-rahman',
    name: 'Surah Ar-Rahman',
    arabicName: 'سورة الرحمن',
    collection: 'limited-editions',
    script: 'Jali Diwani',
    dimensions: '72 × 36″',
    price: 2450,
    description: 'A masterwork featuring the recurring verse "Then which of the favors of your Lord will you deny?" in complex interwoven script.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/logo-full-cream-square.png'
  }
];
