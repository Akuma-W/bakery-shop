import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';

import { UploadsService } from '@/modules/uploads/uploads.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('UploadsService', () => {
  let service: UploadsService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'CLOUDINARY_CLOUD_NAME') return 'bakery_cloud';
      if (key === 'CLOUDINARY_API_KEY') return '123456789';
      if (key === 'CLOUDINARY_API_SECRET') return 'secret_key';
      if (key === 'CLOUDINARY_FOLDER') return 'bakery-shop/products';
      return null;
    }),
  };

  const createMockFile = (overrides?: Partial<Express.Multer.File>): Express.Multer.File => ({
    fieldname: 'file',
    originalname: 'croissant.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 50, // 50 KB
    buffer: Buffer.from('fake image content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cloudinary.config).toHaveBeenCalledWith({
      cloud_name: 'bakery_cloud',
      api_key: '123456789',
      api_secret: 'secret_key',
    });
  });

  describe('uploadImage', () => {
    it('should throw BadRequestException if no file is provided', async () => {
      await expect(service.uploadImage(null as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if file exceeds 5MB limit', async () => {
      const largeFile = createMockFile({
        size: 6 * 1024 * 1024, // 6 MB
      });

      await expect(service.uploadImage(largeFile)).rejects.toThrow(BadRequestException);
      await expect(service.uploadImage(largeFile)).rejects.toThrow(
        'File size exceeds the maximum allowed limit of 5MB',
      );
    });

    it('should throw BadRequestException for unsupported file MIME type or extension', async () => {
      const pdfFile = createMockFile({
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
      });

      await expect(service.uploadImage(pdfFile)).rejects.toThrow(BadRequestException);
      await expect(service.uploadImage(pdfFile)).rejects.toThrow(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      );
    });

    it('should throw InternalServerErrorException if Cloudinary credentials are missing', async () => {
      mockConfigService.get.mockReturnValueOnce(null); // missing cloud name

      const validFile = createMockFile();
      await expect(service.uploadImage(validFile)).rejects.toThrow(InternalServerErrorException);
    });

    it('should successfully stream upload image to Cloudinary and return response', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        const passThrough = new PassThrough();
        process.nextTick(() => {
          callback(null, {
            secure_url:
              'https://res.cloudinary.com/bakery_cloud/image/upload/v123/bakery-shop/products/croissant.jpg',
            public_id: 'bakery-shop/products/croissant',
          });
        });
        return passThrough;
      });

      const validFile = createMockFile();
      const result = await service.uploadImage(validFile);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        {
          folder: 'bakery-shop/products',
          resource_type: 'image',
        },
        expect.any(Function),
      );
      expect(result.originalName).toBe('croissant.jpg');
      expect(result.mimetype).toBe('image/jpeg');
      expect(result.publicId).toBe('bakery-shop/products/croissant');
      expect(result.url).toBe(
        'https://res.cloudinary.com/bakery_cloud/image/upload/v123/bakery-shop/products/croissant.jpg',
      );
    });

    it('should throw BadRequestException if Cloudinary upload stream reports an error', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        const passThrough = new PassThrough();
        process.nextTick(() => {
          callback(new Error('Cloudinary timeout error'), null);
        });
        return passThrough;
      });

      const validFile = createMockFile();
      await expect(service.uploadImage(validFile)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteImage', () => {
    it('should throw BadRequestException if publicId is missing', async () => {
      await expect(service.deleteImage('')).rejects.toThrow(BadRequestException);
    });

    it('should call cloudinary.uploader.destroy with publicId', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
        result: 'ok',
      });

      await service.deleteImage('bakery-shop/products/sample');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('bakery-shop/products/sample');
    });
  });
});
