import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import logger from './logger';

// Merchant Categories - All types of merchants
const categories = [
  { 
    name: 'Fashion & Apparel', 
    description: 'Clothing, accessories, and fashion items',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  },
  { 
    name: 'Electronics & Gadgets', 
    description: 'Technology products and accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
  },
  { 
    name: 'Food & Beverages', 
    description: 'Food products, beverages, and culinary items',
    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop'
  },
  { 
    name: 'Beauty & Wellness', 
    description: 'Beauty products, skincare, and wellness items',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop'
  },
  { 
    name: 'Home & Lifestyle', 
    description: 'Home decor, furniture, and lifestyle products',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
  },
  { 
    name: 'Sports & Fitness', 
    description: 'Sports equipment and fitness products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  { 
    name: 'Books & Education', 
    description: 'Books, educational materials, and learning resources',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  { 
    name: 'Jewelry & Accessories', 
    description: 'Jewelry, watches, and fashion accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
  },
  { 
    name: 'Toys & Games', 
    description: 'Toys, games, and entertainment products',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  { 
    name: 'Health & Pharmacy', 
    description: 'Health products, medicines, and wellness items',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  },
  { 
    name: 'Handicrafts & Artisans', 
    description: 'Handmade items and artisanal products',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  { 
    name: 'Agricultural Products', 
    description: 'Fresh produce, grains, and farming products',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
  },
  { 
    name: 'Traditional Crafts', 
    description: 'Traditional and cultural craft items',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  { 
    name: 'Organic & Natural', 
    description: 'Organic and natural products',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'
  },
  { 
    name: 'Digital Services', 
    description: 'Digital products and online services',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  }
];

// Marketplace Sections - Different areas for merchant counters
const floors = [
  { 
    level: 1, 
    name: 'Main Marketplace', 
    description: 'Popular merchant counters and featured products',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  },
  { 
    level: 2, 
    name: 'Fashion District', 
    description: 'Fashion, beauty, and lifestyle merchant counters',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
  },
  { 
    level: 3, 
    name: 'Tech Hub', 
    description: 'Electronics, gadgets, and digital services',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
  },
  { 
    level: 4, 
    name: 'Food Court', 
    description: 'Food, beverages, and culinary merchant counters',
    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop'
  },
  { 
    level: 5, 
    name: 'Artisan Corner', 
    description: 'Handicrafts, traditional crafts, and artisanal products',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  { 
    level: 6, 
    name: 'Wellness Zone', 
    description: 'Health, wellness, and organic products',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop'
  },
  { 
    level: 7, 
    name: 'Rural Marketplace', 
    description: 'Rural merchants and agricultural products',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
  },
  { 
    level: 8, 
    name: 'Premium Counters', 
    description: 'High-end and luxury merchant counters',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
  }
];

// Merchant Counters/Stalls - All types of merchants
const shops = [
  // Main Marketplace (Level 1) - Popular Counters
  {
    name: 'TechTrend Mobile Store',
    description: 'Latest smartphones, tablets, and mobile accessories with expert consultation',
    categoryName: 'Electronics & Gadgets',
    floorLevel: 1,
    shopNumber: 'MM-01',
    phone: '+1-555-0101',
    email: 'techtrend@supermall.com',
    website: 'https://techtrend.com',
    rating: 4.6,
    merchantName: 'Sarah Johnson',
    location: 'New York, USA',
    merchantType: 'Urban Tech Merchant',
    specialties: ['Mobile Devices', 'Tech Consultation', 'Repair Services'],
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop',
    businessHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: '11:00 AM - 6:00 PM'
    }
  },
  {
    name: 'Fashion Forward Boutique',
    description: 'Trendy fashion items and personalized styling services',
    categoryName: 'Fashion & Apparel',
    floorLevel: 1,
    shopNumber: 'MM-02',
    phone: '+1-555-0102',
    email: 'fashionforward@supermall.com',
    website: 'https://fashionforward.com',
    rating: 4.4,
    merchantName: 'Maria Rodriguez',
    location: 'Los Angeles, USA',
    merchantType: 'Urban Fashion Merchant',
    specialties: ['Trendy Fashion', 'Personal Styling', 'Custom Fittings'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    businessHours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: '12:00 PM - 6:00 PM'
    }
  },

  // Fashion District (Level 2) - Fashion Counters
  {
    name: 'Elegant Threads',
    description: 'Premium clothing and accessories with custom tailoring',
    categoryName: 'Fashion & Apparel',
    floorLevel: 2,
    shopNumber: 'FD-01',
    phone: '+1-555-0201',
    email: 'elegantthreads@supermall.com',
    website: 'https://elegantthreads.com',
    rating: 4.7,
    merchantName: 'David Chen',
    location: 'San Francisco, USA',
    merchantType: 'Urban Fashion Merchant',
    specialties: ['Premium Clothing', 'Custom Tailoring', 'Fashion Consultation'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    businessHours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: '12:00 PM - 6:00 PM'
    }
  },
  {
    name: 'Beauty Haven',
    description: 'Natural beauty products and skincare consultation',
    categoryName: 'Beauty & Wellness',
    floorLevel: 2,
    shopNumber: 'FD-02',
    phone: '+1-555-0202',
    email: 'beautyhaven@supermall.com',
    website: 'https://beautyhaven.com',
    rating: 4.5,
    merchantName: 'Lisa Thompson',
    location: 'Miami, USA',
    merchantType: 'Urban Beauty Merchant',
    specialties: ['Natural Beauty', 'Skincare Consultation', 'Beauty Workshops'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=400&fit=crop',
    businessHours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: '12:00 PM - 6:00 PM'
    }
  },

  // Tech Hub (Level 3) - Technology Counters
  {
    name: 'Digital Solutions Hub',
    description: 'Software development, digital services, and tech consultation',
    categoryName: 'Digital Services',
    floorLevel: 3,
    shopNumber: 'TH-01',
    phone: '+1-555-0301',
    email: 'digitalsolutions@supermall.com',
    website: 'https://digitalsolutions.com',
    rating: 4.8,
    merchantName: 'Alex Kumar',
    location: 'Seattle, USA',
    merchantType: 'Urban Tech Merchant',
    specialties: ['Software Development', 'Digital Marketing', 'Tech Consulting'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  },

  // Food Court (Level 4) - Food Counters
  {
    name: 'Gourmet Delights',
    description: 'Artisanal food products and cooking classes',
    categoryName: 'Food & Beverages',
    floorLevel: 4,
    shopNumber: 'FC-01',
    phone: '+1-555-0401',
    email: 'gourmetdelights@supermall.com',
    website: 'https://gourmetdelights.com',
    rating: 4.6,
    merchantName: 'Chef Michael Brown',
    location: 'Chicago, USA',
    merchantType: 'Urban Food Merchant',
    specialties: ['Artisanal Foods', 'Cooking Classes', 'Recipe Consultation'],
    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=800&h=400&fit=crop',
    businessHours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    }
  },

  // Artisan Corner (Level 5) - Handicraft Counters
  {
    name: 'Craft Corner Studio',
    description: 'Handmade jewelry and personalized craft items',
    categoryName: 'Handicrafts & Artisans',
    floorLevel: 5,
    shopNumber: 'AC-01',
    phone: '+1-555-0501',
    email: 'craftcorner@supermall.com',
    website: 'https://craftcorner.com',
    rating: 4.7,
    merchantName: 'Emma Wilson',
    location: 'Portland, USA',
    merchantType: 'Urban Artisan Merchant',
    specialties: ['Handmade Jewelry', 'Custom Crafts', 'Craft Workshops'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    businessHours: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '10:00 AM - 7:00 PM',
      sunday: '12:00 PM - 5:00 PM'
    }
  },

  // Rural Marketplace (Level 7) - Rural Merchant Counters
  {
    name: 'Village Pottery Studio',
    description: 'Traditional clay pottery and ceramic items made by local artisans',
    categoryName: 'Traditional Crafts',
    floorLevel: 7,
    shopNumber: 'RM-01',
    phone: '+91-98765-43210',
    email: 'villagepottery@supermall.com',
    website: 'https://villagepottery.com',
    rating: 4.5,
    merchantName: 'Rajesh Kumar',
    location: 'Rajasthan, India',
    merchantType: 'Rural Artisan Merchant',
    specialties: ['Traditional Pottery', 'Clay Crafts', 'Cultural Items'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    businessHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '8:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  },
  {
    name: 'Organic Farm Fresh',
    description: 'Fresh organic vegetables and fruits from local farmers',
    categoryName: 'Agricultural Products',
    floorLevel: 7,
    shopNumber: 'RM-02',
    phone: '+91-98765-43211',
    email: 'organicfarm@supermall.com',
    website: 'https://organicfarmfresh.com',
    rating: 4.7,
    merchantName: 'Priya Sharma',
    location: 'Punjab, India',
    merchantType: 'Rural Agricultural Merchant',
    specialties: ['Organic Produce', 'Fresh Vegetables', 'Farm-to-Table'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop',
    businessHours: {
      monday: '6:00 AM - 8:00 PM',
      tuesday: '6:00 AM - 8:00 PM',
      wednesday: '6:00 AM - 8:00 PM',
      thursday: '6:00 AM - 8:00 PM',
      friday: '6:00 AM - 8:00 PM',
      saturday: '6:00 AM - 6:00 PM',
      sunday: '6:00 AM - 2:00 PM'
    }
  },

  // Premium Counters (Level 8) - High-end Counters
  {
    name: 'Luxury Collections',
    description: 'Premium fashion and luxury accessories',
    categoryName: 'Fashion & Apparel',
    floorLevel: 8,
    shopNumber: 'PC-01',
    phone: '+1-555-0801',
    email: 'luxurycollections@supermall.com',
    website: 'https://luxurycollections.com',
    rating: 4.9,
    merchantName: 'Sophia Anderson',
    location: 'Beverly Hills, USA',
    merchantType: 'Premium Fashion Merchant',
    specialties: ['Luxury Fashion', 'VIP Services', 'Personal Shopping'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop',
    businessHours: {
      monday: '11:00 AM - 7:00 PM',
      tuesday: '11:00 AM - 7:00 PM',
      wednesday: '11:00 AM - 7:00 PM',
      thursday: '11:00 AM - 7:00 PM',
      friday: '11:00 AM - 8:00 PM',
      saturday: '11:00 AM - 8:00 PM',
      sunday: '12:00 PM - 6:00 PM'
    }
  }
];

// Product Offers - Merchant counter products
const offers = [
  // TechTrend Mobile Store Offers
  {
    title: 'Latest Smartphone - 15% Off',
    description: 'Brand new smartphones with extended warranty and free accessories',
    shopName: 'TechTrend Mobile Store',
    originalPrice: 999.00,
    discountedPrice: 849.15,
    discountPercentage: 15,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Latest Model', 'Extended Warranty', 'Free Accessories', 'Tech Support'],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: '6.7" Display, 256GB Storage, 5G Compatible',
      warranty: '2 Years Extended Warranty',
      returnPolicy: '30-day return policy',
      shipping: 'Free shipping worldwide'
    }
  },
  {
    title: 'Mobile Repair Service - 20% Off',
    description: 'Professional mobile repair services with quick turnaround',
    shopName: 'TechTrend Mobile Store',
    originalPrice: 100.00,
    discountedPrice: 80.00,
    discountPercentage: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Professional Repair', 'Quick Turnaround', 'Warranty on Repairs', 'Free Diagnosis'],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: 'All mobile brands supported',
      warranty: '90-day repair warranty',
      returnPolicy: 'Satisfaction guaranteed',
      shipping: 'Local pickup and delivery'
    }
  },

  // Fashion Forward Boutique Offers
  {
    title: 'Personal Styling Session - 25% Off',
    description: 'Professional styling consultation and wardrobe makeover',
    shopName: 'Fashion Forward Boutique',
    originalPrice: 200.00,
    discountedPrice: 150.00,
    discountPercentage: 25,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Personal Consultation', 'Wardrobe Analysis', 'Style Recommendations', 'Shopping Guide'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: '2-hour consultation session',
      warranty: 'Follow-up support included',
      returnPolicy: 'Satisfaction guaranteed',
      shipping: 'In-store service'
    }
  },

  // Digital Solutions Hub Offers
  {
    title: 'Website Development Package - 30% Off',
    description: 'Complete website development with SEO optimization',
    shopName: 'Digital Solutions Hub',
    originalPrice: 3000.00,
    discountedPrice: 2100.00,
    discountPercentage: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Custom Design', 'SEO Optimization', 'Mobile Responsive', '1 Year Support'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: '5 pages, contact forms, analytics',
      warranty: '1 year maintenance included',
      returnPolicy: 'Money-back guarantee',
      shipping: 'Digital delivery'
    }
  },

  // Gourmet Delights Offers
  {
    title: 'Cooking Masterclass - 40% Off',
    description: 'Learn gourmet cooking techniques from professional chef',
    shopName: 'Gourmet Delights',
    originalPrice: 150.00,
    discountedPrice: 90.00,
    discountPercentage: 40,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Professional Instruction', 'Recipe Book', 'Ingredients Included', 'Certificate'],
    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: '3-hour hands-on class',
      warranty: 'Lifetime recipe access',
      returnPolicy: 'Rescheduling available',
      shipping: 'In-store experience'
    }
  },

  // Craft Corner Studio Offers
  {
    title: 'Custom Jewelry Design - 20% Off',
    description: 'Personalized jewelry design and creation service',
    shopName: 'Craft Corner Studio',
    originalPrice: 500.00,
    discountedPrice: 400.00,
    discountPercentage: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Custom Design', 'Quality Materials', 'Personal Consultation', 'Lifetime Care'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: 'Sterling silver, gemstones included',
      warranty: 'Lifetime craftsmanship warranty',
      returnPolicy: 'Design approval before creation',
      shipping: 'Free shipping with insurance'
    }
  },

  // Village Pottery Studio Offers
  {
    title: 'Traditional Clay Pots - 30% Off',
    description: 'Authentic clay cooking pots and traditional utensils',
    shopName: 'Village Pottery Studio',
    originalPrice: 1200.00,
    discountedPrice: 840.00,
    discountPercentage: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Handcrafted by Artisans', 'Food-safe Clay', 'Traditional Designs', 'Free Shipping'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: 'Natural clay, traditional firing',
      warranty: '1 year craftsmanship warranty',
      returnPolicy: '30-day return policy',
      shipping: 'Free worldwide shipping'
    }
  },

  // Organic Farm Fresh Offers
  {
    title: 'Organic Vegetable Basket - 25% Off',
    description: 'Fresh organic vegetables delivered to your doorstep',
    shopName: 'Organic Farm Fresh',
    originalPrice: 800.00,
    discountedPrice: 600.00,
    discountPercentage: 25,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['100% Organic Certified', 'Fresh from Farm', 'Weekly Delivery', 'No Pesticides'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: 'Seasonal vegetables, 5kg basket',
      warranty: 'Freshness guarantee',
      returnPolicy: 'Same day replacement',
      shipping: 'Free local delivery'
    }
  },

  // Luxury Collections Offers
  {
    title: 'VIP Personal Shopping - 0% Off',
    description: 'Exclusive personal shopping experience with luxury brands',
    shopName: 'Luxury Collections',
    originalPrice: 1000.00,
    discountedPrice: 1000.00,
    discountPercentage: 0,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    features: ['Personal Stylist', 'Luxury Brands', 'Private Fitting', 'Concierge Service'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    productImages: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
    ],
    productInfo: {
      specifications: '4-hour personal shopping session',
      warranty: 'Lifetime VIP membership',
      returnPolicy: 'Flexible exchange policy',
      shipping: 'Complimentary delivery'
    }
  }
];

// Products - Real product items for shops
const products = [
  {
    name: 'iPhone 15',
    description: 'Latest Apple smartphone with advanced features',
    price: 999.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    shopName: 'TechTrend Mobile Store',
    categoryName: 'Electronics & Gadgets'
  },
  {
    name: 'Handmade Ceramic Mug',
    description: 'Beautifully crafted ceramic mug by local artisans',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    shopName: 'Craft Corner Studio',
    categoryName: 'Handicrafts & Artisans'
  },
  {
    name: 'Yoga Class Pass',
    description: 'One-month unlimited yoga classes',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    shopName: 'Wellness Zone',
    categoryName: 'Sports & Fitness'
  },
  {
    name: 'Organic Vegetable Basket',
    description: 'Fresh organic vegetables delivered weekly',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    shopName: 'Organic Farm Fresh',
    categoryName: 'Agricultural Products'
  },
  {
    name: 'Luxury Leather Wallet',
    description: 'Premium leather wallet with RFID protection',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    shopName: 'Luxury Collections',
    categoryName: 'Jewelry & Accessories'
  },
  {
    name: 'Personal Styling Session',
    description: 'Professional styling consultation and wardrobe makeover',
    price: 200.00,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    shopName: 'Fashion Forward Boutique',
    categoryName: 'Fashion & Apparel'
  },
  {
    name: 'Mobile Repair Service',
    description: 'Professional mobile repair services with quick turnaround',
    price: 100.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    shopName: 'TechTrend Mobile Store',
    categoryName: 'Electronics & Gadgets'
  },
  {
    name: 'Cooking Masterclass',
    description: 'Learn gourmet cooking techniques from a professional chef',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1504674900244-1b47f22f8f54?w=400&h=300&fit=crop',
    shopName: 'Gourmet Delights',
    categoryName: 'Food & Beverages'
  },
  {
    name: 'Custom Jewelry Design',
    description: 'Personalized jewelry design and creation service',
    price: 500.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    shopName: 'Craft Corner Studio',
    categoryName: 'Jewelry & Accessories'
  },
  {
    name: 'Traditional Clay Pots',
    description: 'Authentic clay cooking pots and traditional utensils',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    shopName: 'Village Pottery Studio',
    categoryName: 'Traditional Crafts'
  }
];

// Function to clear all data (for testing)
export const clearData = async () => {
  try {
    logger.info('Starting SuperMall data clearing process...');
    
    // Clear all collections
    const collections = ['categories', 'floors', 'shops', 'offers', 'product_updates', 'products'];
    let totalDeleted = 0;
    
    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        totalDeleted += querySnapshot.docs.length;
        logger.info(`Cleared ${querySnapshot.docs.length} documents from ${collectionName}`);
      } catch (error) {
        logger.error(`Error clearing ${collectionName}:`, error);
      }
    }
    
    logger.info(`SuperMall data clearing completed! Deleted ${totalDeleted} documents total.`);
    return {
      success: true,
      message: `SuperMall data has been cleared (${totalDeleted} documents deleted)`
    };
  } catch (error) {
    logger.error('Error clearing SuperMall data:', error);
    return {
      success: false,
      message: 'Failed to clear SuperMall data',
      error: error.message
    };
  }
};

