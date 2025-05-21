// config/scripts/clean-unused-vars.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Парсим файл с CSS переменными
const variablesFile = path.join(__dirname, "../../src/styles/base/_variables.scss");
if (!fs.existsSync(variablesFile)) {
    console.error(`Файл с переменными не найден: ${variablesFile}`);
    process.exit(1);
}

const variablesContent = fs.readFileSync(variablesFile, "utf-8");

// Извлекаем только CSS переменные (--*)
const cssVariableRegex = /--([a-zA-Z0-9_-]+)\s*:/g;
const definedVariables = new Set();
let match;

while ((match = cssVariableRegex.exec(variablesContent)) !== null) {
    definedVariables.add(match[1]);
}

console.log(`Найдено CSS переменных: ${definedVariables.size}`);

// 2. Анализируем использование переменных во всех файлах проекта
const usedVariables = new Set();

// Анализируем все файлы проекта (кроме node_modules)
async function analyzeProjectFiles() {
    // Ищем во всех файлах, кроме стилей (кроме main.scss)
    const projectFiles = await glob(["../../src/**/*.{astro,html,js,ts,jsx,tsx}", "!../../src/**/node_modules/**"], { cwd: __dirname });

    for (const filePath of projectFiles) {
        const fullPath = path.join(__dirname, filePath);
        const content = fs.readFileSync(fullPath, "utf-8");

        // Ищем использование CSS переменных (var(--variable-name))
        const varUsageRegex = /var\(--([a-zA-Z0-9_-]+)\)/g;
        let usageMatch;

        while ((usageMatch = varUsageRegex.exec(content)) !== null) {
            usedVariables.add(usageMatch[1]);
        }
    }
}

// Анализируем только main.scss и его зависимости (кроме partials)
async function analyzeStyles() {
    const mainFile = path.join(__dirname, "../../src/styles/main.scss");
    if (!fs.existsSync(mainFile)) {
        console.error(`Основной SCSS файл не найден: ${mainFile}`);
        return;
    }

    async function analyzeStyleFile(filePath, processedFiles = new Set()) {
        if (processedFiles.has(filePath)) return;
        processedFiles.add(filePath);

        const content = fs.readFileSync(filePath, "utf-8");

        // Ищем использование CSS переменных в стилях
        const varUsageRegex = /var\(--([a-zA-Z0-9_-]+)\)/g;
        let usageMatch;

        while ((usageMatch = varUsageRegex.exec(content)) !== null) {
            usedVariables.add(usageMatch[1]);
        }

        // Анализируем импорты (только не-partial файлы)
        const importRegex = /@(?:import|use)\s+['"]([^'_][^'"]*)['"]/g;
        let importMatch;

        while ((importMatch = importRegex.exec(content)) !== null) {
            const importPath = importMatch[1];
            const extensions = [".scss", ".css", ""];

            for (const ext of extensions) {
                const fullImportPath = path.join(path.dirname(filePath), `${importPath}${ext}`);

                if (fs.existsSync(fullImportPath)) {
                    await analyzeStyleFile(fullImportPath, processedFiles);
                    break;
                }
            }
        }
    }

    await analyzeStyleFile(mainFile);
}

// Запускаем анализ
await analyzeProjectFiles();
await analyzeStyles();

console.log(`Используется CSS переменных: ${usedVariables.size}`);

// 3. Находим неиспользуемые переменные
const unusedVariables = [...definedVariables].filter((v) => !usedVariables.has(v));

console.log(`Неиспользуемые CSS переменные (${unusedVariables.length}):`, unusedVariables);

// 4. Удаляем неиспользуемые переменные из файла
if (unusedVariables.length > 0) {
    let newContent = variablesContent;
    let removedCount = 0;

    unusedVariables.forEach((varName) => {
        const varRegex = new RegExp(`--${varName}\\s*:[^;]+;\\s*(\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/\\s*)?`, "g");
        const before = newContent;
        newContent = newContent.replace(varRegex, "");
        if (newContent !== before) removedCount++;
    });

    // Удаляем лишние пустые строки
    newContent = newContent.replace(/\n{3,}/g, "\n\n").trim();

    // Сохраняем резервную копию
    const backupFile = `${variablesFile}.bak_${Date.now()}`;
    fs.writeFileSync(backupFile, variablesContent);
    console.log(`Создана резервная копия: ${backupFile}`);

    fs.writeFileSync(variablesFile, newContent);
    console.log(`Удалено ${removedCount} неиспользуемых CSS переменных`);
} else {
    console.log("Неиспользуемые CSS переменные не найдены");
}
