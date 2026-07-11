export interface DemoProduct {
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  badge?: string;
  images: string[];
  specifications: { key: string; value: string }[];
}

export const INITIAL_CATEGORIES = [
  {
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: "Smartphone",
    description: "Smartphones, Laptops, Audio, Smart Watches & Premium Electronics",
  },
  {
    name: "Fashion & Apparel",
    slug: "fashion",
    icon: "Shirt",
    description: "Men's, Women's & Kids' Trendy Clothing, Shoes & Luxury Accessories",
  },
  {
    name: "Grocery & Gourmet",
    slug: "grocery",
    icon: "ShoppingBasket",
    description: "Daily Essentials, Organic Foods, Dry Fruits & Beverages",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: "Home",
    description: "Smart Appliances, Cookware, Ergonomic Furniture & Decor",
  },
  {
    name: "Books & Literature",
    slug: "books",
    icon: "BookOpen",
    description: "Bestsellers, Fiction, Self-Help, Business & Educational Books",
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty",
    icon: "Sparkles",
    description: "Skincare, Fragrances, Haircare & Grooming Essentials",
  },
];

export const INITIAL_PRODUCTS: DemoProduct[] = [
  // ELECTRONICS
  {
    title: "Teotia Pro X1 Ultra 5G Smartphone (12GB RAM, 256GB Storage, Titanium Gray)",
    slug: "teotia-pro-x1-ultra-5g",
    description: "Experience next-generation speed with the all-new Teotia Pro X1 Ultra 5G. Featuring a 6.8-inch Dynamic AMOLED 120Hz display, Snapdragon 8 Gen 3 octa-core processor, professional 108MP + 48MP + 12MP triple AI camera setup, and a massive 5200mAh battery with 120W SuperCharge. Crafted from aerospace titanium for ultimate durability.",
    price: 49999,
    originalPrice: 74999,
    discountPercentage: 33,
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    rating: 4.8,
    reviewCount: 2450,
    inStock: true,
    stockQuantity: 45,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Display", value: "6.8 inch 120Hz AMOLED Ultra HD" },
      { key: "Processor", value: "Snapdragon 8 Gen 3 Octa-Core" },
      { key: "Camera", value: "108MP Main + 48MP Ultra-Wide + 12MP Telephoto" },
      { key: "Battery", value: "5200 mAh with 120W Fast Charging" },
      { key: "Warranty", value: "2 Years Shopprix Brand Replacement Warranty" }
    ]
  },
  {
    title: "Sony Ultra-Noise Cancelling Over-Ear Wireless Headphones WH-1000XM5",
    slug: "sony-ultra-noise-cancelling-headphones",
    description: "Industry-leading noise cancellation with dual processors and 8 microphones. Enjoy up to 30 hours of crystal-clear high-resolution audio with precise voice pickup for phone calls. Lightweight carbon fiber design with ultra-soft leatherette earpads.",
    price: 24990,
    originalPrice: 34990,
    discountPercentage: 29,
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    rating: 4.7,
    reviewCount: 1890,
    inStock: true,
    stockQuantity: 30,
    badge: "Shopprix Choice",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Battery Life", value: "Up to 30 Hours on single charge" },
      { key: "Noise Cancellation", value: "Dual Processor 8-Microphone Active ANC" },
      { key: "Connectivity", value: "Bluetooth 5.3 + 3.5mm Aux Support" },
      { key: "Weight", value: "250 Grams Ultra-Light" }
    ]
  },
  {
    title: "Teotia Book Elite 16 Slim Laptop (Intel Core i9, 32GB RAM, 1TB NVMe SSD)",
    slug: "teotia-book-elite-16-slim-laptop",
    description: "Designed for creators and professionals who demand relentless performance. Featuring a stunning 16-inch 3.2K OLED Retina display, 14th Gen Core i9 processor, dual ThunderBolt 4 ports, and all-day 15-hour battery life inside a CNC milled aluminum chassis.",
    price: 89999,
    originalPrice: 129999,
    discountPercentage: 31,
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    rating: 4.9,
    reviewCount: 642,
    inStock: true,
    stockQuantity: 18,
    badge: "Deal of the Day",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Screen", value: "16-inch 3.2K OLED HDR (3200x2000)" },
      { key: "Memory", value: "32GB LPDDR5X + 1TB PCIe Gen4 SSD" },
      { key: "Weight", value: "1.38 kg Ultra-Slim Aluminum" },
      { key: "OS", value: "Windows 11 Pro Pre-installed + Office 2024" }
    ]
  },
  {
    title: "Apple Watch Series 9 GPS + Cellular 45mm Midnight Aluminum Case",
    slug: "apple-watch-series-9-gps-cellular",
    description: "Brighter display, faster S9 SiP chip, magical double-tap gesture, and advanced health sensors including ECG, blood oxygen, and precise sleep stage tracking. Always-on Retina display with 2000 nits peak brightness.",
    price: 44900,
    originalPrice: 51900,
    discountPercentage: 13,
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    rating: 4.8,
    reviewCount: 3120,
    inStock: true,
    stockQuantity: 60,
    badge: "Prime Fast",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Case Size", value: "45mm Midnight Aluminum" },
      { key: "Sensors", value: "ECG, SpO2, Temperature, Heart Rate Alert" },
      { key: "Water Resistance", value: "50 Meters Swim Proof" }
    ]
  },

  // FASHION
  {
    title: "Shopprix Couture Premium Men's Heavyweight Cotton Trench Coat & Jacket",
    slug: "shopprix-couture-premium-trench-coat",
    description: "Tailored from 100% premium Italian combed cotton with weather-resistant coating. Features classic double-breasted buttons, adjustable waist belt, and thermal inner lining perfect for autumn, winter, or formal evening occasions.",
    price: 3499,
    originalPrice: 6999,
    discountPercentage: 50,
    category: "Fashion & Apparel",
    categorySlug: "fashion",
    rating: 4.6,
    reviewCount: 840,
    inStock: true,
    stockQuantity: 80,
    badge: "Big Sale",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Material", value: "100% Weatherproof Italian Combed Cotton" },
      { key: "Fit", value: "Modern Tailored Regular Fit" },
      { key: "Care", value: "Dry Clean Only" }
    ]
  },
  {
    title: "Urban Walkers Men's Breathable Running & Gym Athletic Sneaker Shoes",
    slug: "urban-walkers-mens-running-sneakers",
    description: "Engineered with responsive cloud-foam sole cushioning and 3D breathable engineered mesh upper. Offers extreme shock absorption, non-slip rubber grip, and ergonomic arch support for everyday jogging, gym workouts, or casual streetwear.",
    price: 1899,
    originalPrice: 4599,
    discountPercentage: 59,
    category: "Fashion & Apparel",
    categorySlug: "fashion",
    rating: 4.5,
    reviewCount: 1420,
    inStock: true,
    stockQuantity: 120,
    badge: "Trending",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37b5ab3f28c8?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Sole", value: "Cloud-Foam EVA + High Grip Rubber" },
      { key: "Upper", value: "3D Breathable Mesh" },
      { key: "Sizes Available", value: "7, 8, 9, 10, 11 UK" }
    ]
  },
  {
    title: "Royal Silk Women's Embroidered Banarasi Kanjivaram Designer Saree with Blouse",
    slug: "royal-silk-womens-embroidered-banarasi-saree",
    description: "Exquisite traditional silk saree crafted by master weavers. Features intricate golden Zari floral motifs along the rich pallu and contrasting borders. Comes with an unstitched matching designer silk blouse piece.",
    price: 2999,
    originalPrice: 8999,
    discountPercentage: 67,
    category: "Fashion & Apparel",
    categorySlug: "fashion",
    rating: 4.8,
    reviewCount: 910,
    inStock: true,
    stockQuantity: 40,
    badge: "Shopprix Choice",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Fabric", value: "Authentic Banarasi Art Silk" },
      { key: "Saree Length", value: "5.5 Meters + 0.8M Blouse Piece" },
      { key: "Weave Type", value: "Zari Golden Jacquard Work" }
    ]
  },

  // GROCERY & GOURMET
  {
    title: "Teotia Naturals Organic Premium California Almonds (Badam) 1 Kg Pack",
    slug: "teotia-naturals-organic-california-almonds-1kg",
    description: "Hand-picked jumbo California almonds sorted for supreme quality, crunch, and natural sweetness. Rich in dietary fiber, Vitamin E, protein, and heart-healthy antioxidants. Vacuum-sealed in resealable freshness ziplock bags.",
    price: 849,
    originalPrice: 1499,
    discountPercentage: 43,
    category: "Grocery & Gourmet",
    categorySlug: "grocery",
    rating: 4.9,
    reviewCount: 5120,
    inStock: true,
    stockQuantity: 300,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Net Weight", value: "1000 Grams (1 Kg)" },
      { key: "Quality", value: "100% Raw, Unroasted & Organic Grade A+" },
      { key: "Shelf Life", value: "12 Months from harvest" }
    ]
  },
  {
    title: "Himalayan Forest 100% Pure Raw Wild Multiflora Honey (Glass Jar 500g)",
    slug: "himalayan-forest-pure-raw-wild-honey-500g",
    description: "Sourced directly from indigenous bee colonies deep in the pristine valleys of the Himalayas. Unheated, unpasteurized, and unprocessed with zero artificial sugar syrup additives. Packed with natural bee pollen and enzymes.",
    price: 499,
    originalPrice: 799,
    discountPercentage: 38,
    category: "Grocery & Gourmet",
    categorySlug: "grocery",
    rating: 4.7,
    reviewCount: 1680,
    inStock: true,
    stockQuantity: 150,
    badge: "Prime Fast",
    images: [
      "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Purity", value: "FSSAI & NMR Tested Lab Certified 100% Pure" },
      { key: "Packaging", value: "Food-Grade Thick Glass Jar" },
      { key: "Weight", value: "500 Grams" }
    ]
  },
  {
    title: "Darjeeling Gold Imperial First Flush Loose Leaf Black Tea (Tin Caddy 250g)",
    slug: "darjeeling-gold-imperial-first-flush-tea-250g",
    description: "Known as the champagne of teas, harvested during the early spring bloom at high-altitude heritage estates in Darjeeling. Offers a delicate muscatel flavor with floral aroma and invigorating golden liquor.",
    price: 650,
    originalPrice: 999,
    discountPercentage: 35,
    category: "Grocery & Gourmet",
    categorySlug: "grocery",
    rating: 4.8,
    reviewCount: 780,
    inStock: false, // Demo out of stock item!
    stockQuantity: 0,
    badge: "Out of Stock",
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Origin", value: "Darjeeling High Altitude Single Estate" },
      { key: "Type", value: "First Flush Orthodox Whole Leaf" },
      { key: "Weight", value: "250g Tin Box" }
    ]
  },

  // HOME & KITCHEN
  {
    title: "Philips Air Fryer XL 6.2L Digital Touch with Fat Removal Technology",
    slug: "philips-air-fryer-xl-6-2l-digital-touch",
    description: "Fry, bake, grill, roast, and reheat with up to 90% less oil! Equipped with Rapid Air 360-degree vortex airflow, touch panel with 7 preset cooking modes, and non-stick dishwasher-safe basket.",
    price: 9999,
    originalPrice: 15999,
    discountPercentage: 38,
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.7,
    reviewCount: 4320,
    inStock: true,
    stockQuantity: 35,
    badge: "Deal of the Day",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Capacity", value: "6.2 Liters (Serves 5-6 People)" },
      { key: "Power", value: "2000 Watts Rapid Heating" },
      { key: "Controls", value: "Digital Touch with Keep Warm Function" }
    ]
  },
  {
    title: "Dyson V15 Detect Extra Cordless Vacuum Cleaner with Laser Dust Detection",
    slug: "dyson-v15-detect-extra-cordless-vacuum",
    description: "Reveals microscopic dust on hard floors with a Precisely-angled laser sensor. Piezo sensor continuously sizes and counts dust particles, automatically increasing suction power when needed. Includes 8 specialized cleaning attachments.",
    price: 54900,
    originalPrice: 65900,
    discountPercentage: 17,
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.9,
    reviewCount: 1105,
    inStock: true,
    stockQuantity: 15,
    badge: "Premium Choice",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Run Time", value: "Up to 60 minutes fade-free suction" },
      { key: "Filtration", value: "Advanced whole-machine HEPA filtration" },
      { key: "Weight", value: "3.1 kg Ergonomic Cordless" }
    ]
  },
  {
    title: "Ergonomic Mesh Office Chair with High Back & Adjustable Lumbar Support",
    slug: "ergonomic-mesh-office-chair-lumbar-support",
    description: "Engineered to eliminate lower back pain during long working hours. Features 4D adjustable armrests, multi-angle synchro-tilt lock up to 135 degrees, heavy-duty chrome base, and breathable high-density Korean mesh.",
    price: 7499,
    originalPrice: 14999,
    discountPercentage: 50,
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.6,
    reviewCount: 1980,
    inStock: true,
    stockQuantity: 50,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1580481077494-e3299acabf75?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Weight Capacity", value: "150 Kg Tested BIFMA Certified" },
      { key: "Recline", value: "90° to 135° Lockable Mechanism" },
      { key: "Headrest", value: "2D Height & Angle Adjustable" }
    ]
  },

  // BOOKS & LITERATURE
  {
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    slug: "atomic-habits-james-clear-hardcover",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that teach you how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    price: 499,
    originalPrice: 799,
    discountPercentage: 38,
    category: "Books & Literature",
    categorySlug: "books",
    rating: 4.9,
    reviewCount: 18500,
    inStock: true,
    stockQuantity: 250,
    badge: "#1 Global Bestseller",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Author", value: "James Clear" },
      { key: "Format", value: "Paperback & Hardcover Available" },
      { key: "Pages", value: "320 Pages Unabridged Edition" },
      { key: "Publisher", value: "Penguin Random House" }
    ]
  },
  {
    title: "The Psychology of Money: Timeless lessons on wealth, greed, and happiness",
    slug: "the-psychology-of-money-morgan-housel",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Morgan Housel shares 19 short stories exploring the strange ways people think about wealth.",
    price: 349,
    originalPrice: 599,
    discountPercentage: 42,
    category: "Books & Literature",
    categorySlug: "books",
    rating: 4.8,
    reviewCount: 12400,
    inStock: true,
    stockQuantity: 180,
    badge: "Shopprix Choice",
    images: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Author", value: "Morgan Housel" },
      { key: "Language", value: "English" },
      { key: "Pages", value: "256 Pages" }
    ]
  },

  // BEAUTY & PERSONAL CARE
  {
    title: "Teotia Glow Radiance Vitamin C + Hyaluronic Acid Brightening Face Serum (30ml)",
    slug: "teotia-glow-radiance-vitamin-c-serum-30ml",
    description: "Formulated with 20% pure L-Ascorbic Acid, 2% Hyaluronic Acid, and Ferulic Acid. Instantly boosts glow, fades dark pigmentation spots, stimulates collagen synthesis, and deeply hydrates dull skin without greasy residue.",
    price: 599,
    originalPrice: 1199,
    discountPercentage: 50,
    category: "Beauty & Personal Care",
    categorySlug: "beauty",
    rating: 4.7,
    reviewCount: 3890,
    inStock: true,
    stockQuantity: 110,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-0e6d526a67e8?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Key Ingredients", value: "20% Vitamin C + 2% Hyaluronic Acid" },
      { key: "Skin Type", value: "Suitable for All Skin Types (Dermatologist Tested)" },
      { key: "Volume", value: "30 Milliliters Glass Dropper Bottle" }
    ]
  },
  {
    title: "Dior Sauvage Eau de Parfum Long-Lasting Luxury Men's Cologne (100ml)",
    slug: "dior-sauvage-eau-de-parfum-luxury-cologne-100ml",
    description: "A radically fresh composition with powerful and noble woody notes. Features juicy Calabrian bergamot, Sichuan pepper, and ambroxan wrapped in vanilla absolute from Papua New Guinea. Magnetic presence for day and night wear.",
    price: 11500,
    originalPrice: 13500,
    discountPercentage: 15,
    category: "Beauty & Personal Care",
    categorySlug: "beauty",
    rating: 4.9,
    reviewCount: 2950,
    inStock: true,
    stockQuantity: 20,
    badge: "Luxury Exclusive",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    specifications: [
      { key: "Concentration", value: "Eau de Parfum (EDP)" },
      { key: "Volume", value: "100 ml / 3.4 oz" },
      { key: "Longevity", value: "14+ Hours Intense Sillage" }
    ]
  }
];

