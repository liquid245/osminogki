# Сайт летнего лагеря на 11ty

Статический сайт, построенный на 11ty (Eleventy), для продуктов летнего лагеря.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run serve
```

Сайт будет доступен по адресу http://localhost:8080

## Сборка

```bash
npm run build
```

Результат сборки будет в папке `_dist/`

## Структура проекта

```
_site/
├── .eleventy.js              # Конфигурация 11ty
├── package.json              # Зависимости Node.js
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions для деплоя
├── _products/               # Продукты (лендинги)
│   ├── summer-camp/
│   │   ├── _index.md        # Общие свойства страницы
│   │   ├── 01-hero.md
│   │   ├── 02-problem.md
│   │   ├── 03-solution.md
│   │   ├── 04-pricing.md
│   │   └── 05-reviews.md
│   └── english-course/
│       └── ...
├── _shared/
│   └── blocks/              # Универсальные блоки
│       ├── reviews.md
│       └── faq.md
├── _layouts/                # Шаблоны страниц
│   ├── product.html         # Шаблон для продуктов
│   └── default.html         # Базовый шаблон
├── _includes/               # Переиспользуемые компоненты
│   ├── head.html            # HEAD с SEO
│   ├── header.html          # Шапка
│   ├── footer.html          # Подвал
│   └── scripts.html         # JavaScript модули
├── assets/
│   ├── css/
│   │   └── style.css        # Основные стили
│   ├── js/
│   │   ├── bot-link-builder.js
│   │   ├── utm-handler.js
│   │   └── analytics.js
│   └── images/
├── 404.html
├── robots.txt
└── README.md
```

## Деплой на GitHub Pages

Сайт автоматически деплоится на GitHub Pages при push в ветку `main` через GitHub Actions.

## Редактирование контента

Контент редактируется через Markdown файлы в папке `_products/`. Каждый продукт имеет свою папку с блоками контента.

## JavaScript модули

- `bot-link-builder.js` - Генерация ссылок на Telegram бота
- `utm-handler.js` - Обработка UTM параметров
- `analytics.js` - Отслеживание событий

## Лицензия

MIT
