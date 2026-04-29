# _site/_context.md
# Контекст модуля: site

---

## Что делает

Статический frontend-модуль проекта.
Хранит лендинги и связанные с ними frontend-ресурсы для текущих продуктов.

## Роль в текущем проекте

- принимает пользовательский трафик на страницы продуктов;
- хранит product-specific frontend-контент;
- передаёт пользователя в соседние части системы через интеграционный контракт, описанный в проектной документации.

## Стек текущего проекта

```text
HTML5
Tailwind CSS
Vanilla JS
GitHub Pages
Яндекс.Метрика
```

## Ключевые project-specific файлы

```text
shared/js/bot-link-builder.js
shared/js/utm-handler.js
products/<id>/index.html
products/<id>/_context.md
```

## Текущие зависимости и связи

- использует проектные frontend-ресурсы и конфигурацию продуктов;
- зависит от project-specific интеграционного контракта с соседним модулем;
- использует analytics и deployment flow, описанные в `docs/*.md`.

## Где искать project-specific детали

- архитектура проекта: `docs/system_architecture.md`
- frontend и SEO: `docs/seo_and_frontend_strategy.md`
- архитектура сайта: `docs/site_architecture_11ty.md`

## Где искать reusable policy

Универсальные operational rules для статического frontend находятся в `agents/zones/frontend_static.md`.