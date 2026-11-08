import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  images: string[];
  allergens?: string[] | null;
  prepTimeMinutes?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}
