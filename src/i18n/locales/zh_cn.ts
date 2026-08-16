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
        imagesFailed: { other: '有 {count} 张图片未能保存' },
        imagesFailedLinkKept: '{images}，已保留原始链接',
        imagesFailedNothingPasted: '{images}，因此没有粘贴任何内容'
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
            heading: '图片',
            savingName: '把粘贴的图片保存到仓库',
            savingDesc:
                '把粘贴的图片保存到附件文件夹，并链接本地文件而不是网址。涵盖 Safari 的“拷贝图像”、复制的网页内容中的图片，以及粘贴的图片地址。文件名默认取自地址：',
            savingAliases: ['下载', '附件', 'safari', '截图', '图片', '文件夹', '文件名', '宽度', '尺寸'],
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

    welcome: {
        title: '欢迎使用 Better Paste',
        intro: [
            '把 Safari 中的图片直接复制进仓库，粘贴不带跟踪参数的链接，修复终端输出中被折断的行，并清理 AI 文本。只管粘贴，剩下的交给 Better Paste。',
            '开始前的一个小提示：把**不做处理直接粘贴**绑定到 `Cmd+Shift+V`（Windows 上为 `Ctrl+Shift+V`），随时都能原样粘贴剪贴板内容。',
            '每条规则都可以在 设置、Better Paste 中单独开关，笔记中加入 `{property}: false` 属性后，该笔记就不再被处理。'
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
