import { d as createAstro, c as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead, s as spreadAttributes, f as renderSlot, a as renderComponent, o as renderScript } from './astro/server-wGLQO-FJ.js';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$3 = createAstro("https://web22des.github.io");
const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ThemeToggle;
  const { initialTheme = "light" } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="theme-toggle" data-astro-cid-lfoluaxz> <input type="checkbox" id="theme-toggle" class="theme-toggle__input"', ` data-astro-cid-lfoluaxz> <label for="theme-toggle" class="theme-toggle__slider" data-astro-cid-lfoluaxz></label> </div> <script>
(function() {
  // \u0424\u0443\u043D\u043A\u0446\u0438\u044F \u0434\u043B\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0442\u0435\u043C\u044B
  function syncTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    // \u0423\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u043C \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u044B
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-toggle').checked = currentTheme === 'dark';
  }

  // \u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F
  syncTheme();

  // \u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F
  document.getElementById('theme-toggle').addEventListener('change', function(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  });

  // \u0421\u043B\u0435\u0434\u0438\u043C \u0437\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F\u043C\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0439 \u0442\u0435\u043C\u044B
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
})();
<\/script>`])), maybeRenderHead(), addAttribute(initialTheme === "dark", "checked"));
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/ThemeToggle.astro", void 0);

const $$ContactsIcons = createComponent(($$result, $$props, $$slots) => {
  const PhoneUser = "71234567890";
  const WhatsappUser = "71234567890";
  const TelegramUser = "username";
  return renderTemplate`${maybeRenderHead()}<div class="contacts-icons"> <!-- Телефон --> <!--  Добавляем роль button для явного указания интерактивности --> <!-- Убедимся, что элемент фокусируем --> <a${addAttribute(`tel:+${PhoneUser}`, "href")} class="contacts-icons__link contacts-icons__link--phone" aria-label="Позвонить по телефону" role="button" tabindex="0"> <span class="contacts-icons__icon" aria-hidden="true"> <span class="_icon-phone"></span> </span> <span class="visually-hidden">${PhoneUser}</span> </a> <!-- WhatsApp --> <a${addAttribute(`https://wa.me/${WhatsappUser}`, "href")} class="contacts-icons__link contacts-icons__link--whatsapp" aria-label="Написать в WhatsApp" target="_blank" rel="noopener noreferrer" role="button" tabindex="0"> <span class="contacts-icons__icon" aria-hidden="true"> <span class="_icon-whatsapp"></span> </span> <span class="visually-hidden">WhatsApp</span> </a> <!-- Telegram --> <a${addAttribute(`https://t.me/${TelegramUser}`, "href")} class="contacts-icons__link contacts-icons__link--telegram" aria-label="Написать в Telegram" target="_blank" rel="noopener noreferrer" role="button" tabindex="0"> <span class="contacts-icons__icon" aria-hidden="true"> <span class="_icon-telegram"></span> </span> <span class="visually-hidden">Telegram</span> </a> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/social/ContactsIcons/ContactsIcons.astro", void 0);

const $$Astro$2 = createAstro("https://web22des.github.io");
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Icon;
  const { name, class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(`_icon-${name} ${className || ""}`, "class")} aria-hidden="true"></span>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/icon/Icon.astro", void 0);

const $$Astro$1 = createAstro("https://web22des.github.io");
const $$Link = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Link;
  const { href, ...props } = Astro2.props;
  const resolvedHref = "/astro-template_v-01-test/" + href.replace(/^\//, "");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(resolvedHref, "href")}${spreadAttributes(props)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/Link.astro", void 0);

const $$Astro = createAstro("https://web22des.github.io");
const $$NavMenu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NavMenu;
  const { items = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="nav-menu"> <ul class="nav-menu__list"> ${items.map((item) => renderTemplate`<li${addAttribute(`nav-menu__item ${item.children ? "has-dropdown" : ""}`, "class")}> ${renderComponent($$result, "Link", $$Link, { "href": item.url, "class": "nav-menu__link", "aria-expanded": item.children ? "false" : null, "aria-haspopup": item.children ? "true" : null }, { "default": ($$result2) => renderTemplate`${item.title}${item.children && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "_icon-arrow-right2", "class": "nav-menu__icon" })}`}` })} ${item.children && renderTemplate`<ul class="nav-menu__submenu"> ${item.children.map((subItem) => renderTemplate`<li class="nav-menu__subitem"> ${renderComponent($$result, "Link", $$Link, { "href": subItem.url, "class": "nav-menu__sublink" }, { "default": ($$result2) => renderTemplate`${subItem.title}` })} </li>`)} </ul>`} </li>`)} </ul> </nav>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/navigation/NavMenu.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const basePath = "/astro-template_v-01-test/";
  const theme = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") || "light" : "light";
  const logoPath = `${basePath}icons/logo-${theme}.svg`;
  return renderTemplate(_a || (_a = __template(["", "<img", " alt=\"Логотип\"> <script>\n// Автоматическое обновление пути при смене темы\nconst updateLogo = () => {\n  const theme = document.documentElement.getAttribute('data-theme') || 'light';\n  const base = '${import.meta.env.BASE_URL}';\n  document.querySelectorAll('[data-logo]').forEach(logo => {\n    logo.src = `${base}icons/logo-${theme}.svg`;\n  });\n};\n\nnew MutationObserver(updateLogo).observe(document.documentElement, {\n  attributes: true,\n  attributeFilter: ['data-theme']\n});\n</script>"], ["", "<img", " alt=\"Логотип\"> <script>\n// Автоматическое обновление пути при смене темы\nconst updateLogo = () => {\n  const theme = document.documentElement.getAttribute('data-theme') || 'light';\n  const base = '\\${import.meta.env.BASE_URL}';\n  document.querySelectorAll('[data-logo]').forEach(logo => {\n    logo.src = \\`\\${base}icons/logo-\\${theme}.svg\\`;\n  });\n};\n\nnew MutationObserver(updateLogo).observe(document.documentElement, {\n  attributes: true,\n  attributeFilter: ['data-theme']\n});\n</script>"])), maybeRenderHead(), addAttribute(logoPath, "src"));
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/Logo.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const menuItems = [
    {
      title: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F",
      url: "/"
    },
    {
      title: "\u0413\u0430\u043B\u0435\u0440\u0435\u044F",
      url: "/gallery/"
    },
    {
      title: "\u041D\u043E\u0432\u043E\u0441\u0442\u0438",
      url: "/news/",
      children: [
        { title: "\u0411\u043B\u043E\u0433", url: "/posts/" },
        { title: "\u041D\u043E\u0432\u043E\u0441\u0442\u0438", url: "/news/news-history" }
      ]
    },
    {
      title: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B",
      url: "/contacts/"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="header"> <div class="header__container"> <div class="header__body"> <div class="header__logo"> ${renderComponent($$result, "Logo", $$Logo, {})} </div> <div class="header__nav"> ${renderComponent($$result, "NavMenu", $$NavMenu, { "items": menuItems })} </div> <div class="header__contacts"> ${renderComponent($$result, "ContactsIcons", $$ContactsIcons, {})} </div> <div class="header__burger"> <span id="burgerButton" class="_icon-switch"></span> </div> </div> <div class="header__footer"> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "initialTheme": "light" })} </div> </div> </div> ${renderScript($$result, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/partials/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/partials/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="footer"> <div class="footer__container"> <p>Footer</p> </div> </footer>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/partials/Footer.astro", void 0);

export { $$Header as $, $$Footer as a };
