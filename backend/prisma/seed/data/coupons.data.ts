import { DiscountType } from '@prisma/client';

export interface SeedCouponData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderValue: string;
  maxDiscountAmount: string | null;
  usageLimit: number;
  usedCount: number;
  userLimit: number;
  validityDays: number;
  isActive: boolean;
}

export const couponsData: SeedCouponData[] = [
  {
    code: 'BANHMOI20',
    description: 'Giảm 20% cho đơn hàng đầu tiên (tối đa 50.000 VNĐ).',
    discountType: DiscountType.PERCENTAGE,
    discountValue: '20.00',
    minOrderValue: '100000.00',
    maxDiscountAmount: '50000.00',
    usageLimit: 100,
    usedCount: 0,
    userLimit: 1,
    validityDays: 30,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    description: 'Miễn phí giao hàng 25.000 VNĐ cho đơn từ 150.000 VNĐ.',
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: '25000.00',
    minOrderValue: '150000.00',
    maxDiscountAmount: '25000.00',
    usageLimit: 500,
    usedCount: 0,
    userLimit: 2,
    validityDays: 30,
    isActive: true,
  },
];
