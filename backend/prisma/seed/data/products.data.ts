export interface SeedProductData {
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  price: string;
  originalPrice: string | null;
  stock: number;
  isFeatured: boolean;
  images: string[];
  allergens: string[];
  prepTimeMinutes: number;
}

export const productsData: SeedProductData[] = [
  {
    name: 'Bánh Sourdough Lên Men Tự Nhiên',
    slug: 'sourdough-artisan-bread',
    categorySlug: 'artisan-breads',
    description:
      'Bánh mì men tự nhiên ủ chậm 24 giờ, lớp vỏ giòn rụm màu hổ phách, ruột dai mềm vị chua thanh tinh tế.',
    price: '85000.00',
    originalPrice: '95000.00',
    stock: 30,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Gluten'],
    prepTimeMinutes: 30,
  },
  {
    name: 'Bánh Mì Hoa Cúc Brioche Pháp',
    slug: 'french-brioche-bread',
    categorySlug: 'artisan-breads',
    description:
      'Bánh mì bơ hoa cúc truyền thống Pháp, dẻo thơm từng thớ bánh, phủ hạt hạnh nhân lát giòn rụm.',
    price: '120000.00',
    originalPrice: null,
    stock: 25,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Gluten', 'Trứng', 'Sữa', 'Hạt hạnh nhân'],
    prepTimeMinutes: 20,
  },
  {
    name: 'Croissant Bơ Pháp Thượng Hạng',
    slug: 'butter-croissant',
    categorySlug: 'sweet-pastries',
    description:
      'Bánh sừng bò nghìn lớp làm từ bơ nhập khẩu Normandy Pháp, xốp phồng thơm nức mũi.',
    price: '45000.00',
    originalPrice: '50000.00',
    stock: 50,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Gluten', 'Trứng', 'Sữa'],
    prepTimeMinutes: 15,
  },
  {
    name: 'Pain au Chocolat (Bánh Sừng Bò Socola)',
    slug: 'pain-au-chocolat',
    categorySlug: 'sweet-pastries',
    description:
      'Bánh pastry nghìn lớp bọc 2 thanh socola đen nguyên chất 65%, ngọt đắng hài hòa.',
    price: '52000.00',
    originalPrice: null,
    stock: 40,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Gluten', 'Trứng', 'Sữa', 'Đậu nành'],
    prepTimeMinutes: 15,
  },
  {
    name: 'Bánh Tiramisu Hộp Cổ Điển Ý',
    slug: 'classic-italian-tiramisu',
    categorySlug: 'cakes-desserts',
    description:
      'Phô mai Mascarpone béo ngậy xen kẽ bánh sampa thấm đẫm cà phê espresso và bột cacao nguyên chất.',
    price: '89000.00',
    originalPrice: '99000.00',
    stock: 20,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Trứng', 'Sữa', 'Caffeine'],
    prepTimeMinutes: 10,
  },
  {
    name: 'Bánh Mousse Việt Quất Tươi',
    slug: 'blueberry-mousse-cake',
    categorySlug: 'cakes-desserts',
    description:
      'Mousse kem sữa chua thanh mát kết hợp sốt việt quất tươi mọng nước, đế bánh quy giòn.',
    price: '79000.00',
    originalPrice: null,
    stock: 18,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Sữa', 'Gelatin'],
    prepTimeMinutes: 10,
  },
  {
    name: 'Cà Phê Cold Brew Muối Biển',
    slug: 'sea-salt-cold-brew',
    categorySlug: 'beverages',
    description:
      'Cà phê Arabica Cầu Đất ủ lạnh 18 tiếng, phủ lớp kem mặn bồng bềnh mịn màng.',
    price: '55000.00',
    originalPrice: null,
    stock: 100,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: ['Sữa', 'Caffeine'],
    prepTimeMinutes: 5,
  },
  {
    name: 'Trà Đào Cam Sả Tươi Mát',
    slug: 'peach-orange-lemongrass-tea',
    categorySlug: 'beverages',
    description:
      'Trà lài ủ đậm kết hợp nước cam vắt tươi, sả thơm thanh mát cùng miếng đào ngâm giòn ngọt.',
    price: '49000.00',
    originalPrice: '55000.00',
    stock: 100,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    ],
    allergens: [],
    prepTimeMinutes: 5,
  },
];
