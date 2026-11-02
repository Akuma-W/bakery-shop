import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

import { usersData } from './data/users.data';
import { categoriesData } from './data/categories.data';
import { productsData } from './data/products.data';
import { couponsData } from './data/coupons.data';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/bakery_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seeds initial database records including owner, customer, categories, products, and coupons.
 */
async function main() {
  console.log('Starting database seeding...');

  // 1. Seed users with bcrypt hashed passwords
  const saltRounds = 12;
  for (const user of usersData) {
    const passwordHash = await bcrypt.hash(user.plainPassword, saltRounds);

    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        passwordHash,
        role: user.role,
        phone: user.phone,
      },
      create: {
        email: user.email,
        fullName: user.fullName,
        passwordHash,
        role: user.role,
        phone: user.phone,
        ...(user.address
          ? {
              addresses: {
                create: {
                  recipientName: user.address.recipientName,
                  phone: user.address.phone,
                  street: user.address.street,
                  ward: user.address.ward,
                  district: user.address.district,
                  city: user.address.city,
                  isDefault: user.address.isDefault,
                },
              },
            }
          : {}),
      },
    });

    console.log(`Seeded user: ${upsertedUser.fullName} (${upsertedUser.email}) - Role: ${upsertedUser.role}`);
  }

  // 2. Seed categories
  const categoryIdMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const upsertedCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    categoryIdMap[cat.slug] = upsertedCat.id;
  }
  console.log(`Seeded ${Object.keys(categoryIdMap).length} categories.`);

  // 3. Seed products
  for (const prod of productsData) {
    const categoryId = categoryIdMap[prod.categorySlug];
    if (!categoryId) {
      throw new Error(`Category slug '${prod.categorySlug}' not found for product '${prod.name}'`);
    }

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        categoryId,
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
        categoryId,
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
  console.log(`Seeded ${productsData.length} products.`);

  // 4. Seed coupons
  const now = new Date();
  for (const cp of couponsData) {
    const endDate = new Date(now.getTime() + cp.validityDays * 24 * 60 * 60 * 1000);

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
        startDate: now,
        endDate,
        isActive: cp.isActive,
      },
      create: {
        code: cp.code,
        description: cp.description,
        discountType: cp.discountType,
        discountValue: cp.discountValue,
        minOrderValue: cp.minOrderValue,
        maxDiscountAmount: cp.maxDiscountAmount,
        usageLimit: cp.usageLimit,
        usedCount: cp.usedCount,
        userLimit: cp.userLimit,
        startDate: now,
        endDate,
        isActive: cp.isActive,
      },
    });
  }
  console.log(`Seeded ${couponsData.length} coupons.`);

  console.log('Database seeding completed successfully.');
}

main()
  .catch((error) => {
    console.error('Error during database seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
