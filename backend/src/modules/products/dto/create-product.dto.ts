import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'cat-uuid-1234',
    description: 'Category ID the product belongs to',
  })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId!: string;

  @ApiProperty({
    example: 'Sourdough Artisan Bread',
    description: 'Product name',
  })
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  @IsString({ message: 'Product name must be a string' })
  @MaxLength(150, { message: 'Product name cannot exceed 150 characters' })
  name!: string;

  @ApiPropertyOptional({
    example: 'sourdough-artisan-bread',
    description: 'URL slug (auto-generated from name if omitted)',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(180, { message: 'Slug cannot exceed 180 characters' })
  slug?: string;

  @ApiProperty({
    example: 'Traditional naturally fermented sourdough bread with crispy crust',
    description: 'Detailed description of the product',
  })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description!: string;

  @ApiProperty({
    example: 65000,
    description: 'Product selling price in VND (stored as Decimal)',
  })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;

  @ApiPropertyOptional({
    example: 80000,
    description: 'Original list price before discount in VND (stored as Decimal)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Original price must be a valid number' })
  @Min(0, { message: 'Original price cannot be negative' })
  originalPrice?: number;

  @ApiPropertyOptional({
    example: 25,
    description: 'Available inventory stock quantity',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is active and visible for ordering',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is highlighted on the storefront',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isFeatured must be a boolean' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    example: ['https://images.unsplash.com/bread-1.jpg'],
    description: 'Array of product image URLs',
    default: [],
  })
  @IsOptional()
  @IsArray({ message: 'Images must be an array of image URLs' })
  @IsString({ each: true, message: 'Each image URL must be a string' })
  images?: string[];

  @ApiPropertyOptional({
    example: ['Gluten', 'Wheat'],
    description: 'Allergen warning tags',
    default: [],
  })
  @IsOptional()
  @IsArray({ message: 'Allergens must be an array of strings' })
  @IsString({ each: true, message: 'Each allergen tag must be a string' })
  allergens?: string[];

  @ApiPropertyOptional({
    example: 30,
    description: 'Preparation / baking lead time in minutes',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Preparation time must be an integer' })
  @Min(0, { message: 'Preparation time cannot be negative' })
  prepTimeMinutes?: number;
}
