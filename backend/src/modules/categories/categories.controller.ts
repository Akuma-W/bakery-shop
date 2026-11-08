import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CategoriesService } from '@/modules/categories/categories.service';
import { CreateCategoryDto } from '@/modules/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/categories/dto/update-category.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Retrieves all product categories (public storefront view, or includes inactive for admins).
   */
  @Get()
  @ApiOperation({ summary: 'Get list of bakery categories' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Whether to include inactive categories (admin use)',
  })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories(
    @Query('includeInactive') includeInactive?: string,
  ) {
    const shouldIncludeInactive = includeInactive === 'true';
    const categories = await this.categoriesService.getCategories(shouldIncludeInactive);
    return { categories };
  }

  /**
   * Retrieves a single category by its SEO URL slug.
   */
  @Get(':slug')
  @ApiOperation({ summary: 'Get category details by slug' })
  @ApiResponse({ status: 200, description: 'Category details returned' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.getCategoryBySlug(slug);
    return { category };
  }

  /**
   * Creates a new product category (Owner only).
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category (Owner only)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(dto);
    return { category };
  }

  /**
   * Updates an existing product category (Owner only).
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing category (Owner only)' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category slug collision' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(id, dto);
    return { category };
  }

  /**
   * Deletes a category if it has no associated products (Owner only).
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (Owner only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete category containing products' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