// Function to check if data already exists
export const checkExistingData = async () => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const shopsSnapshot = await getDocs(collection(db, 'shops'));
    const offersSnapshot = await getDocs(collection(db, 'offers'));
    
    return {
      categories: categoriesSnapshot.docs.length,
      shops: shopsSnapshot.docs.length,
      offers: offersSnapshot.docs.length,
      hasData: categoriesSnapshot.docs.length > 0 || shopsSnapshot.docs.length > 0 || offersSnapshot.docs.length > 0
    };
  } catch (error) {
    logger.error('Error checking existing data:', error);
    return { categories: 0, shops: 0, offers: 0, hasData: false };
  }
};

// Function to seed data
export const seedData = async () => {
  try {
    logger.info('Starting SuperMall digital marketplace data seeding process...');

    // Check for existing data
    const existingData = await checkExistingData();
    if (existingData.hasData) {
      logger.warn('Data already exists in the database. Please clear existing data first.');
      return {
        success: false,
        message: `Data already exists! Found ${existingData.categories} categories, ${existingData.shops} shops, and ${existingData.offers} offers. Please clear data first.`,
        existingData
      };
    }

    // Add categories
    const categoryIds = {};
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      categoryIds[category.name] = docRef.id;
      logger.info(`Added category: ${category.name}`);
    }

    // Add floors (marketplace sections)
    const floorIds = {};
    for (const floor of floors) {
      const docRef = await addDoc(collection(db, 'floors'), {
        ...floor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      floorIds[floor.level] = docRef.id;
      logger.info(`Added marketplace section: ${floor.name}`);
    }

    // Add merchant counters with proper category and floor references
    const shopIds = {};
    for (const shop of shops) {
      const categoryId = categoryIds[shop.categoryName];
      const floorId = floorIds[shop.floorLevel];
      
      if (!categoryId) {
        logger.warn(`Category not found for shop ${shop.name}: ${shop.categoryName}`);
        continue;
      }
      
      if (!floorId) {
        logger.warn(`Floor not found for shop ${shop.name}: ${shop.floorLevel}`);
        continue;
      }
      
      const shopData = {
        ...shop,
        categoryId: categoryId,
        floorId: floorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'shops'), shopData);
      shopIds[shop.name] = docRef.id;
      logger.info(`Added merchant counter: ${shop.name} by ${shop.merchantName} (${shop.merchantType}) from ${shop.location}`);
    }

    // Add product offers with proper shop references
    for (const offer of offers) {
      const shopId = shopIds[offer.shopName];
      
      if (shopId) {
        const offerData = {
          ...offer,
          shopId: shopId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'offers'), offerData);
        logger.info(`Added product offer: ${offer.title}`);
      } else {
        logger.warn(`Shop not found for offer: ${offer.title}`);
      }
    }

    // Add products to Firestore
    const productIds = {};
    for (const product of products) {
      const shopId = shopIds[product.shopName];
      const categoryId = categoryIds[product.categoryName];

      if (!shopId) {
        logger.warn(`Shop not found for product ${product.name}: ${product.shopName}`);
        continue;
      }

      if (!categoryId) {
        logger.warn(`Category not found for product ${product.name}: ${product.categoryName}`);
        continue;
      }

      const productData = {
        ...product,
        shopId: shopId,
        categoryId: categoryId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      productIds[product.name] = docRef.id;
      logger.info(`Added product: ${product.name} from ${product.shopName}`);
    }

    // Link offers to products
    for (const offer of offers) {
      const productId = productIds[offer.shopName]; // Assuming shopName is the product name for offers
      if (productId) {
        const offerData = {
          ...offer,
          productId: productId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await addDoc(collection(db, 'offers'), offerData);
        logger.info(`Linked offer ${offer.title} to product ${offer.shopName}`);
      } else {
        logger.warn(`Product not found for offer ${offer.title}: ${offer.shopName}`);
      }
    }

    logger.info('SuperMall digital marketplace data seeding completed successfully!');
    return {
      success: true,
      message: 'SuperMall digital marketplace data has been added to the database',
      stats: {
        categories: categories.length,
        floors: floors.length,
        shops: shops.length,
        offers: offers.length
      }
    };

  } catch (error) {
    logger.error('Error seeding SuperMall data:', error);
    return {
      success: false,
      message: 'Failed to seed SuperMall data',
      error: error.message
    };
  }
}; 