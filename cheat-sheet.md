# Шпаргалка

## Команды

> explorer . - открыть папку проета (находясь в его корне)

## Примеры коипонентов

1. Вариант установки полупрозрачности из переменной

    > `background: color-mix(in srgb, var(--md-sys-color-on-tertiary) 70%, transparent);`

## 1. Базовый компонент изображения (src/components/Image.astro)

```astro
---
// Используем встроенный Image из astro:assets
import { Image } from 'astro:assets';

interface Props {
  src: string;
  alt: string;
  width: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  formats?: Array<'avif' | 'webp' | 'png' | 'jpeg' | 'svg'>;
  quality?: number;
  class?: string;
}

const {
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  formats = ['webp'],
  quality = 80,
  class: className
} = Astro.props;
---

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  formats={formats}
  quality={quality}
  loading={loading}
  class={className}
/>
```

## 2. Пример использования

```astro
---
import Image from '../components/Image.astro';
---

<!-- Основное изображение -->
<Image
  src="/images/hero.jpg"
  alt="Главный баннер"
  width={1200}
  height={630}
  loading="eager"
  formats={['avif', 'webp']}
/>

<!-- Изображение в контенте -->
<Image
  src="/images/content/product.jpg"
  alt="Продукт"
  width={600}
  loading="lazy"
  class="product-image" <!-- Здесь применяется класс -->
/>



```

## 3. Настройка обработки (astro.config.mjs)

```js
import { defineConfig } from "astro/config";

export default defineConfig({
    // Встроенные настройки изображений
    image: {
        service: {
            // Встроенный обработчик (не требует sharp/squoosh)
            entrypoint: "astro/assets/services/sharp",
        },
        domains: [], // Разрешенные внешние домены
        remotePatterns: [], // Шаблоны для внешних изображений
    },
});
```

## 4. Что вы получаете "из коробки":

#### 1. Автоматическая оптимизация:

-   Конвертация в WebP/AVIF

-   Ресайз по указанным размерам

-   Сжатие с контролем качества

#### 2. Современные форматы:

```astro
formats={['avif', 'webp', 'jpeg']} // Автоматический fallback
```

#### 3. Lazy-loading:

```astro
loading="lazy" // По умолчанию
```

#### 4. Адаптивные изображения:

```astro
sizes="(max-width: 768px) 100vw, 50vw"
```

## 5. Ограничения встроенного решения:

-   Нет advanced-оптимизаций (как в sharp)

-   Нет автоматического art-direction

-   Базовые форматы (WebP, AVIF, PNG, JPEG)
