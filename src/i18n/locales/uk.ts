/*
 * Better Paste - Plugin for Obsidian
 * Copyright (c) 2026 Johan Sanneblad
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TranslationStrings } from '../types';

/** Ukrainian. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_UK: TranslationStrings = {
    commands: {
        paste: 'Вставити',
        pasteRaw: 'Вставити без обробки',
        cleanSelection: 'Очистити виділення',
        cleanTerminal: 'Очистити вивід термінала',
        cleanPdf: 'Очистити текст із PDF',
        runSnippet: 'Виконати сніпет',
        commasInside: 'Перенести коми всередину лапок',
        commasOutside: 'Перенести коми за лапки',
        toggleCleanup: 'Перемкнути автоматичне очищення'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'автоматичну обробку увімкнено',
        cleanupOff: 'автоматичну обробку вимкнено',
        selectTextFirst: 'спершу виділіть текст',
        nothingToClean: 'немає чого очищати',
        clipboardFailed: 'не вдалося прочитати буфер обміну',
        titleFailed: 'не вдалося отримати заголовок.',
        fetchingTitle: 'отримання заголовка...',
        fetchingTitles: 'отримання заголовків...',
        titlesFailed: {
            one: 'не вдалося отримати {count} заголовок',
            few: 'не вдалося отримати {count} заголовки',
            many: 'не вдалося отримати {count} заголовків',
            other: 'не вдалося отримати {count} заголовка'
        },
        imagesFailed: {
            one: 'не вдалося зберегти {count} зображення',
            few: 'не вдалося зберегти {count} зображення',
            many: 'не вдалося зберегти {count} зображень',
            other: 'не вдалося зберегти {count} зображення'
        },
        imagesFailedLinkKept: '{images}, початкове посилання збережено',
        imagesFailedNothingPasted: '{images}, тому нічого не вставлено',
        snippetsCopied: 'сніпети скопійовано',
        snippetsCopyFailed: 'не вдалося скопіювати сніпети'
    },

    settings: {
        exampleFallback: '{description} Приклад: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Про плагін',
            whatsNewName: 'Що нового в Better Paste {version}',
            whatsNewDesc: 'Що змінилося в останніх випусках.',
            whatsNewAliases: ['примітки до випуску', 'зміни', 'список змін', 'версія', 'оновлення', 'історія'],
            whatsNewButton: 'Переглянути оновлення',
            showReleaseNotesName: 'Показувати вікно «Що нового» після оновлення',
            showReleaseNotesDesc: 'Відкриває вікно «Що нового» один раз після кожного оновлення.',
            showReleaseNotesAliases: ['що нового', 'оновлення', 'вікно', 'сповіщення', 'новини', 'журнал змін'],
            supportName: 'Підтримати розробку',
            supportDesc: 'Якщо Better Paste вам корисний, підтримайте його розробку.',
            supportAliases: ['спонсор', 'пожертва', 'кава', 'github'],
            sponsorButton: '❤️ Спонсорувати',
            coffeeButton: '☕️ Пригостити кавою',
            pluginsName: 'Подивіться мої інші плагіни',
            pluginsAliases: ['плагіни', 'notebook navigator', 'pixel perfect image', 'автор', 'більше'],
            notebookNavigatorDesc: 'Кращий файловий браузер і календар',
            pixelPerfectImageDesc: 'Точна зміна розміру зображень та інше'
        },

        behavior: {
            autoCleanName: 'Очищати кожну вставку',
            autoCleanDesc:
                'Застосовує правила під час кожної вставки. Коли вимкнено, правила працюють лише через команди Better Paste. Окрему нотатку можна виключити властивістю "{property}: false" або увімкнути обробку властивістю "{property}: true".',
            autoCleanAliases: ['автоматично', 'увімкнути', 'вимкнути', 'нотатка', 'виключити', 'властивість', 'frontmatter'],
            notePropertyName: 'Властивість нотатки',
            notePropertyDesc: 'Властивість, що вмикає або вимикає Better Paste для однієї нотатки.',
            notePropertyAliases: ['нотатка', 'властивість', 'frontmatter', 'виключити', 'вимкнути', 'увімкнути', 'bp']
        },

        images: {
            heading: 'Зображення',
            savingName: 'Вебзображення',
            savingDesc:
                'Виберіть, що відбувається під час вставлення посилань на зображення з вебу. «Нічого не робити» залишає вставлене як є, «Вставляти посилання з попереднім переглядом» показує зображення прямо з вебу, а «Завантажувати з попереднім переглядом» зберігає копію у сховищі.',
            savingDownloadDesc: 'Типово імʼя файлу походить з адреси:',
            savingChoiceOff: 'Нічого не робити',
            savingChoiceLink: 'Вставляти посилання з попереднім переглядом',
            savingChoiceDownload: 'Завантажувати з попереднім переглядом',
            savingAliases: [
                'завантажити',
                'посилання',
                'вбудувати',
                'попередній перегляд',
                'url',
                'веб',
                'вкладення',
                'safari',
                'локальний',
                'зображення',
                'тека'
            ],
            sizeStyleName: 'Розмір і стиль',
            sizeStyleDesc: 'Додавайте вставленим зображенням ширину або клас CSS, автоматично чи через вікно вибору.',
            sizeStyleAliases: ['розмір', 'ширина', 'css', 'клас', 'стиль', 'масштаб', 'invert'],
            summarySize: 'Розмір: {value}',
            summaryStyle: 'Стиль: {value}',
            summaryAsk: 'Запитувати',
            sizeChoiceName: 'Застосовувати розмір під час вставки',
            sizeChoiceDesc:
                'Додає ширину кожному збереженому вбудованому зображенню, наприклад ![[photo.jpg|400]]. Властивість ширини нотатки має пріоритет.',
            sizeChoiceAliases: ['розмір', 'ширина', 'розмір зображення', 'масштаб', 'вбудовування', '400'],
            sizeOptionsName: 'Варіанти розміру',
            sizeOptionsDesc: 'Ширини, доступні вище та в діалозі під час вставки, через кому.',
            classChoiceName: 'Застосовувати клас CSS під час вставки',
            classChoiceDesc:
                'Додає клас кожному збереженому вбудованому зображенню, наприклад ![[photo.jpg#invert]]. Що робить клас, визначають теми та сніпети CSS.',
            classChoiceAliases: ['css', 'клас', 'сніпет', 'invert', 'тема', 'фільтр', 'вбудовування'],
            classOptionsName: 'Варіанти класу',
            classOptionsDesc: 'Класи, доступні вище та в діалозі під час вставки, через кому.',
            choiceNone: 'Нічого не робити',
            choiceAsk: 'Запитувати під час кожної вставки',
            nameFormatName: 'Імена файлів',
            customDesc:
                'Використовуйте {{name}} для назви джерела, {{noteName}} для назви нотатки, {{property:xyz}} для властивості з frontmatter, {{counter}} або {{counter:2}} для номера, що зростає, та формати дат Moment, наприклад YYYY-MM-DD.',
            customScreenshotDesc:
                'Знімок екрана не має назви джерела, тому його {{name}} стає «Pasted image» з міткою часу, як в Obsidian.',
            customMomentLink: 'Формат Moment',
            customExample: 'Приклад: {value}',
            customExampleNote: 'Моя нотатка',
            customAliases: [
                'імʼя',
                'файл',
                'дата',
                'moment',
                'YYYY',
                '{{name}}',
                'лічильник',
                'властивість',
                'назва нотатки',
                'знімок екрана',
                'перейменувати',
                'буфер обміну',
                'paste image rename'
            ],
            sizePropertyName: 'Властивість ширини зображення',
            sizePropertyDesc:
                'Властивість frontmatter, що задає ширину зображень, вставлених у нотатку. З "{property}: 400" у нотатці вставлене зображення набуває вигляду ![[photo.png|400]]. Залиште порожнім, щоб ширина не додавалася.',
            sizePropertyAliases: ['розмір', 'frontmatter', 'властивість', 'масштаб']
        },

        links: {
            heading: 'Посилання',
            titlesName: 'Отримувати заголовки для вставлених посилань',
            titlesDesc:
                'Вставлення однієї вебадреси створює посилання Markdown із заголовком сторінки. Якщо виділено текст, він стає підписом, а заголовок не завантажується. Якщо заголовок отримати не вдалося, залишається сама адреса.',
            titlesAliases: ['заголовок', 'сторінка', 'сайт', 'посилання markdown', 'завантажити'],
            cleaningName: 'Очищати вставлені посилання',
            cleaningDesc: 'Видаляє параметри відстеження зі вставлених посилань:',
            cleaningAliases: ['url', 'відстеження', 'utm', 'параметри', 'запит', 'сайт', 'домен', 'youtube', 'виняток'],
            removalsName: 'Видалення параметрів із посилань',
            removalsDesc: 'Додаткові параметри для видалення скрізь або на певних сайтах.',
            rulesCount: {
                one: '{count} запис',
                few: '{count} записи',
                many: '{count} записів',
                other: '{count} запису'
            },
            builtInName: 'Вбудовані правила видалення',
            builtInDesc:
                'Оновлено {date}. Глобальні фільтри відстеження: {trackingCount}. Правила для конкретних сайтів: {siteCount}. Криптографічно підписані посилання залишаються без змін.',
            builtInButton: 'Переглянути список',
            listName: 'Ваші правила видалення',
            listDesc:
                'Видаліть параметр із звичайних посилань на будь-якому сайті, ввівши його назву окремо. Наприклад, fbclid видаляє параметр fbclid скрізь, де він зустрічається.\n\nВидаляйте параметри лише на одному сайті за допомогою example.com | source, ref. Це видаляє source та ref з example.com та його піддоменів, тоді як усі інші параметри залишаються. Почніть рядок із !, щоб вимкнути вбудовані правила видалення для цього сайту. Криптографічно підписані посилання завжди залишаються без змін.',
            listAliases: ['домен', 'параметр', 'фільтр', 'видалити', 'youtube'],
            listInvalid: 'Неправильне правило видалення: {values}',
            suggestName: 'Запропонуйте свої правила видалення',
            suggestDesc: 'Допоможіть вдосконалити вбудовані правила видалення, запропонувавши параметри, які варто видаляти.',
            suggestAliases: ['долучитися', 'відправити', 'поділитися', 'надіслати', 'фільтр'],
            suggestButton: 'Переглянути та надіслати',
            testerName: 'Спробуйте',
            testerDesc: 'Вставте посилання, щоб побачити очищений результат.',
            testerLabel: 'Посилання для очищення',
            testerEmpty: 'Очищене посилання зʼявиться тут.'
        },

        text: {
            heading: 'Обробка тексту',
            trimName: 'Прибирати навколишні пробіли',
            trimDesc: 'Видаляє порожні рядки та пробіли на початку й у кінці вставленого тексту.',
            trimAliases: ['пробіл', 'порожній рядок', 'новий рядок', 'обрізання'],
            invisibleName: 'Невидимі символи',
            invisibleDesc: 'Видаляє пробіли нульової ширини й перетворює нерозривні пробіли на звичайні.',
            invisibleAliases: ['ші', 'chatgpt', 'claude', 'llm', 'юнікод', 'невидимий', 'nbsp', 'пробіли'],
            invisibleExampleStart: 'Цей',
            invisibleExampleMiddle: 'результат',
            invisibleExampleEnd: ' був добрий.',
            invisibleExampleAfter: 'Цей результат був добрий.',
            quotesName: 'Лапки',
            quotesDesc: 'Замінює друкарські лапки й апострофи на прямі.',
            quotesAliases: [
                'лапки',
                'друкарські лапки',
                'типографські лапки',
                'фігурні лапки',
                'прямі лапки',
                'апостроф',
                'пунктуація',
                'типографіка',
                'ші'
            ],
            quotesExample: 'Вона сказала: “Готово”.',
            dashesName: 'Тире',
            dashesDesc: 'Замінює середнє та довге тире на дефіси.',
            dashesAliases: ['тире', 'довге тире', 'середнє тире', 'коротке тире', 'дефіс', 'пунктуація', 'типографіка', 'ші'],
            dashesExample: 'Результат — попри все — виявився добрим.'
        },

        structure: {
            heading: 'Структура',
            listNestingName: 'Зберігати вкладеність списків під час вставки',
            listNestingDesc:
                'Вставляє скопійований список зі збереженою ієрархією, вирівнюючи відступ за пунктом списку, в який вставляєте.',
            listNestingAliases: ['список', 'вкладений', 'відступ', 'ієрархія', 'структура', 'маркери', 'прапорець', 'дерево'],
            quoteContinuationName: 'Продовжувати блокові цитати під час вставки',
            quoteContinuationDesc:
                'Вставляє багаторядковий текст у рядок цитати й оформлює кожен рядок як цитату, щоб увесь вставлений текст залишався всередині блокової цитати або виноски.',
            quoteContinuationAliases: ['цитата', 'блокова цитата', 'виноска', 'цитування', 'примітка', 'абзац']
        },

        custom: {
            heading: 'Власна обробка',
            pipelineName: 'Застосовувати до тексту власні сніпети з регулярними виразами',
            pastedText: 'Вставлений текст',
            note: 'Нотатка',
            wikiButton: 'Відкрити вікі',
            regexButton: 'Відкрити тестер регулярних виразів',
            snippetsName: 'Текстові сніпети',
            snippetsDesc:
                'Застосовуються до всього вставленого тексту після вбудованих правил. Увімкніть ті, що мають виконуватися під час вставки.',
            urlSnippetsName: 'Сніпети посилань',
            urlSnippetsDesc:
                'Застосовуються до кожного вставленого посилання після отримання заголовка сторінки. Правила бачать лише готове посилання Markdown, а сама адреса залишається незмінною.',
            enabledSnippetsCount: {
                one: '{count} увімкнений сніпет',
                few: '{count} увімкнені сніпети',
                many: '{count} увімкнених сніпетів',
                other: '{count} увімкненого сніпета'
            },
            snippetRulesCount: {
                one: '{count} правило',
                few: '{count} правила',
                many: '{count} правил',
                other: '{count} правила'
            },
            invalidRulesCount: {
                one: '{count} неправильний рядок',
                few: '{count} неправильні рядки',
                many: '{count} неправильних рядків',
                other: '{count} неправильного рядка'
            },
            unnamedSnippet: 'Сніпет без назви',
            emptyState: 'Ви ще не створили жодного сніпета.',
            addSnippet: 'Додати сніпет',
            editButton: 'Редагувати сніпет',
            exportName: 'Експортувати сніпети',
            exportDesc: 'Копіює всі сніпети у форматі обміну вікі.',
            exportButton: 'Копіювати сніпети',
            importName: 'Імпортувати сніпети',
            importDesc: 'Додає сніпети з формату обміну вікі.',
            previewName: 'Спробуйте',
            previewDesc: 'Введіть приклад тексту, щоб побачити результат усіх увімкнених сніпетів.',
            modalPreviewDesc: 'Введіть приклад тексту, щоб побачити результат цього сніпета.',
            previewInputLabel: 'Приклад тексту',
            previewEmpty: 'Оброблений текст зʼявиться тут.',
            urlPreviewDesc: 'Змініть приклад посилання із заголовком, щоб побачити результат усіх увімкнених сніпетів посилань.',
            urlModalPreviewDesc: 'Змініть приклад посилання із заголовком, щоб побачити результат цього сніпета.',
            urlPreviewLabel: 'Приклад посилання із заголовком',
            urlPreviewEmpty: 'Оброблене посилання зʼявиться тут.',
            nameName: 'Назва',
            rulesName: 'Правила',
            rulesDesc: 'Введіть по одній заміні з регулярним виразом JavaScript у кожному рядку.',
            wikiPasteHint: 'Скопіюйте готовий сніпет із вікі та вставте його прямо в поле правил.',
            invalidLine: 'Рядок {line}: {value}',
            saveButton: 'Зберегти',
            recognizedSnippetsCount: {
                one: 'Розпізнано {count} сніпет',
                few: 'Розпізнано {count} сніпети',
                many: 'Розпізнано {count} сніпетів',
                other: 'Розпізнано {count} сніпета'
            },
            recognizedRulesCount: {
                one: 'розпізнано {count} правило',
                few: 'розпізнано {count} правила',
                many: 'розпізнано {count} правил',
                other: 'розпізнано {count} правила'
            },
            unparseableName: 'Нерозпізнані рядки',
            importFallbackName: 'Імпортований сніпет'
        }
    },

    imageModal: {
        title: 'Параметри зображення',
        sizeName: 'Розмір',
        className: 'Клас CSS',
        none: 'Нічого не робити',
        apply: 'Застосувати',
        cancel: 'Скасувати'
    },

    pdfModal: {
        furniture: 'Прибрати номери сторінок',
        singleParagraph: "Об'єднати все в один абзац",
        description:
            "Перенесені рядки з'єднуються, розірвані дефісом слова відновлюються, лігатури замінюються звичайними літерами, а зайві пробіли вилучаються.",
        preview: 'Попередній перегляд'
    },

    welcome: {
        title: 'Ласкаво просимо до Better Paste',
        intro: [
            'Копіюйте зображення із Safari просто у сховище, вставляйте посилання без параметрів відстеження, виправляйте розірвані рядки виводу термінала й очищайте текст від ШІ. Просто вставте, решту зробить Better Paste.',
            'Порада перед початком: призначте команду **Вставити без обробки** на `Cmd+Shift+V` (`Ctrl+Shift+V` у Windows), щоб завжди можна було вставити саме те, що лежить у буфері обміну.',
            'Кожне правило має власний перемикач у розділі Налаштування, Better Paste, а властивість `{property}: false` вимикає плагін для окремої нотатки.'
        ],
        startButton: 'Почати'
    },

    overlap: {
        title: 'Better Paste: плагіни, що дублюються',
        thanks: 'Дякуємо, що встановили та використовуєте Better Paste!',
        intro: {
            one: 'Зараз у вас встановлено {count} плагін, який робить приблизно те саме, що й Better Paste, тому вимкніть або видаліть:',
            few: 'Зараз у вас встановлено {count} плагіни, які роблять приблизно те саме, що й Better Paste, тому вимкніть або видаліть:',
            many: 'Зараз у вас встановлено {count} плагінів, які роблять приблизно те саме, що й Better Paste, тому вимкніть або видаліть:',
            other: 'Зараз у вас встановлено {count} плагіна, які роблять приблизно те саме, що й Better Paste, тому вимкніть або видаліть:'
        },
        outro: 'Вимкнути можна в розділі Налаштування > Сторонні додатки.',
        dontRemind: 'Більше не нагадувати',
        button: 'Зрозуміло'
    },

    whatsNew: {
        title: 'Що нового в Better Paste',
        releaseHeading: 'Версія {version} ({date})',
        categoryNew: 'Нове',
        categoryImproved: 'Покращено',
        categoryChanged: 'Змінено',
        categoryFixed: 'Виправлено',
        support: 'Якщо Better Paste вам корисний, підтримайте його розробку.',
        coffeeButton: '☕️ Пригостити кавою',
        thanksButton: 'Дякую!',
        dontShowAgain: 'Більше не показувати після оновлень'
    }
};
