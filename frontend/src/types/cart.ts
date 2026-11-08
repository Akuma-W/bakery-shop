export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export type CartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number;
};
