import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { ProductsService } from '@/modules/products/products.service';
import { PrismaService } from '@/database/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct = {
    id: 'prod-uuid-1',
    categoryId: 'cat-uuid-1',
    name: 'Bánh Mì Sourdough',
    slug: 'banh-mi-sourdough',
    description: 'Bánh mì men tự nhiên thơm giòn',
    price: new Prisma.Decimal(65000),
    originalPrice: new Prisma.Decimal(80000),
    stock: 20,
    isActive: true,
    isFeatured: true,
    images: ['https://example.com/sourdough.jpg'],
    allergens: ['Gluten', 'Wheat'],
    prepTimeMinutes: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: 'cat-uuid-1',
      name: 'Bánh Mì',
      slug: 'banh-mi',
    },
  };

  const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Bánh Mì',
    slug: 'banh-mi',
  };

  const mockPrismaService: {
    product: Record<string, jest.Mock>;
    category: Record<string, jest.Mock>;
    orderItem: Record<string, jest.Mock>;
    $transaction: jest.Mock;
  } = {
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    orderItem: {
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return paginated active products by default', async () => {
      mockPrismaService.$transaction.mockResolvedValue([1, [mockProduct]]);

      const result = await service.getProducts({});

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result.products).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should handle search, categorySlug, price and inStockOnly filters', async () => {
      mockPrismaService.$transaction.mockResolvedValue([1, [mockProduct]]);

      const result = await service.getProducts({
        search: 'sourdough',
        categorySlug: 'banh-mi',
        minPrice: 50000,
        maxPrice: 100000,
        inStockOnly: true,
        isFeatured: true,
        page: 2,
        limit: 5,
      });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
    });
  });

  describe('getProductBySlug', () => {
    it('should return product when matching slug is found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getProductBySlug('banh-mi-sourdough');

      expect(result.name).toBe('Bánh Mì Sourdough');
      expect(result.slug).toBe('banh-mi-sourdough');
    });

    it('should throw NotFoundException if slug not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.getProductBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createProduct', () => {
    const createDto = {
      categoryId: 'cat-uuid-1',
      name: 'Bánh Mì Sourdough',
      description: 'Bánh mì men tự nhiên',
      price: 65000,
      originalPrice: 80000,
      stock: 20,
    };

    it('should create product with auto-generated slug from Vietnamese name', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createDto);

      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-uuid-1' },
      });
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { slug: 'banh-mi-sourdough' },
      });
      expect(mockPrismaService.product.create).toHaveBeenCalled();
      expect(result.name).toBe('Bánh Mì Sourdough');
    });

    it('should throw NotFoundException if category does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.createProduct(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.createProduct(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update product details successfully', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        name: 'Bánh Mì Cải Tiến',
      });

      const result = await service.updateProduct('prod-uuid-1', {
        name: 'Bánh Mì Cải Tiến',
      });

      expect(result.name).toBe('Bánh Mì Cải Tiến');
    });

    it('should throw NotFoundException if category in update does not exist', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProduct('prod-uuid-1', {
          categoryId: 'invalid-cat-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStock', () => {
    it('should update stock quantity', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        stock: 50,
      });

      const result = await service.updateStock('prod-uuid-1', 50);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-uuid-1' },
        data: { stock: 50 },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });
      expect(result.stock).toBe(50);
    });
  });

  describe('toggleActive', () => {
    it('should toggle active status from true to false', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        isActive: false,
      });

      const result = await service.toggleActive('prod-uuid-1');

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-uuid-1' },
        data: { isActive: false },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product when no order history exists', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.orderItem.count.mockResolvedValue(0);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct('prod-uuid-1');

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: 'prod-uuid-1' },
      });
      expect(result.message).toBe('Product deleted successfully');
    });

    it('should throw BadRequestException when product has previous orders', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.orderItem.count.mockResolvedValue(5);

      await expect(service.deleteProduct('prod-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
