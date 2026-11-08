export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}
