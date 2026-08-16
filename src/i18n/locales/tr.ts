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

/** Turkish. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_TR: TranslationStrings = {
    commands: {
        paste: 'Yapıştır',
        pasteRaw: 'İşlemeden yapıştır',
        cleanSelection: 'Seçimi temizle',
        cleanTerminal: 'Terminal çıktısını temizle',
        commasInside: 'Virgülleri tırnak içine taşı',
        commasOutside: 'Virgülleri tırnak dışına taşı',
        toggleCleanup: 'Otomatik temizlemeyi aç veya kapat'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'otomatik işleme açık',
        cleanupOff: 'otomatik işleme kapalı',
        selectTextFirst: 'önce metin seçin',
        nothingToClean: 'temizlenecek bir şey yok',
        clipboardFailed: 'pano okunamadı',
        titleFailed: 'başlık alınamadı.',
        fetchingTitle: 'başlık alınıyor...',
        imagesFailed: {
            one: '{count} görsel kaydedilemedi',
            other: '{count} görsel kaydedilemedi'
        },
        imagesFailedLinkKept: '{images}, özgün bağlantı korundu',
        imagesFailedNothingPasted: '{images}, bu yüzden hiçbir şey yapıştırılmadı'
    },

    settings: {
        exampleFallback: '{description} Örnek: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Hakkında',
            whatsNewName: 'Better Paste {version} sürümünde yenilikler',
            whatsNewDesc: 'Son sürümlerde nelerin değiştiği.',
            whatsNewAliases: ['sürüm notları', 'değişiklikler', 'değişiklik günlüğü', 'sürüm', 'güncelleme', 'geçmiş'],
            whatsNewButton: 'Son güncellemeleri gör',
            supportName: 'Geliştirmeyi destekle',
            supportDesc: 'Better Paste işinize yarıyorsa geliştirilmesini desteklemeyi düşünün.',
            supportAliases: ['sponsor', 'bağış', 'kahve', 'github'],
            sponsorButton: '❤️ Sponsor ol',
            coffeeButton: '☕️ Bana bir kahve ısmarla',
            pluginsName: 'Diğer eklentilerime göz at',
            pluginsAliases: ['eklentiler', 'notebook navigator', 'pixel perfect image', 'yazar', 'daha fazlası'],
            notebookNavigatorDesc: 'Daha iyi bir dosya tarayıcısı ve takvim',
            pixelPerfectImageDesc: 'Tam isabetli görsel boyutlandırma ve daha fazlası'
        },

        behavior: {
            autoCleanName: 'Her yapıştırmayı temizle',
            autoCleanDesc:
                'Kuralları her yapıştırmada uygular. Kapalıyken kurallar yalnızca Better Paste komutlarıyla uygulanır. Tek bir not "bp: false" özelliğiyle kendini dışarıda bırakabilir, "bp: true" özelliğiyle de kendini dahil edebilir.',
            autoCleanAliases: ['otomatik', 'etkinleştir', 'devre dışı', 'not', 'hariç tut', 'özellik', 'frontmatter']
        },

        images: {
            heading: 'Görseller',
            savingName: 'Yapıştırılan görselleri kasaya kaydet',
            savingDesc:
                'Yapıştırılan görselleri ek klasörünüze kaydeder ve web adresi yerine yerel dosyaya bağlantı verir. Safari’deki "Görseli kopyala", kopyalanan web içeriğindeki görseller ve yapıştırılan görsel adresleri buna dahildir. Dosya adı öntanımlı olarak adresten gelir:',
            savingAliases: ['indir', 'ek', 'safari', 'ekran görüntüsü', 'görsel', 'klasör', 'dosya adı', 'genişlik', 'boyut'],
            sizeChoiceName: 'Yapıştırırken boyut uygula',
            sizeChoiceDesc:
                'Kaydedilen her gömülü görsele bir genişlik ekler, örneğin ![[photo.jpg|400]]. Notun kendi genişlik özelliği önceliklidir.',
            sizeChoiceAliases: ['boyut', 'genişlik', 'görsel boyutu', 'yeniden boyutlandır', 'gömme', '400'],
            sizeOptionsName: 'Boyut seçenekleri',
            sizeOptionsDesc: 'Yukarıda ve yapıştırma penceresinde sunulan genişlikler, virgülle ayrılır.',
            classChoiceName: 'Yapıştırırken CSS sınıfı uygula',
            classChoiceDesc:
                'Kaydedilen her gömülü görsele bir sınıf ekler, örneğin ![[photo.jpg#invert]]. Bir sınıfın ne yaptığına temalar ve CSS parçacıkları karar verir.',
            classChoiceAliases: ['css', 'sınıf', 'parçacık', 'invert', 'tema', 'filtre', 'gömme'],
            classOptionsName: 'Sınıf seçenekleri',
            classOptionsDesc: 'Yukarıda ve yapıştırma penceresinde sunulan sınıflar, virgülle ayrılır.',
            choiceNone: 'Hiçbir şey yapma',
            choiceAsk: 'Her yapıştırmada sor',
            nameFormatName: 'Dosya adları',
            nameFormatDesc: 'Kaydedilen görsellerin nasıl adlandırılacağı.',
            nameFormatSource: 'Kaynaktan gelen ad',
            nameFormatCustom: 'Özel biçim',
            customName: 'Özel biçim',
            customDesc: 'Kaynak adı için {{name}} ve YYYY-MM-DD gibi Moment tarih biçimlerini kullanın.',
            customMomentLink: 'Moment biçimi',
            customExample: 'Örnek: {value}',
            customAliases: ['ad', 'dosya adı', 'tarih', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Not özelliği',
            notePropertyDesc:
                'Better Paste’i tek bir not için açan veya kapatan özellik. "bp: false" ile not olduğu gibi bırakılır, "bp: true" ile "Her yapıştırmayı temizle" kapalı olsa bile temizlenir. Özelliği yok saymak için boş bırakın.',
            notePropertyAliases: ['not', 'özellik', 'frontmatter', 'hariç tut', 'devre dışı', 'etkinleştir', 'bp'],
            sizePropertyName: 'Görsel genişliği özelliği',
            sizePropertyDesc:
                'Bir nota yapıştırılan görsellerin genişliğini belirleyen frontmatter özelliği. Notta "image-width: 400" varsa, yapıştırılan görsel ![[photo.png|400]] biçimine girer. Genişlik eklenmemesi için boş bırakın.',
            sizePropertyAliases: ['boyut', 'frontmatter', 'özellik', 'yeniden boyutlandır']
        },

        links: {
            heading: 'Bağlantılar',
            titlesName: 'Yapıştırılan bağlantıların başlığını al',
            titlesDesc:
                'Tek başına bir web adresi yapıştırmak, sayfa başlığını taşıyan bir Markdown bağlantısı ekler. Metin seçiliyse, seçili metin etiket olur ve başlık alınmaz. Başlık alınamazsa adresin kendisi kalır.',
            titlesAliases: ['başlık', 'sayfa', 'web sitesi', 'markdown bağlantısı', 'indir'],
            cleaningName: 'Yapıştırılan bağlantıları temizle',
            cleaningDesc: 'Yapıştırılan bağlantılardan izleme parametrelerini kaldırır:',
            cleaningAliases: ['url', 'izleme', 'utm', 'parametreler', 'sorgu', 'site', 'alan adı', 'youtube', 'istisna'],
            stripName: 'Hangi parametreler kaldırılsın',
            stripDesc: 'İzleme parametreleri utm_source, fbclid ve gclid gibi adlardır.',
            stripAliases: ['utm', 'izleme', 'sorgu', 'parametreler'],
            stripAll: 'Bir site kuralı korumadığı sürece her parametre',
            stripTracking: 'Yalnızca bilinen izleme parametreleri',
            rulesName: 'Site kuralları',
            rulesDesc: 'Belirli sitelerde korunacak parametreler.',
            rulesCount: { one: '{count} site', other: '{count} site' },
            listName: 'Kendi site kurallarınız',
            listDesc:
                '{sites} zaten eklenti tarafından destekleniyor. Kendi kurallarınızı burada, satır başına bir tane olacak şekilde ekleyin. "example.com" o sitedeki her parametreyi korur, "example.com: a, b" yalnızca bu ikisini korur, "!example.com" ise eklentiyle gelen bir kuralı kaldırır. Alt alan adları kendiliğinden eşleşir.',
            listShippedCount: { one: '{count} yaygın site', other: '{count} yaygın site' },
            listAliases: ['alan adı', 'istisna', 'beyaz liste', 'youtube'],
            listInvalid: 'Site adı değil: {values}',
            testerName: 'Deneyin',
            testerDesc: 'Kuralların neyi koruduğunu görmek için bir bağlantı yapıştırın.',
            testerLabel: 'Temizlenecek bağlantı',
            testerEmpty: 'Temizlenmiş bağlantı burada görünür.'
        },

        text: {
            heading: 'Metin işleme',
            trimName: 'Çevredeki boşlukları kırp',
            trimDesc: 'Yapıştırılan metnin başındaki ve sonundaki boş satırları ve boşlukları kaldırır.',
            trimAliases: ['boşluk', 'boş satır', 'yeni satır', 'kırp'],
            invisibleName: 'Görünmez karakterler',
            invisibleDesc: 'Sıfır genişlikli boşlukları kaldırır ve bölünmez boşlukları normal boşluğa çevirir.',
            invisibleAliases: ['yapay zeka', 'chatgpt', 'claude', 'llm', 'unicode', 'görünmez', 'nbsp', 'boşluk'],
            invisibleExampleStart: 'Sonuç',
            invisibleExampleMiddle: 'gayet',
            invisibleExampleEnd: ' iyiydi.',
            invisibleExampleAfter: 'Sonuç gayet iyiydi.',
            quotesName: 'Tırnak işaretleri',
            quotesDesc: 'Kıvrık tırnakları ve kesme işaretlerini düz tırnağa dönüştürür.',
            quotesAliases: [
                'tırnak',
                'kıvrık tırnak',
                'akıllı tırnak',
                'düz tırnak',
                'kesme işareti',
                'noktalama',
                'tipografi',
                'yapay zeka'
            ],
            quotesExample: '“Bitti” dedi.',
            dashesName: 'Tireler',
            dashesDesc: 'Orta ve uzun çizgileri kısa çizgiye dönüştürür.',
            dashesAliases: ['tire', 'çizgi', 'kısa çizgi', 'orta çizgi', 'uzun çizgi', 'uzun tire', 'noktalama', 'tipografi', 'yapay zeka'],
            dashesExample: 'Sonuç — her şeye rağmen — iyiydi.'
        }
    },

    imageModal: {
        title: 'Görsel seçenekleri',
        sizeName: 'Boyut',
        className: 'CSS sınıfı',
        none: 'Hiçbir şey yapma',
        apply: 'Uygula',
        cancel: 'İptal'
    },

    welcome: {
        title: 'Better Paste’e hoş geldiniz',
        intro: [
            'Görselleri Safari’den doğrudan kasaya kopyalayın, bağlantıları izleme parametreleri olmadan yapıştırın, terminal çıktısındaki bölünmüş satırları düzeltin ve yapay zekâ metnini temizleyin. Sadece yapıştırın, gerisini Better Paste halleder.',
            'Başlamadan önce bir ipucu: **İşlemeden yapıştır** komutunu `Cmd+Shift+V` (Windows’ta `Ctrl+Shift+V`) kısayoluna atayın; böylece panodakini her zaman olduğu gibi yapıştırabilirsiniz.',
            'Her kuralın Ayarlar, Better Paste altında kendi düğmesi vardır ve `bp: false` özelliği eklentiyi o not için kapatır.'
        ],
        startButton: 'Başla'
    },

    whatsNew: {
        title: 'Better Paste’te yenilikler',
        scrollLabel: 'Sürüm notları',
        releaseHeading: 'Sürüm {version} ({date})',
        categoryNew: 'Yeni',
        categoryImproved: 'İyileştirildi',
        categoryChanged: 'Değişti',
        categoryFixed: 'Düzeltildi',
        support: 'Better Paste işinize yarıyorsa geliştirilmesini desteklemeyi düşünün.',
        coffeeButton: '☕️ Bana bir kahve ısmarla',
        thanksButton: 'Teşekkürler!'
    }
};
