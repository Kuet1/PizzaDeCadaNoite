import type { MenuItem } from "../types/menu.ts";
import { createCard } from "./card.ts";

// Same job as @for in an Angular template: one card per item.
// replaceChildren() clears the list first, so it can be called again by the filters.
function renderList(listId: string, items: MenuItem[]): void {
  const list = document.getElementById(listId);
  if (!list) return;

  list.replaceChildren(...items.map(createCard));
}

export function renderMenu(items: MenuItem[]): void {
  renderList("menu-list", items);
}

export function renderCarousel(items: MenuItem[]): void {
  renderList("carousel", items.filter((item) => item.isFeatured));
}
