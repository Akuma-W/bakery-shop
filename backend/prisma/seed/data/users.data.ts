import { Role } from '@prisma/client';

export interface SeedUserData {
  email: string;
  fullName: string;
  plainPassword: string;
  phone: string;
  role: Role;
  address?: {
    recipientName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    isDefault: boolean;
  };
}

export const usersData: SeedUserData[] = [
  {
    email: 'admin123@gmail.com',
    fullName: 'Trần Tuấn Phong',
    plainPassword: 'Admin123@',
    phone: '0901234567',
    role: Role.OWNER,
  },
  {
    email: 'customer@gmail.com',
    fullName: 'Nguyễn Văn An',
    plainPassword: 'Customer123@',
    phone: '0987654321',
    role: Role.CUSTOMER,
    address: {
      recipientName: 'Nguyễn Văn An',
      phone: '0987654321',
      street: '123 Đường Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
  },
];
