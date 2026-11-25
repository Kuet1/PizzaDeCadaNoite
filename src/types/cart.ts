// The cart only stores the id and the quantity.
// Name and price always come from src/data/menu.ts, so editing localStorage can't change a price.
export interface CartItem {
  id: string;
  quantity: number;
}
