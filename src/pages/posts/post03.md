---
layout: ../../layouts/MarkdownLayout.astro
title: "Клиентский JS внутри компонента (для интерактивности)"

date: 2023-11-17
description: "Это пример описания поста"
---

## 1. Клиентский JS внутри компонента (для интерактивности)

Используйте `<script>` тег в вашем **.astro** файле:

```astro
---
// Серверный код (выполняется при сборке)
const serverData = fetchData();
---

<!-- Разметка -->
<button class="my-button">Click me</button>

<!-- Клиентский JavaScript -->
<script>
  // Этот код выполняется в браузере
  document.querySelector('.my-button').addEventListener('click', () => {
    alert('Button clicked!');
  });
</script>

<!-- Стили -->
<style>
  .my-button {
    background: blue;
    color: white;
  }
</style>
```

#### Когда использовать:

-   Для простой интерактивности (клики, анимации)

-   Если не нужны сложные состояния или фреймворки (React/Vue)

## 2. Отдельный JS-файл для сложной логики

Если кода много, вынесите его в отдельный файл:

```txt
src/
├── components/
│   └── Button.astro
│   └── Button.client.js  # Клиентский код
```

#### Button.astro:

```js
// Этот код будет загружен только в браузере
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".my-button").addEventListener("click", () => {
        console.log("Clicked!");
    });
});
```

#### Плюсы:

-   Чистая разделенность кода

-   Легче поддерживать

-   Можно использовать TypeScript

## 3. Использование фреймворков (React, Vue и т.д.)

Если нужен сложный интерактив, подключите фреймворк:

```tsx
import { useState } from "react";

export default function Button() {
    const [count, setCount] = useState(0);

    return <button onClick={() => setCount((c) => c + 1)}>Clicks: {count}</button>;
}
```

#### Button.astro:

```astro
---
import Button from './Button.tsx';
---

<Button client:load />
```

#### Когда использовать:

-   Для сложных интерактивных компонентов

-   Если нужны состояния (state)

-   При интеграции с существующим React/Vue кодом

#### 4. Лучшие практики

1. Для простого кода - пишите прямо в `<script>` в **.astro файле**

2. Для среднего кода - выносите в **.client.js** файлы

3. Для сложных компонентов - используйте фреймворки (React/Vue/Svelte)
4. Оптимизация:

-   client:load - загрузить сразу (по умолчанию)

-   client:idle - загрузить когда браузер простаивает

-   client:visible - загрузить когда компонент появляется в viewport

## Пример полной структуры

```txt
src/
├── components/
│   ├── SimpleButton.astro          # Простой компонент с inline JS
│   ├── ComplexButton.client.js     # Отдельный JS файл
│   └── ReactButton.tsx            # React компонент
└── pages/
    └── index.astro                # Страница
```

#### index.astro:

```astro
---
import SimpleButton from '../components/SimpleButton.astro';
import ComplexButton from '../components/ComplexButton.client.js';
import ReactButton from '../components/ReactButton.tsx';
---

<SimpleButton />
<ComplexButton />
<ReactButton client:load />
```

## Вывод

1. Немного JS - пишите прямо в компоненте `(<script>)`

2. Средний JS - выносите в **.client.js** файлы

3. Сложный JS - используйте фреймворки (React/Vue)

4. Всегда указывайте стратегию загрузки (`client:load/idle/visible`)

Это обеспечит оптимальную производительность и чистоту кода.
