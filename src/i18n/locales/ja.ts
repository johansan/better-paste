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
        imagesFailedNothingPasted: '{images}。そのため何も貼り付けていません'
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
                '貼り付けのたびにルールを適用します。オフのときは Better Paste のコマンドを使ったときだけ適用されます。個々のノートは "bp: false" プロパティで対象外にでき、"bp: true" で対象にできます。',
            autoCleanAliases: ['自動', '有効', '無効', 'ノート', '除外', 'プロパティ', 'フロントマター', 'frontmatter']
        },

        images: {
            heading: '画像',
            savingName: '貼り付けた画像を保管庫に保存',
            savingDesc:
                '貼り付けた画像を添付ファイルフォルダーに保存し、ウェブアドレスではなくローカルファイルにリンクします。Safari の「画像をコピー」、コピーしたウェブ内容に含まれる画像、貼り付けた画像アドレスが対象です。ファイル名は既定でアドレスから取ります:',
            savingAliases: [
                'ダウンロード',
                '添付ファイル',
                'safari',
                'スクリーンショット',
                '画像',
                'フォルダー',
                'ファイル名',
                '幅',
                'サイズ'
            ],
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
            nameFormatDesc: '保存する画像の名前の付け方。',
            nameFormatSource: '元の名前を使う',
            nameFormatCustom: 'カスタム形式',
            customName: 'カスタム形式',
            customDesc: '元の名前には {{name}} を、日付には YYYY-MM-DD のような Moment の書式を使います。',
            customMomentLink: 'Moment の書式',
            customExample: '例: {value}',
            customAliases: ['名前', 'ファイル名', '日付', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'フロントマター',
            notePropertyName: 'ノートのプロパティ',
            notePropertyDesc:
                '個々のノートで Better Paste を有効または無効にするプロパティです。"bp: false" ならそのノートは変更されず、"bp: true" なら「貼り付けのたびに整える」がオフでも整えられます。空欄にするとこのプロパティを無視します。',
            notePropertyAliases: ['ノート', 'プロパティ', 'フロントマター', 'frontmatter', '除外', '無効', '有効', 'bp'],
            sizePropertyName: '画像幅のプロパティ',
            sizePropertyDesc:
                'ノートに貼り付ける画像の幅を決めるフロントマターのプロパティです。ノートに "image-width: 400" があると、貼り付けた画像は ![[photo.png|400]] になります。空欄にすると幅を付けません。',
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
            stripName: '削除するパラメーター',
            stripDesc: '追跡パラメーターとは utm_source、fbclid、gclid のような名前です。',
            stripAliases: ['utm', '追跡', 'クエリ', 'パラメーター'],
            stripAll: 'サイトルールが残す場合を除き、すべてのパラメーター',
            stripTracking: '既知の追跡パラメーターのみ',
            rulesName: 'サイトルール',
            rulesDesc: '特定のサイトで残すパラメーター。',
            rulesCount: { other: '{count} サイト' },
            listName: '自分のサイトルール',
            listDesc:
                '{sites}はプラグインが対応済みです。独自のルールを 1 行に 1 つずつ追加してください。「example.com」はそのサイトのすべてのパラメーターを残し、「example.com: a, b」はその 2 つだけを残し、「!example.com」はプラグイン同梱のルールを削除します。サブドメインは自動的に一致します。',
            listShippedCount: { other: '{count} 件の主要サイト' },
            listAliases: ['ドメイン', '例外', 'ホワイトリスト', 'youtube'],
            listInvalid: 'サイト名ではありません: {values}',
            testerName: '試す',
            testerDesc: 'リンクを貼り付けると、ルールが何を残すか確認できます。',
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

    welcome: {
        title: 'Better Paste へようこそ',
        intro: [
            'Safari からコピーした画像を保管庫に保存し、リンクから追跡パラメーターを取り除き、折り返されたターミナル出力をつなぎ直し、AI テキストをきれいにします。あとは貼り付けるだけです。',
            'はじめる前にひとつヒント: **処理せずに貼り付け**を `Cmd+Shift+V`（Windows では `Ctrl+Shift+V`）に割り当てておくと、いつでもクリップボードの内容をそのまま貼り付けられます。',
            'ルールはそれぞれ 設定、Better Paste で個別にオン・オフできます。ノートに `bp: false` プロパティを書けば、そのノートではプラグインが無効になります。'
        ],
        startButton: 'はじめる'
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
