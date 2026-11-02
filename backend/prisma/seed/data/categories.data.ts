export interface SeedCategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const categoriesData: SeedCategoryData[] = [
  {
    name: 'Bánh mì thủ công',
    slug: 'artisan-breads',
    description: 'Bánh mì lên men tự nhiên chậm, vỏ giòn ruột mềm thơm mùi lúa mì.',
    sortOrder: 1,
  },
  {
    name: 'Bánh ngọt & Pastry',
    slug: 'sweet-pastries',
    description: 'Các loại croissant nghìn lớp, bánh cuộn bơ Pháp thơm lừng nướng mới mỗi sáng.',
    sortOrder: 2,
  },
  {
    name: 'Bánh kem & Lạnh',
    slug: 'cakes-desserts',
    description: 'Bánh sinh nhật, tiramisu, mousse mát lạnh tinh tế cho các dịp đặc biệt.',
    sortOrder: 3,
  },
  {
    name: 'Đồ uống & Cà phê',
    slug: 'beverages',
    description: 'Cà phê pha máy hảo hạng và trà hoa quả kết hợp hoàn hảo cùng bánh nướng.',
    sortOrder: 4,
  },
];
