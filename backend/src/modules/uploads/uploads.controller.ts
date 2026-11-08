import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { UploadsService } from '@/modules/uploads/uploads.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * Uploads an image file directly to Cloudinary storage (Owner only, max 5MB, JPEG/PNG/WebP).
   */
  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: 'Upload product/category image to Cloudinary (Owner only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image binary file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully to Cloudinary' })
  @ApiResponse({ status: 400, description: 'Invalid file format or file exceeds 5MB' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const uploaded = await this.uploadsService.uploadImage(file);
    return { file: uploaded };
  }

  /**
   * Removes an image from Cloudinary storage by its public ID (Owner only).
   */
  @Delete(':publicId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an image from Cloudinary by public ID (Owner only)' })
  @ApiResponse({ status: 200, description: 'Image deleted from Cloudinary successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Owner role required' })
  async deleteImage(@Param('publicId') publicId: string) {
    await this.uploadsService.deleteImage(publicId);
    return { message: 'Image deleted successfully' };
  }
}
