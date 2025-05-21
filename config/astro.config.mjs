// config/astro/astro.config.mjs
import { defineConfig } from "astro/config";
import viteConfig from "./vite.config.js";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.argv.includes("preview");
const isGHPages = process.env.GITHUB_ACTIONS === "true"; // Автоопределение GitHub Actions

export default defineConfig({
    site: "https://web22des.github.io",
    base: isDev || isPreview || !isGHPages ? "/" : "/astro-template_v-01-test/",
    trailingSlash: "always",
    output: "static", // Явно указываем статический режим
    vite: viteConfig,
});
