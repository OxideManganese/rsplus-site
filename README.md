# RS+ Website — корпоративный сайт компании «РС Плюс»

**RS+** — проект корпоративного сайта компании «РС Плюс», специализирующейся на техническом сопровождении фанерных производств в России и странах СНГ.  
Сайт разработан в рамках производственной практики с использованием современных веб-технологий и архитектуры Astro.js.

## Цели проекта

- Создание современного корпоративного сайта с возможностью масштабирования.  
- Разработка адаптивного интерфейса для представления оборудования, модернизаций и сервисных услуг компании.  
- Интеграция новостного блока через Telegram-канал компании.  
- Подготовка структуры для последующего развёртывания в **Yandex Cloud (Serverless)**.

---

## Используемые технологии

- **Astro.js** — фреймворк для сборки статических сайтов.  
- **HTML5 / CSS3 / JavaScript (ES6)**  
- **Node.js / NPM** — управление зависимостями и сборка проекта.  
- **IcoMoon** — генерация иконок в виде шрифта.  
- **Cheerio.js** — парсинг HTML в serverless-функции для импорта новостей.  
- **GitHub + Netlify** — контроль версий и публикация тестовой версии сайта.

---

##  Структура проекта
```
├── public/ — статические ресурсы
│ ├── icomoon/ — набор фирменных иконок (шрифт + стили)
│ │ ├── style.css
│ │ └── fonts/
│ ├── images/ — изображения сайта
│ │ ├── clients/ — логотипы партнёров
│ │ ├── contacts/ — фотографии специалистов
│ │ ├── modernization/ — схемы и фото линий, проектов
│ │ │ └── project-original/
│ │ ├── colnechnaja-office.svg
│ │ ├── logo-rsplus.svg
│ │ ├── line-rsplus.svg
│ │ └── service-banner.jpg
│ └── scripts/ — клиентские JavaScript-модули
│ ├── header-burger.js
│ ├── scheme.js
│ └── scroll-observer.js
│
├── src/ — основной исходный код проекта
│ ├── components/ — переиспользуемые интерфейсные компоненты
│ │ ├── BrandedCircle.astro
│ │ ├── CompetenciesCard.astro
│ │ ├── Footer.astro
│ │ ├── Header.astro
│ │ ├── NewsList.astro
│ │ └── SchemePoint.astro
│ │
│ ├── layouts/ — шаблоны страниц
│ │ ├── BaseLayout.astro
│ │ └── ModernizationLayout.astro
│ │
│ ├── pages/ — страницы и API-эндпоинты
│ │ ├── api/
│ │ │ └── news.js — serverless-функция загрузки новостей
│ │ ├── modernization/ — подраздел модернизаций по типам линий
│ │ │ ├── composing.astro
│ │ │ ├── drying-grading.astro
│ │ │ ├── hot-pressing.astro
│ │ │ ├── laminating.astro
│ │ │ ├── layup-stacking.astro
│ │ │ ├── repair.astro
│ │ │ └── peeling.astro
│ │ ├── contacts.astro
│ │ ├── index.astro
│ │ ├── lines.astro
│ │ ├── modernization.astro
│ │ ├── parts.astro
│ │ └── service.astro
│ │
│ └── styles/ — таблицы стилей
│ ├── clients.css
│ ├── contacts.css
│ ├── content-card.css
│ ├── footer.css
│ ├── header.css
│ ├── main.css
│ ├── modernization.css
│ ├── scheme.css
│ ├── service.css
│ ├── typography.css
│ └── variables.css
│
├── .gitignore
├── astro.config.mjs
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🌐 Ссылки

- **Демо-версия сайта:** [https://rsplus.netlify.app](https://rsplus.netlify.app)  
- **Репозиторий GitHub:** [https://github.com/OxideManganese/rsplus-site](https://github.com/OxideManganese/rsplus-site)

--- 
