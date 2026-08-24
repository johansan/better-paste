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
        cleanTerminal: '整理終端機輸出',
        cleanPdf: '整理 PDF 文字',
        runSnippet: '執行片段',
        commasInside: '將逗號移到引號內',
        commasOutside: '將逗號移到引號外',
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
        fetchingTitles: '正在取得標題...',
        titlesFailed: { other: '有 {count} 個標題未能取得' },
        imagesFailed: { other: '有 {count} 張圖片未能儲存' },
        imagesFailedLinkKept: '{images}，已保留原始連結',
        imagesFailedNothingPasted: '{images}，因此沒有貼上任何內容',
        snippetsCopied: '片段已複製',
        snippetsCopyFailed: '無法複製片段'
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
            showReleaseNotesName: '更新後顯示新功能',
            showReleaseNotesDesc: '每次更新後開啟一次新功能對話框。',
            showReleaseNotesAliases: ['發行說明', '新功能', '更新', '對話框', '彈窗', '通知'],
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
                '每次貼上都會套用規則。關閉後規則只在 Better Paste 指令中生效。單篇筆記可以用 "{property}: false" 屬性排除自己，也可以用 "{property}: true" 屬性單獨啟用。',
            autoCleanAliases: ['自動', '啟用', '停用', '筆記', '排除', '屬性', 'frontmatter'],
            notePropertyName: '筆記屬性',
            notePropertyDesc: '為單篇筆記開啟或關閉 Better Paste 的屬性。',
            notePropertyAliases: ['筆記', '屬性', 'frontmatter', '排除', '停用', '啟用', 'bp']
        },

        images: {
            heading: '附件',
            fileModeName: '貼上的檔案',
            fileModeDesc:
                '選擇從裝置貼上檔案（如 PDF 和螢幕截圖）時的處理方式。「什麼都不做」讓 Obsidian 照常貼上，預覽也一併保留。「連結但不預覽」則移除驚嘆號。',
            fileModeChoiceOff: '什麼都不做',
            fileModeChoiceLink: '連結但不預覽',
            fileModeAliases: ['檔案', '附件', '預覽', '嵌入', '連結', 'pdf', '螢幕截圖', '驚嘆號'],
            savingName: '網路圖片',
            savingDesc:
                '選擇貼上網路圖片連結時的處理方式。「什麼都不做」保持貼上內容原樣，「連結並預覽」直接從網路顯示圖片，「下載並預覽」則把副本儲存到你的儲存庫。',
            savingDownloadDesc: '檔案名稱預設取自網址：',
            savingChoiceOff: '什麼都不做',
            savingChoiceLink: '連結並預覽',
            savingChoiceDownload: '下載並預覽',
            savingAliases: ['下載', '連結', '嵌入', '預覽', 'url', '網路', '附件', 'safari', '本機', '圖片', '資料夾'],
            sizeStyleName: '尺寸與樣式',
            sizeStyleDesc: '為貼上的圖片加上寬度或 CSS 類別，可自動套用，也可每次選擇。',
            sizeStyleAliases: ['尺寸', '寬度', 'css', '類別', '樣式', '縮放', 'invert'],
            summarySize: '尺寸：{value}',
            summaryStyle: '樣式：{value}',
            summaryAsk: '詢問',
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
            customDesc:
                '用 {{name}} 代表來源名稱，{{noteName}} 代表筆記名稱，{{property:xyz}} 代表 frontmatter 屬性，{{counter}} 或 {{counter:2}} 代表遞增編號，日期可用 YYYY-MM-DD 這類 Moment 格式。',
            customScreenshotDesc: '螢幕截圖沒有來源名稱，因此它的 {{name}} 會像 Obsidian 一樣變成帶時間戳記的「Pasted image」。',
            namingInfoTitle: '檔案名稱格式何時生效',
            namingInfoLead: '重要！以下兩種情況 Better Paste 無法重新命名檔案：',
            namingInfoExplorer: '在 Finder 或檔案總管中複製檔案後貼上',
            namingInfoDrag: '把檔案拖進筆記',
            customMomentLink: 'Moment 格式',
            customExample: '範例：{value}',
            customExampleNote: '我的筆記',
            customAliases: [
                '名稱',
                '檔案名稱',
                '日期',
                'moment',
                'YYYY',
                '{{name}}',
                '編號',
                '屬性',
                '筆記名稱',
                '螢幕截圖',
                '重新命名',
                '剪貼簿',
                'paste image rename'
            ],
            sizePropertyName: '圖片寬度屬性',
            sizePropertyDesc:
                '決定貼進筆記的圖片寬度的 frontmatter 屬性。筆記中寫有 "{property}: 400" 時，貼上的圖片會變成 ![[photo.png|400]]。留空則不加上寬度。',
            sizePropertyAliases: ['尺寸', 'frontmatter', '屬性', '縮放']
        },

        links: {
            heading: '連結',
            titlesName: '為貼上的連結取得標題',
            titlesDesc:
                '單獨貼上一個網址時，會插入帶頁面標題的 Markdown 連結。貼上 Obsidian URL 時，會插入帶筆記名稱的連結。若已選取文字，該文字會成為連結文字，且不取得標題。無法取得標題時保留網址本身。',
            titlesAliases: ['標題', '頁面', '網站', 'markdown 連結', '下載'],
            cleaningName: '整理貼上的連結',
            cleaningDesc: '移除貼上連結中的追蹤參數：',
            cleaningAliases: ['url', '追蹤', 'utm', '參數', '查詢', '網站', '網域', 'youtube', '例外'],
            removalsName: '連結參數移除',
            removalsDesc: '要額外移除的參數，可套用於所有網站或特定網站。',
            rulesCount: { other: '{count} 條規則' },
            builtInName: '內建移除規則',
            builtInDesc: '更新於 {date}。全域追蹤過濾器：{trackingCount}。特定網站規則：{siteCount}。經加密簽章的連結保持不變。',
            builtInButton: '檢視清單',
            listName: '你的移除規則',
            listDesc:
                '若要從所有網站的普通連結中移除特定參數，請單獨輸入該參數名稱。例如，輸入 fbclid 即可移除所有出現的 fbclid 參數。\n\n若要僅從特定網站移除參數，請使用 example.com | source, ref 格式。這會從 example.com 及其子網域中移除 source 和 ref，而其他所有參數則保持不變。若要在某個網站停用內建移除規則，請在該行開頭加上 !。經加密簽章的連結將始終保持不變。',
            listAliases: ['網域', '參數', '篩選', '移除', 'youtube'],
            listInvalid: '無效的移除規則：{values}',
            suggestName: '提交你的移除規則',
            suggestDesc: '提交要移除的參數，協助改善內建移除規則。',
            suggestAliases: ['貢獻', '提交', '分享', '傳送', '篩選'],
            suggestButton: '檢視並傳送',
            testerName: '試試看',
            testerDesc: '貼上一個連結，即可查看經過清理後的結果。',
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
        },

        structure: {
            heading: '結構',
            listNestingName: '貼上時保留清單層級',
            listNestingDesc: '貼上複製的清單時保持其層級結構，並依貼上位置的清單項目調整縮排。',
            listNestingAliases: ['清單', '巢狀', '縮排', '層級', '大綱', '項目符號', '核取方塊', '樹狀'],
            quoteContinuationName: '貼上時延續區塊引用',
            quoteContinuationDesc: '將多行文字貼到引用行時，為每一行加上引用標記，讓貼上的內容全部保留在區塊引用或標註區塊內。',
            quoteContinuationAliases: ['引用', '區塊引用', '標註', '引文', '警告', '段落']
        },

        custom: {
            heading: '自訂處理',
            pipelineName: '將自訂正規表示式片段套用至文字',
            pastedText: '已貼上文字',
            note: '筆記',
            wikiButton: '檢視 Wiki',
            regexButton: '開啟正規表示式測試工具',
            snippetsName: '文字片段',
            snippetsDesc: '在內建規則之後套用至整段貼上的文字。啟用貼上時要執行的片段。',
            urlSnippetsName: '連結片段',
            urlSnippetsDesc: '在取得頁面標題後套用至每條貼上的連結。規則只會看到最終的 Markdown 連結，連結目標保持不變。',
            enabledSnippetsCount: { other: '已啟用 {count} 個片段' },
            snippetRulesCount: { other: '{count} 條規則' },
            invalidRulesCount: { other: '{count} 行無效內容' },
            unnamedSnippet: '未命名片段',
            emptyState: '你還沒有建立任何片段。',
            addSnippet: '新增片段',
            editButton: '編輯片段',
            exportName: '匯出片段',
            exportDesc: '以 Wiki 交換格式複製所有片段。',
            exportButton: '複製片段',
            importName: '匯入片段',
            importDesc: '從 Wiki 交換格式加入片段。',
            previewName: '試試看',
            previewDesc: '輸入範例文字，查看所有已啟用片段的處理結果。',
            modalPreviewDesc: '輸入範例文字，查看此片段的處理結果。',
            previewInputLabel: '範例文字',
            previewEmpty: '處理後的文字會顯示在這裡。',
            urlPreviewDesc: '貼上一個 Markdown 連結，查看所有已啟用連結片段的處理結果。',
            urlModalPreviewDesc: '貼上一個 Markdown 連結，查看此片段的處理結果。',
            urlPreviewLabel: '帶標題的範例連結',
            urlPreviewEmpty: '處理後的連結會顯示在這裡。',
            nameName: '名稱',
            rulesName: '規則',
            rulesDesc: '每行輸入一條 JavaScript 正規表示式取代規則。',
            wikiPasteHint: '從 Wiki 複製現成的片段，直接貼到規則欄位。',
            invalidLine: '第 {line} 行：{value}',
            saveButton: '儲存',
            recognizedSnippetsCount: { other: '辨識出 {count} 個片段' },
            recognizedRulesCount: { other: '辨識出 {count} 條規則' },
            unparseableName: '無法解析的行',
            importFallbackName: '匯入的片段',
            defaultSnippetBoldHeadings: '移除標題中的粗體',
            defaultSnippetBlankLines: '合併空行',
            defaultSnippetSiteSuffixes: '移除頁面標題中的網站名稱'
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

    pdfModal: {
        furniture: '移除頁碼',
        singleParagraph: '合併為一個段落',
        description: '重新連接折行、修復被連字號拆開的單字、將合字轉換為一般字母，並移除多餘的空格。',
        preview: '預覽'
    },

    welcome: {
        title: '歡迎使用 Better Paste',
        intro: [
            '把 Safari 中的圖片直接複製進儲存庫、貼上不帶追蹤參數的連結、修復終端機輸出中被折斷的行，並清理 AI 文字。只管貼上，剩下的交給 Better Paste。',
            '開始前的小提示：把**不做處理直接貼上**綁定到 `Cmd+Shift+V`（Windows 上為 `Ctrl+Shift+V`），隨時都能原樣貼上剪貼簿內容。',
            '每條規則都可以在 設定、Better Paste 中單獨開關，筆記中加入 `{property}: false` 屬性後，該筆記就不再被處理。'
        ],
        startButton: '開始使用'
    },

    overlap: {
        title: 'Better Paste：功能重複的外掛',
        thanks: '感謝安裝並使用 Better Paste！',
        intro: {
            other: '你目前安裝了 {count} 個與 Better Paste 功能大致相同的外掛。請停用或移除以下外掛：'
        },
        outro: '可在 設定 > 第三方外掛程式 中停用。',
        dontRemind: '不再提醒',
        button: '知道了'
    },

    whatsNew: {
        title: 'Better Paste 的新功能',
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
