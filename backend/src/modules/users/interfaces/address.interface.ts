export interface AddressResponse {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdAt: Date;
}