export const INITIAL_REVIEWS = [
  {
    productId: 1,
    authorName: "Vikramaditya Chauhan",
    rating: 5,
    comment: "The Teotia Pro X1 Ultra 5G is absolute beast! Camera clarity in night mode rivals DSLR and the 120W supercharge fills the battery from 0 to 100% in under 20 minutes. Best purchase on Shopprix ever!",
    verifiedPurchase: true,
    helpfulCount: 42
  },
  {
    productId: 1,
    authorName: "Ananya Sharma",
    rating: 5,
    comment: "Titanium build feels super premium. Display is buttery smooth at 120Hz. Highly recommend picking this up during the Teotia Shopprix Big Sale!",
    verifiedPurchase: true,
    helpfulCount: 28
  },
  {
    productId: 1,
    authorName: "Rohit Verma",
    rating: 4,
    comment: "Great device overall. Battery backup easily lasts 1.5 days with heavy gaming and 5G enabled. Only wish they included a free protective case in the box.",
    verifiedPurchase: true,
    helpfulCount: 15
  },
  {
    productId: 2,
    authorName: "Siddharth Mehta",
    rating: 5,
    comment: "Sony WH-1000XM5 ANC is mind blowing. Turned it on during my flight from Delhi to Bangalore and literally heard zero airplane engine noise. Worth every single rupee.",
    verifiedPurchase: true,
    helpfulCount: 34
  },
  {
    productId: 8,
    authorName: "Neha Gupta",
    rating: 5,
    comment: "Teotia Naturals Almonds are so fresh and crunchy! Zero bitter almonds inside, perfect size and great value compared to supermarket prices.",
    verifiedPurchase: true,
    helpfulCount: 19
  }
];
