import { clearCart } from "../services/cart.ts";

// "Finalizar pedido": no real payment, just empties the cart and shows the confirmation.
export function setupCheckout(): void {
  const cart = document.querySelector<HTMLDialogElement>("#cart");
  const checkoutButton = document.querySelector<HTMLButtonElement>("#checkout");
  const confirmation = document.querySelector<HTMLDialogElement>("#confirmation");
  const backButton = document.querySelector<HTMLButtonElement>("[data-close-confirmation]");

  if (!cart || !checkoutButton || !confirmation || !backButton) return;

  checkoutButton.addEventListener("click", () => {
    clearCart();
    cart.close();
    confirmation.showModal();
  });

  backButton.addEventListener("click", () => confirmation.close());
}
