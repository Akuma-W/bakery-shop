import { Category } from '@/types/category';

export const CATEGORIES_MOCK: Category[] = [
  {
    id: 'cat-1',
    name: 'Bánh Mì Artisan',
    slug: 'banh-mi-artisan',
    description: 'Bánh mì men tự nhiên Sourdough, Baguette Pháp nướng giòn rụm mỗi sáng.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    displayOrder: 1,
    isActive: true,
    productCount: 12,
  },
  {
    id: 'cat-2',
    name: 'Bánh Ngọt & Pastry',
    slug: 'banh-ngot-pastry',
    description: 'Croissant ngàn lớp thơm bơ Pháp, Pain au Chocolat, Danish trái cây tươi.',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    displayOrder: 2,
    isActive: true,
    productCount: 16,
  },
  {
    id: 'cat-3',
    name: 'Bánh Kem & Sinh Nhật',
    slug: 'banh-kem-sinh-nhat',
    description: 'Bánh kem tươi bắp, Red Velvet, Tiramisu Ý truyền thống thơm hương cà phê.',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    displayOrder: 3,
    isActive: true,
    productCount: 8,
  },
  {
    id: 'cat-4',
    name: 'Đồ Uống & Trà Tươi',
    slug: 'do-uong-tra-tuoi',
    description: 'Cà phê pha máy Specialty, Trà đào cam sả, Trà sữa Earl Grey nướng.',
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    displayOrder: 4,
    isActive: true,
    productCount: 10,
  },
];
