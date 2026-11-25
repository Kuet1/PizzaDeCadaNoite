import type { CartItem } from "../types/cart.ts";

// Cart state + localStorage. Works like an Angular service:
// one module, one shared state, and functions to read and change it.

const STORAGE_KEY = "pizza-de-cada-noite:cart";

type Listener = () => void;
const listeners: Listener[] = [];

let items: CartItem[] = loadCart();

// Type guard: checks at runtime that a value really has the CartItem shape.
// localStorage can be edited by anyone in DevTools, so saved data is never trusted.
function isCartItem(value: unknown): value is CartItem {
  const item = value as CartItem;
  return typeof item?.id === "string" && Number.isInteger(item?.quantity) && item.quantity > 0;
}

function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return []; // invalid JSON or storage blocked: start with an empty cart
  }
}

function saveAndNotify(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked (private mode): the cart still works in memory
  }
  listeners.forEach((listener) => listener());
}

// Whoever needs to react to changes (the drawer, the counter) registers here
export function onCartChange(listener: Listener): void {
  listeners.push(listener);
}

export function getCartItems(): readonly CartItem[] {
  return items;
}

export function addToCart(id: string): void {
  const existing = items.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ id, quantity: 1 });
  }
  saveAndNotify();
}

// change = +1 or -1. Reaching 0 removes the item.
export function changeQuantity(id: string, change: number): void {
  items = items
    .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
    .filter((item) => item.quantity > 0);
  saveAndNotify();
}

export function removeFromCart(id: string): void {
  items = items.filter((item) => item.id !== id);
  saveAndNotify();
}

export function clearCart(): void {
  items = [];
  saveAndNotify();
}
