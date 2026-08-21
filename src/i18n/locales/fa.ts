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

/** Persian. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_FA: TranslationStrings = {
    commands: {
        paste: 'چسباندن',
        pasteRaw: 'چسباندن بدون پردازش',
        cleanSelection: 'پاک‌سازی متن انتخاب‌شده',
        cleanTerminal: 'پاک‌سازی خروجی پایانه',
        cleanPdf: 'پاک‌سازی متن PDF',
        runSnippet: 'اجرای قطعه',
        commasInside: 'انتقال ویرگول‌ها به داخل گیومه',
        commasOutside: 'انتقال ویرگول‌ها به خارج از گیومه',
        toggleCleanup: 'تغییر وضعیت پاک‌سازی خودکار'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'پردازش خودکار روشن است',
        cleanupOff: 'پردازش خودکار خاموش است',
        selectTextFirst: 'ابتدا متنی را انتخاب کنید',
        nothingToClean: 'چیزی برای پاک‌سازی نیست',
        clipboardFailed: 'خواندن حافظه موقت ممکن نشد',
        titleFailed: 'دریافت عنوان ممکن نشد.',
        fetchingTitle: 'در حال دریافت عنوان...',
        fetchingTitles: 'در حال دریافت عنوان‌ها...',
        titlesFailed: {
            one: '{count} عنوان دریافت نشد',
            other: '{count} عنوان دریافت نشد'
        },
        imagesFailed: {
            one: '{count} تصویر ذخیره نشد',
            other: '{count} تصویر ذخیره نشد'
        },
        imagesFailedLinkKept: '{images}، پیوند اصلی نگه داشته شد',
        imagesFailedNothingPasted: '{images}، بنابراین چیزی چسبانده نشد',
        snippetsCopied: 'قطعه‌ها کپی شدند',
        snippetsCopyFailed: 'کپی قطعه‌ها ممکن نشد'
    },

    settings: {
        exampleFallback: '{description} نمونه: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'درباره',
            whatsNewName: 'تازه‌های Better Paste {version}',
            whatsNewDesc: 'آنچه در نسخه‌های اخیر تغییر کرده است.',
            whatsNewAliases: ['یادداشت انتشار', 'تغییرات', 'فهرست تغییرات', 'نسخه', 'به‌روزرسانی', 'تاریخچه'],
            whatsNewButton: 'دیدن تازه‌ها',
            showReleaseNotesName: 'نمایش تازه‌ها پس از به‌روزرسانی',
            showReleaseNotesDesc: 'پس از هر به‌روزرسانی، پنجرهٔ تازه‌ها را یک بار باز می‌کند.',
            showReleaseNotesAliases: ['یادداشت‌های انتشار', 'تازه‌ها', 'به‌روزرسانی', 'پنجره', 'پاپ‌آپ', 'اعلان'],
            supportName: 'پشتیبانی از توسعه',
            supportDesc: 'اگر Better Paste برایتان مفید است، از توسعه آن پشتیبانی کنید.',
            supportAliases: ['حمایت', 'کمک مالی', 'قهوه', 'github'],
            sponsorButton: '❤️ حمایت',
            coffeeButton: '☕️ یک قهوه مهمانم کن',
            pluginsName: 'افزونه‌های دیگرم را ببینید',
            pluginsAliases: ['افزونه‌ها', 'notebook navigator', 'pixel perfect image', 'سازنده', 'بیشتر'],
            notebookNavigatorDesc: 'مرورگر فایل و تقویم بهتر',
            pixelPerfectImageDesc: 'تغییر اندازه دقیق تصویر و بیشتر'
        },

        behavior: {
            autoCleanName: 'پاک‌سازی هر بار چسباندن',
            autoCleanDesc:
                'قوانین را در هر چسباندن اعمال می‌کند. وقتی خاموش باشد، قوانین فقط از طریق دستورهای Better Paste اجرا می‌شوند. یک یادداشت می‌تواند با ویژگی "{property}: false" خود را کنار بگذارد، یا با "{property}: true" پاک‌سازی را برای خودش روشن کند.',
            autoCleanAliases: ['خودکار', 'فعال', 'غیرفعال', 'یادداشت', 'استثنا', 'ویژگی', 'frontmatter'],
            notePropertyName: 'ویژگی یادداشت',
            notePropertyDesc: 'ویژگی‌ای که Better Paste را برای یک یادداشت روشن یا خاموش می‌کند.',
            notePropertyAliases: ['یادداشت', 'ویژگی', 'frontmatter', 'استثنا', 'غیرفعال', 'فعال', 'bp']
        },

        images: {
            heading: 'تصاویر',
            savingName: 'تصاویر وب',
            savingDesc:
                'انتخاب کنید هنگام چسباندن تصاویر از وب چه اتفاقی بیفتد. «کاری انجام نشود» محتوای چسبانده‌شده را دست‌نخورده می‌گذارد، «پیوند با پیش‌نمایش» تصویر را مستقیماً از وب نشان می‌دهد و «دانلود با پیش‌نمایش» نسخه‌ای از هر تصویر را در گاوصندوق شما ذخیره می‌کند، از جمله تصاویر کپی‌شده در Safari.',
            savingDownloadDesc: 'نام پرونده به‌طور پیش‌فرض از نشانی گرفته می‌شود:',
            savingChoiceOff: 'کاری انجام نشود',
            savingChoiceLink: 'پیوند با پیش‌نمایش',
            savingChoiceDownload: 'دانلود با پیش‌نمایش',
            savingAliases: ['دانلود', 'پیوند', 'جاسازی', 'پیش‌نمایش', 'url', 'وب', 'پیوست', 'safari', 'محلی', 'تصویر', 'پوشه'],
            sizeStyleName: 'اندازه و سبک',
            sizeStyleDesc: 'به تصاویر چسبانده‌شده عرض یا کلاس CSS اضافه کنید، به‌طور خودکار یا از طریق یک انتخابگر.',
            sizeStyleAliases: ['اندازه', 'عرض', 'css', 'کلاس', 'سبک', 'تغییر اندازه', 'invert'],
            summarySize: 'اندازه: {value}',
            summaryStyle: 'سبک: {value}',
            summaryAsk: 'پرسیدن',
            sizeChoiceName: 'اعمال اندازه هنگام چسباندن',
            sizeChoiceDesc:
                'به هر تصویر جاسازی‌شده که ذخیره می‌شود یک عرض می‌افزاید، مانند ![[photo.jpg|400]]. ویژگی عرض خود یادداشت اولویت دارد.',
            sizeChoiceAliases: ['اندازه', 'عرض', 'اندازه تصویر', 'تغییر اندازه', 'جاسازی', '400'],
            sizeOptionsName: 'گزینه‌های اندازه',
            sizeOptionsDesc: 'عرض‌هایی که در بالا و در پنجره چسباندن پیشنهاد می‌شوند، با ویرگول از هم جدا شده‌اند.',
            classChoiceName: 'اعمال کلاس CSS هنگام چسباندن',
            classChoiceDesc:
                'به هر تصویر جاسازی‌شده که ذخیره می‌شود یک کلاس می‌افزاید، مانند ![[photo.jpg#invert]]. اثر کلاس را پوسته‌ها و قطعه‌های CSS تعیین می‌کنند.',
            classChoiceAliases: ['css', 'کلاس', 'قطعه', 'invert', 'پوسته', 'فیلتر', 'جاسازی'],
            classOptionsName: 'گزینه‌های کلاس',
            classOptionsDesc: 'کلاس‌هایی که در بالا و در پنجره چسباندن پیشنهاد می‌شوند، با ویرگول از هم جدا شده‌اند.',
            choiceNone: 'کاری انجام نشود',
            choiceAsk: 'در هر چسباندن پرسیده شود',
            nameFormatName: 'نام پرونده‌ها',
            customDesc:
                'از {{name}} برای نام منبع، {{noteName}} برای نام یادداشت، {{property:xyz}} برای یک ویژگی frontmatter، {{counter}} یا {{counter:2}} برای شماره‌ای افزایشی و از قالب‌های تاریخ Moment مانند YYYY-MM-DD استفاده کنید.',
            customScreenshotDesc:
                'نماگرفت نام منبع ندارد، پس {{name}} آن به «Pasted image» همراه با مهر زمانی تبدیل می‌شود، مانند خود Obsidian.',
            customMomentLink: 'قالب Moment',
            customExample: 'نمونه: {value}',
            customExampleNote: 'یادداشت من',
            customAliases: [
                'نام',
                'پرونده',
                'تاریخ',
                'moment',
                'YYYY',
                '{{name}}',
                'شمارنده',
                'ویژگی',
                'نام یادداشت',
                'نماگرفت',
                'اسکرین‌شات',
                'تغییر نام',
                'حافظه موقت',
                'کلیپ‌بورد',
                'paste image rename'
            ],
            sizePropertyName: 'ویژگی عرض تصویر',
            sizePropertyDesc:
                'ویژگی frontmatter که عرض تصاویر چسبانده‌شده در یک یادداشت را تعیین می‌کند. با "{property}: 400" در یادداشت، تصویر چسبانده‌شده به ![[photo.png|400]] تبدیل می‌شود. برای نیفزودن عرض، خالی بگذارید.',
            sizePropertyAliases: ['اندازه', 'frontmatter', 'ویژگی', 'تغییر اندازه']
        },

        links: {
            heading: 'پیوندها',
            titlesName: 'دریافت عنوان برای پیوندهای چسبانده‌شده',
            titlesDesc:
                'چسباندن یک نشانی وب به‌تنهایی، پیوند Markdown با عنوان صفحه درج می‌کند. اگر متنی انتخاب شده باشد، همان متن برچسب می‌شود و عنوانی دریافت نمی‌شود. اگر عنوان به دست نیاید، خود نشانی باقی می‌ماند.',
            titlesAliases: ['عنوان', 'صفحه', 'وب‌گاه', 'پیوند markdown', 'دانلود'],
            cleaningName: 'پاک‌سازی پیوندهای چسبانده‌شده',
            cleaningDesc: 'پارامترهای ردیابی را از پیوندهای چسبانده‌شده حذف می‌کند:',
            cleaningAliases: ['url', 'ردیابی', 'utm', 'پارامتر', 'پرس‌وجو', 'وب‌گاه', 'دامنه', 'youtube', 'استثنا'],
            removalsName: 'حذف از پیوندها',
            removalsDesc: 'پارامترهای اضافی برای حذف در همه‌جا یا در وب‌گاه‌های خاص.',
            rulesCount: { one: '{count} ورودی', other: '{count} ورودی' },
            builtInName: 'حذف‌های داخلی',
            builtInDesc:
                'به‌روزرسانی‌شده در {date}. فیلترهای سراسری ردیابی: {trackingCount}. قوانین ویژهٔ هر وب‌گاه: {siteCount}. پیوندهای دارای امضای رمزنگاری‌شده بدون تغییر می‌مانند.',
            builtInButton: 'مشاهده فهرست',
            listName: 'حذف‌های شما',
            listDesc:
                'برای حذف یک پارامتر از پیوندهای معمولی در همهٔ وب‌گاه‌ها، نام آن را به‌تنهایی وارد کنید. برای نمونه، fbclid پارامتر fbclid را هر جا که ظاهر شود حذف می‌کند.\n\nبرای حذف پارامترها فقط در یک وب‌گاه، قانونی با قالب example.com | source, ref وارد کنید. این کار source و ref را از example.com و زیردامنه‌های آن حذف می‌کند، در حالی که سایر پارامترها باقی می‌مانند. برای غیرفعال کردن حذف‌های داخلی برای آن وب‌گاه، خط را با ! شروع کنید. پیوندهای دارای امضای رمزنگاری‌شده همیشه بدون تغییر باقی می‌مانند.',
            listAliases: ['دامنه', 'پارامتر', 'فیلتر', 'حذف', 'youtube'],
            listInvalid: 'قانون حذف نامعتبر: {values}',
            suggestName: 'حذف‌های خود را پیشنهاد دهید',
            suggestDesc: 'با ارسال پارامترهایی برای حذف، به بهبود حذف‌های داخلی کمک کنید.',
            suggestAliases: ['مشارکت', 'ثبت', 'اشتراک‌گذاری', 'ارسال', 'فیلتر'],
            suggestButton: 'بازبینی و ارسال',
            testerName: 'امتحان کنید',
            testerDesc: 'یک پیوند بچسبانید تا نتیجهٔ پاک‌سازی‌شده را ببینید.',
            testerLabel: 'پیوند برای پاک‌سازی',
            testerEmpty: 'پیوند پاک‌سازی‌شده اینجا نمایش داده می‌شود.'
        },

        text: {
            heading: 'پردازش متن',
            trimName: 'حذف فاصله‌های پیرامون',
            trimDesc: 'خط‌های خالی و فاصله‌ها را از ابتدا و انتهای متن چسبانده‌شده برمی‌دارد.',
            trimAliases: ['فاصله', 'خط خالی', 'خط جدید', 'برش'],
            invisibleName: 'نویسه‌های نامرئی',
            invisibleDesc: 'فاصله‌های با عرض صفر را حذف می‌کند و فاصله‌های ناشکستنی را به فاصله معمولی تبدیل می‌کند.',
            invisibleAliases: ['هوش مصنوعی', 'chatgpt', 'claude', 'llm', 'یونیکد', 'نامرئی', 'nbsp', 'فاصله'],
            invisibleExampleStart: 'آن',
            invisibleExampleMiddle: 'نتیجه',
            invisibleExampleEnd: ' خوب بود.',
            invisibleExampleAfter: 'آن نتیجه خوب بود.',
            quotesName: 'گیومه',
            quotesDesc: 'گیومه‌های خمیده و آپاستروف‌ها را به گیومه ساده تبدیل می‌کند.',
            quotesAliases: ['گیومه', 'نقل قول', 'گیومه خمیده', 'گیومه ساده', 'آپاستروف', 'نشانه‌گذاری', 'تایپوگرافی', 'هوش مصنوعی'],
            quotesExample: 'گفت: “تمام شد”.',
            dashesName: 'خط تیره',
            dashesDesc: 'نیم‌خط و خط تیره بلند را به خط پیوند تبدیل می‌کند.',
            dashesAliases: ['خط تیره', 'خط تیره بلند', 'نیم‌خط', 'خط پیوند', 'هایفن', 'نشانه‌گذاری', 'تایپوگرافی', 'هوش مصنوعی'],
            dashesExample: 'نتیجه — برخلاف پیش‌بینی‌ها — خوب بود.'
        },

        structure: {
            heading: 'ساختار',
            listNestingName: 'حفظ تودرتویی فهرست‌ها هنگام چسباندن',
            listNestingDesc:
                'فهرست کپی‌شده را با سلسله‌مراتب دست‌نخورده می‌چسباند و تورفتگی را با مورد فهرستی که روی آن می‌چسبانید هماهنگ می‌کند.',
            listNestingAliases: ['فهرست', 'تودرتو', 'تورفتگی', 'سلسله‌مراتب', 'رئوس مطالب', 'بولت', 'چک‌باکس', 'درخت'],
            quoteContinuationName: 'ادامهٔ نقل‌قول‌های بلوکی هنگام چسباندن',
            quoteContinuationDesc:
                'متن چندخطی را روی یک خط نقل‌قول‌شده می‌چسباند و همهٔ خط‌ها را به نقل‌قول تبدیل می‌کند تا کل متن چسبانده‌شده در نقل‌قول بلوکی یا کادر فراخوان باقی بماند.',
            quoteContinuationAliases: ['نقل‌قول', 'نقل‌قول بلوکی', 'فراخوان', 'استناد', 'هشدار', 'پاراگراف']
        },

        custom: {
            heading: 'پردازش سفارشی',
            pipelineName: 'اعمال قطعه‌های عبارت منظم سفارشی روی متن',
            pastedText: 'متن چسبانده‌شده',
            note: 'یادداشت',
            wikiButton: 'نمایش ویکی',
            regexButton: 'باز کردن ابزار آزمایش عبارت منظم',
            snippetsName: 'قطعه‌های متن',
            snippetsDesc: 'پس از قواعد داخلی روی کل متن چسبانده‌شده اعمال می‌شوند. آن‌هایی را که باید هنگام چسباندن اجرا شوند روشن کنید.',
            urlSnippetsName: 'قطعه‌های پیوند',
            urlSnippetsDesc:
                'پس از دریافت عنوان صفحه روی هر پیوند چسبانده‌شده اعمال می‌شوند. قواعد فقط پیوند نهایی Markdown را می‌بینند و مقصد پیوند بدون تغییر می‌ماند.',
            enabledSnippetsCount: { one: '{count} قطعه فعال', other: '{count} قطعه فعال' },
            snippetRulesCount: { one: '{count} قاعده', other: '{count} قاعده' },
            invalidRulesCount: { one: '{count} خط نامعتبر', other: '{count} خط نامعتبر' },
            unnamedSnippet: 'قطعه بدون نام',
            emptyState: 'هنوز هیچ قطعه‌ای نساخته‌اید.',
            addSnippet: 'افزودن قطعه',
            editButton: 'ویرایش قطعه',
            exportName: 'برون‌بری قطعه‌ها',
            exportDesc: 'همه قطعه‌ها را با قالب تبادل ویکی کپی می‌کند.',
            exportButton: 'کپی قطعه‌ها',
            importName: 'درون‌ریزی قطعه‌ها',
            importDesc: 'قطعه‌ها را از قالب تبادل ویکی اضافه می‌کند.',
            previewName: 'امتحان کنید',
            previewDesc: 'متن نمونه‌ای بنویسید تا نتیجه همه قطعه‌های فعال را ببینید.',
            modalPreviewDesc: 'متن نمونه‌ای بنویسید تا نتیجه این قطعه را ببینید.',
            previewInputLabel: 'متن نمونه',
            previewEmpty: 'متن پردازش‌شده اینجا نمایش داده می‌شود.',
            urlPreviewDesc: 'پیوند عنوان‌دار نمونه را ویرایش کنید تا نتیجه همه قطعه‌های فعال پیوند را ببینید.',
            urlModalPreviewDesc: 'پیوند عنوان‌دار نمونه را ویرایش کنید تا نتیجه این قطعه را ببینید.',
            urlPreviewLabel: 'پیوند عنوان‌دار نمونه',
            urlPreviewEmpty: 'پیوند پردازش‌شده اینجا نمایش داده می‌شود.',
            nameName: 'نام',
            rulesName: 'قواعد',
            rulesDesc: 'در هر خط یک جایگزینی با عبارت منظم JavaScript وارد کنید.',
            wikiPasteHint: 'یک قطعه آماده را از ویکی کپی کنید و مستقیم در کادر قواعد بچسبانید.',
            invalidLine: 'خط {line}: {value}',
            saveButton: 'ذخیره',
            recognizedSnippetsCount: { one: '{count} قطعه شناسایی شد', other: '{count} قطعه شناسایی شد' },
            recognizedRulesCount: { one: '{count} قاعده شناسایی شد', other: '{count} قاعده شناسایی شد' },
            unparseableName: 'خط‌های شناسایی‌نشده',
            importFallbackName: 'قطعه درون‌ریزی‌شده'
        }
    },

    imageModal: {
        title: 'گزینه‌های تصویر',
        sizeName: 'اندازه',
        className: 'کلاس CSS',
        none: 'کاری انجام نشود',
        apply: 'اعمال',
        cancel: 'لغو'
    },

    pdfModal: {
        furniture: 'حذف شماره صفحه‌ها',
        singleParagraph: 'ادغام همه در یک پاراگراف',
        description:
            'خط‌های شکسته دوباره به هم می‌پیوندند، واژه‌های جداشده با خط تیره ترمیم می‌شوند، حروف ترکیبی به حروف ساده تبدیل می‌شوند و فاصله‌های اضافی حذف می‌شوند.',
        preview: 'پیش‌نمایش'
    },

    welcome: {
        title: 'به Better Paste خوش آمدید',
        intro: [
            'تصاویر را از Safari مستقیم در گاوصندوق ذخیره کنید، پیوندها را بدون پارامترهای ردیابی بچسبانید، خط‌های شکسته خروجی پایانه را درست کنید و متن هوش مصنوعی را تمیز کنید. فقط بچسبانید، بقیه را Better Paste انجام می‌دهد.',
            'یک نکته پیش از شروع: فرمان **چسباندن بدون پردازش** را به `Cmd+Shift+V` (در Windows به `Ctrl+Shift+V`) اختصاص دهید تا همیشه بتوانید محتوای حافظه موقت را همان‌طور که هست بچسبانید.',
            'هر قانون کلید جداگانه‌ای در تنظیمات، Better Paste دارد و ویژگی `{property}: false` افزونه را برای همان یادداشت خاموش می‌کند.'
        ],
        startButton: 'شروع کنید'
    },

    overlap: {
        title: 'Better Paste: افزونه‌های هم‌پوشان',
        thanks: 'ممنون که Better Paste را نصب کردید و از آن استفاده می‌کنید!',
        intro: {
            one: 'در حال حاضر {count} افزونهٔ نصب‌شده دارید که تقریباً همان کار Better Paste را انجام می‌دهد، پس افزونهٔ زیر را غیرفعال یا حذف کنید:',
            other: 'در حال حاضر {count} افزونهٔ نصب‌شده دارید که تقریباً همان کار Better Paste را انجام می‌دهند، پس موارد زیر را غیرفعال یا حذف کنید:'
        },
        outro: 'در تنظیمات > افزونه‌های شخص‌ثالث غیرفعال کنید.',
        dontRemind: 'دیگر یادآوری نشود',
        button: 'متوجه شدم'
    },

    whatsNew: {
        title: 'تازه‌های Better Paste',
        releaseHeading: 'نسخه {version} ({date})',
        categoryNew: 'تازه',
        categoryImproved: 'بهبودیافته',
        categoryChanged: 'تغییریافته',
        categoryFixed: 'رفع‌شده',
        support: 'اگر Better Paste برایتان مفید است، از توسعه آن پشتیبانی کنید.',
        coffeeButton: '☕️ یک قهوه مهمانم کن',
        thanksButton: 'ممنون!',
        dontShowAgain: 'پس از به‌روزرسانی‌ها دیگر نشان داده نشود'
    }
};
