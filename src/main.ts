import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/main.css";

import { setupNav } from "./components/nav.ts";
import { renderCarousel, renderMenu } from "./components/menu.ts";
import { setupFilters } from "./components/filters.ts";
import { setupCart } from "./components/cart-drawer.ts";
import { setupCheckout } from "./components/checkout.ts";
import { menuItems } from "./data/menu.ts";

setupNav();
renderCarousel(menuItems);
renderMenu(menuItems);
setupFilters(menuItems);
setupCart(menuItems);
setupCheckout();
