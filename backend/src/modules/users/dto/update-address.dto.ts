import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from '@/modules/users/dto/create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
