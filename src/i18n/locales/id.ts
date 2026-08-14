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

/** Indonesian. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_ID: TranslationStrings = {
    commands: {
        paste: 'Tempel',
        pasteRaw: 'Tempel tanpa pemrosesan',
        cleanSelection: 'Bersihkan pilihan',
        toggleCleanup: 'Alihkan pembersihan otomatis'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'pemrosesan otomatis aktif',
        cleanupOff: 'pemrosesan otomatis nonaktif',
        selectTextFirst: 'pilih teks terlebih dahulu',
        nothingToClean: 'tidak ada yang perlu dibersihkan',
        clipboardFailed: 'tidak dapat membaca papan klip',
        titleFailed: 'tidak dapat mengambil judul.',
        fetchingTitle: 'mengambil judul{dots}',
        imagesFailed: { other: '{count} gambar gagal disimpan' },
        imagesFailedLinkKept: '{images}, tautan aslinya dipertahankan',
        imagesFailedNothingPasted: '{images}, jadi tidak ada yang ditempel. Isinya masih ada di papan klip.',
        aiTextCleaned: 'teks AI dirapikan',
        terminalCleaned: 'keluaran terminal dibersihkan',
        textProcessed: 'gaya teks disesuaikan',
        urlsCleaned: { other: '{count} URL dibersihkan' },
        imagesSaved: { other: '{count} gambar disimpan' }
    },

    settings: {
        exampleFallback: '{description} Contoh: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Yang baru di Better Paste {version}',
            whatsNewDesc: 'Apa yang berubah pada rilis terbaru.',
            whatsNewAliases: ['catatan rilis', 'perubahan', 'log perubahan', 'versi', 'pembaruan', 'riwayat'],
            whatsNewButton: 'Lihat pembaruan terbaru',
            supportName: 'Dukung pengembangan',
            supportDesc: 'Jika Better Paste bermanfaat bagi Anda, pertimbangkan untuk mendukung pengembangannya.',
            supportAliases: ['sponsor', 'donasi', 'kopi', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Traktir saya kopi'
        },

        behavior: {
            heading: 'Perilaku',
            autoCleanName: 'Bersihkan setiap tempelan',
            autoCleanDesc:
                'Menerapkan aturan pada setiap tempelan. Matikan untuk memakai perintah saja. Satu catatan dapat mengecualikan diri dengan properti "better-paste: false".',
            autoCleanAliases: ['otomatis', 'aktifkan', 'nonaktifkan', 'catatan', 'kecualikan', 'properti', 'frontmatter'],
            showNoticesName: 'Tampilkan pemberitahuan saat tempelan diubah',
            showNoticesDesc: 'Ringkasan satu baris tentang apa yang dibersihkan. Kegagalan selalu dilaporkan, apa pun pengaturan ini.',
            showNoticesAliases: ['pemberitahuan', 'ringkasan', 'pesan', 'senyap']
        },

        images: {
            heading: 'Gambar',
            savingName: 'Simpan gambar yang ditempel ke dalam brankas',
            savingDesc:
                'Menyimpan gambar yang ditempel sebagai berkas lokal alih-alih meninggalkan tautan gambar eksternal. Ini mencakup "Salin gambar" di Safari, gambar di dalam konten web yang disalin, dan alamat gambar yang berdiri sendiri. Gambar disimpan ke folder lampiran brankas Anda. Dengan "Nama dari sumber":',
            savingAliases: ['unduh', 'lampiran', 'safari', 'tangkapan layar', 'gambar', 'folder', 'nama berkas', 'lebar', 'ukuran'],
            pageName: 'Penanganan gambar',
            pageDesc: 'Nama berkas dan lebar gambar per catatan.',
            nameFormatName: 'Nama berkas',
            nameFormatDesc: 'Pilih cara penamaan berkas gambar yang disimpan.',
            nameFormatSource: 'Nama dari sumber',
            nameFormatCustom: 'Format sendiri',
            customName: 'Format sendiri',
            customDesc: 'Gunakan {{name}} untuk nama sumber dan format tanggal Moment seperti YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Contoh: {value}',
            customAliases: ['nama', 'berkas', 'tanggal', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Properti lebar gambar',
            sizePropertyDesc:
                'Properti frontmatter yang menentukan lebar gambar yang ditempel ke sebuah catatan. Catatan yang memakai properti ini mengambil alih penempelan tangkapan layar dari Obsidian. Biarkan kosong untuk menonaktifkan.',
            sizePropertyAliases: ['ukuran', 'frontmatter', 'properti', 'ubah ukuran']
        },

        links: {
            heading: 'Tautan',
            titlesName: 'Ambil judul untuk tautan yang ditempel',
            titlesDesc:
                'Bila papan klip hanya berisi alamat web yang bukan gambar, judul halamannya diambil dan sebuah tautan Markdown ditempel. Teks lain yang sedang dipilih menjadi labelnya tanpa permintaan apa pun. Jika judul tidak dapat diambil, alamat aslinya dipertahankan.',
            titlesAliases: ['judul', 'halaman', 'situs web', 'tautan markdown', 'unduh'],
            cleaningName: 'Bersihkan tautan yang ditempel',
            cleaningDesc: 'Menghapus parameter pelacakan dari tautan yang ditempel. Bagian yang dicoret akan dihapus:',
            cleaningAliases: ['url', 'pelacakan', 'utm', 'parameter', 'kueri', 'situs', 'domain', 'youtube', 'pengecualian'],
            stripName: 'Parameter mana yang dihapus',
            stripDesc:
                'Pilih menghapus setiap parameter kueri atau hanya parameter pelacakan yang dikenal. Aturan situs dapat mempertahankan parameter pada kedua mode.',
            stripAliases: ['utm', 'pelacakan', 'kueri', 'parameter'],
            stripAll: 'Setiap parameter, kecuali yang dipertahankan aturan situs',
            stripTracking: 'Hanya parameter pelacakan yang dikenal',
            rulesName: 'Aturan untuk mempertahankan parameter',
            rulesDesc: 'Aturan situs untuk mempertahankan parameter kueri tertentu pada kedua mode penghapusan.',
            rulesCount: { other: '{count} situs' },
            listName: 'Aturan situs Anda',
            listDesc:
                '{sites} sudah ditangani dan tetap mutakhir bersama plugin. Tambahkan aturan situs Anda sendiri di sini, satu per baris. "example.com" mempertahankan setiap parameter di situs itu, "example.com: a, b" hanya mempertahankan kedua parameter itu, dan "!example.com" membatalkan aturan bawaan plugin. Pada mode "Hanya parameter pelacakan yang dikenal", sebuah aturan hanya menyelamatkan parameter pelacakan yang cocok, karena parameter lain memang sudah dipertahankan. Subdomain dicocokkan secara otomatis.',
            listShippedCount: { other: '{count} situs umum' },
            listAliases: ['domain', 'pengecualian', 'daftar putih', 'youtube'],
            listInvalid: 'Bukan nama situs: {values}',
            testerName: 'Coba',
            testerDesc: 'Tempel sebuah tautan untuk melihat apa yang akan dipertahankan aturan ini.',
            testerLabel: 'Tautan yang akan dibersihkan',
            testerEmpty: 'Tautan yang sudah dibersihkan muncul di sini.'
        },

        terminal: {
            heading: 'Teks terminal',
            cleanupName: 'Bersihkan keluaran terminal',
            cleanupDesc:
                'Menyambung kembali baris yang terpotong pada keluaran terminal dan menghapus indentasi. Kode warna dibuang. Blok kode, tabel, dan butir daftar tidak disentuh.',
            cleanupAliases: ['pemenggalan baris', 'sambung', 'ansi', 'konsol', 'shell', 'indentasi', 'butir', 'daftar', 'markdown'],
            pageName: 'Penanganan teks terminal',
            pageDesc: 'Syarat penyambungan dan karakter butir.',
            rejoinName: 'Kapan baris terpotong disambung kembali',
            rejoinDesc: 'Syarat agar sebuah baris dianggap lanjutan dari baris sebelumnya.',
            rejoinAliases: ['indentasi', 'pemenggalan baris', 'agresif', 'aman', 'git log'],
            rejoinIndented: 'Hanya bila baris berikutnya berindentasi',
            rejoinAny: 'Setiap kali baris di atas tampak penuh',
            rejoinNever: 'Jangan pernah menyambung, hanya buang kode dan indentasi',
            bulletsName: 'Karakter butir',
            bulletsDesc:
                'Menentukan apakah karakter butir (seperti •) pada keluaran terminal dipertahankan atau diubah menjadi butir daftar Markdown.',
            bulletsAliases: ['daftar', 'markdown', 'tanda hubung'],
            bulletsMarkdown: 'Ubah menjadi butir daftar Markdown',
            bulletsPreserve: 'Biarkan apa adanya',
            testerName: 'Coba',
            testerDesc: 'Tempel keluaran terminal untuk melihat bagaimana hasil pembersihannya.',
            testerLabel: 'Teks terminal yang akan dibersihkan',
            testerEmpty: 'Teks yang sudah dibersihkan muncul di sini.',
            testerSample: [
                '• Langkah tambahan ini terbatas pada penanganan Enter di daftar, jadi perubahan intinya sederhana. Saat menelusuri alur di sekitarnya saya menemukan',
                '  dua titik gesekan yang layak diperiksa: pilihan bisa melompat setelah penyegaran.'
            ]
        },

        text: {
            heading: 'Pemrosesan teks',
            trimName: 'Pangkas spasi di sekelilingnya',
            trimDesc: 'Menghapus baris kosong dan spasi di awal dan akhir teks yang ditempel.',
            trimAliases: ['spasi', 'baris kosong', 'baris baru', 'pangkas'],
            commasName: 'Koma dan tanda kutip',
            commasDesc: 'Pilih di mana koma diletakkan di sebelah tanda kutip ganda penutup.',
            commasAliases: ['koma', 'tanda kutip', 'kutipan', 'tanda baca', 'gaya'],
            commasNone: 'Tanpa perubahan',
            commasInside: 'Koma di dalam tanda kutip',
            commasOutside: 'Koma di luar tanda kutip',
            commasExampleSource: 'Dia menyebutnya "selesai," lalu pergi.',
            commasExampleOutside: 'Dia menyebutnya "selesai", lalu pergi.',
            invisibleName: 'Pembersihan AI: karakter tak terlihat',
            invisibleDesc: 'Menghapus spasi lebar nol dan mengubah spasi tanpa pemenggalan menjadi spasi biasa.',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'tanda pisah',
                'tanda pisah panjang',
                'tanda hubung',
                'unicode',
                'tak terlihat',
                'nbsp',
                'tipografi',
                'tanda baca',
                'spasi'
            ],
            invisibleExampleStart: 'Hasil',
            invisibleExampleMiddle: 'itu',
            invisibleExampleEnd: ' bagus.',
            invisibleExampleAfter: 'Hasil itu bagus.',
            punctuationName: 'Pembersihan AI: tanda pisah dan tanda kutip',
            punctuationDesc: 'Mengubah tanda pisah panjang menjadi tanda hubung dan tanda kutip melengkung menjadi lurus.',
            punctuationAliases: [
                'tanda pisah panjang',
                'tanda pisah',
                'tanda hubung',
                'tanda kutip',
                'tanda kutip melengkung',
                'apostrof',
                'tanda baca',
                'tipografi'
            ],
            punctuationExampleBefore: '“Hasilnya — di luar segala dugaan — sempurna.”',
            punctuationExampleAfter: '"Hasilnya - di luar segala dugaan - sempurna."'
        }
    },

    welcome: {
        title: 'Selamat datang di Better Paste',
        intro: [
            'Better Paste mengubah isi papan klip saat isi itu ditempel ke sebuah catatan.',
            'Menyimpan gambar tertaut sebagai lampiran brankas, menghapus parameter pelacakan dari tautan, menyambung kembali baris yang terpotong pada keluaran terminal, dan mengganti tanda kutip melengkung serta karakter tak terlihat dengan padanan yang sederhana.',
            'Setiap aturan dapat dimatikan sendiri-sendiri.',
            'Satu catatan dapat mengecualikan diri sepenuhnya dengan properti "better-paste: false". Pengaturannya ada di Pengaturan, Better Paste.'
        ],
        startButton: 'Mulai'
    },

    whatsNew: {
        title: 'Yang baru di Better Paste',
        scrollLabel: 'Catatan rilis',
        releaseHeading: 'Versi {version} ({date})',
        categoryNew: 'Baru',
        categoryImproved: 'Ditingkatkan',
        categoryChanged: 'Diubah',
        categoryFixed: 'Diperbaiki',
        support: 'Jika Better Paste bermanfaat bagi Anda, pertimbangkan untuk mendukung pengembangannya.',
        coffeeButton: '☕️ Traktir saya kopi',
        thanksButton: 'Terima kasih!'
    }
};
