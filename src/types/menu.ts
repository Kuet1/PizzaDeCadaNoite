// Union type: a category can ONLY be one of these four strings.
// A typo like "drinks" becomes a type error instead of a silent bug.
export type Category = "traditional" | "special" | "sweet" | "drink";

export interface MenuItem {
  id: string;
  name: string;
  ingredients: string;
  // Money is stored in cents (integer) to avoid float errors: 0.1 + 0.2 !== 0.3
  priceInCents: number;
  category: Category;
  image: string;
  isFeatured: boolean; // shows in the "Destaques da Noite" carousel
}
