import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import { CreateCategoryDto } from '@/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/categories/dto/update-category.dto';
import { CategoryResponse } from '@/modules/categories/interfaces';
import { slugify } from '@/common/utils/slugify.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all categories, optionally including inactive ones for administrative management.
   */
  async getCategories(includeInactive = false): Promise<CategoryResponse[]> {
    return this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Retrieves a single category by its unique URL slug including associated products count.
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Retrieves a single category by its primary key ID.
   */
  async getCategoryById(id: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  /**
   * Creates a new bakery product category with an SEO-friendly slug.
   */
  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponse> {
    const generatedSlug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    const existing = await this.prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: generatedSlug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Updates category details and validates slug uniqueness if modified.
   */
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
    const existing = await this.getCategoryById(id);

    let updatedSlug = existing.slug;
    if (dto.slug) {
      updatedSlug = slugify(dto.slug);
    } else if (dto.name && dto.name !== existing.name && !dto.slug) {
      updatedSlug = slugify(dto.name);
    }

    if (updatedSlug !== existing.slug) {
      const slugConflict = await this.prisma.category.findUnique({
        where: { slug: updatedSlug },
      });

      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: updatedSlug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Deletes a category if it has no associated products to protect referential integrity.
   */
  async deleteCategory(id: string): Promise<{ message: string }> {
    await this.getCategoryById(id);

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category containing products. Reassign or remove products first.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
