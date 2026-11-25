import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/main.css";

import { setupNav } from "./components/nav.ts";
import { renderCarousel, renderMenu } from "./components/menu.ts";
import { setupFilters } from "./components/filters.ts";
import { menuItems } from "./data/menu.ts";

setupNav();
renderCarousel(menuItems);
renderMenu(menuItems);
setupFilters(menuItems);
