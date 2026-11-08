import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesService } from '@/modules/categories/categories.service';
import { PrismaService } from '@/database/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

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

  const mockPrismaService: {
    category: Record<string, jest.Mock>;
    product: Record<string, jest.Mock>;
  } = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return only active categories by default', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.getCategories();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: { _count: { select: { products: true } } },
      });
      expect(result).toEqual([mockCategory]);
    });

    it('should return all categories including inactive when requested', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.getCategories(true);

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: { _count: { select: { products: true } } },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category when matching slug is found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getCategoryBySlug('banh-mi-thu-cong');

      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { slug: 'banh-mi-thu-cong' },
        include: { _count: { select: { products: true } } },
      });
    });

    it('should throw NotFoundException when category slug does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryBySlug('non-existent-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCategoryById', () => {
    it('should return category by ID', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('cat-uuid-1');

      expect(result.id).toBe('cat-uuid-1');
    });

    it('should throw NotFoundException if category ID does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCategory', () => {
    it('should automatically generate slug from Vietnamese name when slug is omitted', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory({
        name: 'Bánh Mì Thủ Công',
        description: 'Bánh mì nướng tươi',
      });

      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { slug: 'banh-mi-thu-cong' },
      });
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Bánh Mì Thủ Công',
          slug: 'banh-mi-thu-cong',
          description: 'Bánh mì nướng tươi',
          imageUrl: undefined,
          sortOrder: 0,
          isActive: true,
        },
        include: { _count: { select: { products: true } } },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      await expect(
        service.createCategory({
          name: 'Bánh Mì Thủ Công',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateCategory', () => {
    it('should update category details successfully', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue({
        ...mockCategory,
        name: 'Bánh Mì Đặc Biệt',
      });

      const result = await service.updateCategory('cat-uuid-1', {
        name: 'Bánh Mì Đặc Biệt',
      });

      expect(result.name).toBe('Bánh Mì Đặc Biệt');
    });

    it('should throw ConflictException if updated slug conflicts with another category', async () => {
      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce({ id: 'another-cat-uuid', slug: 'banh-ngot' });

      await expect(
        service.updateCategory('cat-uuid-1', {
          slug: 'banh-ngot',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category if it has zero associated products', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(0);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      const result = await service.deleteCategory('cat-uuid-1');

      expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-uuid-1' },
      });
      expect(result.message).toBe('Category deleted successfully');
    });

    it('should throw BadRequestException if category still contains products', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(3);

      await expect(service.deleteCategory('cat-uuid-1')).rejects.toThrow(BadRequestException);
    });
  });
});
