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

/** Simplified Chinese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_ZH_CN: TranslationStrings = {
    commands: {
        paste: '粘贴',
        pasteRaw: '不做处理直接粘贴',
        cleanSelection: '清理选中内容',
        cleanTerminal: '清理终端输出',
        cleanPdf: '清理 PDF 文本',
        runSnippet: '运行片段',
        commasInside: '将逗号移到引号内',
        commasOutside: '将逗号移到引号外',
        toggleCleanup: '切换自动清理'
    },

    notices: {
        prefix: 'Better Paste：{message}',
        cleanupOn: '自动处理已开启',
        cleanupOff: '自动处理已关闭',
        selectTextFirst: '请先选择文本',
        nothingToClean: '没有需要清理的内容',
        clipboardFailed: '无法读取剪贴板',
        titleFailed: '无法获取标题。',
        fetchingTitle: '正在获取标题...',
        fetchingTitles: '正在获取标题...',
        titlesFailed: { other: '有 {count} 个标题未能获取' },
        imagesFailed: { other: '有 {count} 张图片未能保存' },
        imagesFailedLinkKept: '{images}，已保留原始链接',
        imagesFailedNothingPasted: '{images}，因此没有粘贴任何内容',
        snippetsCopied: '片段已复制',
        snippetsCopyFailed: '无法复制片段'
    },

    settings: {
        exampleFallback: '{description} 示例：{example}',
        plainFallback: '{description} {example}',

        start: {
            heading: '关于',
            whatsNewName: 'Better Paste {version} 的新功能',
            whatsNewDesc: '最近几个版本的改动。',
            whatsNewAliases: ['发行说明', '更新内容', '更新日志', '版本', '更新', '历史'],
            whatsNewButton: '查看最近更新',
            showReleaseNotesName: '更新后显示新功能',
            showReleaseNotesDesc: '每次更新后打开一次新功能对话框。',
            showReleaseNotesAliases: ['发行说明', '新功能', '更新', '对话框', '弹窗', '通知'],
            supportName: '支持开发',
            supportDesc: '如果 Better Paste 对你有帮助，欢迎支持它的开发。',
            supportAliases: ['赞助', '捐赠', '咖啡', 'github'],
            sponsorButton: '❤️ 赞助',
            coffeeButton: '☕️ 请我喝杯咖啡',
            pluginsName: '看看我的其他插件',
            pluginsAliases: ['插件', 'notebook navigator', 'pixel perfect image', '作者', '更多'],
            notebookNavigatorDesc: '更好用的文件浏览器和日历',
            pixelPerfectImageDesc: '精确的图片缩放等'
        },

        behavior: {
            autoCleanName: '每次粘贴都清理',
            autoCleanDesc:
                '每次粘贴都会应用规则。关闭后规则只在 Better Paste 命令中生效。单篇笔记可以用 "{property}: false" 属性排除自己，也可以用 "{property}: true" 属性单独启用。',
            autoCleanAliases: ['自动', '启用', '禁用', '笔记', '排除', '属性', 'frontmatter'],
            notePropertyName: '笔记属性',
            notePropertyDesc: '为单篇笔记开启或关闭 Better Paste 的属性。',
            notePropertyAliases: ['笔记', '属性', 'frontmatter', '排除', '禁用', '启用', 'bp']
        },

        images: {
            heading: '附件',
            fileModeName: '粘贴的文件',
            fileModeDesc:
                '选择从设备粘贴文件（如 PDF 和截图）时的处理方式。“什么都不做”让 Obsidian 照常粘贴，预览也一并保留。“链接但不预览”则移除感叹号。',
            fileModeChoiceOff: '什么都不做',
            fileModeChoiceLink: '链接但不预览',
            fileModeAliases: ['文件', '附件', '预览', '嵌入', '链接', 'pdf', '截图', '感叹号'],
            savingName: '网络图片',
            savingDesc:
                '选择粘贴网络图片链接时的处理方式。“什么都不做”保持粘贴内容原样，“链接并预览”直接从网络显示图片，“下载并预览”则把副本保存到你的仓库。',
            savingDownloadDesc: '文件名默认取自网址：',
            savingChoiceOff: '什么都不做',
            savingChoiceLink: '链接并预览',
            savingChoiceDownload: '下载并预览',
            savingAliases: ['下载', '链接', '嵌入', '预览', 'url', '网络', '附件', 'safari', '本地', '图片', '文件夹'],
            sizeStyleName: '尺寸与样式',
            sizeStyleDesc: '为粘贴的图片添加宽度或 CSS 类，可自动应用，也可每次选择。',
            sizeStyleAliases: ['尺寸', '宽度', 'css', '类', '样式', '缩放', 'invert'],
            summarySize: '尺寸：{value}',
            summaryStyle: '样式：{value}',
            summaryAsk: '询问',
            sizeChoiceName: '粘贴时应用尺寸',
            sizeChoiceDesc: '为每张保存的图片添加宽度，例如 ![[photo.jpg|400]]。笔记自己的宽度属性优先。',
            sizeChoiceAliases: ['尺寸', '宽度', '图片尺寸', '缩放', '嵌入', '400'],
            sizeOptionsName: '尺寸选项',
            sizeOptionsDesc: '上方和粘贴对话框中提供的宽度，用逗号分隔。',
            classChoiceName: '粘贴时应用 CSS 类',
            classChoiceDesc: '为每张保存的图片添加 CSS 类，例如 ![[photo.jpg#invert]]。类的效果由主题和 CSS 片段决定。',
            classChoiceAliases: ['css', '类', '片段', 'invert', '主题', '滤镜', '嵌入'],
            classOptionsName: 'CSS 类选项',
            classOptionsDesc: '上方和粘贴对话框中提供的类，用逗号分隔。',
            choiceNone: '什么都不做',
            choiceAsk: '每次粘贴时询问',
            nameFormatName: '文件名',
            customDesc:
                '用 {{name}} 表示来源名称，{{noteName}} 表示笔记名称，{{property:xyz}} 表示 frontmatter 属性，{{counter}} 或 {{counter:2}} 表示递增编号，日期可用 YYYY-MM-DD 这类 Moment 格式。',
            customScreenshotDesc: '截图没有来源名称，因此它的 {{name}} 会像 Obsidian 一样变成带时间戳的“Pasted image”。',
            namingInfoTitle: '文件名格式何时生效',
            namingInfoLead: '重要！Better Paste 无法做到以下几点：',
            namingInfoExplorer: '重命名在访达或文件资源管理器中复制后粘贴的文件',
            namingInfoDrag: '重命名拖入笔记的文件',
            namingInfoMobile: '处理在移动设备上用 Obsidian 自带粘贴命令粘贴的内容。请改用“{command}”。',
            customMomentLink: 'Moment 格式',
            customExample: '示例：{value}',
            customExampleNote: '我的笔记',
            customAliases: [
                '名称',
                '文件名',
                '日期',
                'moment',
                'YYYY',
                '{{name}}',
                '编号',
                '属性',
                '笔记名称',
                '截图',
                '重命名',
                '剪贴板',
                'paste image rename'
            ],
            sizePropertyName: '图片宽度属性',
            sizePropertyDesc:
                '决定粘贴进笔记的图片宽度的 frontmatter 属性。笔记中写有 "{property}: 400" 时，粘贴的图片会变成 ![[photo.png|400]]。留空则不添加宽度。',
            sizePropertyAliases: ['尺寸', 'frontmatter', '属性', '缩放']
        },

        links: {
            heading: '链接',
            titlesName: '为粘贴的链接获取标题',
            titlesDesc:
                '单独粘贴一个网址时，会插入带页面标题的 Markdown 链接。粘贴 Obsidian URL 时，会插入带笔记名称的链接。若已选中文本，该文本会成为链接文字，并且不获取标题。无法获取标题时保留网址本身。',
            titlesAliases: ['标题', '页面', '网站', 'markdown 链接', '下载'],
            cleaningName: '清理粘贴的链接',
            cleaningDesc: '移除粘贴链接中的跟踪参数：',
            cleaningAliases: ['url', '跟踪', 'utm', '参数', '查询', '网站', '域名', 'youtube', '例外'],
            removalsName: '链接参数移除',
            removalsDesc: '要额外移除的参数，可作用于所有网站或特定网站。',
            rulesCount: { other: '{count} 条规则' },
            builtInName: '内置移除规则',
            builtInDesc: '更新于 {date}。全局跟踪过滤器：{trackingCount}。特定网站规则：{siteCount}。经过加密签名的链接保持不变。',
            builtInButton: '查看列表',
            listName: '你的移除规则',
            listDesc:
                '在任意网站的普通链接中移除某个参数，只需单独输入该参数的名称。例如，输入 fbclid 即可移除所有出现位置的 fbclid 参数。\n\n若要仅从某个网站移除参数，请使用 example.com | source, ref 格式。这将从 example.com 及其子域名中移除 source 和 ref 参数，而其他所有参数保持不变。在某行开头输入 !，即可关闭该网站的内置移除规则。经过加密签名的链接始终保持不变。',
            listAliases: ['域名', '参数', '过滤器', '删除', 'youtube'],
            listInvalid: '无效的移除规则：{values}',
            suggestName: '提交你的移除规则',
            suggestDesc: '提交要移除的参数，帮助改进内置移除规则。',
            suggestAliases: ['贡献', '提交', '分享', '发送', '过滤器'],
            suggestButton: '查看并发送',
            testerName: '试一试',
            testerDesc: '粘贴一个链接，查看清理后的结果。',
            testerLabel: '要清理的链接',
            testerEmpty: '清理后的链接会显示在这里。'
        },

        text: {
            heading: '文本处理',
            trimName: '去掉首尾空白',
            trimDesc: '去掉粘贴文本开头和结尾的空行与空格。',
            trimAliases: ['空白', '空行', '空格', '换行', '修剪'],
            invisibleName: '不可见字符',
            invisibleDesc: '移除零宽空格，并把不换行空格变成普通空格。',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', '不可见', '零宽', 'nbsp', '空白'],
            invisibleExampleStart: '结果是',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: '。',
            invisibleExampleAfter: '结果是 OK。',
            quotesName: '引号',
            quotesDesc: '把弯引号和撇号换成直引号。',
            quotesAliases: ['引号', '弯引号', '直引号', '智能引号', '撇号', '标点', '排版', 'ai'],
            quotesExample: '她说：“完成了”。',
            dashesName: '破折号',
            dashesDesc: '把连接号和破折号换成连字符。',
            dashesAliases: ['破折号', '连字符', '连接号', '短横线', '标点', '排版', 'ai'],
            dashesExample: '这个结果 — 出乎意料 — 很好。'
        },

        structure: {
            heading: '结构',
            listNestingName: '粘贴时保留列表层级',
            listNestingDesc: '粘贴复制的列表时保持其层级结构，并按粘贴位置的列表项调整缩进。',
            listNestingAliases: ['列表', '嵌套', '缩进', '层级', '大纲', '项目符号', '复选框', '树'],
            quoteContinuationName: '粘贴时延续块引用',
            quoteContinuationDesc: '将多行文本粘贴到引用行时，为每一行添加引用标记，使粘贴内容全部保留在块引用或标注框中。',
            quoteContinuationAliases: ['引用', '块引用', '引用块', '标注', '引文', '警告框', '段落']
        },

        custom: {
            heading: '自定义处理',
            pipelineName: '将自定义正则表达式片段应用于文本',
            pastedText: '已粘贴文本',
            note: '笔记',
            wikiButton: '查看 Wiki',
            regexButton: '打开正则表达式测试工具',
            snippetsName: '文本片段',
            snippetsDesc: '在内置规则之后应用于整段粘贴的文本。启用粘贴时要运行的片段。',
            urlSnippetsName: '链接片段',
            urlSnippetsDesc: '在获取页面标题后应用于每条粘贴的链接。规则只会看到最终的 Markdown 链接，链接目标保持不变。',
            enabledSnippetsCount: { other: '已启用 {count} 个片段' },
            snippetRulesCount: { other: '{count} 条规则' },
            invalidRulesCount: { other: '{count} 行无效内容' },
            unnamedSnippet: '未命名片段',
            emptyState: '你还没有创建任何片段。',
            addSnippet: '添加片段',
            editButton: '编辑片段',
            exportName: '导出片段',
            exportDesc: '以 Wiki 交换格式复制所有片段。',
            exportButton: '复制片段',
            importName: '导入片段',
            importDesc: '从 Wiki 交换格式追加片段。',
            previewName: '试一试',
            previewDesc: '输入示例文本，查看所有已启用片段的处理结果。',
            modalPreviewDesc: '输入示例文本，查看此片段的处理结果。',
            previewInputLabel: '示例文本',
            previewEmpty: '处理后的文本会显示在这里。',
            urlPreviewDesc: '粘贴一个 Markdown 链接，查看所有已启用链接片段的处理结果。',
            urlModalPreviewDesc: '粘贴一个 Markdown 链接，查看此片段的处理结果。',
            urlPreviewLabel: '带标题的示例链接',
            urlPreviewEmpty: '处理后的链接会显示在这里。',
            nameName: '名称',
            rulesName: '规则',
            rulesDesc: '每行输入一条 JavaScript 正则表达式替换规则。',
            wikiPasteHint: '从 Wiki 复制现成的片段，直接粘贴到规则输入框。',
            invalidLine: '第 {line} 行：{value}',
            saveButton: '保存',
            recognizedSnippetsCount: { other: '识别出 {count} 个片段' },
            recognizedRulesCount: { other: '识别出 {count} 条规则' },
            unparseableName: '无法解析的行',
            importFallbackName: '导入的片段',
            defaultSnippetBoldHeadings: '移除标题中的加粗',
            defaultSnippetBlankLines: '合并空行',
            defaultSnippetSiteSuffixes: '移除页面标题中的网站名称'
        }
    },

    imageModal: {
        title: '图片选项',
        sizeName: '尺寸',
        className: 'CSS 类',
        none: '什么都不做',
        apply: '应用',
        cancel: '取消'
    },

    pdfModal: {
        furniture: '移除页码',
        singleParagraph: '合并为一个段落',
        description: '重新连接折行、修复被连字符拆开的单词、将连字转换为普通字母，并移除多余的空格。',
        preview: '预览'
    },

    welcome: {
        title: '欢迎使用 Better Paste',
        intro: [
            '把 Safari 中的图片直接复制进仓库，粘贴不带跟踪参数的链接，修复终端输出中被折断的行，并清理 AI 文本。只管粘贴，剩下的交给 Better Paste。',
            '开始前的一个小提示：把**不做处理直接粘贴**绑定到 `Cmd+Shift+V`（Windows 上为 `Ctrl+Shift+V`），随时都能原样粘贴剪贴板内容。',
            '每条规则都可以在 设置、Better Paste 中单独开关，笔记中加入 `{property}: false` 属性后，该笔记就不再被处理。'
        ],
        startButton: '开始使用'
    },

    overlap: {
        title: 'Better Paste：功能重复的插件',
        thanks: '感谢安装并使用 Better Paste！',
        intro: {
            other: '你目前安装了 {count} 个与 Better Paste 功能大致相同的插件。请禁用或卸载以下插件：'
        },
        outro: '可在 设置 > 第三方插件 中禁用。',
        dontRemind: '不再提醒',
        button: '知道了'
    },

    whatsNew: {
        title: 'Better Paste 的新功能',
        releaseHeading: '版本 {version}（{date}）',
        categoryNew: '新增',
        categoryImproved: '改进',
        categoryChanged: '变更',
        categoryFixed: '修复',
        support: '如果 Better Paste 对你有帮助，欢迎支持它的开发。',
        coffeeButton: '☕️ 请我喝杯咖啡',
        thanksButton: '谢谢！'
    }
};
