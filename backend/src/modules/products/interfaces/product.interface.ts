import { Prisma } from '@prisma/client';

export interface ProductResponse {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: Prisma.Decimal | number;
  originalPrice: Prisma.Decimal | number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  allergens: string[];
  prepTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaginatedProductsResponse {
  products: ProductResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
