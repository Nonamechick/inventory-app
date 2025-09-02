export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  customId: string;
  createdAt: string;
  author?: { id: number; name: string; email: string };
}

export interface Inventory {
  id: number;
  title: string;
  description: string;
  products: Product[];
}
