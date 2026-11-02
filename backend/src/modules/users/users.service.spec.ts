import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';
import { PrismaService } from '@/database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockAddress = {
    id: 'addr-uuid-1',
    userId: 'user-uuid-1',
    recipientName: 'Nguyen Van An',
    phone: '0987654321',
    street: '123 Nguyen Hue',
    ward: 'Ben Nghe',
    district: 'District 1',
    city: 'Ho Chi Minh City',
    isDefault: true,
    createdAt: new Date(),
  };

  const mockPrismaService: {
    address: Record<string, jest.Mock>;
    $transaction: jest.Mock;
  } = {
    address: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback(mockPrismaService);
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAddresses', () => {
    it('should return list of addresses for the authenticated user', async () => {
      mockPrismaService.address.findMany.mockResolvedValue([mockAddress]);

      const result = await service.getAddresses('user-uuid-1');

      expect(mockPrismaService.address.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1' },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('addr-uuid-1');
    });
  });

  describe('getAddressById', () => {
    it('should return address if it exists and belongs to the user', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      const result = await service.getAddressById('user-uuid-1', 'addr-uuid-1');

      expect(result.id).toBe('addr-uuid-1');
      expect(result.userId).toBe('user-uuid-1');
    });

    it('should throw NotFoundException if address does not exist', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(null);

      await expect(service.getAddressById('user-uuid-1', 'non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if address belongs to another user (isolation guarantee)', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      await expect(service.getAddressById('different-user-id', 'addr-uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createAddress', () => {
    const createDto = {
      recipientName: 'Nguyen Van An',
      phone: '0987654321',
      street: '123 Nguyen Hue',
      ward: 'Ben Nghe',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      isDefault: false,
    };

    it('should automatically set isDefault to true if this is the user first address', async () => {
      mockPrismaService.address.count.mockResolvedValue(0);
      mockPrismaService.address.create.mockResolvedValue({
        ...mockAddress,
        isDefault: true,
      });

      const result = await service.createAddress('user-uuid-1', createDto);

      expect(mockPrismaService.address.count).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1' },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1', isDefault: true },
        data: { isDefault: false },
      });
      expect(result.isDefault).toBe(true);
    });

    it('should create address as non-default if user already has addresses and isDefault is false', async () => {
      mockPrismaService.address.count.mockResolvedValue(2);
      mockPrismaService.address.create.mockResolvedValue({
        ...mockAddress,
        isDefault: false,
      });

      const result = await service.createAddress('user-uuid-1', createDto);

      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
      expect(mockPrismaService.address.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          userId: 'user-uuid-1',
          isDefault: false,
        },
      });
      expect(result.isDefault).toBe(false);
    });

    it('should reset previous default addresses when creating a new address with isDefault true', async () => {
      mockPrismaService.address.count.mockResolvedValue(2);
      mockPrismaService.address.create.mockResolvedValue({
        ...mockAddress,
        isDefault: true,
      });

      const result = await service.createAddress('user-uuid-1', {
        ...createDto,
        isDefault: true,
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1', isDefault: true },
        data: { isDefault: false },
      });
      expect(result.isDefault).toBe(true);
    });
  });

  describe('updateAddress', () => {
    it('should update address fields when owner requests', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);
      mockPrismaService.address.update.mockResolvedValue({
        ...mockAddress,
        recipientName: 'Updated Name',
      });

      const result = await service.updateAddress('user-uuid-1', 'addr-uuid-1', {
        recipientName: 'Updated Name',
      });

      expect(result.recipientName).toBe('Updated Name');
    });

    it('should throw NotFoundException when updating an address belonging to another user', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      await expect(
        service.updateAddress('different-user-id', 'addr-uuid-1', {
          recipientName: 'Updated Name',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reset other defaults in a transaction if updated to isDefault true', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue({
        ...mockAddress,
        isDefault: false,
      });
      mockPrismaService.address.update.mockResolvedValue({
        ...mockAddress,
        isDefault: true,
      });

      const result = await service.updateAddress('user-uuid-1', 'addr-uuid-1', {
        isDefault: true,
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1', isDefault: true },
        data: { isDefault: false },
      });
      expect(result.isDefault).toBe(true);
    });
  });

  describe('setDefaultAddress', () => {
    it('should mark address as default in transaction and unset previous defaults', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);
      mockPrismaService.address.update.mockResolvedValue({
        ...mockAddress,
        isDefault: true,
      });

      const result = await service.setDefaultAddress('user-uuid-1', 'addr-uuid-1');

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-1', isDefault: true },
        data: { isDefault: false },
      });
      expect(result.isDefault).toBe(true);
    });

    it('should throw NotFoundException if address belongs to another user', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      await expect(service.setDefaultAddress('different-user-id', 'addr-uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAddress', () => {
    it('should delete address directly if not default', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue({
        ...mockAddress,
        isDefault: false,
      });
      mockPrismaService.address.delete.mockResolvedValue(mockAddress);

      const result = await service.deleteAddress('user-uuid-1', 'addr-uuid-1');

      expect(mockPrismaService.address.delete).toHaveBeenCalledWith({
        where: { id: 'addr-uuid-1' },
      });
      expect(result.message).toBe('Address deleted successfully');
    });

    it('should delete address in transaction and promote remaining address to default if deleted was default', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue({
        ...mockAddress,
        isDefault: true,
      });
      mockPrismaService.address.findFirst.mockResolvedValue({
        id: 'addr-uuid-2',
        userId: 'user-uuid-1',
      });
      mockPrismaService.address.delete.mockResolvedValue(mockAddress);
      mockPrismaService.address.update.mockResolvedValue({
        id: 'addr-uuid-2',
        isDefault: true,
      });

      const result = await service.deleteAddress('user-uuid-1', 'addr-uuid-1');

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.address.delete).toHaveBeenCalledWith({
        where: { id: 'addr-uuid-1' },
      });
      expect(mockPrismaService.address.update).toHaveBeenCalledWith({
        where: { id: 'addr-uuid-2' },
        data: { isDefault: true },
      });
      expect(result.message).toBe('Address deleted successfully');
    });

    it('should throw NotFoundException when deleting address of another user', async () => {
      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      await expect(service.deleteAddress('different-user-id', 'addr-uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
