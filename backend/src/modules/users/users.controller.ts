import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from '@/modules/users/users.service';
import { CreateAddressDto } from '@/modules/users/dto/create-address.dto';
import { UpdateAddressDto } from '@/modules/users/dto/update-address.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Users - Address Book')
@Controller('users/addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves all shipping addresses belonging to the authenticated user.
   */
  @Get()
  @ApiOperation({ summary: 'Get all addresses for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user shipping addresses' })
  async getAddresses(@CurrentUser('id') userId: string) {
    const addresses = await this.usersService.getAddresses(userId);
    return { addresses };
  }

  /**
   * Retrieves a single shipping address by id for the authenticated user.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get address details by id' })
  @ApiResponse({ status: 200, description: 'Address details' })
  @ApiResponse({ status: 404, description: 'Address not found or unauthorized' })
  async getAddressById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const address = await this.usersService.getAddressById(userId, id);
    return { address };
  }

  /**
   * Adds a new shipping address for the authenticated user.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shipping address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    const address = await this.usersService.createAddress(userId, dto);
    return { address };
  }

  /**
   * Updates an existing shipping address for the authenticated user.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing shipping address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found or unauthorized' })
  async updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const address = await this.usersService.updateAddress(userId, id, dto);
    return { address };
  }

  /**
   * Sets a specific shipping address as the default address for the user.
   */
  @Patch(':id/default')
  @ApiOperation({ summary: 'Set address as default shipping address' })
  @ApiResponse({ status: 200, description: 'Default address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found or unauthorized' })
  async setDefaultAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const address = await this.usersService.setDefaultAddress(userId, id);
    return { address };
  }

  /**
   * Deletes a shipping address belonging to the authenticated user.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipping address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found or unauthorized' })
  async deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteAddress(userId, id);
  }
}
