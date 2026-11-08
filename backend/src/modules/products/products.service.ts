import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { FilterProductDto } from '@/modules/products/dto/filter-product.dto';
import { UpdateProductDto } from '@/modules/products/dto/update-product.dto';
import { PaginatedProductsResponse, ProductResponse } from '@/modules/products/interfaces';
import { slugify } from '@/common/utils/slugify.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves paginated products with flexible search, category, price, and stock filters.
   */
  async getProducts(filter: FilterProductDto = {}): Promise<PaginatedProductsResponse> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (!filter.includeInactive) {
      where.isActive = true;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.categorySlug) {
      where.category = { slug: filter.categorySlug };
    }

    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filter.maxPrice);
      }
    }

    if (filter.inStockOnly) {
      where.stock = { gt: 0 };
    }

    if (filter.isFeatured) {
      where.isFeatured = true;
    }

    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';

    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    const formattedProducts = products.map((prod) => this.formatProduct(prod));

    return {
      products: formattedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves a single product by its unique URL slug.
   */
  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  /**
   * Retrieves a single product by its primary key ID.
   */
  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  /**
   * Creates a new bakery product with auto-generated slug and Decimal pricing.
   */
  async createProduct(dto: CreateProductDto): Promise<ProductResponse> {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const generatedSlug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    const existing = await this.prisma.product.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      throw new ConflictException('Product with this slug already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        slug: generatedSlug,
        description: dto.description,
        price: new Prisma.Decimal(dto.price),
        originalPrice:
          dto.originalPrice !== undefined ? new Prisma.Decimal(dto.originalPrice) : null,
        stock: dto.stock ?? 0,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        images: dto.images ?? [],
        allergens: dto.allergens ?? [],
        prepTimeMinutes: dto.prepTimeMinutes ?? 0,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.formatProduct(product);
  }

  /**
   * Updates product details, verifying category reference and slug uniqueness if modified.
   */
  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    const existing = await this.getProductById(id);

    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    let updatedSlug = existing.slug;
    if (dto.slug) {
      updatedSlug = slugify(dto.slug);
    } else if (dto.name && dto.name !== existing.name && !dto.slug) {
      updatedSlug = slugify(dto.name);
    }

    if (updatedSlug !== existing.slug) {
      const slugConflict = await this.prisma.product.findUnique({
        where: { slug: updatedSlug },
      });

      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    const data: Prisma.ProductUpdateInput = {
      name: dto.name,
      slug: updatedSlug,
      description: dto.description,
      stock: dto.stock,
      isActive: dto.isActive,
      isFeatured: dto.isFeatured,
      images: dto.images,
      allergens: dto.allergens,
      prepTimeMinutes: dto.prepTimeMinutes,
    };

    if (dto.price !== undefined) {
      data.price = new Prisma.Decimal(dto.price);
    }

    if (dto.originalPrice !== undefined) {
      data.originalPrice =
        dto.originalPrice !== null ? new Prisma.Decimal(dto.originalPrice) : null;
    }

    if (dto.categoryId) {
      data.category = { connect: { id: dto.categoryId } };
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.formatProduct(updated);
  }

  /**
   * Quickly updates stock inventory quantity for kitchen/counter management.
   */
  async updateStock(id: string, stock: number): Promise<ProductResponse> {
    await this.getProductById(id);

    const updated = await this.prisma.product.update({
      where: { id },
      data: { stock },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.formatProduct(updated);
  }

  /**
   * Quickly toggles product active status on or off for instant storefront visibility.
   */
  async toggleActive(id: string): Promise<ProductResponse> {
    const existing = await this.getProductById(id);

    const updated = await this.prisma.product.update({
      where: { id },
      data: { isActive: !existing.isActive },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return this.formatProduct(updated);
  }

  /**
   * Deletes a product if it has never been ordered, protecting customer purchase history.
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    await this.getProductById(id);

    const orderCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderCount > 0) {
      throw new BadRequestException(
        'Cannot delete product that has order history. Deactivate it instead.',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  /**
   * Formats raw Prisma product model to ProductResponse ensuring images and allergens are arrays.
   */
  private formatProduct(product: any): ProductResponse {
    return {
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      images: Array.isArray(product.images) ? (product.images as string[]) : [],
      allergens: Array.isArray(product.allergens) ? (product.allergens as string[]) : [],
      prepTimeMinutes: product.prepTimeMinutes,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category,
    };
  }
}
