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

/** Japanese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_JA: TranslationStrings = {
    commands: {
        paste: '貼り付け',
        pasteRaw: '処理せずに貼り付け',
        cleanSelection: '選択範囲を整える',
        cleanTerminal: 'ターミナル出力を整える',
        cleanPdf: 'PDFのテキストを整える',
        runSnippet: 'スニペットを実行',
        commasInside: 'カンマを引用符の内側に移動',
        commasOutside: 'カンマを引用符の外側に移動',
        toggleCleanup: '自動整形を切り替え'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: '自動処理をオンにしました',
        cleanupOff: '自動処理をオフにしました',
        selectTextFirst: '先にテキストを選択してください',
        nothingToClean: '整えるものはありません',
        clipboardFailed: 'クリップボードを読み取れませんでした',
        titleFailed: 'タイトルを取得できませんでした。',
        fetchingTitle: 'タイトルを取得中...',
        imagesFailed: { other: '画像 {count} 件を保存できませんでした' },
        imagesFailedLinkKept: '{images}。元のリンクを残しました',
        imagesFailedNothingPasted: '{images}。そのため何も貼り付けていません',
        snippetsCopied: 'スニペットをコピーしました',
        snippetsCopyFailed: 'スニペットをコピーできませんでした'
    },

    settings: {
        exampleFallback: '{description} 例: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'このプラグインについて',
            whatsNewName: 'Better Paste {version} の新機能',
            whatsNewDesc: '直近のリリースで変わった点。',
            whatsNewAliases: ['リリースノート', '変更点', '変更履歴', 'バージョン', '更新', '履歴'],
            whatsNewButton: '最近の更新を見る',
            supportName: '開発を支援する',
            supportDesc: 'Better Paste が役に立ったら、開発の支援をご検討ください。',
            supportAliases: ['スポンサー', '寄付', 'コーヒー', 'github'],
            sponsorButton: '❤️ スポンサー',
            coffeeButton: '☕️ コーヒーをおごる',
            pluginsName: 'ほかのプラグインも見る',
            pluginsAliases: ['プラグイン', 'notebook navigator', 'pixel perfect image', '作者', 'その他'],
            notebookNavigatorDesc: 'より使いやすいファイルブラウザとカレンダー',
            pixelPerfectImageDesc: '正確な画像リサイズなど'
        },

        behavior: {
            autoCleanName: '貼り付けのたびに整える',
            autoCleanDesc:
                '貼り付けのたびにルールを適用します。オフのときは Better Paste のコマンドを使ったときだけ適用されます。個々のノートは "{property}: false" プロパティで対象外にでき、"{property}: true" で対象にできます。',
            autoCleanAliases: ['自動', '有効', '無効', 'ノート', '除外', 'プロパティ', 'フロントマター', 'frontmatter'],
            notePropertyName: 'ノートのプロパティ',
            notePropertyDesc: '個々のノートで Better Paste を有効または無効にするプロパティです。',
            notePropertyAliases: ['ノート', 'プロパティ', 'フロントマター', 'frontmatter', '除外', '無効', '有効', 'bp']
        },

        images: {
            heading: '画像',
            savingName: 'ウェブ画像を保管庫に保存',
            savingDesc:
                'ウェブ上の画像を添付ファイルフォルダーに保存し、ウェブアドレスではなくローカルファイルにリンクします。Safari の「イメージをコピー」、コピーしたウェブコンテンツに含まれる画像、貼り付けた画像アドレスが対象です。ファイル名は既定でアドレスから取ります:',
            savingAliases: ['ダウンロード', 'url', 'ウェブ', '添付ファイル', 'safari', 'ローカル', '画像', 'フォルダー'],
            sizeStyleName: 'サイズとスタイル',
            sizeStyleDesc: '貼り付けた画像に幅や CSS クラスを付けます。自動で適用することも、毎回選ぶこともできます。',
            sizeStyleAliases: ['サイズ', '幅', 'css', 'クラス', 'スタイル', 'リサイズ', 'invert'],
            summarySize: 'サイズ: {value}',
            summaryStyle: 'スタイル: {value}',
            summaryAsk: '毎回確認',
            sizeChoiceName: '貼り付け時にサイズを適用',
            sizeChoiceDesc: '保存した画像の埋め込みに幅を付けます。例: ![[photo.jpg|400]]。ノート自身の幅プロパティが優先されます。',
            sizeChoiceAliases: ['サイズ', '幅', '画像サイズ', 'リサイズ', '埋め込み', '400'],
            sizeOptionsName: 'サイズの選択肢',
            sizeOptionsDesc: '上の設定と貼り付け時のダイアログに表示される幅。カンマ区切りで指定します。',
            classChoiceName: '貼り付け時に CSS クラスを適用',
            classChoiceDesc:
                '保存した画像の埋め込みにクラスを付けます。例: ![[photo.jpg#invert]]。クラスの効果はテーマや CSS スニペットによって決まります。',
            classChoiceAliases: ['css', 'クラス', 'スニペット', 'invert', 'テーマ', 'フィルター', '埋め込み'],
            classOptionsName: 'クラスの選択肢',
            classOptionsDesc: '上の設定と貼り付け時のダイアログに表示されるクラス。カンマ区切りで指定します。',
            choiceNone: '何もしない',
            choiceAsk: '毎回確認する',
            nameFormatName: 'ファイル名',
            customDesc:
                '元の名前には {{name}} を、ノート名には {{noteName}} を、フロントマターのプロパティには {{property:xyz}} を、連番には {{counter}} や {{counter:2}} を、日付には YYYY-MM-DD のような Moment の書式を使います。',
            customScreenshotDesc:
                'スクリーンショットには元の名前がないため、{{name}} は Obsidian と同じくタイムスタンプ付きの「Pasted image」になります。',
            customMomentLink: 'Moment の書式',
            customExample: '例: {value}',
            customExampleNote: 'マイノート',
            customAliases: [
                '名前',
                'ファイル名',
                '日付',
                'moment',
                'YYYY',
                '{{name}}',
                '連番',
                'プロパティ',
                'ノート名',
                'スクリーンショット',
                '名前変更',
                'クリップボード',
                'paste image rename'
            ],
            sizePropertyName: '画像幅のプロパティ',
            sizePropertyDesc:
                'ノートに貼り付ける画像の幅を決めるフロントマターのプロパティです。ノートに "{property}: 400" があると、貼り付けた画像は ![[photo.png|400]] になります。空欄にすると幅を付けません。',
            sizePropertyAliases: ['サイズ', 'フロントマター', 'frontmatter', 'プロパティ', 'リサイズ']
        },

        links: {
            heading: 'リンク',
            titlesName: '貼り付けたリンクのタイトルを取得',
            titlesDesc:
                'ウェブアドレスだけを貼り付けると、ページタイトルを付けた Markdown リンクを挿入します。テキストを選択している場合は、そのテキストがラベルになり、タイトルは取得しません。タイトルを取得できないときはアドレスだけを残します。',
            titlesAliases: ['タイトル', 'ページ', 'ウェブサイト', 'markdown リンク', 'ダウンロード'],
            cleaningName: '貼り付けたリンクを整理',
            cleaningDesc: '貼り付けたリンクから追跡パラメーターを取り除きます:',
            cleaningAliases: ['url', '追跡', 'utm', 'パラメーター', 'クエリ', 'サイト', 'ドメイン', 'youtube', '例外'],
            removalsName: 'リンクのパラメーター削除',
            removalsDesc: 'すべてのサイト、または特定のサイトだけで削除する追加のパラメーター。',
            rulesCount: { other: '{count} 件' },
            builtInName: '組み込みの削除ルール',
            builtInDesc:
                '最終更新: {date}。グローバルな追跡フィルター: {trackingCount}。サイト別ルール: {siteCount}。暗号署名付きのリンクは変更されません。',
            builtInButton: '一覧を表示',
            listName: '自分の削除ルール',
            listDesc:
                '任意のサイトの通常のリンクからパラメーターを削除するには、そのパラメーター名を単独で入力します。例えば「fbclid」と入力すると、fbclid パラメーターがどこに現れても削除されます。\n\n「example.com | source, ref」と指定すると、特定のサイトでのみパラメーターを削除できます。これにより example.com とそのサブドメインから source と ref が削除され、その他のパラメーターはそのまま残ります。行の先頭に「!」を付けると、そのサイトに対する組み込みの削除ルールを無効にできます。暗号署名付きのリンクは常に変更されません。',
            listAliases: ['ドメイン', 'パラメーター', 'フィルター', '削除', 'youtube'],
            listInvalid: '無効な削除ルール: {values}',
            suggestName: '削除ルールを提案する',
            suggestDesc: '削除するパラメーターを提案して、組み込みの削除ルールの改善にご協力ください。',
            suggestAliases: ['貢献', '提出', 'シェア', '送信', 'フィルター'],
            suggestButton: '確認して送信',
            testerName: '試す',
            testerDesc: 'リンクを貼り付けて、整理された結果を確認してください。',
            testerLabel: '整理するリンク',
            testerEmpty: '整理されたリンクがここに表示されます。'
        },

        text: {
            heading: 'テキスト処理',
            trimName: '前後の空白を取り除く',
            trimDesc: '貼り付けたテキストの先頭と末尾から空行と空白を取り除きます。',
            trimAliases: ['空白', '空行', 'スペース', '改行', 'トリム'],
            invisibleName: '不可視文字',
            invisibleDesc: 'ゼロ幅スペースを取り除き、ノーブレークスペースを通常のスペースに変えます。',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', '不可視', 'ゼロ幅', 'nbsp', '空白'],
            invisibleExampleStart: '結果は',
            invisibleExampleMiddle: 'OK',
            invisibleExampleEnd: ' だった。',
            invisibleExampleAfter: '結果は OK だった。',
            quotesName: '引用符',
            quotesDesc: '曲線引用符とアポストロフィをまっすぐな引用符に変えます。',
            quotesAliases: ['引用符', 'スマート引用符', 'クォーテーション', 'アポストロフィ', '句読点', 'タイポグラフィ', 'ai'],
            quotesExample: '“完了” と表示された。',
            dashesName: 'ダッシュ',
            dashesDesc: 'en ダッシュと em ダッシュをハイフンに変えます。',
            dashesAliases: ['ダッシュ', 'em ダッシュ', 'en ダッシュ', '全角ダッシュ', 'ハイフン', '句読点', 'タイポグラフィ', 'ai'],
            dashesExample: 'その結果は — 予想に反して — 良かった。'
        },

        custom: {
            heading: 'カスタム処理',
            pipelineName: 'カスタム正規表現スニペットをテキストに適用',
            pastedText: '貼り付けたテキスト',
            builtInRules: '組み込みルール',
            customSnippets: 'カスタムスニペット',
            note: 'ノート',
            wikiButton: 'Wiki を開く',
            regexButton: '正規表現テストツールを開く',
            snippetsName: 'スニペット',
            snippetsDesc: 'スニペットを追加・編集します。貼り付け時に実行するものをオンにします。',
            enabledSnippetsCount: { other: '有効なスニペット {count} 件' },
            snippetRulesCount: { other: 'ルール {count} 件' },
            invalidRulesCount: { other: '無効な行 {count} 件' },
            unnamedSnippet: '名前のないスニペット',
            emptyState: 'スニペットはまだありません。',
            addSnippet: 'スニペットを追加',
            editButton: 'スニペットを編集',
            exportName: 'スニペットをエクスポート',
            exportDesc: 'すべてのスニペットを Wiki の交換形式でコピーします。',
            exportButton: 'スニペットをコピー',
            importName: 'スニペットをインポート',
            importDesc: 'Wiki の交換形式からスニペットを追加します。',
            previewName: '試す',
            previewDesc: 'サンプルテキストを入力して、有効なすべてのスニペットの結果を確認します。',
            modalPreviewDesc: 'サンプルテキストを入力して、このスニペットの結果を確認します。',
            previewInputLabel: 'サンプルテキスト',
            previewEmpty: '処理後のテキストがここに表示されます。',
            nameName: '名前',
            rulesName: 'ルール',
            rulesDesc: '1 行につき 1 つの JavaScript 正規表現置換を入力します。',
            wikiPasteHint: 'Wiki から既製のスニペットをコピーして、ルール欄にそのまま貼り付けられます。',
            invalidLine: '{line} 行目: {value}',
            saveButton: '保存',
            recognizedSnippetsCount: { other: 'スニペット {count} 件を認識' },
            recognizedRulesCount: { other: 'ルール {count} 件を認識' },
            unparseableName: '解析できない行',
            importFallbackName: 'インポートしたスニペット'
        }
    },

    imageModal: {
        title: '画像オプション',
        sizeName: 'サイズ',
        className: 'CSS クラス',
        none: '何もしない',
        apply: '適用',
        cancel: 'キャンセル'
    },

    pdfModal: {
        furniture: 'ページ番号を削除',
        singleParagraph: 'すべてを1つの段落にまとめる',
        description:
            '折り返された行をつなぎ直し、ハイフンで分割された単語を修復し、合字を通常の文字に変換し、余分なスペースを取り除きます。',
        preview: 'プレビュー'
    },

    welcome: {
        title: 'Better Paste へようこそ',
        intro: [
            'Safari からコピーした画像を保管庫に保存し、リンクから追跡パラメーターを取り除き、折り返されたターミナル出力をつなぎ直し、AI テキストをきれいにします。あとは貼り付けるだけです。',
            'はじめる前にひとつヒント: **処理せずに貼り付け**を `Cmd+Shift+V`（Windows では `Ctrl+Shift+V`）に割り当てておくと、いつでもクリップボードの内容をそのまま貼り付けられます。',
            'ルールはそれぞれ 設定、Better Paste で個別にオン・オフできます。ノートに `{property}: false` プロパティを書けば、そのノートではプラグインが無効になります。'
        ],
        startButton: 'はじめる'
    },

    overlap: {
        title: 'Better Paste: 機能が重複するプラグイン',
        thanks: 'Better Paste をインストールしてお使いいただき、ありがとうございます！',
        intro: {
            other: '現在、ほぼ同じ機能のプラグインが {count} 個インストールされています。次のプラグインを無効化するか、アンインストールしてください：'
        },
        outro: '設定 > コミュニティプラグインで無効化できます。',
        dontRemind: '今後表示しない',
        button: 'わかりました'
    },

    whatsNew: {
        title: 'Better Paste の新機能',
        scrollLabel: 'リリースノート',
        releaseHeading: 'バージョン {version} ({date})',
        categoryNew: '新機能',
        categoryImproved: '改善',
        categoryChanged: '変更',
        categoryFixed: '修正',
        support: 'Better Paste が役に立ったら、開発の支援をご検討ください。',
        coffeeButton: '☕️ コーヒーをおごる',
        thanksButton: 'ありがとう!'
    }
};
