// Opens and closes the mobile menu (hamburger button).
// The CSS shows the menu when aria-expanded="true", so we only change that attribute.

export function setupNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>(".header__toggle");
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav__link");

  // querySelector returns null if the element does not exist
  if (!toggle) return;

  const label = toggle.querySelector<HTMLSpanElement>(".visually-hidden");

  // Arrow functions in const (not `function`): they only exist after the null check above,
  // so TypeScript knows `toggle` is not null inside them
  const setMenuOpen = (isOpen: boolean): void => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (label) label.textContent = isOpen ? "Fechar menu" : "Abrir menu";
  };

  const isMenuOpen = (): boolean => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => {
    setMenuOpen(!isMenuOpen());
  });

  // Choosing a section closes the menu
  links.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // Esc closes the menu and returns focus to the button (keyboard users)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}
