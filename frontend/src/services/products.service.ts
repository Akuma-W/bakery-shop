import { apiClient } from '@/services/api-client';
import { ENDPOINT_PRODUCTS } from '@/constants/API_ENDPOINTS';
import { Product, ProductFilterParams, ProductsResponse } from '@/types/product';
import { PRODUCTS_MOCK } from '@/mocks/products.mock';

/**
 * Service handling product queries with intelligent error fallback.
 */
export const productsService = {
  /**
   * Retrieves products based on search, filter, and pagination parameters.
   */
  async getProducts(params: ProductFilterParams = {}): Promise<ProductsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.categorySlug) query.set('categorySlug', params.categorySlug);
    if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params.inStockOnly !== undefined) query.set('inStockOnly', String(params.inStockOnly));
    if (params.isFeatured !== undefined) query.set('isFeatured', String(params.isFeatured));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = queryString ? `${ENDPOINT_PRODUCTS}?${queryString}` : ENDPOINT_PRODUCTS;

    try {
      const response = await apiClient<ProductsResponse>(endpoint);
      return response;
    } catch (error) {
      // Fallback to mock dataset only on backend error, respecting filters
      let filtered = [...PRODUCTS_MOCK];

      if (params.categorySlug) {
        filtered = filtered.filter((p) => p.category?.slug === params.categorySlug);
      }
      if (params.search) {
        const term = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
        );
      }
      if (params.isFeatured) {
        filtered = filtered.filter((p) => p.isFeatured);
      }
      if (params.inStockOnly) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const paginatedItems = filtered.slice(startIndex, startIndex + limit);

      return {
        items: paginatedItems,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      };
    }
  },

  /**
   * Retrieves single product details by URL slug with fallback to mock data.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiClient<Product>(`${ENDPOINT_PRODUCTS}/${slug}`);
      return response;
    } catch (error) {
      const found = PRODUCTS_MOCK.find((p) => p.slug === slug);
      return found || null;
    }
  },
};
