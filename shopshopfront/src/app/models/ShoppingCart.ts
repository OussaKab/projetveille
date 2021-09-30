export interface ShoppingCart{
  subtotal: number;
  total: number;
  products: {name:string, price: number}[];
}
