import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class FilterProductDto {
  @ApiPropertyOptional({
    description: 'Keyword search query matching product name or description',
  })
  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category unique URL slug',
  })
  @IsOptional()
  @IsString({ message: 'Category slug must be a string' })
  categorySlug?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category ID',
  })
  @IsOptional()
  @IsString({ message: 'Category ID must be a string' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter products with minimum price (inclusive)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a valid number' })
  @Min(0, { message: 'minPrice cannot be negative' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter products with maximum price (inclusive)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a valid number' })
  @Min(0, { message: 'maxPrice cannot be negative' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter products that have inventory stock > 0',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'inStockOnly must be a boolean' })
  inStockOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filter products flagged as featured',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isFeatured must be a boolean' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Include inactive products in results (admin only)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'includeInactive must be a boolean' })
  includeInactive?: boolean;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page limit (maximum 50)',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit cannot exceed 50' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'price', 'name', 'stock'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'price', 'name', 'stock'], {
    message: 'sortBy must be one of: createdAt, price, name, stock',
  })
  sortBy?: 'createdAt' | 'price' | 'name' | 'stock' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortOrder must be either asc or desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
