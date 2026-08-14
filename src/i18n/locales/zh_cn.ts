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
        toggleCleanup: '切换自动清理'
    },

    notices: {
        prefix: 'Better Paste：{message}',
        separator: '，',
        cleanupOn: '自动处理已开启',
        cleanupOff: '自动处理已关闭',
        selectTextFirst: '请先选择文本',
        nothingToClean: '没有需要清理的内容',
        clipboardFailed: '无法读取剪贴板',
        titleFailed: '无法获取标题。',
        fetchingTitle: '正在获取标题{dots}',
        imagesFailed: { other: '有 {count} 张图片未能保存' },
        imagesFailedLinkKept: '{images}，已保留原始链接',
        imagesFailedNothingPasted: '{images}，因此没有粘贴任何内容',
        aiTextCleaned: '已整理 AI 文本',
        terminalCleaned: '已清理终端输出',
        textProcessed: '已调整文本样式',
        urlsCleaned: { other: '已清理 {count} 个链接' },
        imagesSaved: { other: '已保存 {count} 张图片' }
    },

    settings: {
        exampleFallback: '{description} 示例：{example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Better Paste {version} 的新功能',
            whatsNewDesc: '最近几个版本的改动。',
            whatsNewAliases: ['发行说明', '更新内容', '更新日志', '版本', '更新', '历史'],
            whatsNewButton: '查看最近更新',
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
            heading: '行为',
            autoCleanName: '每次粘贴都清理',
            autoCleanDesc:
                '每次粘贴都会应用规则。关闭后规则只在 Better Paste 命令中生效。单篇笔记可以用 "better-paste: false" 属性排除自己。',
            autoCleanAliases: ['自动', '启用', '禁用', '笔记', '排除', '属性', 'frontmatter'],
            showNoticesName: '粘贴内容被修改时显示提示',
            showNoticesDesc: '用一行说明改动了什么。失败总会提示。',
            showNoticesAliases: ['通知', '提示', '摘要', '消息', '安静']
        },

        images: {
            heading: '图片',
            savingName: '把粘贴的图片保存到仓库',
            savingDesc:
                '把粘贴的图片保存到附件文件夹，并链接本地文件而不是网址。涵盖 Safari 的“拷贝图像”、复制的网页内容中的图片，以及粘贴的图片地址。文件名默认取自地址：',
            savingAliases: ['下载', '附件', 'safari', '截图', '图片', '文件夹', '文件名', '宽度', '尺寸'],
            pageName: '图片处理',
            pageDesc: '文件名与图片宽度。',
            nameFormatName: '文件名',
            nameFormatDesc: '保存的图片如何命名。',
            nameFormatSource: '沿用来源名称',
            nameFormatCustom: '自定义格式',
            customName: '自定义格式',
            customDesc: '用 {{name}} 表示来源名称，日期可用 YYYY-MM-DD 这类 Moment 格式。',
            customMomentLink: 'Moment 格式',
            customExample: '示例：{value}',
            customAliases: ['名称', '文件名', '日期', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: '图片宽度属性',
            sizePropertyDesc:
                '决定粘贴进笔记的图片宽度的 frontmatter 属性。笔记中写有 "image-width: 400" 时，粘贴的图片会变成 ![[photo.png|400]]。留空则不添加宽度。',
            sizePropertyAliases: ['尺寸', 'frontmatter', '属性', '缩放']
        },

        links: {
            heading: '链接',
            titlesName: '为粘贴的链接获取标题',
            titlesDesc:
                '单独粘贴一个网址时，会插入带页面标题的 Markdown 链接。若已选中文本，该文本会成为链接文字，并且不获取标题。无法获取标题时保留网址本身。',
            titlesAliases: ['标题', '页面', '网站', 'markdown 链接', '下载'],
            cleaningName: '清理粘贴的链接',
            cleaningDesc: '移除粘贴链接中的跟踪参数：',
            cleaningAliases: ['url', '跟踪', 'utm', '参数', '查询', '网站', '域名', 'youtube', '例外'],
            stripName: '移除哪些参数',
            stripDesc: '跟踪参数是指 utm_source、fbclid、gclid 这类名称。',
            stripAliases: ['utm', '跟踪', '查询', '参数'],
            stripAll: '除站点规则保留的以外，移除全部参数',
            stripTracking: '只移除已知的跟踪参数',
            rulesName: '站点规则',
            rulesDesc: '在特定站点保留的参数。',
            rulesCount: { other: '{count} 个站点' },
            listName: '你的站点规则',
            listDesc:
                '{sites}已由插件覆盖。在这里添加你自己的规则，每行一条。“example.com”保留该站点的全部参数，“example.com: a, b”只保留这两个，“!example.com”则移除插件自带的一条规则。子域名会自动匹配。',
            listShippedCount: { other: '{count} 个常见站点' },
            listAliases: ['域名', '例外', '白名单', 'youtube'],
            listInvalid: '不是站点名称：{values}',
            testerName: '试一试',
            testerDesc: '粘贴一个链接，看看规则会保留什么。',
            testerLabel: '要清理的链接',
            testerEmpty: '清理后的链接会显示在这里。'
        },

        terminal: {
            heading: '终端文本',
            cleanupName: '清理终端输出',
            cleanupDesc: '把终端折断的行重新接起来，并去掉颜色代码和行首缩进。代码块、表格和列表保持不变。',
            cleanupAliases: ['折行', '接行', 'ansi', '控制台', 'shell', '缩进', '项目符号', '列表', 'markdown'],
            pageName: '终端文本处理',
            pageDesc: '接行与项目符号字符。',
            rejoinName: '何时接回被折断的行',
            rejoinDesc: '只有上一行看起来是满的，才会把本行接到它后面。',
            rejoinAliases: ['缩进', '折行', '激进', '保守', 'git log'],
            rejoinIndented: '仅当该行有缩进时',
            rejoinAny: '无论该行是否有缩进',
            rejoinNever: '从不接行，只去掉颜色代码和缩进',
            bulletsName: '项目符号字符',
            bulletsDesc: '如何处理终端输出中的 • 等项目符号。',
            bulletsAliases: ['列表', 'markdown', '短横线'],
            bulletsMarkdown: '转换成 Markdown 列表项',
            bulletsPreserve: '保持原样',
            testerName: '试一试',
            testerDesc: '粘贴终端输出，看看清理后的样子。',
            testerLabel: '要清理的终端文本',
            testerEmpty: '清理后的文本会显示在这里。',
            testerSample: [
                '• 这个额外步骤只涉及列表的 Enter 处理逻辑，所以核心改动很简单。在梳理相邻流程时我发现了',
                '  两处值得验证的可能问题：刷新之后选中项可能会跳动。'
            ]
        },

        text: {
            heading: '文本处理',
            trimName: '去掉首尾空白',
            trimDesc: '去掉粘贴文本开头和结尾的空行与空格。',
            trimAliases: ['空白', '空行', '空格', '换行', '修剪'],
            commasName: '逗号与引号',
            commasDesc: '逗号放在右双引号的哪一侧。',
            commasAliases: ['逗号', '引号', '引用', '标点', '样式'],
            commasNone: '不做改动',
            commasInside: '逗号放在引号内',
            commasOutside: '逗号放在引号外',
            commasExampleSource: '标签是 "完成," 下一个是 "待办"。',
            commasExampleOutside: '标签是 "完成", 下一个是 "待办"。',
            invisibleName: 'AI 清理：不可见字符',
            invisibleDesc: '移除零宽空格，并把不换行空格变成普通空格。',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                '破折号',
                '长破折号',
                '连接号',
                '连字符',
                'unicode',
                '不可见',
                'nbsp',
                '排版',
                '标点',
                '空白'
            ],
            invisibleExampleStart: '结果是',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: '。',
            invisibleExampleAfter: '结果是 OK。',
            punctuationName: 'AI 清理：破折号与引号',
            punctuationDesc: '把长破折号换成连字符，把弯引号换成直引号。',
            punctuationAliases: ['长破折号', '连接号', '连字符', '引号', '弯引号', '撇号', '标点', '排版'],
            punctuationExampleBefore: '“这个结果 — 出乎所有人意料 — 完美无缺。”',
            punctuationExampleAfter: '"这个结果 - 出乎所有人意料 - 完美无缺。"'
        }
    },

    welcome: {
        title: '欢迎使用 Better Paste',
        intro: [
            'Better Paste 会在剪贴板内容被粘贴进笔记时对其进行处理。',
            '它把链接的图片保存为仓库附件，移除链接中的跟踪参数，把终端输出中被折断的行重新接起来，并把弯引号和不可见字符替换成朴素的等价字符。',
            '每条规则都可以单独关闭。',
            '单篇笔记可以用 "better-paste: false" 属性完全排除自己。设置位于 设置、Better Paste。'
        ],
        startButton: '开始使用'
    },

    whatsNew: {
        title: 'Better Paste 的新功能',
        scrollLabel: '发行说明',
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
