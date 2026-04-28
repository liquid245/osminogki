# _site/_context.md
# Контекст модуля: site

---

## Что делает

Статические лендинги для каждого продукта (летний лагерь, курсы и т.д.).
Захватывают UTM-параметры из Яндекс.Директа, передают пользователя
в Telegram-бот через Deep Link с product_id и UTM.

## Стек

```
HTML5 + Tailwind CSS (собранный, не CDN)
Vanilla JS
GitHub Pages (хостинг)
Яндекс.Метрика (аналитика)
```

## Хостинг

GitHub Pages. Деплой: GitHub Actions при push в main.
URL: https://<org>.github.io/<repo>/

## Репозиторий

https://github.com/<org>/github-pages-repo

## Ключевые файлы

```
shared/js/bot-link-builder.js   — строит Deep Link для кнопок
shared/js/utm-handler.js        — сохраняет UTM в sessionStorage
products/<id>/index.html        — лендинг продукта
products/<id>/_context.md       — контекст конкретного продукта
```

## Зависит от

- Яндекс.Метрика (счётчик задаётся в каждом index.html)
- `_bot/` — через контракт Deep Link (должны совпадать product_id)

## Влияет на

- `_bot/` — через Deep Link: если изменить формат ссылки, бот получит неверный payload

## Контракт с ботом

```
Формат Deep Link: https://t.me/<botUsername>?start=<product_id>__<utm_source>__<utm_campaign>
Источник product_id: window.PRODUCT_CONFIG.productId в index.html каждого продукта
Соответствие: productId ДОЛЖЕН совпадать с ключом в _bot/products/
```

## Правила зоны

Подробно: `agents/zones/site.md`
