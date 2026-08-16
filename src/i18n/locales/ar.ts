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

/** Arabic. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_AR: TranslationStrings = {
    commands: {
        paste: 'لصق',
        pasteRaw: 'لصق بدون معالجة',
        cleanSelection: 'تنظيف التحديد',
        cleanTerminal: 'تنظيف مخرجات الطرفية',
        commasInside: 'نقل الفواصل إلى داخل علامات الاقتباس',
        commasOutside: 'نقل الفواصل إلى خارج علامات الاقتباس',
        toggleCleanup: 'تبديل التنظيف التلقائي'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'المعالجة التلقائية مفعّلة',
        cleanupOff: 'المعالجة التلقائية معطّلة',
        selectTextFirst: 'حدّد نصًا أولًا',
        nothingToClean: 'لا شيء لتنظيفه',
        clipboardFailed: 'تعذّرت قراءة الحافظة',
        titleFailed: 'تعذّر جلب العنوان.',
        fetchingTitle: 'جارٍ جلب العنوان...',
        imagesFailed: {
            zero: 'تعذّر حفظ {count} صور',
            one: 'تعذّر حفظ {count} صورة',
            two: 'تعذّر حفظ {count} صورة',
            few: 'تعذّر حفظ {count} صور',
            many: 'تعذّر حفظ {count} صورةً',
            other: 'تعذّر حفظ {count} صورة'
        },
        imagesFailedLinkKept: '{images}، وأُبقي الرابط الأصلي',
        imagesFailedNothingPasted: '{images}، لذلك لم يُلصق شيء'
    },

    settings: {
        exampleFallback: '{description} مثال: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'حول',
            whatsNewName: 'الجديد في Better Paste {version}',
            whatsNewDesc: 'ما الذي تغيّر في أحدث الإصدارات.',
            whatsNewAliases: ['ملاحظات الإصدار', 'التغييرات', 'سجل التغييرات', 'إصدار', 'تحديث', 'السجل'],
            whatsNewButton: 'عرض التحديثات الأخيرة',
            supportName: 'دعم التطوير',
            supportDesc: 'إذا كان Better Paste مفيدًا لك، ففكّر في دعم تطويره.',
            supportAliases: ['رعاية', 'تبرع', 'قهوة', 'github'],
            sponsorButton: '❤️ رعاية',
            coffeeButton: '☕️ اشترِ لي قهوة',
            pluginsName: 'اطّلع على إضافاتي الأخرى',
            pluginsAliases: ['إضافات', 'notebook navigator', 'pixel perfect image', 'المطوّر', 'المزيد'],
            notebookNavigatorDesc: 'متصفّح ملفات وتقويم أفضل',
            pixelPerfectImageDesc: 'تغيير حجم الصور بدقة والمزيد'
        },

        behavior: {
            autoCleanName: 'تنظيف كل عملية لصق',
            autoCleanDesc:
                'يطبّق القواعد عند كل لصق. عند إيقافه لا تُطبّق القواعد إلا عبر أوامر Better Paste. يمكن لملاحظة واحدة أن تستثني نفسها بالخاصية "bp: false"، أو أن تطلب التنظيف بالخاصية "bp: true".',
            autoCleanAliases: ['تلقائي', 'تفعيل', 'تعطيل', 'ملاحظة', 'استثناء', 'خاصية', 'frontmatter']
        },

        images: {
            heading: 'الصور',
            savingName: 'حفظ الصور الملصقة في الخزنة',
            savingDesc:
                'يحفظ الصور الملصقة في مجلد المرفقات ويربط الملف المحلي بدل عنوان الويب. يشمل «نسخ الصورة» في Safari، والصور داخل محتوى ويب منسوخ، وعناوين الصور الملصقة. يأتي اسم الملف من العنوان افتراضيًا:',
            savingAliases: ['تنزيل', 'مرفق', 'safari', 'لقطة شاشة', 'صورة', 'مجلد', 'اسم الملف', 'عرض', 'حجم'],
            sizeChoiceName: 'تطبيق الحجم عند اللصق',
            sizeChoiceDesc: 'يضيف عرضًا إلى كل صورة مضمّنة تُحفظ، مثل ![[photo.jpg|400]]. خاصية العرض في الملاحظة لها الأولوية.',
            sizeChoiceAliases: ['حجم', 'عرض', 'حجم الصورة', 'تغيير الحجم', 'تضمين', '400'],
            sizeOptionsName: 'خيارات الحجم',
            sizeOptionsDesc: 'قيم العرض المعروضة أعلاه وفي مربع الحوار عند اللصق، مفصولة بفواصل.',
            classChoiceName: 'تطبيق فئة CSS عند اللصق',
            classChoiceDesc: 'يضيف فئة إلى كل صورة مضمّنة تُحفظ، مثل ![[photo.jpg#invert]]. تحدد السمات ومقتطفات CSS ما تفعله الفئة.',
            classChoiceAliases: ['css', 'فئة', 'مقتطف', 'invert', 'سمة', 'مرشح', 'تضمين'],
            classOptionsName: 'خيارات الفئة',
            classOptionsDesc: 'الفئات المعروضة أعلاه وفي مربع الحوار عند اللصق، مفصولة بفواصل.',
            choiceNone: 'لا تفعل شيئًا',
            choiceAsk: 'اسأل عند كل لصق',
            nameFormatName: 'أسماء الملفات',
            nameFormatDesc: 'كيف تُسمّى الصور المحفوظة.',
            nameFormatSource: 'الاسم من المصدر',
            nameFormatCustom: 'تنسيق مخصّص',
            customName: 'تنسيق مخصّص',
            customDesc: 'استخدم {{name}} لاسم المصدر وتنسيقات تاريخ Moment مثل YYYY-MM-DD.',
            customMomentLink: 'تنسيق Moment',
            customExample: 'مثال: {value}',
            customAliases: ['اسم', 'ملف', 'تاريخ', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'خاصية الملاحظة',
            notePropertyDesc:
                'خاصية تُفعّل Better Paste أو تُعطّله في ملاحظة واحدة. مع "bp: false" تُترك الملاحظة دون تغيير، ومع "bp: true" تُنظَّف حتى عندما يكون «تنظيف كل عملية لصق» معطّلًا. اتركها فارغة لتجاهل الخاصية.',
            notePropertyAliases: ['ملاحظة', 'خاصية', 'frontmatter', 'استثناء', 'تعطيل', 'تفعيل', 'bp'],
            sizePropertyName: 'خاصية عرض الصورة',
            sizePropertyDesc:
                'خاصية frontmatter التي تحدّد عرض الصور الملصقة في ملاحظة. مع "image-width: 400" في الملاحظة تصبح الصورة الملصقة ![[photo.png|400]]. اتركها فارغة لعدم إضافة عرض.',
            sizePropertyAliases: ['حجم', 'frontmatter', 'خاصية', 'تغيير الحجم']
        },

        links: {
            heading: 'الروابط',
            titlesName: 'جلب عناوين الروابط الملصقة',
            titlesDesc:
                'لصق عنوان ويب وحده يُدرج رابط Markdown يحمل عنوان الصفحة. إذا كان هناك نص محدّد، صار هو التسمية ولا يُجلب أي عنوان. يبقى العنوان المجرّد إذا تعذّر جلب عنوان الصفحة.',
            titlesAliases: ['عنوان', 'صفحة', 'موقع', 'رابط markdown', 'تنزيل'],
            cleaningName: 'تنظيف الروابط الملصقة',
            cleaningDesc: 'يزيل معاملات التتبّع من الروابط الملصقة:',
            cleaningAliases: ['url', 'تتبّع', 'utm', 'معاملات', 'استعلام', 'موقع', 'نطاق', 'youtube', 'استثناء'],
            stripName: 'أي المعاملات تُزال',
            stripDesc: 'معاملات التتبّع أسماء مثل utm_source وfbclid وgclid.',
            stripAliases: ['utm', 'تتبّع', 'استعلام', 'معاملات'],
            stripAll: 'كل معامل، إلا إذا أبقته قاعدة موقع',
            stripTracking: 'معاملات التتبّع المعروفة فقط',
            rulesName: 'قواعد المواقع',
            rulesDesc: 'المعاملات التي تبقى في مواقع بعينها.',
            rulesCount: {
                zero: '{count} مواقع',
                one: '{count} موقع',
                two: '{count} موقع',
                few: '{count} مواقع',
                many: '{count} موقعًا',
                other: '{count} موقع'
            },
            listName: 'قواعد مواقعك',
            listDesc:
                '{sites} تغطيها الإضافة مسبقًا. أضف قواعدك هنا، قاعدة في كل سطر. «example.com» يبقي كل معاملات ذلك الموقع، و«example.com: a, b» يبقي هذين الاثنين فقط، و«!example.com» يزيل قاعدة تأتي مع الإضافة. تُطابق النطاقات الفرعية تلقائيًا.',
            listShippedCount: {
                zero: '{count} مواقع شائعة',
                one: '{count} موقع شائع',
                two: '{count} موقع شائع',
                few: '{count} مواقع شائعة',
                many: '{count} موقعًا شائعًا',
                other: '{count} موقع شائع'
            },
            listAliases: ['نطاق', 'استثناء', 'قائمة بيضاء', 'youtube'],
            listInvalid: 'ليس اسم موقع: {values}',
            testerName: 'جرّبها',
            testerDesc: 'الصق رابطًا لترى ما الذي تبقيه القواعد.',
            testerLabel: 'الرابط المراد تنظيفه',
            testerEmpty: 'يظهر الرابط بعد تنظيفه هنا.'
        },

        text: {
            heading: 'معالجة النص',
            trimName: 'إزالة المسافات المحيطة',
            trimDesc: 'يزيل الأسطر الفارغة والمسافات من بداية النص الملصق ونهايته.',
            trimAliases: ['مسافات', 'سطر فارغ', 'سطر جديد', 'اقتصاص'],
            invisibleName: 'الأحرف غير المرئية',
            invisibleDesc: 'يزيل المسافات عديمة العرض ويحوّل المسافات غير القابلة للكسر إلى مسافات عادية.',
            invisibleAliases: ['ذكاء اصطناعي', 'chatgpt', 'claude', 'llm', 'يونيكود', 'غير مرئي', 'nbsp', 'مسافات'],
            invisibleExampleStart: 'كانت',
            invisibleExampleMiddle: 'النتيجة',
            invisibleExampleEnd: ' جيدة.',
            invisibleExampleAfter: 'كانت النتيجة جيدة.',
            quotesName: 'علامات الاقتباس',
            quotesDesc: 'يحوّل علامات الاقتباس المنحنية والفواصل العليا إلى مستقيمة.',
            quotesAliases: ['علامة اقتباس', 'تنصيص', 'اقتباس منحني', 'اقتباس مستقيم', 'فاصلة عليا', 'ترقيم', 'طباعة', 'ذكاء اصطناعي'],
            quotesExample: 'قالت: “انتهينا”.',
            dashesName: 'الشرطات',
            dashesDesc: 'يحوّل الشرطات القصيرة والطويلة إلى واصلات.',
            dashesAliases: ['شرطة', 'شرطة طويلة', 'شرطة قصيرة', 'واصلة', 'ترقيم', 'طباعة', 'ذكاء اصطناعي'],
            dashesExample: 'كانت النتيجة — رغم كل الصعاب — جيدة.'
        }
    },

    imageModal: {
        title: 'خيارات الصورة',
        sizeName: 'الحجم',
        className: 'فئة CSS',
        none: 'لا تفعل شيئًا',
        apply: 'تطبيق',
        cancel: 'إلغاء'
    },

    welcome: {
        title: 'مرحبًا بك في Better Paste',
        intro: [
            'انسخ الصور من Safari إلى الخزنة مباشرة، والصق الروابط من دون معاملات التتبّع، وأصلح أسطر الطرفية المقطوعة، ونظّف نصوص الذكاء الاصطناعي. الصق فقط، وسيتولى Better Paste الباقي.',
            'نصيحة قبل البدء: اربط الأمر **لصق بدون معالجة** بالاختصار `Cmd+Shift+V` (أو `Ctrl+Shift+V` في Windows) لتتمكن دائمًا من لصق محتوى الحافظة كما هو.',
            'لكل قاعدة مفتاحها الخاص في الإعدادات، Better Paste، وتؤدي الخاصية `bp: false` إلى إيقاف الإضافة في تلك الملاحظة.'
        ],
        startButton: 'ابدأ'
    },

    whatsNew: {
        title: 'الجديد في Better Paste',
        scrollLabel: 'ملاحظات الإصدار',
        releaseHeading: 'الإصدار {version} ({date})',
        categoryNew: 'جديد',
        categoryImproved: 'محسّن',
        categoryChanged: 'مُغيّر',
        categoryFixed: 'مُصلح',
        support: 'إذا كان Better Paste مفيدًا لك، ففكّر في دعم تطويره.',
        coffeeButton: '☕️ اشترِ لي قهوة',
        thanksButton: 'شكرًا!'
    }
};
