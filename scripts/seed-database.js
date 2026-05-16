const { createClient } = require('@supabase/supabase-js')

/**
 * Seed database from existing lib/data.js
 * Run: node scripts/seed-database.js
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── collections (from lib/data.js) ────────────────────────────
const collections = [
  { slug: 'quranic-verses', name: 'Quranic Verses', arabic_name: 'الآيات القرآنية', sort_order: 1 },
  { slug: '99-names', name: '99 Names of Allah', arabic_name: 'الأسماء الحسنى', sort_order: 2 },
  { slug: 'bridal-gift', name: 'Bridal & Gift', arabic_name: 'مجموعة العروس', sort_order: 3 },
  { slug: 'limited-editions', name: 'Limited Editions', arabic_name: 'قطع فريدة', sort_order: 4 },
]

// ── products (from lib/data.js) ───────────────────────────────
const products = [
  {
    slug: 'ayat-al-kursi-teal',
    name: 'Ayat al-Kursi — Teal',
    arabic_name: 'آية الكرسي',
    collection_slug: 'quranic-verses',
    collection_label: 'Ayatul Kursi Collection',
    script: 'Thuluth',
    dimensions: '60 × 30″',
    canvas_size: 'large',
    price: 35000,          // $350.00 in cents
    customization_fee: 5000, // $50.00 in cents
    processing_time: '2–3 weeks',
    description: 'The Verse of the Throne rendered in luminous gold Thuluth script against a hand-marbled teal canvas. Surrounded by a hand-painted floral arabesque border with gold leaf accents. A centerpiece piece for any home.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/product-ayatul-kursi-teal-1.jpg',
    images: ['/product-ayatul-kursi-teal-1.jpg', '/product-ayatul-kursi-teal-2.jpg'],
    features: ['Hand-gilded gold leaf', 'Archival-grade canvas', 'Floral arabesque border', 'Signed by calligrapher'],
    customizations: ['Color palette', 'Design style', 'Layout inspiration'],
    is_featured: true,
    stock_quantity: -1,    // Made to order
  },
  {
    slug: '99-names-burgundy',
    name: '99 Names — Burgundy Diamond',
    arabic_name: 'أسماء الله الحسنى',
    collection_slug: '99-names',
    collection_label: 'Asmaul Husna Collection',
    script: 'Thuluth',
    dimensions: '60 × 36″',
    canvas_size: 'large',
    price: 40000,
    customization_fee: 10000,
    processing_time: '~1 month',
    description: 'All 99 beautiful names of Allah arranged in hand-painted diamond medallions across a rich burgundy canvas. Each name is individually composed in gold leaf Thuluth script within jewel-toned panels of blue, green, copper and cream, flanked by intricate floral arabesques.',
    calligrapher: 'Ustad Tariq, Cairo',
    image: '/product-99-names-burgundy-1.jpg',
    images: ['/product-99-names-burgundy-1.jpg', '/product-99-names-burgundy-2.jpg', '/product-99-names-burgundy-3.jpg'],
    features: ['99 individually painted name panels', 'Jewel-toned diamond layout', 'Gold leaf accents throughout', 'Floral arabesque side panels'],
    customizations: ['Color palette', 'Design inspiration', 'Overall aesthetic/style'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: '99-names-black',
    name: '99 Names — Noir Hexagonal',
    arabic_name: 'أسماء الله الحسنى',
    collection_slug: '99-names',
    collection_label: 'Asmaul Husna Collection',
    script: 'Thuluth',
    dimensions: '48 × 36″',
    canvas_size: 'large',
    price: 40000,
    customization_fee: 10000,
    processing_time: '~1 month',
    description: 'The 99 names arranged in stunning silver and grey hexagonal cells against a deep black canvas, flanked by geometric star panels in gold. A modern interpretation of a timeless devotion.',
    calligrapher: 'Master Ali, Lahore',
    image: '/product-99-names-black-1.jpg',
    images: ['/product-99-names-black-1.jpg', '/product-99-names-black-2.jpg'],
    features: ['Hexagonal tessellation layout', 'Silver & grey gradient cells', 'Gold geometric star side panels', 'Contemporary noir palette'],
    customizations: ['Color palette', 'Design inspiration', 'Overall aesthetic/style'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: '99-names-green',
    name: '99 Names — Emerald Garden',
    arabic_name: 'أسماء الله الحسنى',
    collection_slug: '99-names',
    collection_label: 'Asmaul Husna Collection',
    script: 'Thuluth',
    dimensions: '48 × 40″',
    canvas_size: 'large',
    price: 40000,
    customization_fee: 10000,
    processing_time: '~1 month',
    description: 'The 99 names displayed in interlocking arabesque quatrefoils across a lush emerald green canvas. Vivid greens, teals and burgundy panels are outlined in raised gold, creating a jewel-box effect.',
    calligrapher: 'Ustad Tariq, Cairo',
    image: '/product-99-names-green-2.jpg',
    images: ['/product-99-names-green-1.jpg', '/product-99-names-green-2.jpg', '/product-99-names-green-3.jpg'],
    features: ['Arabesque quatrefoil pattern', 'Raised gold outlining', 'Emerald & teal palette', 'Gold finial accent'],
    customizations: ['Color palette', 'Design inspiration', 'Overall aesthetic/style'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: '99-names-pink',
    name: '99 Names — Rose Gold',
    arabic_name: 'أسماء الله الحسنى',
    collection_slug: '99-names',
    collection_label: 'Asmaul Husna Collection',
    script: 'Naskh',
    dimensions: '36 × 36″',
    canvas_size: 'large',
    price: 40000,
    customization_fee: 10000,
    processing_time: '~1 month',
    description: 'A softer palette for the 99 names — rose, blush and teal panels set against a warm cream canvas. Perfect for contemporary interiors and a beautiful bridal gift.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/product-99-names-pink-1.jpg',
    images: ['/product-99-names-pink-1.jpg', '/product-99-names-pink-2.jpg'],
    features: ['Soft rose & blush palette', 'Warm cream base canvas', 'Contemporary Naskh script', 'Ideal as a bridal gift'],
    customizations: ['Color palette', 'Design inspiration', 'Overall aesthetic/style'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'ayat-al-kursi-sage',
    name: 'Ayat al-Kursi — Sage',
    arabic_name: 'آية الكرسي',
    collection_slug: 'quranic-verses',
    collection_label: 'Ayatul Kursi Collection',
    script: 'Diwani',
    dimensions: '48 × 24″',
    canvas_size: 'large',
    price: 35000,
    customization_fee: 5000,
    processing_time: '2–3 weeks',
    description: 'The Verse of the Throne in flowing Diwani script on a muted sage-green canvas. Surrounded by delicate gold vine arabesques, creating a piece that feels both classical and contemporary.',
    calligrapher: 'Master Ali, Lahore',
    image: '/product-ayatul-kursi-sage-1.jpg',
    images: ['/product-ayatul-kursi-sage-1.jpg', '/product-ayatul-kursi-sage-2.jpg'],
    features: ['Flowing Diwani calligraphy', 'Hand-painted vine arabesques', 'Sage-green tonal canvas', 'Gold leaf accents'],
    customizations: ['Color palette', 'Design style', 'Layout inspiration'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'ayat-al-kursi-blue',
    name: 'Ayat al-Kursi — Celestial Blue',
    arabic_name: 'آية الكرسي',
    collection_slug: 'quranic-verses',
    collection_label: 'Ayatul Kursi Collection',
    script: 'Thuluth',
    dimensions: '40 × 30″',
    canvas_size: 'large',
    price: 35000,
    customization_fee: 5000,
    processing_time: '2–3 weeks',
    description: 'A serene blue canvas bearing the Verse of the Throne in delicate gold calligraphy. The celestial blue tones evoke the sky, making this piece perfect for bedrooms and quiet spaces.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/product-ayatul-kursi-blue-1.jpg',
    images: ['/product-ayatul-kursi-blue-1.jpg'],
    features: ['Celestial blue canvas', 'Gold Thuluth calligraphy', 'Serene & calming aesthetic', 'Archival materials'],
    customizations: ['Color palette', 'Design style', 'Layout inspiration'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'allah-green',
    name: 'Allah — Emerald',
    arabic_name: 'الله',
    collection_slug: 'quranic-verses',
    collection_label: 'Calligraphy Collection',
    script: 'Jali Thuluth',
    dimensions: '20 × 24″',
    canvas_size: 'medium',
    price: 8000,
    customization_fee: 5000,
    processing_time: '1–2 weeks',
    description: 'The name of Allah in majestic Jali Thuluth script, set against a deep emerald green canvas with gold arabesque vine border. A powerful yet intimate devotional piece.',
    calligrapher: 'Ustad Tariq, Cairo',
    image: '/product-allah-green-1.jpg',
    images: ['/product-allah-green-1.jpg', '/product-allah-green-2.jpg'],
    features: ['Jali Thuluth script', 'Emerald green canvas', 'Gold vine border', 'Compact devotional size'],
    customizations: ['Color palette', 'Design adjustments', 'Aesthetic preferences'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'ya-hayyu-blue',
    name: 'Ya Hayyu Ya Qayyum',
    arabic_name: 'يا حيّ يا قيّوم',
    collection_slug: 'quranic-verses',
    collection_label: 'Calligraphy Collection',
    script: 'Diwani',
    dimensions: '36 × 24″',
    canvas_size: 'large',
    price: 25000,
    customization_fee: 5000,
    processing_time: '2–3 weeks',
    description: 'O Ever-Living, O Self-Sustaining — an invocation rendered in swirling Diwani script on a deep blue canvas with gold accents. A piece that brings serenity and remembrance.',
    calligrapher: 'Master Ali, Lahore',
    image: '/product-ya-hayyu-blue-1.jpg',
    images: ['/product-ya-hayyu-blue-1.jpg', '/product-ya-hayyu-blue-2.jpg'],
    features: ['Swirling Diwani script', 'Deep blue tonal canvas', 'Gold accent details', 'Signed by calligrapher'],
    customizations: ['Color palette', 'Design adjustments', 'Aesthetic preferences'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'bismillah-beige',
    name: 'Bismillah — Floral',
    arabic_name: 'بسم الله الرحمن الرحيم',
    collection_slug: 'bridal-gift',
    collection_label: 'Calligraphy Collection',
    script: 'Diwani',
    dimensions: '36 × 18″',
    canvas_size: 'large',
    price: 22000,
    customization_fee: 5000,
    processing_time: '2–3 weeks',
    description: 'Bismillah-ir-Rahman-ir-Rahim in warm Diwani script surrounded by a delicate floral border. The warm beige tones and botanical details make this the perfect housewarming or bridal gift.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/product-bismillah-beige-1.jpg',
    images: ['/product-bismillah-beige-1.jpg', '/product-bismillah-beige-2.jpg'],
    features: ['Warm Diwani calligraphy', 'Delicate floral border', 'Beige tonal canvas', 'Perfect bridal gift'],
    customizations: ['Color palette', 'Design adjustments', 'Aesthetic preferences'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'tawakkul-grey',
    name: 'Tawakkul — Grey Marble',
    arabic_name: 'توكّلت على الله',
    collection_slug: 'bridal-gift',
    collection_label: 'Calligraphy Collection',
    script: 'Nastaliq',
    dimensions: '24 × 24″',
    canvas_size: 'medium',
    price: 6000,
    customization_fee: 5000,
    processing_time: '1–2 weeks',
    description: 'I have placed my trust in Allah — a calming grey-marbled canvas with silver and gold script. Part of our mini-canvas collection, ideal for desks, shelves, and intimate spaces.',
    calligrapher: 'Master Ali, Lahore',
    image: '/product-tawakkul-grey-1.jpg',
    images: ['/product-tawakkul-grey-1.jpg', '/product-tawakkul-grey-2.jpg'],
    features: ['Grey marble effect', 'Silver & gold script', 'Intimate canvas size', 'Ideal for shelves & desks'],
    customizations: ['Color palette', 'Design adjustments', 'Aesthetic preferences'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: '5-names-mini',
    name: '5 Names — Mini Canvas Set',
    arabic_name: 'أسماء الله',
    collection_slug: 'bridal-gift',
    collection_label: 'Mini Canvas Collection',
    script: 'Various',
    dimensions: '8 × 10″ each',
    canvas_size: 'small',
    price: 1500,
    customization_fee: 1000,
    processing_time: '1 week',
    description: 'A curated set of five mini canvases, each bearing one of the beautiful names of Allah. Perfect as individual accents or displayed as a group. An ideal gift for any occasion.',
    calligrapher: 'Master Ali, Lahore',
    image: '/product-5-names-mini-1.jpg',
    images: ['/product-5-names-mini-1.jpg'],
    features: ['Set of 5 mini canvases', 'Various script styles', 'Display individually or grouped', 'Perfect gift set'],
    customizations: ['Color palette', 'Design adjustments'],
    is_featured: false,
    stock_quantity: -1,
  },
  {
    slug: 'gold-arabesque',
    name: 'Gold Arabesque — Detail',
    arabic_name: 'الزخرفة الذهبية',
    collection_slug: 'limited-editions',
    collection_label: 'Limited Edition',
    script: 'Ottoman Tezhip',
    dimensions: 'Various sizes',
    canvas_size: 'medium',
    price: 9000,
    customization_fee: 5000,
    processing_time: '2–3 weeks',
    description: 'A close study of our hand-painted arabesque florals and gold leaf work. Each vine, petal, and leaf is individually rendered by hand in the Ottoman tezhip tradition.',
    calligrapher: 'Master Hasan, Istanbul',
    image: '/product-gold-arabesque-detail.jpg',
    images: ['/product-gold-arabesque-detail.jpg'],
    features: ['Ottoman tezhip tradition', 'Individual hand-painted florals', '24k gold leaf application', 'Museum-quality detail'],
    customizations: ['Color palette', 'Design adjustments', 'Aesthetic preferences'],
    is_featured: false,
    stock_quantity: -1,
  },
]

async function seed() {
  console.log('🌱 Seeding HILAL Arts database...\n')

  // ── 1. Seed collections ─────────────────────────────────────
  console.log('Inserting collections...')
  const { data: insertedCollections, error: collectionsError } = await supabase
    .from('collections')
    .upsert(collections, { onConflict: 'slug' })
    .select()

  if (collectionsError) {
    console.error('Collections error:', collectionsError)
    process.exit(1)
  }

  console.log(`  ✓ ${insertedCollections.length} collections inserted`)

  // Build slug → id map
  const collectionMap = {}
  for (const c of insertedCollections) {
    collectionMap[c.slug] = c.id
  }

  // ── 2. Seed products ────────────────────────────────────────
  console.log('Inserting products...')
  for (const p of products) {
    const collectionId = collectionMap[p.collection_slug]
    if (!collectionId) {
      console.warn(`  ⚠ Skipping ${p.slug}: collection "${p.collection_slug}" not found`)
      continue
    }

    const productData = {
      slug: p.slug,
      name: p.name,
      arabic_name: p.arabic_name,
      collection_id: collectionId,
      collection_label: p.collection_label,
      script: p.script,
      dimensions: p.dimensions,
      canvas_size: p.canvas_size,
      price: p.price,
      customization_fee: p.customization_fee,
      processing_time: p.processing_time,
      description: p.description,
      calligrapher: p.calligrapher,
      image: p.image,
      is_featured: p.is_featured,
      stock_quantity: p.stock_quantity,
    }

    const { data: productRow, error: productError } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'slug' })
      .select()
      .single()

    if (productError) {
      console.error(`  ✗ Error inserting ${p.slug}:`, productError)
      continue
    }

    console.log(`  ✓ ${p.name}`)

    // ── 3. Seed product images ────────────────────────────────
    if (p.images && p.images.length > 0) {
      const imageRows = p.images.map((url, i) => ({
        product_id: productRow.id,
        url,
        alt_text: `${p.name} view ${i + 1}`,
        sort_order: i,
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .upsert(imageRows, { onConflict: 'product_id, url' })

      if (imagesError) {
        console.error(`    ✗ Images error for ${p.slug}:`, imagesError)
      }
    }

    // ── 4. Seed product features ──────────────────────────────
    if (p.features && p.features.length > 0) {
      const featureRows = p.features.map((text, i) => ({
        product_id: productRow.id,
        text,
        sort_order: i,
      }))

      const { error: featuresError } = await supabase
        .from('product_features')
        .upsert(featureRows, { onConflict: 'product_id, text' })

      if (featuresError) {
        console.error(`    ✗ Features error for ${p.slug}:`, featuresError)
      }
    }

    // ── 5. Seed product customizations ────────────────────────
    if (p.customizations && p.customizations.length > 0) {
      const customizationRows = p.customizations.map((label, i) => ({
        product_id: productRow.id,
        label,
        sort_order: i,
      }))

      const { error: customizationsError } = await supabase
        .from('product_customizations')
        .upsert(customizationRows, { onConflict: 'product_id, label' })

      if (customizationsError) {
        console.error(`    ✗ Customizations error for ${p.slug}:`, customizationsError)
      }
    }
  }

  console.log('\n✅ Seeding complete!')
}

seed().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
