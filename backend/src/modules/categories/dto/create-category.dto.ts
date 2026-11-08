import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Artisan Bread',
    description: 'Category display name',
  })
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(100, { message: 'Category name cannot exceed 100 characters' })
  name!: string;

  @ApiPropertyOptional({
    example: 'artisan-bread',
    description: 'Unique URL slug (auto-generated from name if omitted)',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(120, { message: 'Slug cannot exceed 120 characters' })
  slug?: string;

  @ApiPropertyOptional({
    example: 'Freshly baked daily traditional artisan breads',
    description: 'Detailed description of the category',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-bread.jpg',
    description: 'Banner or preview image URL for the category',
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order priority (ascending)',
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Sort order must be an integer' })
  @Min(0, { message: 'Sort order must be greater than or equal to 0' })
  sortOrder?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the category is active and visible in the storefront',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}
