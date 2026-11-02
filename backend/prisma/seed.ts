import { PrismaClient, Role, DiscountType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/bakery_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Bắt đầu nạp dữ liệu mẫu (Seeding Bakery Shop)...');

  // 1. Mã hóa mật khẩu an toàn bằng bcrypt (12 rounds)
  const saltRounds = 12;
  const ownerPasswordHash = await bcrypt.hash('Admin123@', saltRounds);
  const customerPasswordHash = await bcrypt.hash('Customer123@', saltRounds);

  // 2. Tạo tài khoản Chủ tiệm (Owner)
  const owner = await prisma.user.upsert({
    where: { email: 'admin123@gmail.com' },
    update: {
      fullName: 'Trần Tuấn Phong',
      passwordHash: ownerPasswordHash,
      role: Role.OWNER,
    },
    create: {
      email: 'admin123@gmail.com',
      fullName: 'Trần Tuấn Phong',
      passwordHash: ownerPasswordHash,
      role: Role.OWNER,
      phone: '0901234567',
    },
  });
  console.log(`✅ Đã tạo tài khoản Chủ tiệm: ${owner.fullName} (${owner.email})`);

  // 3. Tạo tài khoản Khách hàng mẫu (Customer)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {
      fullName: 'Nguyễn Văn An',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
    },
    create: {
      email: 'customer@gmail.com',
      fullName: 'Nguyễn Văn An',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '0987654321',
      addresses: {
        create: {
          recipientName: 'Nguyễn Văn An',
          phone: '0987654321',
          street: '123 Đường Nguyễn Huệ',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'Hồ Chí Minh',
          isDefault: true,
        },
      },
    },
  });
  console.log(`✅ Đã tạo tài khoản Khách hàng: ${customer.fullName} (${customer.email})`);

  // 4. Tạo Danh mục sản phẩm (Categories)
  const categoriesData = [
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

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    categories[cat.slug] = createdCat.id;
  }
  console.log(`✅ Đã tạo ${Object.keys(categories).length} danh mục bánh.`);

  // 5. Tạo Sản phẩm bánh thực tế (Products)
  const productsData = [
    {
      name: 'Bánh Sourdough Lên Men Tự Nhiên',
      slug: 'sourdough-artisan-bread',
      categoryId: categories['artisan-breads'],
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
      categoryId: categories['artisan-breads'],
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
      categoryId: categories['sweet-pastries'],
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
      categoryId: categories['sweet-pastries'],
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
      categoryId: categories['cakes-desserts'],
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
      categoryId: categories['cakes-desserts'],
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
      categoryId: categories['beverages'],
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
      categoryId: categories['beverages'],
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

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        categoryId: prod.categoryId,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        images: prod.images,
        allergens: prod.allergens,
        prepTimeMinutes: prod.prepTimeMinutes,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        categoryId: prod.categoryId,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        images: prod.images,
        allergens: prod.allergens,
        prepTimeMinutes: prod.prepTimeMinutes,
      },
    });
  }
  console.log(`✅ Đã nạp ${productsData.length} sản phẩm bánh & đồ uống.`);

  // 6. Tạo Coupon mã giảm giá mẫu (Coupons)
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const couponsData = [
    {
      code: 'BANHMOI20',
      description: 'Giảm 20% cho đơn hàng đầu tiên (tối đa 50.000 VNĐ).',
      discountType: DiscountType.PERCENTAGE,
      discountValue: '20.00',
      minOrderValue: '100000.00',
      maxDiscountAmount: '50000.00',
      usageLimit: 100,
      usedCount: 0,
      userLimit: 1,
      startDate: now,
      endDate: thirtyDaysLater,
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Miễn phí giao hàng 25.000 VNĐ cho đơn từ 150.000 VNĐ.',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: '25000.00',
      minOrderValue: '150000.00',
      maxDiscountAmount: '25000.00',
      usageLimit: 500,
      usedCount: 0,
      userLimit: 2,
      startDate: now,
      endDate: thirtyDaysLater,
      isActive: true,
    },
  ];

  for (const cp of couponsData) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {
        description: cp.description,
        discountType: cp.discountType,
        discountValue: cp.discountValue,
        minOrderValue: cp.minOrderValue,
        maxDiscountAmount: cp.maxDiscountAmount,
        usageLimit: cp.usageLimit,
        userLimit: cp.userLimit,
        startDate: cp.startDate,
        endDate: cp.endDate,
        isActive: cp.isActive,
      },
      create: cp,
    });
  }
  console.log(`✅ Đã tạo ${couponsData.length} mã coupon khuyến mãi.`);

  console.log('🎉 Hoàn tất nạp dữ liệu mẫu thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi nạp dữ liệu mẫu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
