import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { ProductsController } from '@/modules/products/products.controller';
import { ProductsService } from '@/modules/products/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

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

  const mockProductsService = {
    getProducts: jest.fn(),
    getProductBySlug: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    updateStock: jest.fn(),
    toggleActive: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return paginated products from service', async () => {
      const paginatedResult = {
        products: [mockProduct],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
      mockProductsService.getProducts.mockResolvedValue(paginatedResult);

      const result = await controller.getProducts({});

      expect(mockProductsService.getProducts).toHaveBeenCalledWith({});
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('getProductBySlug', () => {
    it('should return product details wrapped in an object', async () => {
      mockProductsService.getProductBySlug.mockResolvedValue(mockProduct);

      const result = await controller.getProductBySlug('banh-mi-sourdough');

      expect(mockProductsService.getProductBySlug).toHaveBeenCalledWith('banh-mi-sourdough');
      expect(result).toEqual({ product: mockProduct });
    });
  });

  describe('createProduct', () => {
    it('should create and return the new product', async () => {
      const createDto = {
        categoryId: 'cat-uuid-1',
        name: 'Bánh Mì Sourdough',
        description: 'Bánh mì men tự nhiên',
        price: 65000,
      };
      mockProductsService.createProduct.mockResolvedValue(mockProduct);

      const result = await controller.createProduct(createDto);

      expect(mockProductsService.createProduct).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ product: mockProduct });
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const updateDto = { name: 'Bánh Mì Mới' };
      mockProductsService.updateProduct.mockResolvedValue({
        ...mockProduct,
        name: 'Bánh Mì Mới',
      });

      const result = await controller.updateProduct('prod-uuid-1', updateDto);

      expect(mockProductsService.updateProduct).toHaveBeenCalledWith('prod-uuid-1', updateDto);
      expect(result.product.name).toBe('Bánh Mì Mới');
    });
  });

  describe('updateStock', () => {
    it('should update stock quantity and return updated product', async () => {
      mockProductsService.updateStock.mockResolvedValue({
        ...mockProduct,
        stock: 100,
      });

      const result = await controller.updateStock('prod-uuid-1', { stock: 100 });

      expect(mockProductsService.updateStock).toHaveBeenCalledWith('prod-uuid-1', 100);
      expect(result.product.stock).toBe(100);
    });
  });

  describe('toggleActive', () => {
    it('should toggle active status and return updated product', async () => {
      mockProductsService.toggleActive.mockResolvedValue({
        ...mockProduct,
        isActive: false,
      });

      const result = await controller.toggleActive('prod-uuid-1');

      expect(mockProductsService.toggleActive).toHaveBeenCalledWith('prod-uuid-1');
      expect(result.product.isActive).toBe(false);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and return confirmation message', async () => {
      mockProductsService.deleteProduct.mockResolvedValue({
        message: 'Product deleted successfully',
      });

      const result = await controller.deleteProduct('prod-uuid-1');

      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith('prod-uuid-1');
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });
  });
});
