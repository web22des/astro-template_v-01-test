// src/ui/slide-animations.js
export function _slideUp(target, duration = 500) {
    // Сохраняем оригинальные паддинги перед анимацией
    const originalPaddingTop = target.style.paddingTop || "32px"; // Кастомное значение
    const originalPaddingBottom = target.style.paddingBottom || "32px";

    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";

    // Устанавливаем начальные паддинги перед анимацией
    target.style.paddingTop = originalPaddingTop;
    target.style.paddingBottom = originalPaddingBottom;

    // Анимируем к нулю
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;

    setTimeout(() => {
        target.hidden = true;
        // Восстанавливаем паддинги после анимации
        target.style.paddingTop = originalPaddingTop;
        target.style.paddingBottom = originalPaddingBottom;
    }, duration);
}

export function _slideDown(target, duration = 500) {
    target.hidden = false;
    // Сохраняем оригинальные паддинги
    const originalPaddingTop = target.style.paddingTop || "32px";
    const originalPaddingBottom = target.style.paddingBottom || "32px";

    // Сбрасываем стили
    target.style.height = "";
    target.style.paddingTop = originalPaddingTop; // Устанавливаем кастомные паддинги
    target.style.paddingBottom = originalPaddingBottom;
    target.style.marginTop = "";
    target.style.marginBottom = "";
    target.style.overflow = "hidden";

    // Фиксируем натуральную высоту
    const height = target.offsetHeight;
    target.style.height = 0;
    target.style.paddingTop = 0; // Начало анимации с 0
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;

    // Анимация
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.paddingTop = originalPaddingTop; // Возвращаем паддинги
    target.style.paddingBottom = originalPaddingBottom;

    setTimeout(() => {
        target.style.overflow = "";
    }, duration);
}

export function _slideToggle(target, duration = 500) {
    if (target.hidden || target.style.height === "0px") {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}
