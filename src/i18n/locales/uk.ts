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
        imagesFailed: {
            one: 'не вдалося зберегти {count} зображення',
            few: 'не вдалося зберегти {count} зображення',
            many: 'не вдалося зберегти {count} зображень',
            other: 'не вдалося зберегти {count} зображення'
        },
        imagesFailedLinkKept: '{images}, початкове посилання збережено',
        imagesFailedNothingPasted: '{images}, тому нічого не вставлено'
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
            savingName: 'Зберігати вставлені зображення у сховище',
            savingDesc:
                'Зберігає вставлені зображення до теки вкладень і посилається на локальний файл замість вебадреси. Стосується «Копіювати зображення» в Safari, зображень у скопійованому вебвмісті та вставлених адрес зображень. Типово імʼя файлу походить з адреси:',
            savingAliases: ['завантажити', 'вкладення', 'safari', 'знімок екрана', 'зображення', 'тека', 'імʼя файлу', 'ширина', 'розмір'],
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
            nameFormatDesc: 'Як називаються збережені зображення.',
            nameFormatSource: 'Назва з джерела',
            nameFormatCustom: 'Власний формат',
            customName: 'Власний формат',
            customDesc: 'Використовуйте {{name}} для назви джерела та формати дат Moment, наприклад YYYY-MM-DD.',
            customMomentLink: 'Формат Moment',
            customExample: 'Приклад: {value}',
            customAliases: ['імʼя', 'файл', 'дата', 'moment', 'YYYY', '{{name}}'],
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
            one: 'Зараз у вас встановлено {count} плагін, який робить приблизно те саме, тому вимкніть або видаліть:',
            few: 'Зараз у вас встановлено {count} плагіни, які роблять приблизно те саме, тому вимкніть або видаліть:',
            many: 'Зараз у вас встановлено {count} плагінів, які роблять приблизно те саме, тому вимкніть або видаліть:',
            other: 'Зараз у вас встановлено {count} плагіна, які роблять приблизно те саме, тому вимкніть або видаліть:'
        },
        outro: 'Вимкнути можна в розділі Налаштування > Сторонні додатки.',
        dontRemind: 'Більше не нагадувати',
        button: 'Зрозуміло'
    },

    whatsNew: {
        title: 'Що нового в Better Paste',
        scrollLabel: 'Примітки до випуску',
        releaseHeading: 'Версія {version} ({date})',
        categoryNew: 'Нове',
        categoryImproved: 'Покращено',
        categoryChanged: 'Змінено',
        categoryFixed: 'Виправлено',
        support: 'Якщо Better Paste вам корисний, підтримайте його розробку.',
        coffeeButton: '☕️ Пригостити кавою',
        thanksButton: 'Дякую!'
    }
};
