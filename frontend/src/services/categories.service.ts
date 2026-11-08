import { apiClient } from '@/services/api-client';
import { ENDPOINT_CATEGORIES } from '@/constants/API_ENDPOINTS';
import { Category } from '@/types/category';
import { CATEGORIES_MOCK } from '@/mocks/categories.mock';

/**
 * Service handling category data queries with intelligent error fallback.
 */
export const categoriesService = {
  /**
   * Fetches active categories from backend, falling back to mock data only if request fails.
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient<Category[]>(ENDPOINT_CATEGORIES);
      return response;
    } catch (error) {
      // Fallback to mock data only upon network or server error
      return CATEGORIES_MOCK;
    }
  },
};
