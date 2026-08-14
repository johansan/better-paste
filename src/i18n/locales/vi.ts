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
        imagesFailedNothingPasted: '{images}, nên không dán gì cả. Nội dung vẫn còn trong bảng nhớ tạm.',
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
            supportDesc: 'Nếu Better Paste hữu ích với bạn, hãy cân nhắc ủng hộ việc phát triển tiếp.',
            supportAliases: ['tài trợ', 'quyên góp', 'cà phê', 'github'],
            sponsorButton: '❤️ Tài trợ',
            coffeeButton: '☕️ Mời tôi ly cà phê'
        },

        behavior: {
            heading: 'Hành vi',
            autoCleanName: 'Dọn mọi lần dán',
            autoCleanDesc:
                'Áp dụng các quy tắc cho mọi lần dán. Tắt đi để chỉ dùng các lệnh. Một ghi chú riêng lẻ có thể tự loại trừ bằng thuộc tính "better-paste: false".',
            autoCleanAliases: ['tự động', 'bật', 'tắt', 'ghi chú', 'loại trừ', 'thuộc tính', 'frontmatter'],
            showNoticesName: 'Hiện thông báo khi lần dán bị thay đổi',
            showNoticesDesc: 'Một dòng tóm tắt những gì đã được dọn. Lỗi luôn được báo, bất kể tùy chọn này.',
            showNoticesAliases: ['thông báo', 'tóm tắt', 'tin nhắn', 'im lặng']
        },

        images: {
            heading: 'Hình ảnh',
            savingName: 'Lưu ảnh đã dán vào kho',
            savingDesc:
                'Lưu ảnh đã dán thành tệp cục bộ thay vì để lại liên kết ảnh bên ngoài. Bao gồm "Sao chép hình ảnh" của Safari, ảnh trong nội dung web đã sao chép và địa chỉ ảnh đứng riêng. Ảnh được lưu vào thư mục tệp đính kèm của kho. Với "Lấy tên từ nguồn":',
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
            pageDesc: 'Tên tệp và chiều rộng ảnh theo từng ghi chú.',
            nameFormatName: 'Tên tệp',
            nameFormatDesc: 'Chọn cách đặt tên cho tệp ảnh đã lưu.',
            nameFormatSource: 'Lấy tên từ nguồn',
            nameFormatCustom: 'Định dạng tùy chỉnh',
            customName: 'Định dạng tùy chỉnh',
            customDesc: 'Dùng {{name}} cho tên nguồn và các định dạng ngày của Moment như YYYY-MM-DD.',
            customMomentLink: 'Định dạng Moment',
            customExample: 'Ví dụ: {value}',
            customAliases: ['tên', 'tên tệp', 'ngày', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Thuộc tính chiều rộng ảnh',
            sizePropertyDesc:
                'Thuộc tính frontmatter xác định chiều rộng của ảnh dán vào một ghi chú. Ghi chú dùng thuộc tính này sẽ tiếp quản việc dán ảnh chụp màn hình thay cho Obsidian. Để trống để tắt.',
            sizePropertyAliases: ['kích thước', 'frontmatter', 'thuộc tính', 'đổi cỡ']
        },

        links: {
            heading: 'Liên kết',
            titlesName: 'Lấy tiêu đề cho liên kết đã dán',
            titlesDesc:
                'Khi bảng nhớ tạm chỉ chứa một địa chỉ web không phải ảnh, tiêu đề trang sẽ được lấy về và dán thành liên kết Markdown. Văn bản khác đang được chọn sẽ thành nhãn mà không cần gửi yêu cầu nào. Nếu không lấy được tiêu đề, địa chỉ gốc được giữ nguyên.',
            titlesAliases: ['tiêu đề', 'trang', 'trang web', 'liên kết markdown', 'tải xuống'],
            cleaningName: 'Dọn liên kết đã dán',
            cleaningDesc: 'Loại bỏ tham số theo dõi khỏi liên kết đã dán. Phần bị gạch ngang sẽ bị bỏ:',
            cleaningAliases: ['url', 'theo dõi', 'utm', 'tham số', 'truy vấn', 'trang web', 'tên miền', 'youtube', 'ngoại lệ'],
            stripName: 'Bỏ những tham số nào',
            stripDesc:
                'Chọn bỏ mọi tham số truy vấn hay chỉ những tham số theo dõi đã biết. Quy tắc theo trang web có thể giữ lại tham số trong cả hai chế độ.',
            stripAliases: ['utm', 'theo dõi', 'truy vấn', 'tham số'],
            stripAll: 'Mọi tham số, trừ khi một quy tắc trang web giữ lại',
            stripTracking: 'Chỉ những tham số theo dõi đã biết',
            rulesName: 'Quy tắc giữ lại tham số',
            rulesDesc: 'Quy tắc theo trang web để giữ lại một số tham số truy vấn trong cả hai chế độ loại bỏ.',
            rulesCount: { other: '{count} trang web' },
            listName: 'Quy tắc trang web của bạn',
            listDesc:
                '{sites} đã được xử lý sẵn và luôn cập nhật cùng phần mở rộng. Thêm quy tắc của riêng bạn ở đây, mỗi dòng một quy tắc. "example.com" giữ mọi tham số của trang đó, "example.com: a, b" chỉ giữ hai tham số đó, còn "!example.com" bỏ đi một quy tắc đi kèm phần mở rộng. Ở chế độ "Chỉ những tham số theo dõi đã biết", một quy tắc chỉ cứu những tham số theo dõi khớp, vì các tham số khác vốn đã được giữ. Tên miền con được khớp tự động.',
            listShippedCount: { other: '{count} trang web phổ biến' },
            listAliases: ['tên miền', 'ngoại lệ', 'danh sách trắng', 'youtube'],
            listInvalid: 'Không phải tên trang web: {values}',
            testerName: 'Thử xem',
            testerDesc: 'Dán một liên kết để xem các quy tắc này sẽ giữ lại gì.',
            testerLabel: 'Liên kết cần dọn',
            testerEmpty: 'Liên kết đã dọn sẽ hiện ở đây.'
        },

        terminal: {
            heading: 'Văn bản dòng lệnh',
            cleanupName: 'Dọn đầu ra dòng lệnh',
            cleanupDesc:
                'Nối lại những dòng bị ngắt trong đầu ra dòng lệnh và bỏ thụt lề. Mã màu bị loại bỏ. Khối mã, bảng và mục danh sách được giữ nguyên.',
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
            pageDesc: 'Điều kiện nối dòng và ký tự đầu dòng.',
            rejoinName: 'Khi nào nối lại một dòng bị ngắt',
            rejoinDesc: 'Điều kiện để coi một dòng là phần tiếp theo của dòng trước.',
            rejoinAliases: ['thụt lề', 'ngắt dòng', 'mạnh tay', 'an toàn', 'git log'],
            rejoinIndented: 'Chỉ khi dòng kế tiếp có thụt lề',
            rejoinAny: 'Mỗi khi dòng phía trên trông đã đầy',
            rejoinNever: 'Không bao giờ nối, chỉ bỏ mã màu và thụt lề',
            bulletsName: 'Ký tự đầu dòng',
            bulletsDesc:
                'Quyết định ký tự đầu dòng (như •) trong đầu ra dòng lệnh được giữ nguyên hay chuyển thành mục danh sách Markdown.',
            bulletsAliases: ['danh sách', 'markdown', 'gạch ngang'],
            bulletsMarkdown: 'Chuyển thành mục danh sách Markdown',
            bulletsPreserve: 'Giữ nguyên như cũ',
            testerName: 'Thử xem',
            testerDesc: 'Dán đầu ra dòng lệnh để xem nó sẽ được dọn như thế nào.',
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
            commasDesc: 'Chọn vị trí đặt dấu phẩy bên cạnh dấu nháy kép đóng.',
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
            'Một ghi chú riêng lẻ có thể tự loại trừ hoàn toàn bằng thuộc tính "better-paste: false". Thiết lập nằm ở Cài đặt, Better Paste.'
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
