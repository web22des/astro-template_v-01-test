import { spollers } from "./functions/spolers";

import { initSliders } from "./libs/slider.js";

//initSliders();
//spollers();

document.addEventListener("DOMContentLoaded", () => {
    initSliders();
    spollers();
});
console.log("✅ Все подключенные скрипты подключены!");
