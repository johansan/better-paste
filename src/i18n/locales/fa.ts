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
        imagesFailed: {
            one: '{count} تصویر ذخیره نشد',
            other: '{count} تصویر ذخیره نشد'
        },
        imagesFailedLinkKept: '{images}، پیوند اصلی نگه داشته شد',
        imagesFailedNothingPasted: '{images}، بنابراین چیزی چسبانده نشد'
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
            savingName: 'ذخیره تصاویر چسبانده‌شده در گاوصندوق',
            savingDesc:
                'تصاویر چسبانده‌شده را در پوشه پیوست‌های شما ذخیره می‌کند و به جای نشانی وب به پرونده محلی پیوند می‌دهد. شامل «کپی تصویر» در Safari، تصاویر درون محتوای وب کپی‌شده و نشانی‌های تصویر چسبانده‌شده است. نام پرونده به‌طور پیش‌فرض از نشانی گرفته می‌شود:',
            savingAliases: ['دانلود', 'پیوست', 'safari', 'نماگرفت', 'تصویر', 'پوشه', 'نام پرونده', 'عرض', 'اندازه'],
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
            nameFormatDesc: 'نام‌گذاری تصاویر ذخیره‌شده.',
            nameFormatSource: 'نام از منبع',
            nameFormatCustom: 'قالب دلخواه',
            customName: 'قالب دلخواه',
            customDesc: 'از {{name}} برای نام منبع و از قالب‌های تاریخ Moment مانند YYYY-MM-DD استفاده کنید.',
            customMomentLink: 'قالب Moment',
            customExample: 'نمونه: {value}',
            customAliases: ['نام', 'پرونده', 'تاریخ', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'ویژگی عرض تصویر',
            sizePropertyDesc:
                'ویژگی frontmatter که عرض تصاویر چسبانده‌شده در یک یادداشت را تعیین می‌کند. با "image-width: 400" در یادداشت، تصویر چسبانده‌شده به ![[photo.png|400]] تبدیل می‌شود. برای نیفزودن عرض، خالی بگذارید.',
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
            stripName: 'کدام پارامترها حذف شوند',
            stripDesc: 'پارامترهای ردیابی نام‌هایی مانند utm_source، fbclid و gclid هستند.',
            stripAliases: ['utm', 'ردیابی', 'پرس‌وجو', 'پارامتر'],
            stripAll: 'هر پارامتری، مگر جایی که قانون وب‌گاه آن را نگه دارد',
            stripTracking: 'تنها پارامترهای ردیابی شناخته‌شده',
            rulesName: 'قوانین وب‌گاه',
            rulesDesc: 'پارامترهایی که در وب‌گاه‌های مشخص نگه داشته می‌شوند.',
            rulesCount: { one: '{count} وب‌گاه', other: '{count} وب‌گاه' },
            listName: 'قوانین وب‌گاه شما',
            listDesc:
                '{sites} از پیش زیر پوشش افزونه است. قوانین خود را اینجا بیفزایید، هر خط یک قانون. «example.com» همه پارامترهای آن وب‌گاه را نگه می‌دارد، «example.com: a, b» تنها همان دو را نگه می‌دارد و «!example.com» قانونی را که همراه افزونه می‌آید حذف می‌کند. زیردامنه‌ها خودکار تطبیق می‌یابند.',
            listShippedCount: { one: '{count} وب‌گاه پرکاربرد', other: '{count} وب‌گاه پرکاربرد' },
            listAliases: ['دامنه', 'استثنا', 'فهرست سفید', 'youtube'],
            listInvalid: 'نام وب‌گاه نیست: {values}',
            testerName: 'امتحان کنید',
            testerDesc: 'یک پیوند بچسبانید تا ببینید قوانین چه چیزی را نگه می‌دارند.',
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
            one: 'در حال حاضر {count} افزونهٔ نصب‌شده دارید که تقریباً همین کار را انجام می‌دهد، پس موارد زیر را غیرفعال یا حذف کنید:',
            other: 'در حال حاضر {count} افزونهٔ نصب‌شده دارید که تقریباً همین کار را انجام می‌دهند، پس موارد زیر را غیرفعال یا حذف کنید:'
        },
        outro: 'در تنظیمات > افزونه‌های شخص‌ثالث غیرفعال کنید.',
        dontRemind: 'دیگر یادآوری نشود',
        button: 'متوجه شدم'
    },

    whatsNew: {
        title: 'تازه‌های Better Paste',
        scrollLabel: 'یادداشت‌های انتشار',
        releaseHeading: 'نسخه {version} ({date})',
        categoryNew: 'تازه',
        categoryImproved: 'بهبودیافته',
        categoryChanged: 'تغییریافته',
        categoryFixed: 'رفع‌شده',
        support: 'اگر Better Paste برایتان مفید است، از توسعه آن پشتیبانی کنید.',
        coffeeButton: '☕️ یک قهوه مهمانم کن',
        thanksButton: 'ممنون!'
    }
};
