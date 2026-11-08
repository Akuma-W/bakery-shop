import { Test, TestingModule } from '@nestjs/testing';

import { UploadsController } from '@/modules/uploads/uploads.controller';
import { UploadsService } from '@/modules/uploads/uploads.service';

describe('UploadsController', () => {
  let controller: UploadsController;

  const mockUploadsService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        {
          provide: UploadsService,
          useValue: mockUploadsService,
        },
      ],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should delegate upload to service and return response', async () => {
      const mockResult = {
        url: 'https://res.cloudinary.com/bakery_cloud/image/upload/bakery-shop/products/test.jpg',
        publicId: 'bakery-shop/products/test',
        originalName: 'croissant.jpg',
        mimetype: 'image/jpeg',
        size: 50000,
      };
      mockUploadsService.uploadImage.mockResolvedValue(mockResult);

      const fakeFile = {} as Express.Multer.File;
      const result = await controller.uploadImage(fakeFile);

      expect(mockUploadsService.uploadImage).toHaveBeenCalledWith(fakeFile);
      expect(result).toEqual({ file: mockResult });
    });
  });

  describe('deleteImage', () => {
    it('should delegate image removal to service and return success message', async () => {
      mockUploadsService.deleteImage.mockResolvedValue(undefined);

      const result = await controller.deleteImage('bakery-shop/products/test');

      expect(mockUploadsService.deleteImage).toHaveBeenCalledWith('bakery-shop/products/test');
      expect(result).toEqual({ message: 'Image deleted successfully' });
    });
  });
});
