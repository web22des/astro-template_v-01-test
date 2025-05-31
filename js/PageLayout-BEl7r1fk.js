import { d as createAstro, c as createComponent, b as addAttribute, o as renderScript, e as renderHead, a as renderComponent, f as renderSlot, r as renderTemplate } from './astro/server-wGLQO-FJ.js';
import 'kleur/colors';
/* empty css                         */
import { $ as $$Header, a as $$Footer } from './Footer-h-aRBZrU.js';

const $$Astro = createAstro("https://web22des.github.io");
const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { title = "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" } = Astro2.props;
  return renderTemplate`<html lang="ru"> <head><meta charset="utf-8"><!-- Добавляем meta-тег для системной темы --><meta name="color-scheme" content="light dark"><meta name="theme-color" content="var(--md-sys-color-background)"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Базовые иконки --><link rel="icon" href="/favicon/favicon.ico" sizes="any"><link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml"><!-- Адаптивные иконки --><link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png"><link rel="manifest" href="/favicon/site.webmanifest">${renderScript($$result, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/layouts/PageLayout.astro?astro&type=script&index=0&lang.ts")}<title>${title}</title>${renderHead()}</head> <body class="wrapper"> ${renderComponent($$result, "Header", $$Header, {})} <main class="page"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/layouts/PageLayout.astro", void 0);

export { $$PageLayout as $ };
