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

/** Vietnamese. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_VI: TranslationStrings = {
    commands: {
        paste: 'Dán',
        pasteRaw: 'Dán không xử lý',
        cleanSelection: 'Dọn phần đã chọn',
        toggleCleanup: 'Bật tắt dọn dẹp tự động'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'đã bật xử lý tự động',
        cleanupOff: 'đã tắt xử lý tự động',
        selectTextFirst: 'hãy chọn văn bản trước',
        nothingToClean: 'không có gì để dọn',
        clipboardFailed: 'không đọc được bảng nhớ tạm',
        titleFailed: 'không lấy được tiêu đề.',
        fetchingTitle: 'đang lấy tiêu đề{dots}',
        imagesFailed: { other: 'không lưu được {count} ảnh' },
        imagesFailedLinkKept: '{images}, đã giữ liên kết gốc',
        imagesFailedNothingPasted: '{images}, nên không dán gì cả',
        aiTextCleaned: 'đã chỉnh văn bản AI',
        terminalCleaned: 'đã dọn đầu ra dòng lệnh',
        textProcessed: 'đã chỉnh kiểu văn bản',
        urlsCleaned: { other: 'đã dọn {count} liên kết' },
        imagesSaved: { other: 'đã lưu {count} ảnh' }
    },

    settings: {
        exampleFallback: '{description} Ví dụ: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Có gì mới trong Better Paste {version}',
            whatsNewDesc: 'Những thay đổi trong các bản phát hành gần đây.',
            whatsNewAliases: ['ghi chú phát hành', 'thay đổi', 'nhật ký thay đổi', 'phiên bản', 'cập nhật', 'lịch sử'],
            whatsNewButton: 'Xem cập nhật gần đây',
            supportName: 'Ủng hộ việc phát triển',
            supportDesc: 'Nếu Better Paste hữu ích với bạn, hãy cân nhắc ủng hộ việc phát triển.',
            supportAliases: ['tài trợ', 'quyên góp', 'cà phê', 'github'],
            sponsorButton: '❤️ Tài trợ',
            coffeeButton: '☕️ Mời tôi ly cà phê',
            pluginsName: 'Xem các plugin khác của tôi',
            pluginsAliases: ['plugin', 'tiện ích', 'notebook navigator', 'pixel perfect image', 'tác giả'],
            notebookNavigatorDesc: 'Trình duyệt tệp và lịch tốt hơn',
            pixelPerfectImageDesc: 'Đổi kích thước ảnh chính xác và nhiều hơn nữa'
        },

        behavior: {
            heading: 'Hành vi',
            autoCleanName: 'Dọn mọi lần dán',
            autoCleanDesc:
                'Áp dụng các quy tắc cho mọi lần dán. Khi tắt, các quy tắc chỉ được áp dụng khi dùng các lệnh của Better Paste. Một ghi chú riêng lẻ có thể tự loại trừ bằng thuộc tính "bp: false", hoặc tự bật lại bằng "bp: true".',
            autoCleanAliases: ['tự động', 'bật', 'tắt', 'ghi chú', 'loại trừ', 'thuộc tính', 'frontmatter'],
            showNoticesName: 'Hiện thông báo khi lần dán bị thay đổi',
            showNoticesDesc: 'Một dòng tóm tắt những gì đã thay đổi. Lỗi luôn được báo.',
            showNoticesAliases: ['thông báo', 'tóm tắt', 'tin nhắn', 'im lặng']
        },

        images: {
            heading: 'Hình ảnh',
            savingName: 'Lưu ảnh đã dán vào kho',
            savingDesc:
                'Lưu ảnh đã dán vào thư mục tệp đính kèm của bạn và liên kết tới tệp cục bộ thay vì địa chỉ web. Bao gồm "Sao chép hình ảnh" của Safari, ảnh trong nội dung web đã sao chép và địa chỉ ảnh được dán. Theo mặc định, tên tệp lấy từ địa chỉ:',
            savingAliases: [
                'tải xuống',
                'tệp đính kèm',
                'safari',
                'ảnh chụp màn hình',
                'hình ảnh',
                'thư mục',
                'tên tệp',
                'chiều rộng',
                'kích thước'
            ],
            pageName: 'Xử lý hình ảnh',
            pageDesc: 'Tên tệp và chiều rộng ảnh.',
            nameFormatName: 'Tên tệp',
            nameFormatDesc: 'Cách đặt tên cho ảnh đã lưu.',
            nameFormatSource: 'Lấy tên từ nguồn',
            nameFormatCustom: 'Định dạng tùy chỉnh',
            customName: 'Định dạng tùy chỉnh',
            customDesc: 'Dùng {{name}} cho tên nguồn và các định dạng ngày của Moment như YYYY-MM-DD.',
            customMomentLink: 'Định dạng Moment',
            customExample: 'Ví dụ: {value}',
            customAliases: ['tên', 'tên tệp', 'ngày', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Thuộc tính ghi chú',
            notePropertyDesc:
                'Thuộc tính bật hoặc tắt Better Paste cho một ghi chú. Với "bp: false", ghi chú được giữ nguyên, còn với "bp: true", ghi chú vẫn được dọn dù "Dọn mọi lần dán" đang tắt. Để trống để bỏ qua thuộc tính này.',
            notePropertyAliases: ['ghi chú', 'thuộc tính', 'frontmatter', 'loại trừ', 'tắt', 'bật', 'bp'],
            sizePropertyName: 'Thuộc tính chiều rộng ảnh',
            sizePropertyDesc:
                'Thuộc tính frontmatter xác định chiều rộng của ảnh dán vào một ghi chú. Với "bp-image-width: 400" trong ghi chú, ảnh dán vào sẽ thành ![[photo.png|400]]. Để trống để không thêm chiều rộng.',
            sizePropertyAliases: ['kích thước', 'frontmatter', 'thuộc tính', 'đổi cỡ']
        },

        links: {
            heading: 'Liên kết',
            titlesName: 'Lấy tiêu đề cho liên kết đã dán',
            titlesDesc:
                'Dán riêng một địa chỉ web sẽ chèn liên kết Markdown kèm tiêu đề trang. Nếu đang chọn văn bản, phần văn bản đó thành nhãn và không lấy tiêu đề. Địa chỉ nguyên dạng được giữ lại khi không lấy được tiêu đề.',
            titlesAliases: ['tiêu đề', 'trang', 'trang web', 'liên kết markdown', 'tải xuống'],
            cleaningName: 'Dọn liên kết đã dán',
            cleaningDesc: 'Loại bỏ tham số theo dõi khỏi liên kết đã dán:',
            cleaningAliases: ['url', 'theo dõi', 'utm', 'tham số', 'truy vấn', 'trang web', 'tên miền', 'youtube', 'ngoại lệ'],
            stripName: 'Bỏ những tham số nào',
            stripDesc: 'Tham số theo dõi là những tên như utm_source, fbclid và gclid.',
            stripAliases: ['utm', 'theo dõi', 'truy vấn', 'tham số'],
            stripAll: 'Mọi tham số, trừ khi một quy tắc trang web giữ lại',
            stripTracking: 'Chỉ những tham số theo dõi đã biết',
            rulesName: 'Quy tắc trang web',
            rulesDesc: 'Tham số cần giữ trên một số trang web.',
            rulesCount: { other: '{count} trang web' },
            listName: 'Quy tắc trang web của bạn',
            listDesc:
                '{sites} đã được phần mở rộng xử lý sẵn. Thêm quy tắc của riêng bạn ở đây, mỗi dòng một quy tắc. "example.com" giữ mọi tham số của trang đó, "example.com: a, b" chỉ giữ hai tham số đó, còn "!example.com" gỡ một quy tắc đi kèm phần mở rộng. Tên miền con được khớp tự động.',
            listShippedCount: { other: '{count} trang web phổ biến' },
            listAliases: ['tên miền', 'ngoại lệ', 'danh sách trắng', 'youtube'],
            listInvalid: 'Không phải tên trang web: {values}',
            testerName: 'Thử xem',
            testerDesc: 'Dán một liên kết để xem các quy tắc giữ lại gì.',
            testerLabel: 'Liên kết cần dọn',
            testerEmpty: 'Liên kết đã dọn sẽ hiện ở đây.'
        },

        terminal: {
            heading: 'Văn bản dòng lệnh',
            cleanupName: 'Dọn đầu ra dòng lệnh',
            cleanupDesc:
                'Nối lại các dòng bị tự động xuống dòng trong đầu ra dòng lệnh, đồng thời bỏ mã màu và thụt lề ở đầu dòng. Khối mã, bảng và danh sách được giữ nguyên.',
            cleanupAliases: [
                'ngắt dòng',
                'nối dòng',
                'ansi',
                'bảng điều khiển',
                'shell',
                'thụt lề',
                'dấu đầu dòng',
                'danh sách',
                'markdown'
            ],
            pageName: 'Xử lý văn bản dòng lệnh',
            pageDesc: 'Nối dòng và ký tự đầu dòng.',
            rejoinName: 'Khi nào nối lại một dòng bị ngắt',
            rejoinDesc: 'Một dòng chỉ được nối vào dòng trên khi dòng đó trông đã đầy.',
            rejoinAliases: ['thụt lề', 'ngắt dòng', 'mạnh tay', 'an toàn', 'git log'],
            rejoinIndented: 'Chỉ khi dòng có thụt lề',
            rejoinAny: 'Dù dòng có thụt lề hay không',
            rejoinNever: 'Không bao giờ, chỉ bỏ mã màu và thụt lề',
            bulletsName: 'Ký tự đầu dòng',
            bulletsDesc: 'Xử lý thế nào với ký tự đầu dòng như • trong đầu ra dòng lệnh.',
            bulletsAliases: ['danh sách', 'markdown', 'gạch ngang'],
            bulletsMarkdown: 'Chuyển thành mục danh sách Markdown',
            bulletsPreserve: 'Giữ nguyên như cũ',
            testerName: 'Thử xem',
            testerDesc: 'Dán đầu ra dòng lệnh để xem nó được dọn như thế nào.',
            testerLabel: 'Văn bản dòng lệnh cần dọn',
            testerEmpty: 'Văn bản đã dọn sẽ hiện ở đây.',
            testerSample: [
                '• Bước bổ sung chỉ gói trong phần xử lý phím Enter của danh sách, nên thay đổi cốt lõi khá đơn giản. Khi lần theo các luồng lân cận, tôi thấy',
                '  hai điểm vướng đáng kiểm chứng: vùng chọn có thể nhảy sau khi làm mới.'
            ]
        },

        text: {
            heading: 'Xử lý văn bản',
            trimName: 'Cắt khoảng trắng xung quanh',
            trimDesc: 'Bỏ dòng trống và khoảng trắng ở đầu và cuối văn bản đã dán.',
            trimAliases: ['khoảng trắng', 'dòng trống', 'dấu cách', 'xuống dòng', 'cắt'],
            commasName: 'Dấu phẩy và dấu nháy kép',
            commasDesc: 'Vị trí dấu phẩy bên cạnh dấu nháy kép đóng.',
            commasAliases: ['dấu phẩy', 'dấu nháy', 'trích dẫn', 'dấu câu', 'kiểu'],
            commasNone: 'Không thay đổi',
            commasInside: 'Dấu phẩy bên trong dấu nháy',
            commasOutside: 'Dấu phẩy bên ngoài dấu nháy',
            commasExampleSource: 'Anh ấy gọi đó là "xong," rồi bỏ đi.',
            commasExampleOutside: 'Anh ấy gọi đó là "xong", rồi bỏ đi.',
            invisibleName: 'Dọn AI: ký tự vô hình',
            invisibleDesc: 'Bỏ khoảng trắng rộng bằng không và biến khoảng trắng không ngắt thành khoảng trắng thường.',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'gạch ngang',
                'gạch ngang dài',
                'gạch nối',
                'unicode',
                'vô hình',
                'nbsp',
                'kiểu chữ',
                'dấu câu',
                'khoảng trắng'
            ],
            invisibleExampleStart: 'Kết',
            invisibleExampleMiddle: 'quả',
            invisibleExampleEnd: ' rất tốt.',
            invisibleExampleAfter: 'Kết quả rất tốt.',
            punctuationName: 'Dọn AI: gạch ngang và dấu nháy',
            punctuationDesc: 'Chuyển gạch ngang dài thành gạch nối và dấu nháy cong thành dấu nháy thẳng.',
            punctuationAliases: [
                'gạch ngang dài',
                'gạch ngang',
                'gạch nối',
                'dấu nháy',
                'dấu nháy cong',
                'dấu lược',
                'dấu câu',
                'kiểu chữ'
            ],
            punctuationExampleBefore: '“Kết quả — bất chấp mọi thứ — thật hoàn hảo.”',
            punctuationExampleAfter: '"Kết quả - bất chấp mọi thứ - thật hoàn hảo."'
        }
    },

    welcome: {
        title: 'Chào mừng đến với Better Paste',
        intro: [
            'Better Paste thay đổi nội dung bảng nhớ tạm ngay khi nó được dán vào một ghi chú.',
            'Tiện ích này lưu ảnh được liên kết thành tệp đính kèm trong kho, loại bỏ tham số theo dõi khỏi liên kết, nối lại những dòng bị ngắt trong đầu ra dòng lệnh, và thay dấu nháy cong cùng ký tự vô hình bằng ký tự thường.',
            'Mỗi quy tắc có thể tắt riêng.',
            'Một ghi chú riêng lẻ có thể tự loại trừ hoàn toàn bằng thuộc tính "bp: false". Thiết lập nằm ở Cài đặt, Better Paste.'
        ],
        startButton: 'Bắt đầu'
    },

    whatsNew: {
        title: 'Có gì mới trong Better Paste',
        scrollLabel: 'Ghi chú phát hành',
        releaseHeading: 'Phiên bản {version} ({date})',
        categoryNew: 'Mới',
        categoryImproved: 'Cải tiến',
        categoryChanged: 'Thay đổi',
        categoryFixed: 'Sửa lỗi',
        support: 'Nếu Better Paste hữu ích với bạn, hãy cân nhắc ủng hộ việc phát triển.',
        coffeeButton: '☕️ Mời tôi ly cà phê',
        thanksButton: 'Cảm ơn!'
    }
};
