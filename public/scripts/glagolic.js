(function() {
    'use strict';
    
    // Проверяем наличие параметра lang со значением ⱃⱆ (глаголица)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('lang') !== 'ⱃⱆ') return;
    
    // Базовый алфавит глаголицы
    const GLAGOLITIC_MAP = {
        'а': 'Ⰰ', 'б': 'Ⰱ', 'в': 'Ⰲ', 'г': 'Ⰳ', 'д': 'Ⰴ',
        'е': 'Ⰵ', 'ж': 'Ⰶ', 'з': 'Ⰸ', 'и': 'Ⰺ', 'к': 'Ⰽ',
        'л': 'Ⰾ', 'м': 'Ⰿ', 'н': 'Ⱀ', 'о': 'Ⱁ', 'п': 'Ⱂ',
        'р': 'Ⱃ', 'с': 'Ⱄ', 'т': 'Ⱅ', 'у': 'Ⱆ', 'ф': 'Ⱇ',
        'х': 'Ⱈ', 'ц': 'Ⱌ', 'ч': 'Ⱍ', 'ш': 'Ⱎ', 'щ': 'Ⱋ',
        'ъ': 'Ⱏ', 'ы': 'ⰟⰊ', 'ь': 'Ⱐ', 'э': 'Ⰵ', 'ю': 'Ⱓ',
        // Буквы с особыми правилами (будут обрабатываться отдельно)
        'ё': '', 'й': '', 'я': '', 'и': '',
        // Заглавные буквы
        'А': 'Ⰰ', 'Б': 'Ⰱ', 'В': 'Ⰲ', 'Г': 'Ⰳ', 'Д': 'Ⰴ',
        'Е': 'Ⰵ', 'Ж': 'Ⰶ', 'З': 'Ⰸ', 'И': 'Ⰺ', 'К': 'Ⰽ',
        'Л': 'Ⰾ', 'М': 'Ⰿ', 'Н': 'Ⱀ', 'О': 'Ⱁ', 'П': 'Ⱂ',
        'Р': 'Ⱃ', 'С': 'Ⱄ', 'Т': 'Ⱅ', 'У': 'Ⱆ', 'Ф': 'Ⱇ',
        'Х': 'Ⱈ', 'Ц': 'Ⱌ', 'Ч': 'Ⱍ', 'Ш': 'Ⱎ', 'Щ': 'Ⱋ',
        'Ъ': 'Ⱏ', 'Ы': 'ⰟⰊ', 'Ь': 'Ⱐ', 'Э': 'Ⰵ', 'Ю': 'Ⱓ',
        'Ё': '', 'Й': '', 'Я': '', 'И': ''
    };
    
    // Специальные символы
    const SPECIAL_SYMBOLS = {
        'ё': 'Ⱖ', 'Ё': 'Ⱖ', // Малый и большой юс
        'й': 'Ⰹ', 'Й': 'Ⰹ', // И с краткой
        // Для буквы Я - правила ниже
    };
    
    // Гласные для проверок
    const VOWELS = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
    const CONSONANTS = 'бвгджзйклмнпрстфхцчшщБВГДЖЗЙКЛМНПРСТФХЦЧШЩ';
    const SOFT_SIGNS = 'ьъЬЪ';
    
    // Функция для определения позиции в слове
    function getWordContext(text, position) {
        // Находим границы слова
        let start = position;
        let end = position;
        
        // Идём назад до начала слова
        while (start > 0 && /[а-яёА-ЯЁ]/.test(text[start - 1])) {
            start--;
        }
        
        // Идём вперёд до конца слова
        while (end < text.length - 1 && /[а-яёА-ЯЁ]/.test(text[end + 1])) {
            end++;
        }
        
        const word = text.substring(start, end + 1);
        const positionInWord = position - start;
        
        return {
            word: word,
            position: positionInWord,
            prevChar: positionInWord > 0 ? word[positionInWord - 1] : '',
            nextChar: positionInWord < word.length - 1 ? word[positionInWord + 1] : '',
            isWordStart: positionInWord === 0,
            isWordEnd: positionInWord === word.length - 1
        };
    }
    
    // Улучшенная функция преобразования текста
    function convertToGlagolitic(text) {
        let result = '';
        let i = 0;
        
        while (i < text.length) {
            const currentChar = text[i];
            const lowerChar = currentChar.toLowerCase();
            
            // 1. Проверка сочетаний "дж" и "дз" (регистронезависимо)
            if (i < text.length - 1) {
                const twoChars = (text[i] + text[i + 1]).toLowerCase();
                if (twoChars === 'дж' || twoChars === 'дз') {
                    result += 'ⰼ';
                    i += 2;
                    continue;
                }
            }
            
            // 2. Особые правила для буквы Я
            if (lowerChar === 'я') {
                const context = getWordContext(text, i);
                
                // Проверяем условия для Ⱝ (начало слова или после гласной/ь/ъ)
                if (context.isWordStart || 
                    VOWELS.includes(context.prevChar) || 
                    SOFT_SIGNS.includes(context.prevChar)) {
                    result += (currentChar === 'Я' ? 'Ⱝ' : 'ⱝ');
                } 
                // Во всех остальных случаях ⱔ
                else {
                    result += (currentChar === 'Я' ? 'ⱔ' : 'Ⱔ');
                }
                i++;
                continue;
            }
            
            // 3. Особые правила для буквы И
            if (lowerChar === 'и') {
                const context = getWordContext(text, i);
                
                // Проверяем, стоит ли И перед согласной или после С
                const isBeforeConsonant = CONSONANTS.includes(context.nextChar);
                const isAfterS = context.prevChar.toLowerCase() === 'с';
                
                if (isBeforeConsonant || isAfterS) {
                    result += (currentChar === 'И' ? 'Ⰻ' : 'ⰻ');
                } else {
                    result += (currentChar === 'И' ? 'Ⰺ' : 'ⰺ');
                }
                i++;
                continue;
            }
            
            // 4. Проверка специальных символов (ё, й)
            if (SPECIAL_SYMBOLS[currentChar]) {
                result += SPECIAL_SYMBOLS[currentChar];
                i++;
                continue;
            }
            
            // 5. Проверка базового алфавита
            if (GLAGOLITIC_MAP[currentChar]) {
                result += GLAGOLITIC_MAP[currentChar];
                i++;
                continue;
            }
            
            // 6. Проверка строчных букв (с приведением к регистру)
            if (GLAGOLITIC_MAP[lowerChar] && currentChar === lowerChar) {
                result += GLAGOLITIC_MAP[lowerChar];
                i++;
                continue;
            }
            
            // 7. Проверка заглавных букв
            if (currentChar !== lowerChar && GLAGOLITIC_MAP[lowerChar]) {
                // Для глаголицы нет регистра, используем базовую форму
                result += GLAGOLITIC_MAP[lowerChar];
                i++;
                continue;
            }
            
            // 8. Если символ не найден, оставляем как есть
            result += currentChar;
            i++;
        }
        
        return result;
    }
    
    // Функция для добавления параметра lang ко всем внутренним ссылкам
    function updateInternalLinks() {
        const links = document.querySelectorAll('a[href]');
        const currentDomain = window.location.hostname;
        
        links.forEach(link => {
            try {
                const url = new URL(link.href);
                
                // Проверяем, что ссылка ведёт на тот же домен
                if (url.hostname === currentDomain || 
                    url.hostname === '' || 
                    !url.hostname) {
                    
                    // Добавляем параметр lang=ⱃⱆ если его нет
                    if (!url.searchParams.has('lang')) {
                        url.searchParams.set('lang', 'ⱃⱆ');
                        link.href = url.toString();
                    } else if (url.searchParams.get('lang') !== 'ⱃⱆ') {
                        url.searchParams.set('lang', 'ⱃⱆ');
                        link.href = url.toString();
                    }
                }
            } catch (e) {
                // Для относительных ссылок
                if (link.href.startsWith('/') || 
                    link.href.startsWith('./') || 
                    link.href.startsWith('../') ||
                    !link.href.includes('://')) {
                    
                    // Парсим относительный URL
                    const baseUrl = window.location.origin;
                    const fullUrl = new URL(link.href, baseUrl);
                    
                    if (!fullUrl.searchParams.has('lang')) {
                        fullUrl.searchParams.set('lang', 'ⱃⱆ');
                        link.href = fullUrl.toString().replace(baseUrl, '');
                    } else if (fullUrl.searchParams.get('lang') !== 'ⱃⱆ') {
                        fullUrl.searchParams.set('lang', 'ⱃⱆ');
                        link.href = fullUrl.toString().replace(baseUrl, '');
                    }
                }
            }
        });
    }
    
    // Основная функция преобразования страницы
    function convertPageToGlagolitic() {
        // Элементы, которые нужно преобразовать
        const selectors = [
            'p', 'span', 'div:not(.no-glagolitic)', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'li', 'td', 'th', 'label', 'button', 'figcaption', 'blockquote',
            'cite', 'q', 'em', 'strong', 'b', 'i', 'figcaption', 'caption',
            'legend', 'summary', 'time', 'mark'
        ].join(', ');
        
        // Получаем все текстовые элементы
        const elements = document.querySelectorAll(selectors);
        
        // Преобразуем текст в элементах
        elements.forEach(element => {
            // Обрабатываем все текстовые узлы внутри элемента
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Пропускаем скрипты и стили
                        if (node.parentElement.tagName === 'SCRIPT' || 
                            node.parentElement.tagName === 'STYLE' ||
                            node.parentElement.classList.contains('no-glagolitic')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );
            
            let node;
            const nodesToProcess = [];
            
            while (node = walker.nextNode()) {
                if (node.textContent.trim().length > 0) {
                    nodesToProcess.push(node);
                }
            }
            
            // Преобразуем текст
            nodesToProcess.forEach(node => {
                const originalText = node.textContent;
                const convertedText = convertToGlagolitic(originalText);
                if (convertedText !== originalText) {
                    node.textContent = convertedText;
                }
            });
        });
        
        // Обрабатываем специальные атрибуты
        const specialAttributes = [
            ['title', document.title],
            ['meta[name="description"]', 'content'],
            ['meta[name="keywords"]', 'content'],
            ['input[placeholder]', 'placeholder'],
            ['textarea[placeholder]', 'placeholder'],
            ['img[alt]', 'alt']
        ];
        
        specialAttributes.forEach(([selector, attribute]) => {
            if (selector === 'title') {
                document.title = convertToGlagolitic(document.title);
            } else {
                document.querySelectorAll(selector).forEach(el => {
                    if (el[attribute]) {
                        el[attribute] = convertToGlagolitic(el[attribute]);
                    }
                });
            }
        });
        
        // Обновляем все внутренние ссылки
        updateInternalLinks();
        
        // Добавляем индикатор глаголицы
        addGlagoliticIndicator();
        
        // Добавляем специальный класс к body для стилизации
        document.body.classList.add('glagolitic-mode');
    }
    
    // Функция добавления индикатора
    function addGlagoliticIndicator() {
        // Удаляем старый индикатор если есть
        const oldIndicator = document.getElementById('glagolitic-indicator');
        if (oldIndicator) oldIndicator.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'glagolitic-indicator';
        indicator.innerHTML = 'ⰃⰎⰀⰃⰑⰎⰋⰜⰀ <small>(вернуться)</small>';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: "Segoe UI Symbol", "Arial Unicode MS", sans-serif;
            border: 2px solid white;
            transition: transform 0.3s, box-shadow 0.3s;
            font-weight: bold;
        `;
        
        // Эффекты при наведении
        indicator.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        };
        
        indicator.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };
        
        // Возврат к обычной версии
        indicator.onclick = function() {
            const url = new URL(window.location);
            url.searchParams.delete('lang');
            window.location.href = url.toString();
        };
        
        document.body.appendChild(indicator);
    }
    
    // Запускаем преобразование
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            convertPageToGlagolitic();
            // Также обновляем ссылки при динамической загрузке контента
            observeDOMChanges();
        });
    } else {
        convertPageToGlagolitic();
        observeDOMChanges();
    }
    
    // Наблюдатель за изменениями DOM для динамического контента
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                // Небольшая задержка для обработки динамического контента
                setTimeout(() => {
                    convertPageToGlagolitic();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Добавляем CSS для улучшения отображения глаголицы
    const style = document.createElement('style');
    style.textContent = `
        .glagolitic-mode {
            font-family: "Segoe UI Symbol", "Arial Unicode MS", "Noto Sans Glagolitic", sans-serif;
        }
        .glagolitic-mode * {
            letter-spacing: 0.5px;
            word-spacing: 1px;
        }
        
        /* Для улучшения читаемости */
        .glagolitic-mode h1,
        .glagolitic-mode h2,
        .glagolitic-mode h3 {
            font-weight: 700;
        }
        
        /* Исключение для элементов, где не нужно преобразование */
        .no-glagolitic,
        .no-glagolitic * {
            font-family: inherit !important;
        }
    `;
    document.head.appendChild(style);
    
    // Сохраняем состояние в sessionStorage
    sessionStorage.setItem('glagolitic_active', 'true');
})();