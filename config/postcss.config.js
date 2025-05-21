const cssOptimizer = require("./scripts/css-optimizer");

module.exports = {
    plugins: [
        require("autoprefixer"),
        cssOptimizer.purgeUnusedVars({
            safelist: [
                // Только действительно нужные переменные
                "--primary-color",
                "--accent-color",
            ],
            strictMode: true,
            checkThemePairs: false, // Отключаем автосохранение пар
            debug: true,
        }),
        require("@fullhuman/postcss-purgecss")({
            content: ["./src/styles/main.scss", "./src/**/*.{js,ts,jsx,tsx,astro,html}"],
            safelist: [], // Пустой safelist для максимальной очистки
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        }),
    ],
};
