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
        toggleCleanup: 'تبديل التنظيف التلقائي'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: '، ',
        cleanupOn: 'المعالجة التلقائية مفعّلة',
        cleanupOff: 'المعالجة التلقائية معطّلة',
        selectTextFirst: 'حدّد نصًا أولًا',
        nothingToClean: 'لا شيء لتنظيفه',
        clipboardFailed: 'تعذّرت قراءة الحافظة',
        titleFailed: 'تعذّر جلب العنوان.',
        fetchingTitle: 'جارٍ جلب العنوان{dots}',
        imagesFailed: {
            zero: 'تعذّر حفظ {count} صور',
            one: 'تعذّر حفظ {count} صورة',
            two: 'تعذّر حفظ {count} صورة',
            few: 'تعذّر حفظ {count} صور',
            many: 'تعذّر حفظ {count} صورةً',
            other: 'تعذّر حفظ {count} صورة'
        },
        imagesFailedLinkKept: '{images}، وأُبقي الرابط الأصلي',
        imagesFailedNothingPasted: '{images}، لذلك لم يُلصق شيء. المحتوى ما زال في الحافظة.',
        aiTextCleaned: 'تم ترتيب نص الذكاء الاصطناعي',
        terminalCleaned: 'تم تنظيف مخرجات الطرفية',
        textProcessed: 'تم ضبط نمط النص',
        urlsCleaned: {
            zero: 'تم تنظيف {count} روابط',
            one: 'تم تنظيف {count} رابط',
            two: 'تم تنظيف {count} رابط',
            few: 'تم تنظيف {count} روابط',
            many: 'تم تنظيف {count} رابطًا',
            other: 'تم تنظيف {count} رابط'
        },
        imagesSaved: {
            zero: 'تم حفظ {count} صور',
            one: 'تم حفظ {count} صورة',
            two: 'تم حفظ {count} صورة',
            few: 'تم حفظ {count} صور',
            many: 'تم حفظ {count} صورةً',
            other: 'تم حفظ {count} صورة'
        }
    },

    settings: {
        exampleFallback: '{description} مثال: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'الجديد في Better Paste {version}',
            whatsNewDesc: 'ما الذي تغيّر في أحدث الإصدارات.',
            whatsNewAliases: ['ملاحظات الإصدار', 'التغييرات', 'سجل التغييرات', 'إصدار', 'تحديث', 'السجل'],
            whatsNewButton: 'عرض التحديثات الأخيرة',
            supportName: 'دعم التطوير',
            supportDesc: 'إذا كان Better Paste مفيدًا لك، ففكّر في دعم استمرار تطويره.',
            supportAliases: ['رعاية', 'تبرع', 'قهوة', 'github'],
            sponsorButton: '❤️ رعاية',
            coffeeButton: '☕️ اشترِ لي قهوة'
        },

        behavior: {
            heading: 'السلوك',
            autoCleanName: 'تنظيف كل عملية لصق',
            autoCleanDesc:
                'يطبّق القواعد عند كل لصق. عطّل هذا الخيار لاستخدام الأوامر فقط. يمكن لملاحظة واحدة أن تستثني نفسها بالخاصية "better-paste: false".',
            autoCleanAliases: ['تلقائي', 'تفعيل', 'تعطيل', 'ملاحظة', 'استثناء', 'خاصية', 'frontmatter'],
            showNoticesName: 'إظهار إشعار عند تغيير عملية لصق',
            showNoticesDesc: 'ملخّص من سطر واحد لما تم تنظيفه. يتم الإبلاغ عن الأعطال دائمًا مهما كان هذا الإعداد.',
            showNoticesAliases: ['إشعار', 'ملخّص', 'رسالة', 'صامت']
        },

        images: {
            heading: 'الصور',
            savingName: 'حفظ الصور الملصقة في الخزنة',
            savingDesc:
                'يحفظ الصور الملصقة كملفات محلية بدل ترك روابط خارجية. يشمل ذلك «نسخ الصورة» في Safari، والصور داخل محتوى ويب منسوخ، وعناوين الصور المفردة. تُحفظ الصور في مجلد مرفقات خزنتك. مع خيار «الاسم من المصدر»:',
            savingAliases: ['تنزيل', 'مرفق', 'safari', 'لقطة شاشة', 'صورة', 'مجلد', 'اسم الملف', 'عرض', 'حجم'],
            pageName: 'معالجة الصور',
            pageDesc: 'أسماء الملفات وعرض الصور لكل ملاحظة.',
            nameFormatName: 'أسماء الملفات',
            nameFormatDesc: 'اختر كيف تُسمّى ملفات الصور المحفوظة.',
            nameFormatSource: 'الاسم من المصدر',
            nameFormatCustom: 'تنسيق مخصّص',
            customName: 'تنسيق مخصّص',
            customDesc: 'استخدم {{name}} لاسم المصدر وتنسيقات تاريخ Moment مثل YYYY-MM-DD.',
            customMomentLink: 'تنسيق Moment',
            customExample: 'مثال: {value}',
            customAliases: ['اسم', 'ملف', 'تاريخ', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'خاصية عرض الصورة',
            sizePropertyDesc:
                'خاصية frontmatter التي تحدّد عرض الصور الملصقة في ملاحظة. الملاحظة التي تستخدم هذه الخاصية تتولّى لصق لقطات الشاشة بدلًا من Obsidian. اتركها فارغة للتعطيل.',
            sizePropertyAliases: ['حجم', 'frontmatter', 'خاصية', 'تغيير الحجم']
        },

        links: {
            heading: 'الروابط',
            titlesName: 'جلب عناوين الروابط الملصقة',
            titlesDesc:
                'عندما تحتوي الحافظة على عنوان ويب فقط وليس صورة، يُجلب عنوان الصفحة ويُلصق رابط Markdown. أي نص محدّد آخر يصبح التسمية دون إرسال أي طلب. إذا تعذّر جلب العنوان، يبقى العنوان الأصلي.',
            titlesAliases: ['عنوان', 'صفحة', 'موقع', 'رابط markdown', 'تنزيل'],
            cleaningName: 'تنظيف الروابط الملصقة',
            cleaningDesc: 'يزيل معاملات التتبّع من الروابط الملصقة. الجزء المشطوب يُزال:',
            cleaningAliases: ['url', 'تتبّع', 'utm', 'معاملات', 'استعلام', 'موقع', 'نطاق', 'youtube', 'استثناء'],
            stripName: 'أي المعاملات تُزال',
            stripDesc:
                'اختر إزالة كل معاملات الاستعلام أو معاملات التتبّع المعروفة فقط. يمكن لقواعد المواقع أن تحفظ المعاملات في كلا الوضعين.',
            stripAliases: ['utm', 'تتبّع', 'استعلام', 'معاملات'],
            stripAll: 'كل معامل، إلا إذا أبقته قاعدة موقع',
            stripTracking: 'معاملات التتبّع المعروفة فقط',
            rulesName: 'قواعد الإبقاء على المعاملات',
            rulesDesc: 'قواعد المواقع للإبقاء على معاملات استعلام محدّدة في كلا وضعي الإزالة.',
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
                '{sites} مُعالجة مسبقًا وتبقى محدّثة مع الإضافة. أضف قواعد مواقعك هنا، قاعدة في كل سطر. «example.com» يبقي كل معاملات ذلك الموقع، و«example.com: a, b» يبقي هذين الاثنين فقط، و«!example.com» يُلغي قاعدة تأتي مع الإضافة. في وضع «معاملات التتبّع المعروفة فقط» لا تنقذ القاعدة إلا معاملات التتبّع المطابقة، لأن بقية المعاملات محفوظة أصلًا. تُطابق النطاقات الفرعية تلقائيًا.',
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
            testerDesc: 'الصق رابطًا لترى ما الذي ستبقيه هذه القواعد.',
            testerLabel: 'الرابط المراد تنظيفه',
            testerEmpty: 'يظهر الرابط بعد تنظيفه هنا.'
        },

        terminal: {
            heading: 'نص الطرفية',
            cleanupName: 'تنظيف مخرجات الطرفية',
            cleanupDesc:
                'يعيد وصل الأسطر المقطوعة في مخرجات الطرفية ويزيل المسافات البادئة. تُزال رموز الألوان. كتل الشيفرة والجداول وعناصر القوائم تبقى كما هي.',
            cleanupAliases: ['التفاف', 'وصل', 'ansi', 'طرفية', 'صدفة', 'مسافة بادئة', 'تعداد نقطي', 'قائمة', 'markdown'],
            pageName: 'معالجة نص الطرفية',
            pageDesc: 'شروط إعادة الوصل ورموز التعداد النقطي.',
            rejoinName: 'متى يُعاد وصل سطر مقطوع',
            rejoinDesc: 'الشرط اللازم لاعتبار سطر امتدادًا للسطر السابق.',
            rejoinAliases: ['مسافة بادئة', 'التفاف', 'جريء', 'آمن', 'git log'],
            rejoinIndented: 'فقط عندما يبدأ السطر التالي بمسافة بادئة',
            rejoinAny: 'كلما بدا السطر الذي قبله ممتلئًا',
            rejoinNever: 'لا تُعِد الوصل أبدًا، أزل الرموز والمسافات البادئة فقط',
            bulletsName: 'رموز التعداد النقطي',
            bulletsDesc: 'يحدّد ما إذا كانت رموز التعداد النقطي (مثل •) في مخرجات الطرفية تبقى أم تتحوّل إلى عناصر قائمة Markdown.',
            bulletsAliases: ['قائمة', 'markdown', 'شرطة'],
            bulletsMarkdown: 'التحويل إلى عناصر قائمة Markdown',
            bulletsPreserve: 'اتركها كما هي',
            testerName: 'جرّبها',
            testerDesc: 'الصق مخرجات طرفية لترى كيف ستُنظَّف.',
            testerLabel: 'نص الطرفية المراد تنظيفه',
            testerEmpty: 'يظهر النص بعد تنظيفه هنا.',
            testerSample: [
                '• الخطوة الإضافية محصورة في معالج Enter الخاص بالقائمة، لذا التغيير الأساسي بسيط. وأثناء تتبّع المسارات المجاورة وجدت',
                '  نقطتي احتكاك محتملتين تستحقان التحقق: قد يقفز التحديد بعد التحديث.'
            ]
        },

        text: {
            heading: 'معالجة النص',
            trimName: 'إزالة المسافات المحيطة',
            trimDesc: 'يزيل الأسطر الفارغة والمسافات من بداية النص الملصق ونهايته.',
            trimAliases: ['مسافات', 'سطر فارغ', 'سطر جديد', 'اقتصاص'],
            commasName: 'الفواصل وعلامات الاقتباس',
            commasDesc: 'اختر موضع الفاصلة بجوار علامة اقتباس مزدوجة مغلقة.',
            commasAliases: ['فاصلة', 'اقتباس', 'علامة اقتباس', 'ترقيم', 'نمط'],
            commasNone: 'بدون تغيير',
            commasInside: 'الفاصلة داخل علامتي الاقتباس',
            commasOutside: 'الفاصلة خارج علامتي الاقتباس',
            commasExampleSource: 'قال إنه "مكتمل," ثم غادر.',
            commasExampleOutside: 'قال إنه "مكتمل", ثم غادر.',
            invisibleName: 'تنظيف الذكاء الاصطناعي: المحارف غير المرئية',
            invisibleDesc: 'يزيل المسافات عديمة العرض ويحوّل المسافات غير القابلة للكسر إلى مسافات عادية.',
            invisibleAliases: [
                'ذكاء اصطناعي',
                'chatgpt',
                'claude',
                'llm',
                'شرطة',
                'شرطة طويلة',
                'شرطة متوسطة',
                'واصلة',
                'يونيكود',
                'غير مرئي',
                'nbsp',
                'طباعة',
                'ترقيم',
                'مسافات'
            ],
            invisibleExampleStart: 'كانت',
            invisibleExampleMiddle: 'النتيجة',
            invisibleExampleEnd: ' جيدة.',
            invisibleExampleAfter: 'كانت النتيجة جيدة.',
            punctuationName: 'تنظيف الذكاء الاصطناعي: الشرطات وعلامات الاقتباس',
            punctuationDesc: 'يحوّل الشرطات الطويلة إلى واصلات وعلامات الاقتباس المنحنية إلى مستقيمة.',
            punctuationAliases: ['شرطة طويلة', 'شرطة متوسطة', 'واصلة', 'علامة اقتباس', 'اقتباس منحني', 'فاصلة عليا', 'ترقيم', 'طباعة'],
            punctuationExampleBefore: '“كانت النتيجة — رغم كل الصعاب — مثالية.”',
            punctuationExampleAfter: '"كانت النتيجة - رغم كل الصعاب - مثالية."'
        }
    },

    welcome: {
        title: 'مرحبًا بك في Better Paste',
        intro: [
            'يغيّر Better Paste محتوى الحافظة أثناء لصقه في ملاحظة.',
            'يحفظ الصور المرتبطة كمرفقات في الخزنة، ويزيل معاملات التتبّع من الروابط، ويعيد وصل الأسطر المقطوعة في مخرجات الطرفية، ويستبدل علامات الاقتباس المنحنية والمحارف غير المرئية بمكافئات بسيطة.',
            'يمكن إيقاف كل قاعدة على حدة.',
            'يمكن لملاحظة واحدة أن تستثني نفسها بالكامل بالخاصية "better-paste: false". الإعدادات موجودة في الإعدادات، Better Paste.'
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
