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
        cleanupOn: 'pemrosesan otomatis aktif',
        cleanupOff: 'pemrosesan otomatis nonaktif',
        selectTextFirst: 'pilih teks terlebih dahulu',
        nothingToClean: 'tidak ada yang perlu dibersihkan',
        clipboardFailed: 'tidak dapat membaca papan klip',
        titleFailed: 'tidak dapat mengambil judul.',
        fetchingTitle: 'mengambil judul...',
        imagesFailed: { other: '{count} gambar gagal disimpan' },
        imagesFailedLinkKept: '{images}, tautan aslinya dipertahankan',
        imagesFailedNothingPasted: '{images}, jadi tidak ada yang ditempel'
    },

    settings: {
        exampleFallback: '{description} Contoh: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Tentang',
            whatsNewName: 'Yang baru di Better Paste {version}',
            whatsNewDesc: 'Apa yang berubah pada rilis terbaru.',
            whatsNewAliases: ['catatan rilis', 'perubahan', 'log perubahan', 'versi', 'pembaruan', 'riwayat'],
            whatsNewButton: 'Lihat pembaruan terbaru',
            supportName: 'Dukung pengembangan',
            supportDesc: 'Jika Better Paste bermanfaat bagi Anda, pertimbangkan untuk mendukung pengembangannya.',
            supportAliases: ['sponsor', 'donasi', 'kopi', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Traktir saya kopi',
            pluginsName: 'Lihat plugin saya yang lain',
            pluginsAliases: ['plugin', 'notebook navigator', 'pixel perfect image', 'penulis', 'lainnya'],
            notebookNavigatorDesc: 'Penjelajah berkas dan kalender yang lebih baik',
            pixelPerfectImageDesc: 'Pengubahan ukuran gambar yang presisi dan lainnya'
        },

        behavior: {
            autoCleanName: 'Bersihkan setiap tempelan',
            autoCleanDesc:
                'Menerapkan aturan pada setiap tempelan. Saat mati, aturan hanya dijalankan melalui perintah Better Paste. Satu catatan dapat mengecualikan diri dengan properti "bp: false", atau ikut dibersihkan dengan "bp: true".',
            autoCleanAliases: ['otomatis', 'aktifkan', 'nonaktifkan', 'catatan', 'kecualikan', 'properti', 'frontmatter']
        },

        images: {
            heading: 'Gambar',
            savingName: 'Simpan gambar yang ditempel ke dalam brankas',
            savingDesc:
                'Menyimpan gambar yang ditempel ke folder lampiran Anda dan menaut ke berkas lokal alih-alih alamat web. Mencakup "Salin gambar" di Safari, gambar di dalam konten web yang disalin, dan alamat gambar yang ditempel. Secara baku nama berkas diambil dari alamatnya:',
            savingAliases: ['unduh', 'lampiran', 'safari', 'tangkapan layar', 'gambar', 'folder', 'nama berkas', 'lebar', 'ukuran'],
            nameFormatName: 'Nama berkas',
            nameFormatDesc: 'Cara penamaan gambar yang disimpan.',
            nameFormatSource: 'Nama dari sumber',
            nameFormatCustom: 'Format sendiri',
            customName: 'Format sendiri',
            customDesc: 'Gunakan {{name}} untuk nama sumber dan format tanggal Moment seperti YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Contoh: {value}',
            customAliases: ['nama', 'berkas', 'tanggal', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Properti catatan',
            notePropertyDesc:
                'Properti yang mengaktifkan atau menonaktifkan Better Paste untuk satu catatan. Dengan "bp: false", catatan dibiarkan apa adanya, dan dengan "bp: true", catatan tetap dibersihkan meski "Bersihkan setiap tempelan" mati. Biarkan kosong untuk mengabaikan properti ini.',
            notePropertyAliases: ['catatan', 'properti', 'frontmatter', 'kecualikan', 'nonaktifkan', 'aktifkan', 'bp'],
            sizePropertyName: 'Properti lebar gambar',
            sizePropertyDesc:
                'Properti frontmatter yang menentukan lebar gambar yang ditempel ke sebuah catatan. Dengan "image-width: 400" di catatan, gambar yang ditempel menjadi ![[photo.png|400]]. Biarkan kosong agar tidak ada lebar yang ditambahkan.',
            sizePropertyAliases: ['ukuran', 'frontmatter', 'properti', 'ubah ukuran']
        },

        links: {
            heading: 'Tautan',
            titlesName: 'Ambil judul untuk tautan yang ditempel',
            titlesDesc:
                'Menempel alamat web yang berdiri sendiri akan memasukkan tautan Markdown berisi judul halaman. Jika ada teks yang dipilih, teks itu menjadi labelnya dan judul tidak diambil. Alamat apa adanya dipertahankan bila judul tidak dapat diambil.',
            titlesAliases: ['judul', 'halaman', 'situs web', 'tautan markdown', 'unduh'],
            cleaningName: 'Bersihkan tautan yang ditempel',
            cleaningDesc: 'Menghapus parameter pelacakan dari tautan yang ditempel:',
            cleaningAliases: ['url', 'pelacakan', 'utm', 'parameter', 'kueri', 'situs', 'domain', 'youtube', 'pengecualian'],
            stripName: 'Parameter mana yang dihapus',
            stripDesc: 'Parameter pelacakan adalah nama seperti utm_source, fbclid, dan gclid.',
            stripAliases: ['utm', 'pelacakan', 'kueri', 'parameter'],
            stripAll: 'Setiap parameter, kecuali dipertahankan aturan situs',
            stripTracking: 'Hanya parameter pelacakan yang dikenal',
            rulesName: 'Aturan situs',
            rulesDesc: 'Parameter yang dipertahankan pada situs tertentu.',
            rulesCount: { other: '{count} situs' },
            listName: 'Aturan situs Anda',
            listDesc:
                '{sites} sudah ditangani oleh plugin. Tambahkan aturan Anda sendiri di sini, satu per baris. "example.com" mempertahankan setiap parameter di situs itu, "example.com: a, b" hanya mempertahankan kedua parameter itu, dan "!example.com" menghapus aturan bawaan plugin. Subdomain dicocokkan secara otomatis.',
            listShippedCount: { other: '{count} situs umum' },
            listAliases: ['domain', 'pengecualian', 'daftar putih', 'youtube'],
            listInvalid: 'Bukan nama situs: {values}',
            testerName: 'Coba',
            testerDesc: 'Tempel sebuah tautan untuk melihat apa yang dipertahankan aturan.',
            testerLabel: 'Tautan yang akan dibersihkan',
            testerEmpty: 'Tautan yang sudah dibersihkan muncul di sini.'
        },

        terminal: {
            heading: 'Teks terminal',
            cleanupName: 'Bersihkan keluaran terminal',
            cleanupDesc:
                'Menyambung kembali baris yang dipotong terminal serta menghapus kode warna dan indentasi awal. Blok kode, tabel, dan daftar tidak disentuh.',
            cleanupAliases: ['pemenggalan baris', 'sambung', 'ansi', 'konsol', 'shell', 'indentasi', 'butir', 'daftar', 'markdown'],
            pageName: 'Penanganan teks terminal',
            pageDesc: 'Penyambungan baris dan karakter butir.',
            rejoinName: 'Kapan baris terpotong disambung kembali',
            rejoinDesc: 'Sebuah baris hanya disambung ke baris di atasnya bila baris itu tampak penuh.',
            rejoinAliases: ['indentasi', 'pemenggalan baris', 'agresif', 'aman', 'git log'],
            rejoinIndented: 'Hanya bila baris berindentasi',
            rejoinAny: 'Berindentasi atau tidak',
            rejoinNever: 'Jangan pernah, hanya buang kode dan indentasi',
            bulletsName: 'Karakter butir',
            bulletsDesc: 'Apa yang dilakukan pada karakter butir seperti • di keluaran terminal.',
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
            commasDesc: 'Di mana koma diletakkan di sebelah tanda kutip ganda penutup.',
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
            'Salin gambar dari Safari langsung ke brankas, tempel tautan tanpa parameter pelacakan, perbaiki keluaran terminal yang barisnya terpotong, dan bersihkan teks AI. Cukup tempel, sisanya diurus Better Paste.',
            'Satu kiat sebelum mulai: pasang **Tempel tanpa pemrosesan** ke `Cmd+Shift+V` (`Ctrl+Shift+V` di Windows) agar isi papan klip selalu bisa ditempel apa adanya.',
            'Setiap aturan punya sakelar sendiri di Pengaturan, Better Paste, dan properti `bp: false` mematikan plugin untuk catatan itu.'
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
