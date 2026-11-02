import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Tran Tuan Phong',
    description: 'Full name of the recipient',
  })
  @IsNotEmpty({ message: 'Recipient name cannot be empty' })
  @IsString({ message: 'Recipient name must be a string' })
  @MaxLength(100, { message: 'Recipient name cannot exceed 100 characters' })
  recipientName!: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Contact phone number of the recipient',
  })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @IsString({ message: 'Phone number must be a string' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phone!: string;

  @ApiProperty({
    example: '123 Nguyen Hue Street',
    description: 'Street address including house number',
  })
  @IsNotEmpty({ message: 'Street cannot be empty' })
  @IsString({ message: 'Street must be a string' })
  @MaxLength(255, { message: 'Street cannot exceed 255 characters' })
  street!: string;

  @ApiProperty({
    example: 'Ben Nghe Ward',
    description: 'Ward or commune name',
  })
  @IsNotEmpty({ message: 'Ward cannot be empty' })
  @IsString({ message: 'Ward must be a string' })
  @MaxLength(100, { message: 'Ward cannot exceed 100 characters' })
  ward!: string;

  @ApiProperty({
    example: 'District 1',
    description: 'District name',
  })
  @IsNotEmpty({ message: 'District cannot be empty' })
  @IsString({ message: 'District must be a string' })
  @MaxLength(100, { message: 'District cannot exceed 100 characters' })
  district!: string;

  @ApiProperty({
    example: 'Ho Chi Minh City',
    description: 'City or province name',
  })
  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, { message: 'City cannot exceed 100 characters' })
  city!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this address is designated as the default shipping address',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isDefault must be a boolean value' })
  isDefault?: boolean;
}
