import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from '@/modules/categories/categories.controller';
import { CategoriesService } from '@/modules/categories/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Bánh Mì Thủ Công',
    slug: 'banh-mi-thu-cong',
    description: 'Bánh mì nướng tươi mỗi ngày',
    imageUrl: 'https://example.com/bread.jpg',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { products: 2 },
  };

  const mockCategoriesService = {
    getCategories: jest.fn(),
    getCategoryBySlug: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return categories list wrapped in an object', async () => {
      mockCategoriesService.getCategories.mockResolvedValue([mockCategory]);

      const result = await controller.getCategories(undefined);

      expect(mockCategoriesService.getCategories).toHaveBeenCalledWith(false);
      expect(result).toEqual({ categories: [mockCategory] });
    });

    it('should pass includeInactive true when query parameter is "true"', async () => {
      mockCategoriesService.getCategories.mockResolvedValue([mockCategory]);

      const result = await controller.getCategories('true');

      expect(mockCategoriesService.getCategories).toHaveBeenCalledWith(true);
      expect(result).toEqual({ categories: [mockCategory] });
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category details by slug', async () => {
      mockCategoriesService.getCategoryBySlug.mockResolvedValue(mockCategory);

      const result = await controller.getCategoryBySlug('banh-mi-thu-cong');

      expect(mockCategoriesService.getCategoryBySlug).toHaveBeenCalledWith('banh-mi-thu-cong');
      expect(result).toEqual({ category: mockCategory });
    });
  });

  describe('createCategory', () => {
    it('should create and return the new category', async () => {
      const createDto = {
        name: 'Bánh Mì Thủ Công',
        description: 'Bánh mì tươi',
      };
      mockCategoriesService.createCategory.mockResolvedValue(mockCategory);

      const result = await controller.createCategory(createDto);

      expect(mockCategoriesService.createCategory).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ category: mockCategory });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the updated category', async () => {
      const updateDto = { name: 'Bánh Mì Đặc Biệt' };
      mockCategoriesService.updateCategory.mockResolvedValue({
        ...mockCategory,
        name: 'Bánh Mì Đặc Biệt',
      });

      const result = await controller.updateCategory('cat-uuid-1', updateDto);

      expect(mockCategoriesService.updateCategory).toHaveBeenCalledWith('cat-uuid-1', updateDto);
      expect(result.category.name).toBe('Bánh Mì Đặc Biệt');
    });
  });

  describe('deleteCategory', () => {
    it('should call service deleteCategory and return success response', async () => {
      mockCategoriesService.deleteCategory.mockResolvedValue({
        message: 'Category deleted successfully',
      });

      const result = await controller.deleteCategory('cat-uuid-1');

      expect(mockCategoriesService.deleteCategory).toHaveBeenCalledWith('cat-uuid-1');
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });
  });
});
