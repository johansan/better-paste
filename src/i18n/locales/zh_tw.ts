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

/** Traditional Chinese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_ZH_TW: TranslationStrings = {
    commands: {
        paste: '貼上',
        pasteRaw: '不做處理直接貼上',
        cleanSelection: '整理選取內容',
        cleanTerminal: '\u6E05\u7406\u6240\u9078\u5167\u5BB9\u4E2D\u7684\u7D42\u7AEF\u6A5F\u8F38\u51FA',
        commasInside: '\u5C07\u9017\u865F\u79FB\u5230\u5F15\u865F\u5167',
        commasOutside: '\u5C07\u9017\u865F\u79FB\u5230\u5F15\u865F\u5916',
        toggleCleanup: '切換自動整理'
    },

    notices: {
        prefix: 'Better Paste：{message}',
        cleanupOn: '自動處理已開啟',
        cleanupOff: '自動處理已關閉',
        selectTextFirst: '請先選取文字',
        nothingToClean: '沒有需要整理的內容',
        clipboardFailed: '無法讀取剪貼簿',
        titleFailed: '無法取得標題。',
        fetchingTitle: '正在取得標題...',
        imagesFailed: { other: '有 {count} 張圖片未能儲存' },
        imagesFailedLinkKept: '{images}，已保留原始連結',
        imagesFailedNothingPasted: '{images}，因此沒有貼上任何內容'
    },

    settings: {
        exampleFallback: '{description} 範例：{example}',
        plainFallback: '{description} {example}',

        start: {
            heading: '關於',
            whatsNewName: 'Better Paste {version} 的新功能',
            whatsNewDesc: '最近幾個版本的變動。',
            whatsNewAliases: ['發行說明', '更新內容', '更新紀錄', '版本', '更新', '歷史'],
            whatsNewButton: '查看最近更新',
            supportName: '支持開發',
            supportDesc: '如果 Better Paste 對你有幫助，歡迎支持它的開發。',
            supportAliases: ['贊助', '捐款', '咖啡', 'github'],
            sponsorButton: '❤️ 贊助',
            coffeeButton: '☕️ 請我喝杯咖啡',
            pluginsName: '看看我的其他外掛',
            pluginsAliases: ['外掛', '插件', 'notebook navigator', 'pixel perfect image', '作者'],
            notebookNavigatorDesc: '更好用的檔案瀏覽器和行事曆',
            pixelPerfectImageDesc: '精確的圖片縮放等'
        },

        behavior: {
            autoCleanName: '每次貼上都整理',
            autoCleanDesc:
                '每次貼上都會套用規則。關閉後規則只在 Better Paste 指令中生效。單篇筆記可以用 "bp: false" 屬性排除自己，也可以用 "bp: true" 屬性單獨啟用。',
            autoCleanAliases: ['自動', '啟用', '停用', '筆記', '排除', '屬性', 'frontmatter']
        },

        images: {
            heading: '圖片',
            savingName: '把貼上的圖片儲存到儲存庫',
            savingDesc:
                '把貼上的圖片儲存到附件資料夾，並連結本機檔案而不是網址。涵蓋 Safari 的「拷貝影像」、複製的網頁內容中的圖片，以及貼上的圖片網址。檔案名稱預設取自網址：',
            savingAliases: ['下載', '附件', 'safari', '螢幕截圖', '圖片', '資料夾', '檔案名稱', '寬度', '尺寸'],
            sizeChoiceName: '貼上時套用尺寸',
            sizeChoiceDesc: '為每張儲存的圖片加上寬度，例如 ![[photo.jpg|400]]。筆記自己的寬度屬性優先。',
            sizeChoiceAliases: ['尺寸', '寬度', '圖片尺寸', '縮放', '嵌入', '400'],
            sizeOptionsName: '尺寸選項',
            sizeOptionsDesc: '上方與貼上對話框中提供的寬度，以逗號分隔。',
            classChoiceName: '貼上時套用 CSS 類別',
            classChoiceDesc: '為每張儲存的圖片加上類別，例如 ![[photo.jpg#invert]]。類別的效果由主題與 CSS 片段決定。',
            classChoiceAliases: ['css', '類別', '片段', 'invert', '主題', '濾鏡', '嵌入'],
            classOptionsName: '類別選項',
            classOptionsDesc: '上方與貼上對話框中提供的類別，以逗號分隔。',
            choiceNone: '什麼都不做',
            choiceAsk: '每次貼上時詢問',
            nameFormatName: '檔案名稱',
            nameFormatDesc: '儲存的圖片如何命名。',
            nameFormatSource: '沿用來源名稱',
            nameFormatCustom: '自訂格式',
            customName: '自訂格式',
            customDesc: '用 {{name}} 代表來源名稱，日期可用 YYYY-MM-DD 這類 Moment 格式。',
            customMomentLink: 'Moment 格式',
            customExample: '範例：{value}',
            customAliases: ['名稱', '檔案名稱', '日期', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: '筆記屬性',
            notePropertyDesc:
                '為單篇筆記開啟或關閉 Better Paste 的屬性。寫成 "bp: false" 時該筆記不會被更動，寫成 "bp: true" 時即使「每次貼上都整理」已關閉也會整理。留空則忽略該屬性。',
            notePropertyAliases: ['筆記', '屬性', 'frontmatter', '排除', '停用', '啟用', 'bp'],
            sizePropertyName: '圖片寬度屬性',
            sizePropertyDesc:
                '決定貼進筆記的圖片寬度的 frontmatter 屬性。筆記中寫有 "image-width: 400" 時，貼上的圖片會變成 ![[photo.png|400]]。留空則不加上寬度。',
            sizePropertyAliases: ['尺寸', 'frontmatter', '屬性', '縮放']
        },

        links: {
            heading: '連結',
            titlesName: '為貼上的連結取得標題',
            titlesDesc:
                '單獨貼上一個網址時，會插入帶頁面標題的 Markdown 連結。若已選取文字，該文字會成為連結文字，且不取得標題。無法取得標題時保留網址本身。',
            titlesAliases: ['標題', '頁面', '網站', 'markdown 連結', '下載'],
            cleaningName: '整理貼上的連結',
            cleaningDesc: '移除貼上連結中的追蹤參數：',
            cleaningAliases: ['url', '追蹤', 'utm', '參數', '查詢', '網站', '網域', 'youtube', '例外'],
            stripName: '要移除哪些參數',
            stripDesc: '追蹤參數是指 utm_source、fbclid、gclid 這類名稱。',
            stripAliases: ['utm', '追蹤', '查詢', '參數'],
            stripAll: '除網站規則保留的以外，移除全部參數',
            stripTracking: '只移除已知的追蹤參數',
            rulesName: '網站規則',
            rulesDesc: '在特定網站保留的參數。',
            rulesCount: { other: '{count} 個網站' },
            listName: '你的網站規則',
            listDesc:
                '{sites}已由外掛涵蓋。在這裡加入你自己的規則，每行一條。「example.com」會保留該網站的全部參數，「example.com: a, b」只保留這兩個，「!example.com」則移除外掛內建的一條規則。子網域會自動比對。',
            listShippedCount: { other: '{count} 個常見網站' },
            listAliases: ['網域', '例外', '白名單', 'youtube'],
            listInvalid: '不是網站名稱：{values}',
            testerName: '試試看',
            testerDesc: '貼上一個連結，看看規則會保留什麼。',
            testerLabel: '要整理的連結',
            testerEmpty: '整理後的連結會顯示在這裡。'
        },

        text: {
            heading: '文字處理',
            trimName: '去掉前後空白',
            trimDesc: '去掉貼上文字開頭與結尾的空行與空格。',
            trimAliases: ['空白', '空行', '空格', '換行', '修剪'],
            invisibleName: '不可見字元',
            invisibleDesc: '移除零寬空格，並把不換行空格變成一般空格。',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', '不可見', '零寬', 'nbsp', '空白'],
            invisibleExampleStart: '結果是',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: '。',
            invisibleExampleAfter: '結果是 OK。',
            quotesName: '引號',
            quotesDesc: '把彎引號和撇號換成直引號。',
            quotesAliases: ['引號', '彎引號', '直引號', '智慧引號', '撇號', '標點', '排版', 'ai'],
            quotesExample: '她說：“完成了”。',
            dashesName: '破折號',
            dashesDesc: '把連接號和破折號換成連字號。',
            dashesAliases: ['破折號', '連字號', '連接號', '橫線', '標點', '排版', 'ai'],
            dashesExample: '這個結果 — 出乎意料 — 很好。'
        }
    },

    imageModal: {
        title: '圖片選項',
        sizeName: '尺寸',
        className: 'CSS 類別',
        none: '什麼都不做',
        apply: '套用',
        cancel: '取消'
    },

    welcome: {
        title: '歡迎使用 Better Paste',
        intro: [
            '把 Safari 中的圖片直接複製進儲存庫、貼上不帶追蹤參數的連結、修復終端機輸出中被折斷的行，並清理 AI 文字。只管貼上，剩下的交給 Better Paste。',
            '開始前的小提示：把**不做處理直接貼上**綁定到 `Cmd+Shift+V`（Windows 上為 `Ctrl+Shift+V`），隨時都能原樣貼上剪貼簿內容。',
            '每條規則都可以在 設定、Better Paste 中單獨開關，筆記中加入 `bp: false` 屬性後，該筆記就不再被處理。'
        ],
        startButton: '開始使用'
    },

    whatsNew: {
        title: 'Better Paste 的新功能',
        scrollLabel: '發行說明',
        releaseHeading: '版本 {version}（{date}）',
        categoryNew: '新增',
        categoryImproved: '改進',
        categoryChanged: '變更',
        categoryFixed: '修正',
        support: '如果 Better Paste 對你有幫助，歡迎支持它的開發。',
        coffeeButton: '☕️ 請我喝杯咖啡',
        thanksButton: '謝謝！'
    }
};
