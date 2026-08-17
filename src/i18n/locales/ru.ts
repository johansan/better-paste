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
        cleanPdf: 'Очистить текст из PDF',
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
                'Применяет правила при каждой вставке. Когда выключено, правила работают только через команды Better Paste. Отдельную заметку можно исключить свойством "{property}: false" или включить свойством "{property}: true".',
            autoCleanAliases: ['автоматически', 'включить', 'выключить', 'заметка', 'исключить', 'свойство', 'frontmatter'],
            notePropertyName: 'Свойство заметки',
            notePropertyDesc: 'Свойство, включающее или выключающее Better Paste для одной заметки.',
            notePropertyAliases: ['заметка', 'свойство', 'frontmatter', 'исключить', 'выключить', 'включить', 'bp']
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
            customAliases: ['имя', 'файл', 'дата', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Свойство ширины изображения',
            sizePropertyDesc:
                'Свойство frontmatter, задающее ширину изображений, вставляемых в заметку. Со свойством "{property}: 400" в заметке вставленное изображение принимает вид ![[photo.png|400]]. Оставьте пустым, чтобы ширина не добавлялась.',
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
            removalsName: 'Удаление параметров из ссылок',
            removalsDesc: 'Дополнительные параметры для удаления везде или на определённых сайтах.',
            rulesCount: {
                one: '{count} запись',
                few: '{count} записи',
                many: '{count} записей',
                other: '{count} записи'
            },
            builtInName: 'Встроенные правила удаления',
            builtInDesc:
                'Обновлено: {date}. Глобальные фильтры отслеживания: {trackingCount}. Правила для конкретных сайтов: {siteCount}. Ссылки с криптографической подписью остаются без изменений.',
            builtInButton: 'Просмотреть список',
            listName: 'Ваши правила удаления',
            listDesc:
                'Удалите параметр из обычных ссылок на любом сайте, введя его название отдельно. Например, «fbclid» удаляет параметр fbclid везде, где он встречается.\n\nУдалите параметры только на одном сайте с помощью «example.com | source, ref». Это удалит source и ref с example.com и его поддоменов, в то время как все остальные параметры останутся. Начните строку со знака «!», чтобы отключить встроенные правила удаления для этого сайта. Криптографически подписанные ссылки всегда остаются без изменений.',
            listAliases: ['домен', 'параметр', 'фильтр', 'удалить', 'youtube'],
            listInvalid: 'Недопустимое правило удаления: {values}',
            suggestName: 'Предложите свои правила удаления',
            suggestDesc: 'Помогите улучшить встроенные правила удаления, предложив параметры, которые стоит удалять.',
            suggestAliases: ['поддержите проект', 'отправить', 'поделиться', 'предложить', 'фильтр'],
            suggestButton: 'Проверить и отправить',
            testerName: 'Попробуйте',
            testerDesc: 'Вставьте ссылку, чтобы увидеть очищенный результат.',
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

    pdfModal: {
        furniture: 'Убрать номера страниц',
        singleParagraph: 'Объединить всё в один абзац',
        description:
            'Перенесённые строки соединяются, разорванные дефисом слова восстанавливаются, лигатуры заменяются обычными буквами, а лишние пробелы удаляются.',
        preview: 'Предпросмотр'
    },

    welcome: {
        title: 'Добро пожаловать в Better Paste',
        intro: [
            'Копируйте изображения из Safari прямо в хранилище, вставляйте ссылки без параметров отслеживания, исправляйте разорванные строки вывода терминала и очищайте текст из ИИ. Просто вставьте, остальное сделает Better Paste.',
            'Совет перед началом: назначьте команду **Вставить без обработки** на `Cmd+Shift+V` (`Ctrl+Shift+V` в Windows), чтобы всегда можно было вставить ровно то, что лежит в буфере обмена.',
            'У каждого правила свой переключатель в разделе Настройки, Better Paste, а свойство `{property}: false` отключает плагин для отдельной заметки.'
        ],
        startButton: 'Начать'
    },

    overlap: {
        title: 'Better Paste: плагины, дублирующие друг друга',
        thanks: 'Спасибо, что установили и используете Better Paste!',
        intro: {
            one: 'Сейчас у вас установлен {count} плагин, который делает примерно то же самое, поэтому отключите или удалите:',
            few: 'Сейчас у вас установлено {count} плагина, которые делают примерно то же самое, поэтому отключите или удалите:',
            many: 'Сейчас у вас установлено {count} плагинов, которые делают примерно то же самое, поэтому отключите или удалите:',
            other: 'Сейчас у вас установлено {count} плагина, которые делают примерно то же самое, поэтому отключите или удалите:'
        },
        outro: 'Отключить можно в разделе Настройки > Сторонние плагины.',
        dontRemind: 'Больше не напоминать',
        button: 'Понятно'
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
