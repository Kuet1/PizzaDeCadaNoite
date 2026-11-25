import type { MenuItem } from "../types/menu.ts";
import { formatPrice } from "../utils/currency.ts";

// Builds one menu card. Reused by the menu list and the carousel.
// Uses textContent (never innerHTML): it treats data as plain text, so nothing can inject HTML (XSS).
export function createCard(item: MenuItem): HTMLLIElement {
  const card = document.createElement("li");
  card.className = "card";

  const image = document.createElement("img");
  image.className = "card__image";
  image.src = item.image;
  image.alt = item.name;
  image.width = 600;
  image.height = 450;
  image.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card__body";

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = item.name;

  const ingredients = document.createElement("p");
  ingredients.className = "card__ingredients";
  ingredients.textContent = item.ingredients;

  const footer = document.createElement("div");
  footer.className = "card__footer";

  const price = document.createElement("p");
  price.className = "card__price";
  price.textContent = formatPrice(item.priceInCents);

  const button = document.createElement("button");
  button.className = "button card__button";
  button.type = "button";
  button.textContent = "Adicionar";
  button.dataset.id = item.id; // becomes data-id="margherita", read by the cart later
  // "Adicionar" alone is ambiguous for screen readers when there are 8 buttons
  button.setAttribute("aria-label", `Adicionar ${item.name} ao carrinho`);

  footer.append(price, button);
  body.append(title, ingredients, footer);
  card.append(image, body);

  return card;
}
