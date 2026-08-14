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
        toggleCleanup: 'Переключить автоматическую очистку'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'автоматическая обработка включена',
        cleanupOff: 'автоматическая обработка выключена',
        selectTextFirst: 'сначала выделите текст',
        nothingToClean: 'очищать нечего',
        clipboardFailed: 'не удалось прочитать буфер обмена',
        titleFailed: 'не удалось получить заголовок.',
        fetchingTitle: 'получение заголовка{dots}',
        imagesFailed: {
            one: 'не удалось сохранить {count} изображение',
            few: 'не удалось сохранить {count} изображения',
            many: 'не удалось сохранить {count} изображений',
            other: 'не удалось сохранить {count} изображения'
        },
        imagesFailedLinkKept: '{images}, исходная ссылка сохранена',
        imagesFailedNothingPasted: '{images}, поэтому ничего не вставлено. Содержимое осталось в буфере обмена.',
        aiTextCleaned: 'текст ИИ приведён в порядок',
        terminalCleaned: 'вывод терминала очищен',
        textProcessed: 'стиль текста поправлен',
        urlsCleaned: {
            one: 'очищен {count} URL',
            few: 'очищено {count} URL',
            many: 'очищено {count} URL',
            other: 'очищено {count} URL'
        },
        imagesSaved: {
            one: 'сохранено {count} изображение',
            few: 'сохранено {count} изображения',
            many: 'сохранено {count} изображений',
            other: 'сохранено {count} изображения'
        }
    },

    settings: {
        exampleFallback: '{description} Пример: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Что нового в Better Paste {version}',
            whatsNewDesc: 'Что изменилось в последних выпусках.',
            whatsNewAliases: ['примечания к выпуску', 'изменения', 'список изменений', 'версия', 'обновление', 'история'],
            whatsNewButton: 'Посмотреть обновления',
            supportName: 'Поддержать разработку',
            supportDesc: 'Если Better Paste вам полезен, поддержите его дальнейшую разработку.',
            supportAliases: ['спонсор', 'пожертвование', 'кофе', 'github'],
            sponsorButton: '❤️ Спонсировать',
            coffeeButton: '☕️ Купить мне кофе'
        },

        behavior: {
            heading: 'Поведение',
            autoCleanName: 'Очищать каждую вставку',
            autoCleanDesc:
                'Применяет правила при каждой вставке. Выключите, чтобы пользоваться только командами. Отдельную заметку можно исключить свойством "better-paste: false".',
            autoCleanAliases: ['автоматически', 'включить', 'выключить', 'заметка', 'исключить', 'свойство', 'frontmatter'],
            showNoticesName: 'Показывать уведомление, когда вставка изменена',
            showNoticesDesc: 'Однострочная сводка того, что было очищено. Об ошибках сообщается всегда, независимо от этой настройки.',
            showNoticesAliases: ['уведомление', 'сводка', 'сообщение', 'тихо']
        },

        images: {
            heading: 'Изображения',
            savingName: 'Сохранять вставленные изображения в хранилище',
            savingDesc:
                'Сохраняет вставленные изображения как локальные файлы вместо внешних ссылок. Это касается «Скопировать изображение» в Safari, изображений внутри скопированного веб-содержимого и отдельных адресов изображений. Изображения попадают в папку вложений вашего хранилища. С вариантом «Имя из источника»:',
            savingAliases: ['скачать', 'вложение', 'safari', 'снимок экрана', 'изображение', 'папка', 'имя файла', 'ширина', 'размер'],
            pageName: 'Обработка изображений',
            pageDesc: 'Имена файлов и ширина изображений для заметки.',
            nameFormatName: 'Имена файлов',
            nameFormatDesc: 'Выберите, как называются сохранённые файлы изображений.',
            nameFormatSource: 'Имя из источника',
            nameFormatCustom: 'Свой формат',
            customName: 'Свой формат',
            customDesc: 'Используйте {{name}} для имени источника и форматы дат Moment, например YYYY-MM-DD.',
            customMomentLink: 'Формат Moment',
            customExample: 'Пример: {value}',
            customAliases: ['имя', 'файл', 'дата', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Свойство ширины изображения',
            sizePropertyDesc:
                'Свойство frontmatter, задающее ширину изображений, вставляемых в заметку. Заметка с этим свойством берёт вставку снимков экрана на себя вместо Obsidian. Оставьте пустым, чтобы отключить.',
            sizePropertyAliases: ['размер', 'frontmatter', 'свойство', 'масштаб']
        },

        links: {
            heading: 'Ссылки',
            titlesName: 'Получать заголовки для вставленных ссылок',
            titlesDesc:
                'Если в буфере обмена только веб-адрес, не являющийся изображением, заголовок страницы загружается и вставляется ссылка Markdown. Любой другой выделенный текст становится подписью без сетевого запроса. Если заголовок получить не удалось, остаётся исходный адрес.',
            titlesAliases: ['заголовок', 'страница', 'сайт', 'ссылка markdown', 'скачать'],
            cleaningName: 'Очищать вставленные ссылки',
            cleaningDesc: 'Удаляет параметры отслеживания из вставленных ссылок. Зачёркнутая часть удаляется:',
            cleaningAliases: ['url', 'отслеживание', 'utm', 'параметры', 'запрос', 'сайт', 'домен', 'youtube', 'исключение'],
            stripName: 'Какие параметры удалять',
            stripDesc:
                'Выберите, удалять ли все параметры запроса или только известные параметры отслеживания. Правила сайтов могут сохранять параметры в обоих режимах.',
            stripAliases: ['utm', 'отслеживание', 'запрос', 'параметры'],
            stripAll: 'Все параметры, кроме сохранённых правилом сайта',
            stripTracking: 'Только известные параметры отслеживания',
            rulesName: 'Правила сохранения параметров',
            rulesDesc: 'Правила сайтов для сохранения конкретных параметров запроса в обоих режимах удаления.',
            rulesCount: {
                one: '{count} сайт',
                few: '{count} сайта',
                many: '{count} сайтов',
                other: '{count} сайта'
            },
            listName: 'Ваши правила сайтов',
            listDesc:
                '{sites} уже обрабатываются и обновляются вместе с плагином. Добавьте здесь свои правила, по одному в строке. «example.com» сохраняет все параметры этого сайта, «example.com: a, b» сохраняет только эти два, а «!example.com» отменяет правило, поставляемое с плагином. В режиме «Только известные параметры отслеживания» правило спасает лишь подходящие параметры отслеживания, потому что остальные и так сохраняются. Поддомены учитываются автоматически.',
            listShippedCount: {
                one: '{count} популярный сайт',
                few: '{count} популярных сайта',
                many: '{count} популярных сайтов',
                other: '{count} популярных сайта'
            },
            listAliases: ['домен', 'исключение', 'белый список', 'youtube'],
            listInvalid: 'Это не имя сайта: {values}',
            testerName: 'Попробуйте',
            testerDesc: 'Вставьте ссылку, чтобы увидеть, что сохранят эти правила.',
            testerLabel: 'Ссылка для очистки',
            testerEmpty: 'Очищенная ссылка появится здесь.'
        },

        terminal: {
            heading: 'Текст терминала',
            cleanupName: 'Очищать вывод терминала',
            cleanupDesc:
                'Снова соединяет перенесённые строки вывода терминала и убирает отступы. Коды цвета удаляются. Блоки кода, таблицы и элементы списков не затрагиваются.',
            cleanupAliases: ['перенос', 'соединить', 'ansi', 'консоль', 'оболочка', 'отступ', 'маркер', 'список', 'markdown'],
            pageName: 'Обработка текста терминала',
            pageDesc: 'Условия соединения строк и символы маркеров.',
            rejoinName: 'Когда соединять разорванную строку',
            rejoinDesc: 'Условие, при котором строка считается продолжением предыдущей.',
            rejoinAliases: ['отступ', 'перенос', 'агрессивно', 'безопасно', 'git log'],
            rejoinIndented: 'Только если следующая строка с отступом',
            rejoinAny: 'Всегда, когда строка выше выглядит заполненной',
            rejoinNever: 'Никогда не соединять, только убирать коды и отступы',
            bulletsName: 'Символы маркеров',
            bulletsDesc:
                'Определяет, сохраняются ли символы маркеров (например •) в выводе терминала или превращаются в элементы списка Markdown.',
            bulletsAliases: ['список', 'markdown', 'тире'],
            bulletsMarkdown: 'Преобразовать в элементы списка Markdown',
            bulletsPreserve: 'Оставить как есть',
            testerName: 'Попробуйте',
            testerDesc: 'Вставьте вывод терминала, чтобы увидеть, как он будет очищен.',
            testerLabel: 'Текст терминала для очистки',
            testerEmpty: 'Очищенный текст появится здесь.',
            testerSample: [
                '• Дополнительный шаг затрагивает только обработчик Enter в списке, поэтому основное изменение простое. Просматривая соседние сценарии, я нашёл',
                '  два вероятных проблемных места, которые стоит проверить: выделение может сместиться после обновления.'
            ]
        },

        text: {
            heading: 'Обработка текста',
            trimName: 'Убирать окружающие пробелы',
            trimDesc: 'Удаляет пустые строки и пробелы в начале и конце вставленного текста.',
            trimAliases: ['пробел', 'пустая строка', 'перевод строки', 'обрезка'],
            commasName: 'Запятые и кавычки',
            commasDesc: 'Выберите, где ставить запятую рядом с закрывающей двойной кавычкой.',
            commasAliases: ['запятая', 'кавычка', 'цитата', 'пунктуация', 'стиль'],
            commasNone: 'Без изменений',
            commasInside: 'Запятая внутри кавычек',
            commasOutside: 'Запятая за кавычками',
            commasExampleSource: 'Он назвал это "готовым," а потом ушёл.',
            commasExampleOutside: 'Он назвал это "готовым", а потом ушёл.',
            invisibleName: 'Очистка ИИ: невидимые символы',
            invisibleDesc: 'Удаляет пробелы нулевой ширины и превращает неразрывные пробелы в обычные.',
            invisibleAliases: [
                'ии',
                'chatgpt',
                'claude',
                'llm',
                'тире',
                'длинное тире',
                'среднее тире',
                'дефис',
                'юникод',
                'невидимый',
                'nbsp',
                'типографика',
                'пунктуация',
                'пробелы'
            ],
            invisibleExampleStart: 'Этот',
            invisibleExampleMiddle: 'результат',
            invisibleExampleEnd: ' был хорошим.',
            invisibleExampleAfter: 'Этот результат был хорошим.',
            punctuationName: 'Очистка ИИ: тире и кавычки',
            punctuationDesc: 'Превращает длинные тире в дефисы, а фигурные кавычки в прямые.',
            punctuationAliases: [
                'длинное тире',
                'среднее тире',
                'дефис',
                'кавычки',
                'фигурные кавычки',
                'апостроф',
                'пунктуация',
                'типографика'
            ],
            punctuationExampleBefore: '“Результат — вопреки всему — оказался безупречным.”',
            punctuationExampleAfter: '"Результат - вопреки всему - оказался безупречным."'
        }
    },

    welcome: {
        title: 'Добро пожаловать в Better Paste',
        intro: [
            'Better Paste изменяет содержимое буфера обмена в момент вставки в заметку.',
            'Он сохраняет связанные изображения во вложениях хранилища, удаляет параметры отслеживания из ссылок, соединяет перенесённые строки вывода терминала и заменяет фигурные кавычки и невидимые символы простыми аналогами.',
            'Каждое правило можно отключить отдельно.',
            'Отдельную заметку можно полностью исключить свойством "better-paste: false". Настройки находятся в разделе Настройки, Better Paste.'
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
