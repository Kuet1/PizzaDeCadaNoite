import type { MenuItem } from "../types/menu.ts";
import {
  addToCart,
  changeQuantity,
  getCartItems,
  onCartChange,
  removeFromCart,
} from "../services/cart.ts";
import { formatPrice } from "../utils/currency.ts";

type Action = "decrease" | "increase" | "remove";

function createActionButton(
  action: Action,
  id: string,
  text: string,
  label: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `cart-item__button cart-item__button--${action}`;
  button.textContent = text;
  button.dataset.action = action;
  button.dataset.id = id;
  button.setAttribute("aria-label", label);
  return button;
}

function createCartRow(item: MenuItem, quantity: number): HTMLLIElement {
  const row = document.createElement("li");
  row.className = "cart-item";

  const name = document.createElement("p");
  name.className = "cart-item__name";
  name.textContent = item.name;

  const subtotal = document.createElement("p");
  subtotal.className = "cart-item__subtotal";
  subtotal.textContent = formatPrice(item.priceInCents * quantity);

  const controls = document.createElement("div");
  controls.className = "cart-item__controls";

  const amount = document.createElement("span");
  amount.className = "cart-item__quantity";
  amount.textContent = String(quantity);

  controls.append(
    createActionButton("decrease", item.id, "−", `Diminuir quantidade de ${item.name}`),
    amount,
    createActionButton("increase", item.id, "+", `Aumentar quantidade de ${item.name}`),
    createActionButton("remove", item.id, "Remover", `Remover ${item.name} do carrinho`),
  );

  row.append(name, subtotal, controls);
  return row;
}

export function setupCart(menuItems: MenuItem[]): void {
  const dialog = document.querySelector<HTMLDialogElement>("#cart");
  const openButton = document.querySelector<HTMLButtonElement>(".header__cart");
  const closeButton = document.querySelector<HTMLButtonElement>(".cart__close");
  const list = document.querySelector<HTMLUListElement>("#cart-list");
  const emptyMessage = document.querySelector<HTMLParagraphElement>("#cart-empty");
  const total = document.querySelector<HTMLElement>("#cart-total");
  const count = document.querySelector<HTMLElement>("#cart-count");
  const checkout = document.querySelector<HTMLButtonElement>("#checkout");
  const status = document.querySelector<HTMLElement>("#cart-status");

  if (
    !dialog || !openButton || !closeButton || !list || !emptyMessage ||
    !total || !count || !checkout || !status
  ) {
    return;
  }

  // Quick lookup by id: menuById.get("margherita") → the full MenuItem
  const menuById = new Map(menuItems.map((item) => [item.id, item]));

  const render = (): void => {
    let totalInCents = 0;
    let totalQuantity = 0;
    const rows: HTMLLIElement[] = [];

    for (const cartItem of getCartItems()) {
      const menuItem = menuById.get(cartItem.id);
      if (!menuItem) continue; // unknown id (old or edited localStorage): ignore it

      totalInCents += menuItem.priceInCents * cartItem.quantity;
      totalQuantity += cartItem.quantity;
      rows.push(createCartRow(menuItem, cartItem.quantity));
    }

    list.replaceChildren(...rows);
    emptyMessage.hidden = rows.length > 0;
    checkout.disabled = rows.length === 0;
    total.textContent = formatPrice(totalInCents);
    count.textContent = String(totalQuantity);
  };

  // --- Open / close ---
  openButton.addEventListener("click", () => dialog.showModal());
  closeButton.addEventListener("click", () => dialog.close());

  // A click on the <dialog> itself (not on the inner panel) is a click on the dark backdrop
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // --- "Adicionar" buttons on the cards ---
  // Event delegation: ONE listener on the document handles every card,
  // even cards created later by the filters.
  document.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".card__button");
    const id = button?.dataset.id;
    if (!id) return;

    addToCart(id);
    status.textContent = `${menuById.get(id)?.name}: adicionado ao carrinho`;
  });

  // --- −, + and Remover inside the cart ---
  list.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
    const id = button?.dataset.id;
    const action = button?.dataset.action as Action | undefined;
    if (!id || !action) return;

    if (action === "increase") changeQuantity(id, 1);
    if (action === "decrease") changeQuantity(id, -1);
    if (action === "remove") removeFromCart(id);

    // The list was redrawn, so the clicked button no longer exists.
    // Put keyboard focus back on the same button, or on "close" if the row is gone.
    const sameButton = list.querySelector<HTMLButtonElement>(
      `[data-action="${action}"][data-id="${CSS.escape(id)}"]`,
    );
    (sameButton ?? closeButton).focus();
  });

  onCartChange(render);
  render(); // first draw: shows what was saved in localStorage
}
