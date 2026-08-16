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

/** Russian. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_RU: TranslationStrings = {
    commands: {
        paste: 'Вставить',
        pasteRaw: 'Вставить без обработки',
        cleanSelection: 'Очистить выделение',
        cleanTerminal: 'Очистить вывод терминала',
        commasInside: 'Перенести запятые внутрь кавычек',
        commasOutside: 'Перенести запятые за кавычки',
        toggleCleanup: 'Переключить автоматическую очистку'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'автоматическая обработка включена',
        cleanupOff: 'автоматическая обработка выключена',
        selectTextFirst: 'сначала выделите текст',
        nothingToClean: 'очищать нечего',
        clipboardFailed: 'не удалось прочитать буфер обмена',
        titleFailed: 'не удалось получить заголовок.',
        fetchingTitle: 'получение заголовка...',
        imagesFailed: {
            one: 'не удалось сохранить {count} изображение',
            few: 'не удалось сохранить {count} изображения',
            many: 'не удалось сохранить {count} изображений',
            other: 'не удалось сохранить {count} изображения'
        },
        imagesFailedLinkKept: '{images}, исходная ссылка сохранена',
        imagesFailedNothingPasted: '{images}, поэтому ничего не вставлено'
    },

    settings: {
        exampleFallback: '{description} Пример: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'О плагине',
            whatsNewName: 'Что нового в Better Paste {version}',
            whatsNewDesc: 'Что изменилось в последних выпусках.',
            whatsNewAliases: ['примечания к выпуску', 'изменения', 'список изменений', 'версия', 'обновление', 'история'],
            whatsNewButton: 'Посмотреть обновления',
            supportName: 'Поддержать разработку',
            supportDesc: 'Если Better Paste вам полезен, поддержите его разработку.',
            supportAliases: ['спонсор', 'пожертвование', 'кофе', 'github'],
            sponsorButton: '❤️ Спонсировать',
            coffeeButton: '☕️ Купить мне кофе',
            pluginsName: 'Посмотрите мои другие плагины',
            pluginsAliases: ['плагины', 'notebook navigator', 'pixel perfect image', 'автор', 'ещё'],
            notebookNavigatorDesc: 'Улучшенный файловый браузер и календарь',
            pixelPerfectImageDesc: 'Точное изменение размера изображений и другое'
        },

        behavior: {
            autoCleanName: 'Очищать каждую вставку',
            autoCleanDesc:
                'Применяет правила при каждой вставке. Когда выключено, правила работают только через команды Better Paste. Отдельную заметку можно исключить свойством "bp: false" или включить свойством "bp: true".',
            autoCleanAliases: ['автоматически', 'включить', 'выключить', 'заметка', 'исключить', 'свойство', 'frontmatter']
        },

        images: {
            heading: 'Изображения',
            savingName: 'Сохранять вставленные изображения в хранилище',
            savingDesc:
                'Сохраняет вставленные изображения в папку вложений и ссылается на локальный файл вместо веб-адреса. Касается «Скопировать изображение» в Safari, изображений внутри скопированного веб-содержимого и вставленных адресов изображений. По умолчанию имя файла берётся из адреса:',
            savingAliases: ['скачать', 'вложение', 'safari', 'снимок экрана', 'изображение', 'папка', 'имя файла', 'ширина', 'размер'],
            sizeChoiceName: 'Применять размер при вставке',
            sizeChoiceDesc:
                'Добавляет ширину каждому сохранённому встроенному изображению, например ![[photo.jpg|400]]. Свойство ширины заметки имеет приоритет.',
            sizeChoiceAliases: ['размер', 'ширина', 'размер изображения', 'масштаб', 'встраивание', '400'],
            sizeOptionsName: 'Варианты размера',
            sizeOptionsDesc: 'Ширины, доступные выше и в диалоге при вставке, через запятую.',
            classChoiceName: 'Применять класс CSS при вставке',
            classChoiceDesc:
                'Добавляет класс каждому сохранённому встроенному изображению, например ![[photo.jpg#invert]]. Что делает класс, определяют темы и сниппеты CSS.',
            classChoiceAliases: ['css', 'класс', 'сниппет', 'invert', 'тема', 'фильтр', 'встраивание'],
            classOptionsName: 'Варианты класса',
            classOptionsDesc: 'Классы, доступные выше и в диалоге при вставке, через запятую.',
            choiceNone: 'Ничего не делать',
            choiceAsk: 'Спрашивать при каждой вставке',
            nameFormatName: 'Имена файлов',
            nameFormatDesc: 'Как называются сохранённые изображения.',
            nameFormatSource: 'Имя из источника',
            nameFormatCustom: 'Свой формат',
            customName: 'Свой формат',
            customDesc: 'Используйте {{name}} для имени источника и форматы дат Moment, например YYYY-MM-DD.',
            customMomentLink: 'Формат Moment',
            customExample: 'Пример: {value}',
            customAliases: ['имя', 'файл', 'дата', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Свойство заметки',
            notePropertyDesc:
                'Свойство, включающее или выключающее Better Paste для одной заметки. При "bp: false" заметка остаётся нетронутой, а при "bp: true" очищается, даже когда «Очищать каждую вставку» выключено. Оставьте пустым, чтобы игнорировать свойство.',
            notePropertyAliases: ['заметка', 'свойство', 'frontmatter', 'исключить', 'выключить', 'включить', 'bp'],
            sizePropertyName: 'Свойство ширины изображения',
            sizePropertyDesc:
                'Свойство frontmatter, задающее ширину изображений, вставляемых в заметку. Со свойством "image-width: 400" в заметке вставленное изображение принимает вид ![[photo.png|400]]. Оставьте пустым, чтобы ширина не добавлялась.',
            sizePropertyAliases: ['размер', 'frontmatter', 'свойство', 'масштаб']
        },

        links: {
            heading: 'Ссылки',
            titlesName: 'Получать заголовки для вставленных ссылок',
            titlesDesc:
                'Вставка одного веб-адреса создаёт ссылку Markdown с заголовком страницы. Если выделен текст, он становится подписью, и заголовок не запрашивается. Если заголовок получить не удалось, остаётся сам адрес.',
            titlesAliases: ['заголовок', 'страница', 'сайт', 'ссылка markdown', 'скачать'],
            cleaningName: 'Очищать вставленные ссылки',
            cleaningDesc: 'Удаляет параметры отслеживания из вставленных ссылок:',
            cleaningAliases: ['url', 'отслеживание', 'utm', 'параметры', 'запрос', 'сайт', 'домен', 'youtube', 'исключение'],
            stripName: 'Какие параметры удалять',
            stripDesc: 'К параметрам отслеживания относятся utm_source, fbclid и gclid.',
            stripAliases: ['utm', 'отслеживание', 'запрос', 'параметры'],
            stripAll: 'Все параметры, если правило сайта не сохраняет их',
            stripTracking: 'Только известные параметры отслеживания',
            rulesName: 'Правила сайтов',
            rulesDesc: 'Параметры, сохраняемые на определённых сайтах.',
            rulesCount: {
                one: '{count} сайт',
                few: '{count} сайта',
                many: '{count} сайтов',
                other: '{count} сайта'
            },
            listName: 'Ваши правила сайтов',
            listDesc:
                '{sites} уже поддерживаются плагином. Добавьте здесь свои правила, по одному в строке. «example.com» сохраняет все параметры этого сайта, «example.com: a, b» сохраняет только эти два, а «!example.com» удаляет правило, поставляемое с плагином. Поддомены учитываются автоматически.',
            listShippedCount: {
                one: '{count} популярный сайт',
                few: '{count} популярных сайта',
                many: '{count} популярных сайтов',
                other: '{count} популярных сайта'
            },
            listAliases: ['домен', 'исключение', 'белый список', 'youtube'],
            listInvalid: 'Это не имя сайта: {values}',
            testerName: 'Попробуйте',
            testerDesc: 'Вставьте ссылку, чтобы увидеть, что сохраняют правила.',
            testerLabel: 'Ссылка для очистки',
            testerEmpty: 'Очищенная ссылка появится здесь.'
        },

        text: {
            heading: 'Обработка текста',
            trimName: 'Убирать окружающие пробелы',
            trimDesc: 'Удаляет пустые строки и пробелы в начале и конце вставленного текста.',
            trimAliases: ['пробел', 'пустая строка', 'перевод строки', 'обрезка'],
            invisibleName: 'Невидимые символы',
            invisibleDesc: 'Удаляет пробелы нулевой ширины и превращает неразрывные пробелы в обычные.',
            invisibleAliases: ['ии', 'chatgpt', 'claude', 'llm', 'юникод', 'невидимый', 'nbsp', 'пробелы'],
            invisibleExampleStart: 'Этот',
            invisibleExampleMiddle: 'результат',
            invisibleExampleEnd: ' был хорошим.',
            invisibleExampleAfter: 'Этот результат был хорошим.',
            quotesName: 'Кавычки',
            quotesDesc: 'Заменяет типографские кавычки и апострофы на прямые.',
            quotesAliases: [
                'кавычки',
                'типографские кавычки',
                'умные кавычки',
                'фигурные кавычки',
                'прямые кавычки',
                'апостроф',
                'пунктуация',
                'типографика',
                'ии'
            ],
            quotesExample: 'Она сказала: “Готово”.',
            dashesName: 'Тире',
            dashesDesc: 'Заменяет среднее и длинное тире на дефисы.',
            dashesAliases: ['тире', 'длинное тире', 'среднее тире', 'короткое тире', 'дефис', 'пунктуация', 'типографика', 'ии'],
            dashesExample: 'Результат — вопреки всему — оказался хорошим.'
        }
    },

    imageModal: {
        title: 'Параметры изображения',
        sizeName: 'Размер',
        className: 'Класс CSS',
        none: 'Ничего не делать',
        apply: 'Применить',
        cancel: 'Отмена'
    },

    welcome: {
        title: 'Добро пожаловать в Better Paste',
        intro: [
            'Копируйте изображения из Safari прямо в хранилище, вставляйте ссылки без параметров отслеживания, исправляйте разорванные строки вывода терминала и очищайте текст из ИИ. Просто вставьте, остальное сделает Better Paste.',
            'Совет перед началом: назначьте команду **Вставить без обработки** на `Cmd+Shift+V` (`Ctrl+Shift+V` в Windows), чтобы всегда можно было вставить ровно то, что лежит в буфере обмена.',
            'У каждого правила свой переключатель в разделе Настройки, Better Paste, а свойство `bp: false` отключает плагин для отдельной заметки.'
        ],
        startButton: 'Начать'
    },

    whatsNew: {
        title: 'Что нового в Better Paste',
        scrollLabel: 'Примечания к выпуску',
        releaseHeading: 'Версия {version} ({date})',
        categoryNew: 'Новое',
        categoryImproved: 'Улучшено',
        categoryChanged: 'Изменено',
        categoryFixed: 'Исправлено',
        support: 'Если Better Paste вам полезен, поддержите его разработку.',
        coffeeButton: '☕️ Купить мне кофе',
        thanksButton: 'Спасибо!'
    }
};
