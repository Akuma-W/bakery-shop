import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { ProductsService } from '@/modules/products/products.service';
import { CreateProductDto } from '@/modules/products/dto/create-product.dto';
import { FilterProductDto } from '@/modules/products/dto/filter-product.dto';
import { UpdateProductDto } from '@/modules/products/dto/update-product.dto';
import { UpdateStockDto } from '@/modules/products/dto/update-stock.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieves paginated bakery products with flexible filtering and search criteria.
   */
  @Get()
  @ApiOperation({ summary: 'Get list of bakery products with filter and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of products returned' })
  async getProducts(@Query() filter: FilterProductDto) {
    return this.productsService.getProducts(filter);
  }

  /**
   * Retrieves detailed information of a single product by its unique URL slug.
   */
  @Get(':slug')
  @ApiOperation({ summary: 'Get product details by URL slug' })
  @ApiResponse({ status: 200, description: 'Product details returned' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductBySlug(@Param('slug') slug: string) {
    const product = await this.productsService.getProductBySlug(slug);
    return { product };
  }

  /**
   * Creates a new bakery product (Owner only).
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product (Owner only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Product slug conflict' })
  async createProduct(@Body() dto: CreateProductDto) {
    const product = await this.productsService.createProduct(dto);
    return { product };
  }

  /**
   * Updates an existing bakery product (Owner only).
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product (Owner only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Product or Category not found' })
  @ApiResponse({ status: 409, description: 'Product slug conflict' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productsService.updateProduct(id, dto);
    return { product };
  }

  /**
   * Quickly updates inventory stock quantity for a product (Owner only).
   */
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quickly update product stock quantity (Owner only)' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ) {
    const product = await this.productsService.updateStock(id, dto.stock);
    return { product };
  }

  /**
   * Quick toggle on/off switch for product active selling status (Owner only).
   */
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle product active/inactive state (Owner only)' })
  @ApiResponse({ status: 200, description: 'Active state toggled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleActive(@Param('id') id: string) {
    const product = await this.productsService.toggleActive(id);
    return { product };
  }

  /**
   * Deletes a product if it has no previous order history (Owner only).
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (Owner only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete product with existing orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
