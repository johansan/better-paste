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
        toggleCleanup: 'Перемкнути автоматичне очищення'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'автоматичну обробку увімкнено',
        cleanupOff: 'автоматичну обробку вимкнено',
        selectTextFirst: 'спершу виділіть текст',
        nothingToClean: 'немає чого очищати',
        clipboardFailed: 'не вдалося прочитати буфер обміну',
        titleFailed: 'не вдалося отримати заголовок.',
        fetchingTitle: 'отримання заголовка{dots}',
        imagesFailed: {
            one: 'не вдалося зберегти {count} зображення',
            few: 'не вдалося зберегти {count} зображення',
            many: 'не вдалося зберегти {count} зображень',
            other: 'не вдалося зберегти {count} зображення'
        },
        imagesFailedLinkKept: '{images}, початкове посилання збережено',
        imagesFailedNothingPasted: '{images}, тому нічого не вставлено',
        aiTextCleaned: 'текст ШІ впорядковано',
        terminalCleaned: 'вивід термінала очищено',
        textProcessed: 'стиль тексту скориговано',
        urlsCleaned: {
            one: 'очищено {count} URL',
            few: 'очищено {count} URL',
            many: 'очищено {count} URL',
            other: 'очищено {count} URL'
        },
        imagesSaved: {
            one: 'збережено {count} зображення',
            few: 'збережено {count} зображення',
            many: 'збережено {count} зображень',
            other: 'збережено {count} зображення'
        }
    },

    settings: {
        exampleFallback: '{description} Приклад: {example}',
        plainFallback: '{description} {example}',

        start: {
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
            pixelPerfectImageDesc: 'Точна зміна розміру зображень та багато іншого'
        },

        behavior: {
            heading: 'Поведінка',
            autoCleanName: 'Очищати кожну вставку',
            autoCleanDesc:
                'Застосовує правила під час кожної вставки. Коли вимкнено, правила працюють лише через команди Better Paste. Окрему нотатку можна виключити властивістю "bp: false" або увімкнути властивістю "bp: true".',
            autoCleanAliases: ['автоматично', 'увімкнути', 'вимкнути', 'нотатка', 'виключити', 'властивість', 'frontmatter'],
            showNoticesName: 'Показувати сповіщення, коли вставку змінено',
            showNoticesDesc: 'Однорядковий підсумок змін. Про помилки повідомляється завжди.',
            showNoticesAliases: ['сповіщення', 'підсумок', 'повідомлення', 'тихо']
        },

        images: {
            heading: 'Зображення',
            savingName: 'Зберігати вставлені зображення у сховище',
            savingDesc:
                'Зберігає вставлені зображення до теки вкладень і посилається на локальний файл замість вебадреси. Стосується «Копіювати зображення» в Safari, зображень у скопійованому вебвмісті та вставлених адрес зображень. Типово імʼя файлу походить з адреси:',
            savingAliases: ['завантажити', 'вкладення', 'safari', 'знімок екрана', 'зображення', 'тека', 'імʼя файлу', 'ширина', 'розмір'],
            pageName: 'Обробка зображень',
            pageDesc: 'Імена файлів і ширина зображень.',
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
                'Властивість frontmatter, що задає ширину зображень, вставлених у нотатку. З "bp-image-width: 400" у нотатці вставлене зображення набуває вигляду ![[photo.png|400]]. Залиште порожнім, щоб ширина не додавалася.',
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
            stripName: 'Які параметри видаляти',
            stripDesc: 'До параметрів відстеження належать utm_source, fbclid і gclid.',
            stripAliases: ['utm', 'відстеження', 'запит', 'параметри'],
            stripAll: 'Усі параметри, якщо правило сайту їх не зберігає',
            stripTracking: 'Лише відомі параметри відстеження',
            rulesName: 'Правила сайтів',
            rulesDesc: 'Параметри, які зберігаються на певних сайтах.',
            rulesCount: {
                one: '{count} сайт',
                few: '{count} сайти',
                many: '{count} сайтів',
                other: '{count} сайту'
            },
            listName: 'Ваші правила сайтів',
            listDesc:
                '{sites} вже підтримуються плагіном. Додайте тут власні правила, по одному в рядку. «example.com» зберігає всі параметри цього сайту, «example.com: a, b» зберігає лише ці два, а «!example.com» вилучає правило, що постачається з плагіном. Піддомени враховуються автоматично.',
            listShippedCount: {
                one: '{count} поширений сайт',
                few: '{count} поширені сайти',
                many: '{count} поширених сайтів',
                other: '{count} поширеного сайту'
            },
            listAliases: ['домен', 'виняток', 'білий список', 'youtube'],
            listInvalid: 'Це не назва сайту: {values}',
            testerName: 'Спробуйте',
            testerDesc: 'Вставте посилання, щоб побачити, що зберігають правила.',
            testerLabel: 'Посилання для очищення',
            testerEmpty: 'Очищене посилання зʼявиться тут.'
        },

        terminal: {
            heading: 'Текст термінала',
            cleanupName: 'Очищати вивід термінала',
            cleanupDesc:
                'Знову зʼєднує рядки, перенесені терміналом, і прибирає коди кольору та відступи на початку. Блоки коду, таблиці та списки лишаються без змін.',
            cleanupAliases: ['перенесення', 'зʼєднати', 'ansi', 'консоль', 'оболонка', 'відступ', 'маркер', 'список', 'markdown'],
            pageName: 'Обробка тексту термінала',
            pageDesc: 'Зʼєднання рядків і символи маркерів.',
            rejoinName: 'Коли зʼєднувати розірваний рядок',
            rejoinDesc: 'Рядок приєднується до попереднього лише тоді, коли той виглядає заповненим.',
            rejoinAliases: ['відступ', 'перенесення', 'агресивно', 'безпечно', 'git log'],
            rejoinIndented: 'Лише якщо рядок має відступ',
            rejoinAny: 'З відступом чи без',
            rejoinNever: 'Ніколи, лише прибирати коди й відступи',
            bulletsName: 'Символи маркерів',
            bulletsDesc: 'Що робити із символами маркерів, як-от •, у виводі термінала.',
            bulletsAliases: ['список', 'markdown', 'тире'],
            bulletsMarkdown: 'Перетворити на елементи списку Markdown',
            bulletsPreserve: 'Залишити як є',
            testerName: 'Спробуйте',
            testerDesc: 'Вставте вивід термінала, щоб побачити, як його очищено.',
            testerLabel: 'Текст термінала для очищення',
            testerEmpty: 'Очищений текст зʼявиться тут.',
            testerSample: [
                '• Додатковий крок зачіпає лише обробник Enter у списку, тому основна зміна проста. Переглядаючи сусідні сценарії, я знайшов',
                '  два ймовірні проблемні місця, які варто перевірити: виділення може зміститися після оновлення.'
            ]
        },

        text: {
            heading: 'Обробка тексту',
            trimName: 'Прибирати навколишні пробіли',
            trimDesc: 'Видаляє порожні рядки та пробіли на початку й у кінці вставленого тексту.',
            trimAliases: ['пробіл', 'порожній рядок', 'новий рядок', 'обрізання'],
            commasName: 'Коми та лапки',
            commasDesc: 'Де стоїть кома поруч із закривальною подвійною лапкою.',
            commasAliases: ['кома', 'лапки', 'цитата', 'пунктуація', 'стиль'],
            commasNone: 'Без змін',
            commasInside: 'Кома всередині лапок',
            commasOutside: 'Кома за лапками',
            commasExampleSource: 'Він назвав це "готовим," а потім пішов.',
            commasExampleOutside: 'Він назвав це "готовим", а потім пішов.',
            invisibleName: 'Очищення ШІ: невидимі символи',
            invisibleDesc: 'Видаляє пробіли нульової ширини й перетворює нерозривні пробіли на звичайні.',
            invisibleAliases: [
                'ші',
                'chatgpt',
                'claude',
                'llm',
                'тире',
                'довге тире',
                'середнє тире',
                'дефіс',
                'юнікод',
                'невидимий',
                'nbsp',
                'типографіка',
                'пунктуація',
                'пробіли'
            ],
            invisibleExampleStart: 'Цей',
            invisibleExampleMiddle: 'результат',
            invisibleExampleEnd: ' був добрий.',
            invisibleExampleAfter: 'Цей результат був добрий.',
            punctuationName: 'Очищення ШІ: тире та лапки',
            punctuationDesc: 'Перетворює довгі тире на дефіси, а фігурні лапки на прямі.',
            punctuationAliases: ['довге тире', 'середнє тире', 'дефіс', 'лапки', 'фігурні лапки', 'апостроф', 'пунктуація', 'типографіка'],
            punctuationExampleBefore: '“Результат — попри все — виявився бездоганним.”',
            punctuationExampleAfter: '"Результат - попри все - виявився бездоганним."'
        }
    },

    welcome: {
        title: 'Ласкаво просимо до Better Paste',
        intro: [
            'Better Paste змінює вміст буфера обміну під час вставлення в нотатку.',
            'Він зберігає повʼязані зображення як вкладення сховища, видаляє параметри відстеження з посилань, зʼєднує перенесені рядки виводу термінала й замінює фігурні лапки та невидимі символи простими відповідниками.',
            'Кожне правило можна вимкнути окремо.',
            'Окрему нотатку можна повністю виключити властивістю "bp: false". Налаштування розташовані в розділі Налаштування, Better Paste.'
        ],
        startButton: 'Почати'
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
