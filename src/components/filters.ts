import type { Category, MenuItem } from "../types/menu.ts";
import { renderMenu } from "./menu.ts";

// A filter is any category OR "all" (union type built from another union type)
type Filter = Category | "all";

export function setupFilters(items: MenuItem[]): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".filters__button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // dataset values are plain strings; `as` tells TS to trust the HTML here
      const filter = button.dataset.category as Filter;

      // Only the clicked button stays pressed (the CSS styles it from aria-pressed)
      buttons.forEach((other) => {
        other.setAttribute("aria-pressed", String(other === button));
      });

      const visibleItems =
        filter === "all" ? items : items.filter((item) => item.category === filter);

      renderMenu(visibleItems);
    });
  });
}
