import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    example: 50,
    description: 'Updated inventory stock quantity',
  })
  @IsNotEmpty({ message: 'Stock cannot be empty' })
  @Type(() => Number)
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock!: number;
}
