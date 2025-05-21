---
layout: ../../layouts/MarkdownLayout.astro
title: "Лучшая практика работы с Markdown/MDX и классами в Astro (официальный подход + рекомендации)"

date: 2023-11-16
description: "Это пример описания поста"
---

# Лучшая практика работы с Markdown/MDX и классами в Astro (официальный подход + рекомендации)

## 1. Официальный подход (по документации Astro)

### 1.1. Использование layout + глобальных стилей

#### Как работает:

1. Создаёте layout-компонент для Markdown

2. Импортируете CSS-файл

3. Стилизуете стандартные HTML-элементы

#### Шаги:

#### 1. Создайте layout (src/layouts/MarkdownLayout.astro):

```astro
---
// Импорт стилей
import '../styles/markdown.css';
const { frontmatter } = Astro.props;
---
<html>
<head>
  <title>{frontmatter.title}</title>
</head>
<body>
  <article class="markdown-content">
    <slot /> <!-- Сюда вставится содержимое .md -->
  </article>
</body>
</html>
```

#### 2. Добавьте стили (src/styles/markdown.css):

```css
.markdown-content {
    max-width: 800px;
    margin: 0 auto;
}

/* Стилизация элементов Markdown */
.markdown-content h1 {
    font-size: 2rem;
    color: var(--color-primary);
}

.markdown-content img {
    border-radius: 8px;
    margin: 1rem 0;
}
```

#### 3. В .md-файле укажите layout:

```markdown
---
layout: ../layouts/MarkdownLayout.astro
title: "Моя статья"
---

# Заголовок статьи

Это Markdown-контент...
```

### 1.2. Использование @apply для компонентного подхода

Если используете Tailwind или PostCSS:

```css
/* markdown.css */
.markdown-content {
    @apply prose prose-lg max-w-3xl mx-auto;
}

.markdown-content h1 {
    @apply text-3xl font-bold mb-6;
}
```

### 2. Если нужны кастомные классы (БЭМ и др.)

#### 2.1. Использование MDX вместо Markdown

MDX позволяет смешивать JSX и Markdown:

```mdx
---
import './article-styles.css';
---

<div className="article">
  <h1 className="article__title">Заголовок</h1>

Это **Markdown**-контент с _JSX_!

</div>
```

#### Плюсы:

-   Полная поддержка HTML/JSX

-   Можно использовать любые классы (БЭМ, CSS Modules и т.д.)

-   Компонентный подход

#### 2.2. Переопределение элементов через components (для MDX)

В astro.config.mjs:

```js
export default defineConfig({
    markdown: {
        shikiConfig: { theme: "github-dark" },
    },
    mdx: {
        components: {
            h1: "/src/components/Heading.astro",
            p: "/src/components/Paragraph.astro",
        },
    },
});
```

#### Пример компонента (Heading.astro):

```astro
---
const { children } = Astro.props;
---

<h1 class="article__title">
  {children}
</h1>
```

## 3. Критерии выбора подхода

| Ситуация                 | Решение                      | Плюсы                                                               |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------- |
| Простой Markdown-контент | Layout + глобальные стили    | - Простота реализации Работает "из коробки"- Минимум настроек       |
| Нужны кастомные классы   | MDX + CSS Modules            | - Поддержка БЭМ Локальные стили Гибкость именования                 |
| Комплексные статьи       | MDX + кастомные компоненты   | - Максимальный контроль Переиспользуемые компоненты Чистая разметка |
| Строгие требования к SEO | Markdown с layout            | - Лучшая SEO-оптимизация Чистый HTML на выходе                      |
| Интерактивные элементы   | MDX с React/Vue компонентами | - Возможность вставки JSX Интерактивность                           |

## 4. Главные рекомендации

1. Для простых статей используйте обычный Markdown с layout-стилями.

2. Если нужен БЭМ/кастомные классы — переходите на MDX.

3. Не усложняйте без необходимости (избегайте кастомных парсеров).

4. Используйте стандартные возможности Astro — они покрывают 90% случаев.

#### Официальные ресурсы:

-   [Astro Markdown Guide](https://docs.astro.build/ru/guides/markdown-content/)
-   [Astro MDX Docs](https://docs.astro.build/ru/guides/integrations-guide/mdx/)
