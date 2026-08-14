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
        toggleCleanup: '切換自動整理'
    },

    notices: {
        prefix: 'Better Paste：{message}',
        separator: '，',
        cleanupOn: '自動處理已開啟',
        cleanupOff: '自動處理已關閉',
        selectTextFirst: '請先選取文字',
        nothingToClean: '沒有需要整理的內容',
        clipboardFailed: '無法讀取剪貼簿',
        titleFailed: '無法取得標題。',
        fetchingTitle: '正在取得標題{dots}',
        imagesFailed: { other: '有 {count} 張圖片未能儲存' },
        imagesFailedLinkKept: '{images}，已保留原始連結',
        imagesFailedNothingPasted: '{images}，因此沒有貼上任何內容',
        aiTextCleaned: '已整理 AI 文字',
        terminalCleaned: '已整理終端機輸出',
        textProcessed: '已調整文字樣式',
        urlsCleaned: { other: '已整理 {count} 個連結' },
        imagesSaved: { other: '已儲存 {count} 張圖片' }
    },

    settings: {
        exampleFallback: '{description} 範例：{example}',
        plainFallback: '{description} {example}',

        start: {
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
            heading: '行為',
            autoCleanName: '每次貼上都整理',
            autoCleanDesc:
                '每次貼上都會套用規則。關閉後規則只在 Better Paste 指令中生效。單篇筆記可以用 "bp: false" 屬性排除自己，也可以用 "bp: true" 屬性加入。',
            autoCleanAliases: ['自動', '啟用', '停用', '筆記', '排除', '屬性', 'frontmatter'],
            showNoticesName: '貼上內容被修改時顯示通知',
            showNoticesDesc: '用一行說明改動了什麼。失敗一律會通知。',
            showNoticesAliases: ['通知', '提示', '摘要', '訊息', '安靜']
        },

        images: {
            heading: '圖片',
            savingName: '把貼上的圖片儲存到儲存庫',
            savingDesc:
                '把貼上的圖片儲存到附件資料夾，並連結本機檔案而不是網址。涵蓋 Safari 的「拷貝影像」、複製的網頁內容中的圖片，以及貼上的圖片網址。檔案名稱預設取自網址：',
            savingAliases: ['下載', '附件', 'safari', '螢幕截圖', '圖片', '資料夾', '檔案名稱', '寬度', '尺寸'],
            pageName: '圖片處理',
            pageDesc: '檔案名稱與圖片寬度。',
            nameFormatName: '檔案名稱',
            nameFormatDesc: '儲存的圖片如何命名。',
            nameFormatSource: '沿用來源名稱',
            nameFormatCustom: '自訂格式',
            customName: '自訂格式',
            customDesc: '用 {{name}} 代表來源名稱，日期可用 YYYY-MM-DD 這類 Moment 格式。',
            customMomentLink: 'Moment 格式',
            customExample: '範例：{value}',
            customAliases: ['名稱', '檔案名稱', '日期', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: '圖片寬度屬性',
            sizePropertyDesc:
                '決定貼進筆記的圖片寬度的 frontmatter 屬性。筆記中寫有 "bp-image-width: 400" 時，貼上的圖片會變成 ![[photo.png|400]]。留空則不加上寬度。',
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

        terminal: {
            heading: '終端機文字',
            cleanupName: '整理終端機輸出',
            cleanupDesc: '把終端機折斷的行重新接起來，並去掉顏色代碼與行首縮排。程式碼區塊、表格和清單維持原狀。',
            cleanupAliases: ['換行', '接行', 'ansi', '主控台', 'shell', '縮排', '項目符號', '清單', 'markdown'],
            pageName: '終端機文字處理',
            pageDesc: '接行與項目符號字元。',
            rejoinName: '何時接回被折斷的行',
            rejoinDesc: '只有上一行看起來是滿的，才會把這一行接到它後面。',
            rejoinAliases: ['縮排', '換行', '積極', '保守', 'git log'],
            rejoinIndented: '只有該行有縮排時',
            rejoinAny: '不論該行是否有縮排',
            rejoinNever: '從不接行，只去掉顏色代碼與縮排',
            bulletsName: '項目符號字元',
            bulletsDesc: '如何處理終端機輸出中的 • 等項目符號。',
            bulletsAliases: ['清單', 'markdown', '短破折號'],
            bulletsMarkdown: '轉換成 Markdown 清單項目',
            bulletsPreserve: '維持原狀',
            testerName: '試試看',
            testerDesc: '貼上終端機輸出，看看整理後的樣子。',
            testerLabel: '要整理的終端機文字',
            testerEmpty: '整理後的文字會顯示在這裡。',
            testerSample: [
                '• 這個額外步驟只牽涉清單的 Enter 處理邏輯，所以核心改動很簡單。在梳理鄰近流程時我發現了',
                '  兩處值得驗證的可能問題：重新整理之後選取項目可能會跳動。'
            ]
        },

        text: {
            heading: '文字處理',
            trimName: '去掉前後空白',
            trimDesc: '去掉貼上文字開頭與結尾的空行與空格。',
            trimAliases: ['空白', '空行', '空格', '換行', '修剪'],
            commasName: '逗號與引號',
            commasDesc: '逗號放在右雙引號的哪一側。',
            commasAliases: ['逗號', '引號', '引用', '標點', '樣式'],
            commasNone: '不做變動',
            commasInside: '逗號放在引號內',
            commasOutside: '逗號放在引號外',
            commasExampleSource: '標籤是 "完成," 下一個是 "待辦"。',
            commasExampleOutside: '標籤是 "完成", 下一個是 "待辦"。',
            invisibleName: 'AI 整理：不可見字元',
            invisibleDesc: '移除零寬空格，並把不換行空格變成一般空格。',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                '破折號',
                '長破折號',
                '連接號',
                '連字號',
                'unicode',
                '不可見',
                'nbsp',
                '排版',
                '標點',
                '空白'
            ],
            invisibleExampleStart: '結果是',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: '。',
            invisibleExampleAfter: '結果是 OK。',
            punctuationName: 'AI 整理：破折號與引號',
            punctuationDesc: '把長破折號換成連字號，把彎引號換成直引號。',
            punctuationAliases: ['長破折號', '連接號', '連字號', '引號', '彎引號', '撇號', '標點', '排版'],
            punctuationExampleBefore: '“這個結果 — 出乎所有人意料 — 完美無缺。”',
            punctuationExampleAfter: '"這個結果 - 出乎所有人意料 - 完美無缺。"'
        }
    },

    welcome: {
        title: '歡迎使用 Better Paste',
        intro: [
            'Better Paste 會在剪貼簿內容被貼進筆記時加以處理。',
            '它把連結的圖片儲存成儲存庫附件，移除連結中的追蹤參數，把終端機輸出中被折斷的行重新接起來，並把彎引號與不可見字元換成樸素的等價字元。',
            '每條規則都可以單獨關閉。',
            '單篇筆記可以用 "bp: false" 屬性完全排除自己。設定位於 設定、Better Paste。'
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
