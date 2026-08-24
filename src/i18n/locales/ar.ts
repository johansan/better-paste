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
        pasteRaw: 'لصق كنص عادي',
        cleanSelection: 'تنظيف التحديد',
        cleanTerminal: 'تنظيف مخرجات الطرفية',
        cleanPdf: 'تنظيف نص PDF',
        runSnippet: 'تشغيل مقتطف',
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
        fetchingTitles: 'جارٍ جلب العناوين...',
        titlesFailed: {
            zero: 'تعذّر جلب {count} عناوين',
            one: 'تعذّر جلب {count} عنوان',
            two: 'تعذّر جلب {count} عنوانين',
            few: 'تعذّر جلب {count} عناوين',
            many: 'تعذّر جلب {count} عنوانًا',
            other: 'تعذّر جلب {count} عنوان'
        },
        imagesFailed: {
            zero: 'تعذّر حفظ {count} صور',
            one: 'تعذّر حفظ {count} صورة',
            two: 'تعذّر حفظ {count} صورة',
            few: 'تعذّر حفظ {count} صور',
            many: 'تعذّر حفظ {count} صورةً',
            other: 'تعذّر حفظ {count} صورة'
        },
        imagesFailedLinkKept: '{images}، وأُبقي الرابط الأصلي',
        imagesFailedNothingPasted: '{images}، لذلك لم يُلصق شيء',
        snippetsCopied: 'نُسخت المقتطفات',
        snippetsCopyFailed: 'تعذّر نسخ المقتطفات'
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
            showReleaseNotesName: 'عرض الجديد بعد التحديث',
            showReleaseNotesDesc: 'يفتح مربع حوار «الجديد» مرة واحدة بعد كل تحديث.',
            showReleaseNotesAliases: ['ملاحظات الإصدار', 'الجديد', 'تحديث', 'مربع حوار', 'منبثقة', 'إشعار'],
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
                'يطبّق القواعد عند كل لصق. عند إيقافه لا تُطبّق القواعد إلا عبر أوامر Better Paste. يمكن لملاحظة واحدة أن تستثني نفسها بالخاصية "{property}: false"، أو أن تطلب التنظيف بالخاصية "{property}: true".',
            autoCleanAliases: ['تلقائي', 'تفعيل', 'تعطيل', 'ملاحظة', 'استثناء', 'خاصية', 'frontmatter'],
            notePropertyName: 'خاصية الملاحظة',
            notePropertyDesc: 'خاصية تُفعّل Better Paste أو تُعطّله في ملاحظة واحدة.',
            notePropertyAliases: ['ملاحظة', 'خاصية', 'frontmatter', 'استثناء', 'تعطيل', 'تفعيل', 'bp']
        },

        images: {
            heading: 'المرفقات',
            fileModeName: 'الملفات الملصقة',
            fileModeDesc:
                'اختر ما يحدث عند لصق ملفات من جهازك، مثل ملفات PDF ولقطات الشاشة. «لا تفعل شيئًا» يدع Obsidian يتولى اللصق بما في ذلك المعاينة، و«ربط بدون معاينة» يزيل علامة التعجب.',
            fileModeChoiceOff: 'لا تفعل شيئًا',
            fileModeChoiceLink: 'ربط بدون معاينة',
            fileModeAliases: ['ملف', 'مرفق', 'معاينة', 'تضمين', 'رابط', 'pdf', 'لقطة شاشة', 'علامة تعجب'],
            savingName: 'صور الويب',
            savingDesc:
                'اختر ما يحدث عند لصق روابط لصور من الويب. «لا تفعل شيئًا» يترك اللصق كما هو، و«ربط مع معاينة» يعرض الصورة مباشرة من الويب، و«تنزيل مع معاينة» يحفظ نسخة في خزنتك.',
            savingDownloadDesc: 'يأتي اسم الملف من العنوان افتراضيًا:',
            savingChoiceOff: 'لا تفعل شيئًا',
            savingChoiceLink: 'ربط مع معاينة',
            savingChoiceDownload: 'تنزيل مع معاينة',
            savingAliases: ['تنزيل', 'ربط', 'تضمين', 'معاينة', 'url', 'ويب', 'مرفق', 'safari', 'محلي', 'صورة', 'مجلد'],
            sizeStyleName: 'الحجم والمظهر',
            sizeStyleDesc: 'أضف عرضًا أو فئة CSS إلى الصور الملصقة، إما تلقائيًا أو عبر نافذة اختيار.',
            sizeStyleAliases: ['حجم', 'عرض', 'css', 'فئة', 'مظهر', 'تغيير الحجم', 'invert'],
            summarySize: 'الحجم: {value}',
            summaryStyle: 'المظهر: {value}',
            summaryAsk: 'اسأل',
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
            customDesc:
                'استخدم {{name}} لاسم المصدر، و{{noteName}} لاسم الملاحظة، و{{property:xyz}} لخاصية frontmatter، و{{counter}} أو {{counter:2}} لرقم متزايد، وتنسيقات تاريخ Moment مثل YYYY-MM-DD.',
            customScreenshotDesc: 'لقطة الشاشة لا تملك اسم مصدر، لذلك يصبح {{name}} فيها «Pasted image» مع طابع زمني، كما في Obsidian.',
            namingInfoTitle: 'متى يُطبَّق تنسيق اسم الملف',
            namingInfoLead: 'مهم! لا يستطيع Better Paste القيام بما يلي:',
            namingInfoExplorer: 'إعادة تسمية ملف تنسخه في Finder أو مستكشف الملفات وتلصقه',
            namingInfoDrag: 'إعادة تسمية ملف تسحبه إلى ملاحظة',
            namingInfoMobile: 'معالجة ما يُلصق بأمر اللصق الخاص بـ Obsidian على الهاتف. استخدم «{command}» بدلًا منه.',
            customMomentLink: 'تنسيق Moment',
            customExample: 'مثال: {value}',
            customExampleNote: 'ملاحظتي',
            customAliases: [
                'اسم',
                'ملف',
                'تاريخ',
                'moment',
                'YYYY',
                '{{name}}',
                'عدّاد',
                'خاصية',
                'اسم الملاحظة',
                'لقطة شاشة',
                'إعادة تسمية',
                'الحافظة',
                'paste image rename'
            ],
            sizePropertyName: 'خاصية عرض الصورة',
            sizePropertyDesc:
                'خاصية frontmatter التي تحدّد عرض الصور الملصقة في ملاحظة. مع "{property}: 400" في الملاحظة تصبح الصورة الملصقة ![[photo.png|400]]. اتركها فارغة لعدم إضافة عرض.',
            sizePropertyAliases: ['حجم', 'frontmatter', 'خاصية', 'تغيير الحجم']
        },

        links: {
            heading: 'الروابط',
            titlesName: 'جلب عناوين الروابط الملصقة',
            titlesDesc:
                'لصق عنوان ويب وحده يُدرج رابط Markdown يحمل عنوان الصفحة. لصق رابط Obsidian يُدرج رابطًا يحمل اسم الملاحظة. إذا كان هناك نص محدّد، صار هو التسمية ولا يُجلب أي عنوان. يبقى العنوان المجرّد إذا تعذّر جلب عنوان الصفحة.',
            titlesAliases: ['عنوان', 'صفحة', 'موقع', 'رابط markdown', 'تنزيل'],
            cleaningName: 'تنظيف الروابط الملصقة',
            cleaningDesc: 'يزيل معاملات التتبّع من الروابط الملصقة:',
            cleaningAliases: ['url', 'تتبّع', 'utm', 'معاملات', 'استعلام', 'موقع', 'نطاق', 'youtube', 'استثناء'],
            removalsName: 'إزالة المعاملات من الروابط',
            removalsDesc: 'معاملات إضافية تُزال في كل مكان أو في مواقع بعينها.',
            rulesCount: {
                zero: '{count} مدخلات',
                one: '{count} مدخل',
                two: '{count} مدخلان',
                few: '{count} مدخلات',
                many: '{count} مدخلًا',
                other: '{count} مدخل'
            },
            builtInName: 'عمليات الإزالة المدمجة',
            builtInDesc:
                'تم التحديث في {date}. مرشحات التتبّع العامة: {trackingCount}. القواعد الخاصة بالمواقع: {siteCount}. تظل الروابط الموقّعة تشفيريًا دون تغيير.',
            builtInButton: 'عرض القائمة',
            listName: 'عمليات الإزالة الخاصة بك',
            listDesc:
                'أزل معاملًا من الروابط العادية في كل المواقع بإدخال اسمه وحده. مثلًا، «fbclid» يزيل معامل fbclid أينما ظهر.\n\nأزل معاملات في موقع واحد فقط بكتابة «example.com | source, ref». هذا يزيل source وref من example.com ونطاقاته الفرعية، بينما تبقى بقية المعاملات. ابدأ السطر بعلامة «!» لإيقاف عمليات الإزالة المدمجة لذلك الموقع. تظل الروابط الموقّعة تشفيريًا دون تغيير دائمًا.',
            listAliases: ['domain', 'معاملات', 'تصفية', 'إزالة', 'youtube'],
            listInvalid: 'قاعدة إزالة غير صالحة: {values}',
            suggestName: 'اقترح ما تريد إزالته',
            suggestDesc: 'ساهم بمعاملات تريد إزالتها للمساعدة في تحسين عمليات الإزالة المدمجة.',
            suggestAliases: ['ساهم', 'تقديم', 'مشاركة', 'إرسال', 'تصفية'],
            suggestButton: 'مراجعة وإرسال',
            testerName: 'جرّبها',
            testerDesc: 'الصق رابطًا لترى النتيجة بعد التنظيف.',
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
        },

        structure: {
            heading: 'البنية',
            listNestingName: 'الحفاظ على تداخل القوائم عند اللصق',
            listNestingDesc: 'يلصق قائمة منسوخة مع بقاء تسلسلها الهرمي، مع محاذاة المسافة البادئة لعنصر القائمة الذي تلصق عليه.',
            listNestingAliases: ['قائمة', 'متداخلة', 'مسافة بادئة', 'تسلسل هرمي', 'مخطط', 'نقاط', 'خانة اختيار', 'شجرة'],
            quoteContinuationName: 'متابعة الاقتباسات الكتلية عند اللصق',
            quoteContinuationDesc:
                'يلصق نصًا متعدد الأسطر على سطر مقتبس مع اقتباس كل سطر، ليبقى النص الملصق كله داخل الاقتباس الكتلي أو مربع التنبيه.',
            quoteContinuationAliases: ['اقتباس', 'اقتباس كتلي', 'مربع تنبيه', 'استشهاد', 'تنبيه', 'فقرة']
        },

        custom: {
            heading: 'معالجة مخصصة',
            pipelineName: 'تطبيق مقتطفات التعبيرات النمطية المخصصة على النص',
            pastedText: 'النص الملصق',
            note: 'الملاحظة',
            wikiButton: 'عرض الويكي',
            regexButton: 'فتح أداة اختبار التعبيرات النمطية',
            snippetsName: 'مقتطفات النص',
            snippetsDesc: 'تُطبَّق على كامل النص الملصق بعد القواعد المدمجة. فعّل منها ما تريد تشغيله عند اللصق.',
            urlSnippetsName: 'مقتطفات الروابط',
            urlSnippetsDesc:
                'تُطبَّق على كل رابط ملصق بعد جلب عنوان الصفحة. لا ترى القواعد سوى رابط Markdown النهائي، وتبقى وجهة الرابط دون تغيير.',
            enabledSnippetsCount: {
                zero: '{count} مقتطفات مفعّلة',
                one: '{count} مقتطف مفعّل',
                two: '{count} مقتطفان مفعّلان',
                few: '{count} مقتطفات مفعّلة',
                many: '{count} مقتطفًا مفعّلًا',
                other: '{count} مقتطف مفعّل'
            },
            snippetRulesCount: {
                zero: '{count} قواعد',
                one: '{count} قاعدة',
                two: '{count} قاعدتان',
                few: '{count} قواعد',
                many: '{count} قاعدةً',
                other: '{count} قاعدة'
            },
            invalidRulesCount: {
                zero: '{count} أسطر غير صالحة',
                one: '{count} سطر غير صالح',
                two: '{count} سطران غير صالحين',
                few: '{count} أسطر غير صالحة',
                many: '{count} سطرًا غير صالح',
                other: '{count} سطر غير صالح'
            },
            unnamedSnippet: 'مقتطف بلا اسم',
            emptyState: 'لم تنشئ أي مقتطفات بعد.',
            addSnippet: 'إضافة مقتطف',
            editButton: 'تحرير المقتطف',
            exportName: 'تصدير المقتطفات',
            exportDesc: 'ينسخ كل المقتطفات بتنسيق التبادل المستخدم في الويكي.',
            exportButton: 'نسخ المقتطفات',
            importName: 'استيراد المقتطفات',
            importDesc: 'يضيف مقتطفات من تنسيق التبادل المستخدم في الويكي.',
            previewName: 'جرّبها',
            previewDesc: 'اكتب نصًا تجريبيًا لرؤية نتيجة كل المقتطفات المفعّلة.',
            modalPreviewDesc: 'اكتب نصًا تجريبيًا لرؤية نتيجة هذا المقتطف.',
            previewInputLabel: 'نص تجريبي',
            previewEmpty: 'يظهر النص المعالَج هنا.',
            urlPreviewDesc: 'الصق رابط Markdown لرؤية نتيجة كل مقتطفات الروابط المفعّلة.',
            urlModalPreviewDesc: 'الصق رابط Markdown لرؤية نتيجة هذا المقتطف.',
            urlPreviewLabel: 'رابط معنون تجريبي',
            urlPreviewEmpty: 'يظهر الرابط المعالَج هنا.',
            nameName: 'الاسم',
            rulesName: 'القواعد',
            rulesDesc: 'أدخل استبدالًا واحدًا بتعبير نمطي من JavaScript في كل سطر.',
            wikiPasteHint: 'انسخ مقتطفًا جاهزًا من الويكي والصقه مباشرة في حقل القواعد.',
            invalidLine: 'السطر {line}: {value}',
            saveButton: 'حفظ',
            recognizedSnippetsCount: {
                zero: 'تم التعرّف على {count} مقتطفات',
                one: 'تم التعرّف على {count} مقتطف',
                two: 'تم التعرّف على {count} مقتطفين',
                few: 'تم التعرّف على {count} مقتطفات',
                many: 'تم التعرّف على {count} مقتطفًا',
                other: 'تم التعرّف على {count} مقتطف'
            },
            recognizedRulesCount: {
                zero: 'تم التعرّف على {count} قواعد',
                one: 'تم التعرّف على {count} قاعدة',
                two: 'تم التعرّف على {count} قاعدتين',
                few: 'تم التعرّف على {count} قواعد',
                many: 'تم التعرّف على {count} قاعدةً',
                other: 'تم التعرّف على {count} قاعدة'
            },
            unparseableName: 'أسطر غير قابلة للتحليل',
            importFallbackName: 'مقتطف مستورد',
            defaultSnippetBoldHeadings: 'إزالة الخط الغامق من العناوين',
            defaultSnippetBlankLines: 'دمج الأسطر الفارغة',
            defaultSnippetSiteSuffixes: 'إزالة أسماء المواقع من عناوين الصفحات'
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

    pdfModal: {
        furniture: 'إزالة أرقام الصفحات',
        singleParagraph: 'دمج الكل في فقرة واحدة',
        description:
            'يُعاد وصل الأسطر الملتفّة، وتُصلَح الكلمات المقسومة بشرطة، وتُحوَّل الحروف المركّبة إلى حروف عادية، وتُزال المسافات الزائدة.',
        preview: 'معاينة'
    },

    welcome: {
        title: 'مرحبًا بك في Better Paste',
        intro: [
            'انسخ الصور من Safari إلى الخزنة مباشرة، والصق الروابط من دون معاملات التتبّع، وأصلح أسطر الطرفية المقطوعة، ونظّف نصوص الذكاء الاصطناعي. الصق فقط، وسيتولى Better Paste الباقي.',
            'نصيحة قبل البدء: اربط الأمر **لصق بدون معالجة** بالاختصار `Cmd+Shift+V` (أو `Ctrl+Shift+V` في Windows) لتتمكن دائمًا من لصق محتوى الحافظة كما هو.',
            'لكل قاعدة مفتاحها الخاص في الإعدادات، Better Paste، وتؤدي الخاصية `{property}: false` إلى إيقاف الإضافة في تلك الملاحظة.'
        ],
        startButton: 'ابدأ'
    },

    overlap: {
        title: 'Better Paste: إضافات متداخلة',
        thanks: 'شكرًا لتثبيتك واستخدامك Better Paste!',
        intro: {
            zero: 'لديك حاليًا {count} إضافات مثبتة تقوم بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:',
            one: 'لديك حاليًا {count} إضافة مثبتة تقوم بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:',
            two: 'لديك حاليًا {count} إضافتان مثبتتان تقومان بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:',
            few: 'لديك حاليًا {count} إضافات مثبتة تقوم بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:',
            many: 'لديك حاليًا {count} إضافةً مثبتةً تقوم بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:',
            other: 'لديك حاليًا {count} إضافة مثبتة تقوم بمهمة Better Paste نفسها تقريبًا، لذا عطّل أو أزِل ما يلي:'
        },
        outro: 'عطّلها من الإعدادات > إضافات تابعة لجهات خارجية.',
        dontRemind: 'عدم التذكير مرة أخرى',
        button: 'فهمت'
    },

    whatsNew: {
        title: 'الجديد في Better Paste',
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
