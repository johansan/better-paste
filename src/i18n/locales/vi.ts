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
        cleanTerminal: 'Dọn đầu ra terminal',
        cleanPdf: 'Dọn văn bản từ PDF',
        runSnippet: 'Chạy đoạn mã',
        commasInside: 'Chuyển dấu phẩy vào trong dấu ngoặc kép',
        commasOutside: 'Chuyển dấu phẩy ra ngoài dấu ngoặc kép',
        toggleCleanup: 'Bật tắt dọn dẹp tự động'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'đã bật xử lý tự động',
        cleanupOff: 'đã tắt xử lý tự động',
        selectTextFirst: 'hãy chọn văn bản trước',
        nothingToClean: 'không có gì để dọn',
        clipboardFailed: 'không đọc được bảng nhớ tạm',
        titleFailed: 'không lấy được tiêu đề.',
        fetchingTitle: 'đang lấy tiêu đề...',
        imagesFailed: { other: 'không lưu được {count} ảnh' },
        imagesFailedLinkKept: '{images}, đã giữ liên kết gốc',
        imagesFailedNothingPasted: '{images}, nên không dán gì cả',
        snippetsCopied: 'đã sao chép đoạn mã',
        snippetsCopyFailed: 'không sao chép được đoạn mã'
    },

    settings: {
        exampleFallback: '{description} Ví dụ: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Giới thiệu',
            whatsNewName: 'Có gì mới trong Better Paste {version}',
            whatsNewDesc: 'Những thay đổi trong các bản phát hành gần đây.',
            whatsNewAliases: ['ghi chú phát hành', 'thay đổi', 'nhật ký thay đổi', 'phiên bản', 'cập nhật', 'lịch sử'],
            whatsNewButton: 'Xem cập nhật gần đây',
            showReleaseNotesName: 'Hiển thị "Có gì mới" sau khi cập nhật',
            showReleaseNotesDesc: 'Mở hộp thoại "Có gì mới" một lần sau mỗi lần cập nhật.',
            showReleaseNotesAliases: ['ghi chú phát hành', 'có gì mới', 'cập nhật', 'hộp thoại', 'popup', 'thông báo'],
            supportName: 'Ủng hộ việc phát triển',
            supportDesc: 'Nếu Better Paste hữu ích với bạn, hãy cân nhắc ủng hộ việc phát triển.',
            supportAliases: ['tài trợ', 'quyên góp', 'cà phê', 'github'],
            sponsorButton: '❤️ Tài trợ',
            coffeeButton: '☕️ Mời tôi ly cà phê',
            pluginsName: 'Xem các plugin khác của tôi',
            pluginsAliases: ['plugin', 'tiện ích', 'notebook navigator', 'pixel perfect image', 'tác giả'],
            notebookNavigatorDesc: 'Trình duyệt tệp và lịch tốt hơn',
            pixelPerfectImageDesc: 'Đổi kích thước ảnh chính xác và hơn thế nữa'
        },

        behavior: {
            autoCleanName: 'Dọn mọi lần dán',
            autoCleanDesc:
                'Áp dụng các quy tắc cho mọi lần dán. Khi tắt, các quy tắc chỉ được áp dụng khi dùng các lệnh của Better Paste. Một ghi chú riêng lẻ có thể tự loại trừ bằng thuộc tính "{property}: false", hoặc tự bật lại bằng "{property}: true".',
            autoCleanAliases: ['tự động', 'bật', 'tắt', 'ghi chú', 'loại trừ', 'thuộc tính', 'frontmatter'],
            notePropertyName: 'Thuộc tính ghi chú',
            notePropertyDesc: 'Thuộc tính bật hoặc tắt Better Paste cho một ghi chú.',
            notePropertyAliases: ['ghi chú', 'thuộc tính', 'frontmatter', 'loại trừ', 'tắt', 'bật', 'bp']
        },

        images: {
            heading: 'Hình ảnh',
            savingName: 'Lưu ảnh từ web vào kho',
            savingDesc:
                'Lưu ảnh từ web vào thư mục tệp đính kèm của bạn và liên kết tới tệp cục bộ thay vì địa chỉ web. Bao gồm "Sao chép hình ảnh" của Safari, ảnh trong nội dung web đã sao chép và địa chỉ ảnh được dán. Theo mặc định, tên tệp lấy từ địa chỉ:',
            savingAliases: ['tải xuống', 'url', 'web', 'tệp đính kèm', 'safari', 'cục bộ', 'hình ảnh', 'thư mục'],
            sizeStyleName: 'Kích thước và kiểu',
            sizeStyleDesc: 'Thêm chiều rộng hoặc lớp CSS cho ảnh đã dán, tự động hoặc qua hộp thoại chọn.',
            sizeStyleAliases: ['kích thước', 'chiều rộng', 'css', 'lớp', 'kiểu', 'đổi kích thước', 'invert'],
            summarySize: 'Kích thước: {value}',
            summaryStyle: 'Kiểu: {value}',
            summaryAsk: 'Hỏi',
            sizeChoiceName: 'Áp dụng kích thước khi dán',
            sizeChoiceDesc:
                'Thêm chiều rộng cho mỗi ảnh nhúng được lưu, ví dụ ![[photo.jpg|400]]. Thuộc tính chiều rộng của ghi chú được ưu tiên.',
            sizeChoiceAliases: ['kích thước', 'chiều rộng', 'kích thước ảnh', 'đổi kích thước', 'nhúng', '400'],
            sizeOptionsName: 'Tùy chọn kích thước',
            sizeOptionsDesc: 'Các chiều rộng hiển thị ở trên và trong hộp thoại khi dán, phân tách bằng dấu phẩy.',
            classChoiceName: 'Áp dụng lớp CSS khi dán',
            classChoiceDesc:
                'Thêm một lớp cho mỗi ảnh nhúng được lưu, ví dụ ![[photo.jpg#invert]]. Chủ đề và đoạn mã CSS quyết định tác dụng của lớp.',
            classChoiceAliases: ['css', 'lớp', 'đoạn css', 'invert', 'chủ đề', 'bộ lọc', 'nhúng'],
            classOptionsName: 'Tùy chọn lớp',
            classOptionsDesc: 'Các lớp hiển thị ở trên và trong hộp thoại khi dán, phân tách bằng dấu phẩy.',
            choiceNone: 'Không làm gì',
            choiceAsk: 'Hỏi mỗi lần dán',
            nameFormatName: 'Tên tệp',
            customDesc:
                'Dùng {{name}} cho tên nguồn, {{noteName}} cho tên ghi chú, {{property:xyz}} cho một thuộc tính frontmatter, {{counter}} hoặc {{counter:2}} cho số tăng dần, và các định dạng ngày của Moment như YYYY-MM-DD.',
            customScreenshotDesc:
                'Ảnh chụp màn hình không có tên nguồn, nên {{name}} của nó trở thành "Pasted image" kèm dấu thời gian, như trong Obsidian.',
            customMomentLink: 'Định dạng Moment',
            customExample: 'Ví dụ: {value}',
            customExampleNote: 'Ghi chú của tôi',
            customAliases: [
                'tên',
                'tên tệp',
                'ngày',
                'moment',
                'YYYY',
                '{{name}}',
                'bộ đếm',
                'thuộc tính',
                'tên ghi chú',
                'ảnh chụp màn hình',
                'đổi tên',
                'bảng nhớ tạm',
                'bộ nhớ tạm',
                'paste image rename'
            ],
            sizePropertyName: 'Thuộc tính chiều rộng ảnh',
            sizePropertyDesc:
                'Thuộc tính frontmatter xác định chiều rộng của ảnh dán vào một ghi chú. Với "{property}: 400" trong ghi chú, ảnh dán vào sẽ thành ![[photo.png|400]]. Để trống để không thêm chiều rộng.',
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
            removalsName: 'Loại bỏ liên kết',
            removalsDesc: 'Các tham số bổ sung để loại bỏ trên mọi trang web hoặc trên các trang web cụ thể.',
            rulesCount: { other: '{count} mục' },
            builtInName: 'Loại bỏ tích hợp sẵn',
            builtInDesc:
                'Đã cập nhật {date}. Bộ lọc theo dõi áp dụng cho mọi trang web: {trackingCount}. Quy tắc dành riêng cho từng trang web: {siteCount}. Các liên kết có chữ ký mã hóa sẽ không bị thay đổi.',
            builtInButton: 'Xem danh sách',
            listName: 'Các mục loại bỏ của bạn',
            listDesc:
                'Loại bỏ một tham số khỏi các liên kết thông thường trên mọi trang web bằng cách nhập tên của tham số đó một mình. Ví dụ: fbclid sẽ loại bỏ tham số fbclid bất cứ nơi nào nó xuất hiện.\n\nLoại bỏ các tham số chỉ trên một trang web với example.com | source, ref. Điều này sẽ loại bỏ source và ref khỏi example.com và các tên miền phụ của nó, trong khi các tham số khác vẫn được giữ nguyên. Bắt đầu một dòng bằng dấu ! để tắt các mục loại bỏ tích hợp sẵn cho trang web đó. Các liên kết có chữ ký mã hóa luôn được giữ nguyên.',
            listAliases: ['tên miền', 'tham số', 'lọc', 'loại bỏ', 'youtube'],
            listInvalid: 'Quy tắc loại bỏ không hợp lệ: {values}',
            suggestName: 'Đề xuất các mục loại bỏ của bạn',
            suggestDesc: 'Giúp cải thiện các mục loại bỏ tích hợp sẵn bằng cách đóng góp các tham số cần loại bỏ.',
            suggestAliases: ['đóng góp', 'nộp', 'chia sẻ', 'gửi', 'lọc'],
            suggestButton: 'Kiểm tra và gửi',
            testerName: 'Thử xem',
            testerDesc: 'Dán một liên kết để xem kết quả đã dọn.',
            testerLabel: 'Liên kết cần dọn',
            testerEmpty: 'Liên kết đã dọn sẽ hiện ở đây.'
        },

        text: {
            heading: 'Xử lý văn bản',
            trimName: 'Cắt khoảng trắng xung quanh',
            trimDesc: 'Bỏ dòng trống và khoảng trắng ở đầu và cuối văn bản đã dán.',
            trimAliases: ['khoảng trắng', 'dòng trống', 'dấu cách', 'xuống dòng', 'cắt'],
            invisibleName: 'Ký tự vô hình',
            invisibleDesc: 'Bỏ khoảng trắng rộng bằng không và biến khoảng trắng không ngắt thành khoảng trắng thường.',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', 'vô hình', 'nbsp', 'khoảng trắng'],
            invisibleExampleStart: 'Kết',
            invisibleExampleMiddle: 'quả',
            invisibleExampleEnd: ' rất tốt.',
            invisibleExampleAfter: 'Kết quả rất tốt.',
            quotesName: 'Dấu nháy',
            quotesDesc: 'Chuyển dấu nháy cong và dấu lược thành dấu nháy thẳng.',
            quotesAliases: ['dấu nháy', 'dấu ngoặc kép', 'dấu nháy cong', 'dấu nháy thẳng', 'dấu lược', 'dấu câu', 'kiểu chữ', 'ai'],
            quotesExample: '“Xong rồi”, anh ấy nói.',
            dashesName: 'Gạch ngang',
            dashesDesc: 'Chuyển gạch ngang en và em thành gạch nối.',
            dashesAliases: ['gạch ngang', 'gạch ngang dài', 'gạch nối', 'dấu câu', 'kiểu chữ', 'ai'],
            dashesExample: 'Kết quả — bất chấp mọi thứ — rất tốt.'
        },

        structure: {
            heading: 'Cấu trúc',
            listNestingName: 'Giữ cấu trúc lồng nhau của danh sách khi dán',
            listNestingDesc: 'Dán danh sách đã sao chép với phân cấp nguyên vẹn, thụt lề theo mục danh sách bạn dán vào.',
            listNestingAliases: ['danh sách', 'lồng nhau', 'thụt lề', 'phân cấp', 'dàn ý', 'gạch đầu dòng', 'hộp kiểm', 'cây'],
            quoteContinuationName: 'Tiếp tục trích dẫn khối khi dán',
            quoteContinuationDesc:
                'Dán văn bản nhiều dòng vào một dòng trích dẫn và biến mọi dòng thành dòng trích dẫn, để toàn bộ nội dung dán vẫn nằm trong trích dẫn khối hoặc callout.',
            quoteContinuationAliases: ['trích dẫn', 'trích dẫn khối', 'chú thích', 'dẫn nguồn', 'cảnh báo', 'đoạn văn']
        },

        custom: {
            heading: 'Xử lý tùy chỉnh',
            pipelineName: 'Áp dụng các đoạn mã regex tùy chỉnh cho văn bản',
            pastedText: 'Văn bản đã dán',
            note: 'Ghi chú',
            wikiButton: 'Mở wiki',
            regexButton: 'Mở công cụ thử biểu thức chính quy',
            snippetsName: 'Đoạn mã văn bản',
            snippetsDesc: 'Áp dụng cho toàn bộ văn bản đã dán sau các quy tắc tích hợp. Bật những đoạn mã bạn muốn chạy khi dán.',
            urlSnippetsName: 'Đoạn mã liên kết',
            urlSnippetsDesc:
                'Áp dụng cho từng liên kết đã dán sau khi lấy tiêu đề trang. Quy tắc chỉ thấy liên kết Markdown hoàn chỉnh, và đích của liên kết vẫn giữ nguyên.',
            enabledSnippetsCount: { other: '{count} đoạn mã đang bật' },
            snippetRulesCount: { other: '{count} quy tắc' },
            invalidRulesCount: { other: '{count} dòng không hợp lệ' },
            unnamedSnippet: 'Đoạn mã chưa đặt tên',
            emptyState: 'Bạn chưa tạo đoạn mã nào.',
            addSnippet: 'Thêm đoạn mã',
            editButton: 'Sửa đoạn mã',
            exportName: 'Xuất đoạn mã',
            exportDesc: 'Sao chép tất cả đoạn mã theo định dạng trao đổi của wiki.',
            exportButton: 'Sao chép đoạn mã',
            importName: 'Nhập đoạn mã',
            importDesc: 'Thêm đoạn mã từ định dạng trao đổi của wiki.',
            previewName: 'Thử xem',
            previewDesc: 'Nhập văn bản mẫu để xem kết quả của mọi đoạn mã đang bật.',
            modalPreviewDesc: 'Nhập văn bản mẫu để xem kết quả của đoạn mã này.',
            previewInputLabel: 'Văn bản mẫu',
            previewEmpty: 'Văn bản đã xử lý sẽ xuất hiện ở đây.',
            urlPreviewDesc: 'Sửa liên kết có tiêu đề mẫu để xem kết quả từ mọi đoạn mã liên kết đang bật.',
            urlModalPreviewDesc: 'Sửa liên kết có tiêu đề mẫu để xem kết quả từ đoạn mã này.',
            urlPreviewLabel: 'Liên kết có tiêu đề mẫu',
            urlPreviewEmpty: 'Liên kết đã xử lý sẽ xuất hiện ở đây.',
            nameName: 'Tên',
            rulesName: 'Quy tắc',
            rulesDesc: 'Nhập một phép thay thế bằng biểu thức chính quy JavaScript trên mỗi dòng.',
            wikiPasteHint: 'Sao chép một đoạn mã có sẵn từ wiki và dán thẳng vào ô quy tắc.',
            invalidLine: 'Dòng {line}: {value}',
            saveButton: 'Lưu',
            recognizedSnippetsCount: { other: 'Đã nhận dạng {count} đoạn mã' },
            recognizedRulesCount: { other: 'đã nhận dạng {count} quy tắc' },
            unparseableName: 'Các dòng không nhận dạng được',
            importFallbackName: 'Đoạn mã đã nhập'
        }
    },

    imageModal: {
        title: 'Tùy chọn ảnh',
        sizeName: 'Kích thước',
        className: 'Lớp CSS',
        none: 'Không làm gì',
        apply: 'Áp dụng',
        cancel: 'Hủy'
    },

    pdfModal: {
        furniture: 'Xóa số trang',
        singleParagraph: 'Gộp tất cả thành một đoạn văn',
        description:
            'Các dòng bị ngắt được nối lại, từ bị tách bởi dấu gạch nối được sửa, chữ cái dính liền thành một ký tự được tách rời và khoảng trắng thừa bị xóa.',
        preview: 'Xem trước'
    },

    welcome: {
        title: 'Chào mừng đến với Better Paste',
        intro: [
            'Sao chép ảnh từ Safari thẳng vào kho, dán liên kết không kèm tham số theo dõi, sửa những dòng bị ngắt trong đầu ra dòng lệnh, và dọn sạch văn bản AI. Chỉ cần dán, phần còn lại Better Paste lo.',
            'Một mẹo trước khi bắt đầu: gán **Dán không xử lý** vào `Cmd+Shift+V` (`Ctrl+Shift+V` trên Windows) để lúc nào cũng dán được đúng nội dung trong bảng nhớ tạm.',
            'Mỗi quy tắc có công tắc riêng trong Cài đặt, Better Paste, và thuộc tính `{property}: false` sẽ tắt tiện ích cho ghi chú đó.'
        ],
        startButton: 'Bắt đầu'
    },

    overlap: {
        title: 'Better Paste: plugin trùng chức năng',
        thanks: 'Cảm ơn bạn đã cài và dùng Better Paste!',
        intro: {
            other: 'Hiện bạn đã cài {count} plugin làm gần như cùng một việc, hãy tắt hoặc gỡ các plugin sau:'
        },
        outro: 'Tắt trong Cài đặt > Phần mở rộng của bên thứ ba.',
        dontRemind: 'Không hiển thị lại',
        button: 'Đã hiểu'
    },

    whatsNew: {
        title: 'Có gì mới trong Better Paste',
        releaseHeading: 'Phiên bản {version} ({date})',
        categoryNew: 'Mới',
        categoryImproved: 'Cải tiến',
        categoryChanged: 'Thay đổi',
        categoryFixed: 'Sửa lỗi',
        support: 'Nếu Better Paste hữu ích với bạn, hãy cân nhắc ủng hộ việc phát triển.',
        coffeeButton: '☕️ Mời tôi ly cà phê',
        thanksButton: 'Cảm ơn!',
        dontShowAgain: 'Không hiện lại sau khi cập nhật'
    }
};
