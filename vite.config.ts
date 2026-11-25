import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages serves the site from a subfolder (https://user.github.io/repo-name/).
  // "./" makes every built path relative, so it works in any folder.
  base: "./",
});
