import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';
import { CreateAddressDto } from '@/modules/users/dto/create-address.dto';
import { UpdateAddressDto } from '@/modules/users/dto/update-address.dto';
import { AddressResponse } from '@/modules/users/interfaces';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all shipping addresses for a specific authenticated user.
   */
  async getAddresses(userId: string): Promise<AddressResponse[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Retrieves a single address by id ensuring it belongs to the authenticated user.
   */
  async getAddressById(userId: string, addressId: string): Promise<AddressResponse> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  /**
   * Creates a new shipping address. Sets default automatically if it is the first address.
   */
  async createAddress(userId: string, dto: CreateAddressDto): Promise<AddressResponse> {
    const existingCount = await this.prisma.address.count({
      where: { userId },
    });

    const shouldBeDefault = existingCount === 0 || dto.isDefault === true;

    if (shouldBeDefault) {
      return this.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.create({
          data: {
            ...dto,
            userId,
            isDefault: true,
          },
        });
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
        isDefault: false,
      },
    });
  }

  /**
   * Updates an existing address ensuring owner authorization and transactional default handling.
   */
  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<AddressResponse> {
    await this.getAddressById(userId, addressId);

    if (dto.isDefault === true) {
      return this.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.update({
          where: { id: addressId },
          data: {
            ...dto,
            isDefault: true,
          },
        });
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  /**
   * Designates a specific address as the default shipping address for the user.
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<AddressResponse> {
    await this.getAddressById(userId, addressId);

    return this.prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  }

  /**
   * Deletes a shipping address, optionally promoting the next latest address to default if needed.
   */
  async deleteAddress(userId: string, addressId: string): Promise<{ message: string }> {
    const address = await this.getAddressById(userId, addressId);

    if (address.isDefault) {
      await this.prisma.$transaction(async (tx) => {
        await tx.address.delete({
          where: { id: addressId },
        });

        const nextAddress = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      });
    } else {
      await this.prisma.address.delete({
        where: { id: addressId },
      });
    }

    return { message: 'Address deleted successfully' };
  }
}
