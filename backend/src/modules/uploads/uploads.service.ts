import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as path from 'path';
import { Readable } from 'stream';

import { UploadedFileResponse } from '@/modules/uploads/interfaces';

@Injectable()
export class UploadsService {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB limit
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Validates and streams an uploaded image to Cloudinary storage, returning public secure URL.
   */
  async uploadImage(file: Express.Multer.File): Promise<UploadedFileResponse> {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds the maximum allowed limit of 5MB');
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const isMimeAllowed = this.allowedMimeTypes.includes(file.mimetype);
    const isExtAllowed = this.allowedExtensions.includes(extension);

    if (!isMimeAllowed || !isExtAllowed) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    }

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary service is not configured properly in environment variables',
      );
    }

    const folder = this.configService.get<string>('CLOUDINARY_FOLDER') || 'bakery-shop/products';

    return new Promise<UploadedFileResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                `Failed to upload image to Cloudinary: ${error?.message || 'Unknown error'}`,
              ),
            );
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an image from Cloudinary storage by its public ID.
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) {
      throw new BadRequestException('Image public ID is required');
    }

    await cloudinary.uploader.destroy(publicId);
  }
}
