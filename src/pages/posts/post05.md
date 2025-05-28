---
layout: ../../layouts/MarkdownLayout.astro
title: "Документация для `spolers.js`"

date: 2025-05-28
description: "Документация для `spolers.js`"
---

# Документация для `spolers.js`

Модуль spolers.js реализует функционал аккордеонов (спойлеров) с анимацией на основе медиазапросов.

```astro
<!-- Сниппет spollers -->
<div data-spollers class="spollers">
    <div class="spollers__item">
        <button type="button" data-spoller class="spollers__title">Заголовок спойлера</button>
        <div class="spollers__body">Контент спойлера</div>
    </div>
</div>
```

Использует вспомогательные модули:

-   slide-animations.js — для плавного раскрытия/скрытия контента.
-   dataMediaQueries.js — для обработки адаптивных условий.

## 1. Импорты

```js
import { _slideToggle, _slideUp, _slideDown } from "../ui/slide-animations";
import { dataMediaQueries } from "../ui/dataMediaQueries";
```

## 2. Основная функция `spollers()`

Инициализирует спойлеры на странице.

#### Логика работы:

1. Находит все элементы с атрибутом [data-spollers].
2. Разделяет их на:

-   Обычные спойлеры (без медиазапросов).
-   Адаптивные спойлеры (с медиазапросами, например, data-spollers="768,max").

3. Для адаптивных спойлеров добавляет обработчик изменения размера окна.

## 3. Вспомогательные функции

> `initSpollers(spollersArray, matchMedia = false)` Инициализирует спойлеры в зависимости от условий (медиазапросов).

#### Параметры:

-   spollersArray — массив DOM-элементов-контейнеров [data-spollers].
-   matchMedia — объект MediaQueryList (если есть медиазапрос).

#### Действия:

-   Добавляет класс \_spoller-init и обработчик клика.
-   Если медиазапрос неактивен — удаляет инициализацию.

> `initSpollerBody(spollersBlock, hideSpollerBody = true)` Настраивает контент спойлеров.

#### Параметры:

-   spollersBlock — контейнер [data-spollers].
-   hideSpollerBody — скрывать ли контент (по умолчанию true).

#### Действия:

-   Находит заголовки [data-spoller] внутри контейнера.
-   Управляет атрибутом hidden и tabindex для доступности.

> `setSpollerAction(e)` Обработчик клика на заголовок спойлера.

#### Логика:

1. Определяет, был ли клик на [data-spoller].
2. Проверяет:

-   Атрибут data-one-spoller (режим "аккордеон").
-   Скорость анимации из data-spollers-speed (по умолчанию 500 мс).

3. Переключает состояние:

-   Добавляет/удаляет класс `\_spoller-active`.
-   Запускает анимацию через `\_slideToggle`.

> `hideSpollersBody(spollersBlock)` Закрывает все спойлеры в блоке (для режима "аккордеон").

#### Закрытие при клике вне спойлера

Если на странице есть элементы с `[data-spoller-close]`, при клике вне спойлера они закрываются.

## 4. Адаптивность и медиазапросы

Скрипт поддерживает медиазапросы в формате:

```html
<div data-spollers="768,max">...</div>
```

-   768 — ширина в пикселях.
-   max — тип запроса (max-width или min-width).

#### Примеры:

`data-spollers="768,max"` — работает только на экранах ≤ 768px. `data-spollers="1024,min"` — работает только на экранах ≥ 1024px.

## 5. Требования к HTML

```html
<div data-spollers>
    <button data-spoller>Заголовок</button>
    <div hidden>Контент</div>
</div>
```

#### Дополнительные атрибуты:

-   `data-one-spoller` Режим "аккордеон" (только один открытый спойлер).
-   `data-spollers-speed` Скорость анимации в мс (например, data-spollers-speed="300").
-   `data-spoller-close` Элемент, при клике вне которого спойлер закроется (например, кнопка).

## 6. CSS-классы

-   `_spoller-init` Добавляется после инициализации спойлера.
-   `_spoller-active` Открытый спойлер.

#### Примечание

Для управления `padding-top` и `padding-bottom` написаны переменные

```js
// src/ui/slide-animations.js
const originalPaddingTop = target.style.paddingTop || "32px"; // Кастомное значение
const originalPaddingBottom = target.style.paddingBottom || "32px";
```

Это позволяет корректно использовать паддинги внутри блока с классом `.spollers__item`.

## 7. Примеры использования

#### Простой спойлер:

```html
<div data-spollers>
    <button data-spoller>Заголовок 1</button>
    <div hidden>Контент 1</div>
</div>
```

#### Аккордеон:

```html
<div data-spollers data-one-spoller>
    <button data-spoller>Заголовок 1</button>
    <div hidden>Контент 1</div>
    <button data-spoller>Заголовок 2</button>
    <div hidden>Контент 2</div>
</div>
```

#### Адаптивный спойлер:

```html
<div data-spollers="768,max">
    <button data-spoller>Заголовок (только на мобильных)</button>
    <div hidden>Контент</div>
</div>
```

## 8. Возможные проблемы и решения

#### Спойлер не открывается:

-   Проверьте, есть ли атрибуты data-spollers и data-spoller.
-   Убедитесь, что контент следует сразу после заголовка и имеет hidden.
-   Проверьте консоль на ошибки (например, неудачный импорт модулей).

#### Анимация не работает:

-   Убедитесь, что у контента есть высота (height не равна 0).
-   Проверьте, нет ли в CSS overflow: hidden у родителя.

#### Медиазапросы не применяются:

-   Проверьте синтаксис, например: data-spollers="768,max".
-   Убедитесь, что dataMediaQueries.js подключен корректно.

## 9. Совместимость

-   Работает в современных браузерах (Chrome, Firefox, Edge, Safari).
-   Требует поддержки ES6-модулей (используйте `<script type="module">`).

#### Рекомендация:

Для кастомизации анимации измените параметры в slide-animations.js (например, длительность).
