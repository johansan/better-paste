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
        toggleCleanup: 'تغییر وضعیت پاک‌سازی خودکار'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: '، ',
        cleanupOn: 'پردازش خودکار روشن است',
        cleanupOff: 'پردازش خودکار خاموش است',
        selectTextFirst: 'ابتدا متنی را انتخاب کنید',
        nothingToClean: 'چیزی برای پاک‌سازی نیست',
        clipboardFailed: 'خواندن حافظه موقت ممکن نشد',
        titleFailed: 'دریافت عنوان ممکن نشد.',
        fetchingTitle: 'در حال دریافت عنوان{dots}',
        imagesFailed: {
            one: '{count} تصویر ذخیره نشد',
            other: '{count} تصویر ذخیره نشد'
        },
        imagesFailedLinkKept: '{images}، پیوند اصلی نگه داشته شد',
        imagesFailedNothingPasted: '{images}، بنابراین چیزی چسبانده نشد. محتوا هنوز در حافظه موقت است.',
        aiTextCleaned: 'متن هوش مصنوعی مرتب شد',
        terminalCleaned: 'خروجی پایانه پاک‌سازی شد',
        textProcessed: 'سبک متن تنظیم شد',
        urlsCleaned: { one: '{count} نشانی پاک‌سازی شد', other: '{count} نشانی پاک‌سازی شد' },
        imagesSaved: { one: '{count} تصویر ذخیره شد', other: '{count} تصویر ذخیره شد' }
    },

    settings: {
        exampleFallback: '{description} نمونه: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'تازه‌های Better Paste {version}',
            whatsNewDesc: 'آنچه در نسخه‌های اخیر تغییر کرده است.',
            whatsNewAliases: ['یادداشت انتشار', 'تغییرات', 'فهرست تغییرات', 'نسخه', 'به‌روزرسانی', 'تاریخچه'],
            whatsNewButton: 'دیدن تازه‌ها',
            supportName: 'پشتیبانی از توسعه',
            supportDesc: 'اگر Better Paste برایتان مفید است، از ادامه توسعه آن پشتیبانی کنید.',
            supportAliases: ['حمایت', 'کمک مالی', 'قهوه', 'github'],
            sponsorButton: '❤️ حمایت',
            coffeeButton: '☕️ یک قهوه مهمانم کن'
        },

        behavior: {
            heading: 'رفتار',
            autoCleanName: 'پاک‌سازی هر بار چسباندن',
            autoCleanDesc:
                'قوانین را در هر چسباندن اعمال می‌کند. برای استفاده تنها از دستورها این را خاموش کنید. یک یادداشت می‌تواند با ویژگی "better-paste: false" خود را کنار بگذارد.',
            autoCleanAliases: ['خودکار', 'فعال', 'غیرفعال', 'یادداشت', 'استثنا', 'ویژگی', 'frontmatter'],
            showNoticesName: 'نمایش اعلان وقتی چسباندن تغییر کرد',
            showNoticesDesc: 'خلاصه‌ای یک‌خطی از آنچه پاک‌سازی شد. خطاها همیشه گزارش می‌شوند، هر مقداری که اینجا تنظیم شده باشد.',
            showNoticesAliases: ['اعلان', 'خلاصه', 'پیام', 'بی‌صدا']
        },

        images: {
            heading: 'تصاویر',
            savingName: 'ذخیره تصاویر چسبانده‌شده در گاوصندوق',
            savingDesc:
                'تصاویر چسبانده‌شده را به جای رها کردن پیوند بیرونی، به صورت پرونده محلی ذخیره می‌کند. این شامل «کپی تصویر» در Safari، تصاویر درون محتوای وب کپی‌شده و نشانی‌های تکی تصویر می‌شود. تصاویر در پوشه پیوست‌های گاوصندوق شما ذخیره می‌شوند. با گزینه «نام از منبع»:',
            savingAliases: ['دانلود', 'پیوست', 'safari', 'نماگرفت', 'تصویر', 'پوشه', 'نام پرونده', 'عرض', 'اندازه'],
            pageName: 'مدیریت تصاویر',
            pageDesc: 'نام پرونده‌ها و عرض تصویر برای هر یادداشت.',
            nameFormatName: 'نام پرونده‌ها',
            nameFormatDesc: 'انتخاب کنید پرونده‌های تصویری ذخیره‌شده چگونه نام‌گذاری شوند.',
            nameFormatSource: 'نام از منبع',
            nameFormatCustom: 'قالب دلخواه',
            customName: 'قالب دلخواه',
            customDesc: 'از {{name}} برای نام منبع و از قالب‌های تاریخ Moment مانند YYYY-MM-DD استفاده کنید.',
            customMomentLink: 'قالب Moment',
            customExample: 'نمونه: {value}',
            customAliases: ['نام', 'پرونده', 'تاریخ', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'ویژگی عرض تصویر',
            sizePropertyDesc:
                'ویژگی frontmatter که عرض تصاویر چسبانده‌شده در یک یادداشت را تعیین می‌کند. یادداشتی که از این ویژگی استفاده کند، چسباندن نماگرفت‌ها را به جای Obsidian بر عهده می‌گیرد. برای غیرفعال کردن، خالی بگذارید.',
            sizePropertyAliases: ['اندازه', 'frontmatter', 'ویژگی', 'تغییر اندازه']
        },

        links: {
            heading: 'پیوندها',
            titlesName: 'دریافت عنوان برای پیوندهای چسبانده‌شده',
            titlesDesc:
                'وقتی حافظه موقت تنها یک نشانی وب غیرتصویری دارد، عنوان صفحه دریافت و یک پیوند Markdown چسبانده می‌شود. هر متن انتخاب‌شده دیگری بدون هیچ درخواستی به برچسب تبدیل می‌شود. اگر عنوان دریافت نشود، نشانی اصلی باقی می‌ماند.',
            titlesAliases: ['عنوان', 'صفحه', 'وب‌گاه', 'پیوند markdown', 'دانلود'],
            cleaningName: 'پاک‌سازی پیوندهای چسبانده‌شده',
            cleaningDesc: 'پارامترهای ردیابی را از پیوندهای چسبانده‌شده حذف می‌کند. بخش خط‌خورده حذف می‌شود:',
            cleaningAliases: ['url', 'ردیابی', 'utm', 'پارامتر', 'پرس‌وجو', 'وب‌گاه', 'دامنه', 'youtube', 'استثنا'],
            stripName: 'کدام پارامترها حذف شوند',
            stripDesc:
                'انتخاب کنید همه پارامترهای پرس‌وجو حذف شوند یا تنها پارامترهای ردیابی شناخته‌شده. قوانین وب‌گاه می‌توانند در هر دو حالت پارامترها را نگه دارند.',
            stripAliases: ['utm', 'ردیابی', 'پرس‌وجو', 'پارامتر'],
            stripAll: 'هر پارامتری، مگر جایی که قانون وب‌گاه آن را نگه دارد',
            stripTracking: 'تنها پارامترهای ردیابیِ شناخته‌شده',
            rulesName: 'قوانین نگه‌داشتن پارامترها',
            rulesDesc: 'قوانین وب‌گاه برای نگه‌داشتن پارامترهای مشخص پرس‌وجو در هر دو حالت حذف.',
            rulesCount: { one: '{count} وب‌گاه', other: '{count} وب‌گاه' },
            listName: 'قوانین وب‌گاه شما',
            listDesc:
                '{sites} از پیش پشتیبانی می‌شود و همراه افزونه به‌روز می‌ماند. قوانین خود را اینجا بیفزایید، هر خط یک قانون. «example.com» همه پارامترهای آن وب‌گاه را نگه می‌دارد، «example.com: a, b» تنها همان دو را نگه می‌دارد و «!example.com» قانونی را که همراه افزونه می‌آید حذف می‌کند. در حالت «تنها پارامترهای ردیابیِ شناخته‌شده» یک قانون فقط پارامترهای ردیابی متناظر را نجات می‌دهد، چون بقیه پارامترها از پیش نگه داشته می‌شوند. زیردامنه‌ها خودکار تطبیق می‌یابند.',
            listShippedCount: { one: '{count} وب‌گاه پرکاربرد', other: '{count} وب‌گاه پرکاربرد' },
            listAliases: ['دامنه', 'استثنا', 'فهرست سفید', 'youtube'],
            listInvalid: 'نام وب‌گاه نیست: {values}',
            testerName: 'امتحان کنید',
            testerDesc: 'یک پیوند بچسبانید تا ببینید این قوانین چه چیزی را نگه می‌دارند.',
            testerLabel: 'پیوند برای پاک‌سازی',
            testerEmpty: 'پیوند پاک‌سازی‌شده اینجا نمایش داده می‌شود.'
        },

        terminal: {
            heading: 'متن پایانه',
            cleanupName: 'پاک‌سازی خروجی پایانه',
            cleanupDesc:
                'خط‌های شکسته در خروجی پایانه را دوباره به هم می‌پیوندد و تورفتگی را برمی‌دارد. رمزهای رنگ حذف می‌شوند. بلوک‌های کد، جدول‌ها و آیتم‌های فهرست دست‌نخورده می‌مانند.',
            cleanupAliases: ['شکست خط', 'پیوستن', 'ansi', 'کنسول', 'پوسته', 'تورفتگی', 'گلوله', 'فهرست', 'markdown'],
            pageName: 'مدیریت متن پایانه',
            pageDesc: 'شرایط پیوستن خط‌ها و نویسه‌های گلوله.',
            rejoinName: 'چه زمانی خط شکسته دوباره پیوند بخورد',
            rejoinDesc: 'شرط لازم برای اینکه یک خط ادامه خط پیشین به شمار بیاید.',
            rejoinAliases: ['تورفتگی', 'شکست خط', 'تهاجمی', 'محتاط', 'git log'],
            rejoinIndented: 'تنها وقتی خط بعدی تورفتگی دارد',
            rejoinAny: 'هر گاه خط بالا پر به نظر برسد',
            rejoinNever: 'هرگز پیوند نزن، فقط رمزها و تورفتگی را بردار',
            bulletsName: 'نویسه‌های گلوله',
            bulletsDesc: 'تعیین می‌کند نویسه‌های گلوله (مانند •) در خروجی پایانه حفظ شوند یا به آیتم فهرست Markdown تبدیل شوند.',
            bulletsAliases: ['فهرست', 'markdown', 'خط تیره'],
            bulletsMarkdown: 'تبدیل به آیتم فهرست Markdown',
            bulletsPreserve: 'همان‌طور که هستند بمانند',
            testerName: 'امتحان کنید',
            testerDesc: 'خروجی پایانه را بچسبانید تا ببینید چگونه پاک‌سازی می‌شود.',
            testerLabel: 'متن پایانه برای پاک‌سازی',
            testerEmpty: 'متن پاک‌سازی‌شده اینجا نمایش داده می‌شود.',
            testerSample: [
                '• گام اضافی تنها به مدیریت Enter در فهرست محدود است، بنابراین تغییر اصلی ساده است. هنگام بررسی جریان‌های مجاور یافتم',
                '  دو نقطه اصطکاک محتمل که ارزش بررسی دارند: انتخاب ممکن است پس از تازه‌سازی جابه‌جا شود.'
            ]
        },

        text: {
            heading: 'پردازش متن',
            trimName: 'حذف فاصله‌های پیرامون',
            trimDesc: 'خط‌های خالی و فاصله‌ها را از ابتدا و انتهای متن چسبانده‌شده برمی‌دارد.',
            trimAliases: ['فاصله', 'خط خالی', 'خط جدید', 'برش'],
            commasName: 'ویرگول و گیومه',
            commasDesc: 'انتخاب کنید ویرگول کنار گیومه دوتایی بسته کجا قرار بگیرد.',
            commasAliases: ['ویرگول', 'گیومه', 'نقل قول', 'نشانه‌گذاری', 'سبک'],
            commasNone: 'بدون تغییر',
            commasInside: 'ویرگول درون گیومه',
            commasOutside: 'ویرگول بیرون گیومه',
            commasExampleSource: 'او گفت "تمام شد," و رفت.',
            commasExampleOutside: 'او گفت "تمام شد", و رفت.',
            invisibleName: 'پاک‌سازی هوش مصنوعی: نویسه‌های نامرئی',
            invisibleDesc: 'فاصله‌های با عرض صفر را حذف می‌کند و فاصله‌های ناشکستنی را به فاصله معمولی تبدیل می‌کند.',
            invisibleAliases: [
                'هوش مصنوعی',
                'chatgpt',
                'claude',
                'llm',
                'خط تیره',
                'خط تیره بلند',
                'نیم‌خط',
                'یونیکد',
                'نامرئی',
                'nbsp',
                'تایپوگرافی',
                'نشانه‌گذاری',
                'فاصله'
            ],
            invisibleExampleStart: 'آن',
            invisibleExampleMiddle: 'نتیجه',
            invisibleExampleEnd: ' خوب بود.',
            invisibleExampleAfter: 'آن نتیجه خوب بود.',
            punctuationName: 'پاک‌سازی هوش مصنوعی: خط تیره و گیومه',
            punctuationDesc: 'خط تیره‌های بلند را به خط پیوند و گیومه‌های فرفری را به گیومه راست تبدیل می‌کند.',
            punctuationAliases: ['خط تیره بلند', 'نیم‌خط', 'خط پیوند', 'گیومه', 'گیومه فرفری', 'آپاستروف', 'نشانه‌گذاری', 'تایپوگرافی'],
            punctuationExampleBefore: '“نتیجه — برخلاف همه پیش‌بینی‌ها — بی‌نقص بود.”',
            punctuationExampleAfter: '"نتیجه - برخلاف همه پیش‌بینی‌ها - بی‌نقص بود."'
        }
    },

    welcome: {
        title: 'به Better Paste خوش آمدید',
        intro: [
            'Better Paste محتوای حافظه موقت را هنگام چسباندن در یک یادداشت تغییر می‌دهد.',
            'تصاویر پیوندشده را به عنوان پیوست در گاوصندوق ذخیره می‌کند، پارامترهای ردیابی را از پیوندها برمی‌دارد، خط‌های شکسته خروجی پایانه را دوباره به هم می‌پیوندد و گیومه‌های فرفری و نویسه‌های نامرئی را با معادل‌های ساده جایگزین می‌کند.',
            'هر قانون را می‌توان جداگانه خاموش کرد.',
            'یک یادداشت می‌تواند با ویژگی "better-paste: false" کاملاً کنار بماند. تنظیمات در بخش تنظیمات، Better Paste است.'
        ],
        startButton: 'شروع کنید'
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
