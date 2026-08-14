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
        toggleCleanup: 'Otomatik temizlemeyi aç veya kapat'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'otomatik işleme açık',
        cleanupOff: 'otomatik işleme kapalı',
        selectTextFirst: 'önce metin seçin',
        nothingToClean: 'temizlenecek bir şey yok',
        clipboardFailed: 'pano okunamadı',
        titleFailed: 'başlık alınamadı.',
        fetchingTitle: 'başlık alınıyor{dots}',
        imagesFailed: {
            one: '{count} görsel kaydedilemedi',
            other: '{count} görsel kaydedilemedi'
        },
        imagesFailedLinkKept: '{images}, özgün bağlantı korundu',
        imagesFailedNothingPasted: '{images}, bu yüzden hiçbir şey yapıştırılmadı',
        aiTextCleaned: 'yapay zekâ metni düzeltildi',
        terminalCleaned: 'uçbirim çıktısı temizlendi',
        textProcessed: 'metin biçemi ayarlandı',
        urlsCleaned: { one: '{count} URL temizlendi', other: '{count} URL temizlendi' },
        imagesSaved: { one: '{count} görsel kaydedildi', other: '{count} görsel kaydedildi' }
    },

    settings: {
        exampleFallback: '{description} Örnek: {example}',
        plainFallback: '{description} {example}',

        start: {
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
            pixelPerfectImageDesc: 'Tam isabetli görsel boyutlandırma ve çok daha fazlası'
        },

        behavior: {
            heading: 'Davranış',
            autoCleanName: 'Her yapıştırmayı temizle',
            autoCleanDesc:
                'Kuralları her yapıştırmada uygular. Kapalıyken kurallar yalnızca Better Paste komutlarıyla uygulanır. Tek bir not "better-paste: false" özelliğiyle kendini dışarıda bırakabilir.',
            autoCleanAliases: ['otomatik', 'etkinleştir', 'devre dışı', 'not', 'hariç tut', 'özellik', 'frontmatter'],
            showNoticesName: 'Yapıştırma değiştirildiğinde bildirim göster',
            showNoticesDesc: 'Nelerin değiştiğine dair tek satırlık özet. Hatalar her zaman bildirilir.',
            showNoticesAliases: ['bildirim', 'özet', 'ileti', 'sessiz']
        },

        images: {
            heading: 'Görseller',
            savingName: 'Yapıştırılan görselleri kasaya kaydet',
            savingDesc:
                'Yapıştırılan görselleri ek klasörünüze kaydeder ve web adresi yerine yerel dosyaya bağlantı verir. Safari’deki "Görseli kopyala", kopyalanan web içeriğindeki görseller ve yapıştırılan görsel adresleri buna dahildir. Dosya adı öntanımlı olarak adresten gelir:',
            savingAliases: ['indir', 'ek', 'safari', 'ekran görüntüsü', 'görsel', 'klasör', 'dosya adı', 'genişlik', 'boyut'],
            pageName: 'Görsel işleme',
            pageDesc: 'Dosya adları ve görsel genişliği.',
            nameFormatName: 'Dosya adları',
            nameFormatDesc: 'Kaydedilen görsellerin nasıl adlandırılacağı.',
            nameFormatSource: 'Kaynaktan gelen ad',
            nameFormatCustom: 'Özel biçim',
            customName: 'Özel biçim',
            customDesc: 'Kaynak adı için {{name}} ve YYYY-MM-DD gibi Moment tarih biçimlerini kullanın.',
            customMomentLink: 'Moment biçimi',
            customExample: 'Örnek: {value}',
            customAliases: ['ad', 'dosya adı', 'tarih', 'moment', 'YYYY', '{{name}}'],
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

        terminal: {
            heading: 'Uçbirim metni',
            cleanupName: 'Uçbirim çıktısını temizle',
            cleanupDesc:
                'Uçbirimin böldüğü satırları yeniden birleştirir, renk kodlarını ve baştaki girintiyi kaldırır. Kod blokları, tablolar ve listeler olduğu gibi kalır.',
            cleanupAliases: ['satır kaydırma', 'birleştir', 'ansi', 'konsol', 'kabuk', 'girinti', 'madde imi', 'liste', 'markdown'],
            pageName: 'Uçbirim metni işleme',
            pageDesc: 'Satır birleştirme ve madde imi karakterleri.',
            rejoinName: 'Bölünmüş satır ne zaman birleştirilsin',
            rejoinDesc: 'Bir satır, yalnızca üstündeki satır dolu göründüğünde ona eklenir.',
            rejoinAliases: ['girinti', 'satır kaydırma', 'agresif', 'güvenli', 'git log'],
            rejoinIndented: 'Yalnızca satır girintiliyse',
            rejoinAny: 'Satır girintili olsun ya da olmasın',
            rejoinNever: 'Asla, yalnızca kodları ve girintiyi kaldır',
            bulletsName: 'Madde imi karakterleri',
            bulletsDesc: 'Uçbirim çıktısındaki • gibi madde imi karakterleriyle ne yapılacağı.',
            bulletsAliases: ['liste', 'markdown', 'tire'],
            bulletsMarkdown: 'Markdown liste öğelerine dönüştür',
            bulletsPreserve: 'Olduğu gibi bırak',
            testerName: 'Deneyin',
            testerDesc: 'Nasıl temizlendiğini görmek için uçbirim çıktısı yapıştırın.',
            testerLabel: 'Temizlenecek uçbirim metni',
            testerEmpty: 'Temizlenmiş metin burada görünür.',
            testerSample: [
                '• Ek adım yalnızca listenin Enter işleyicisiyle sınırlı, bu yüzden asıl değişiklik sade kalıyor. Komşu akışları izlerken bulduğum',
                '  doğrulanmaya değer iki sürtünme noktası var: yenilemeden sonra seçim yerinden oynayabilir.'
            ]
        },

        text: {
            heading: 'Metin işleme',
            trimName: 'Çevredeki boşlukları kırp',
            trimDesc: 'Yapıştırılan metnin başındaki ve sonundaki boş satırları ve boşlukları kaldırır.',
            trimAliases: ['boşluk', 'boş satır', 'yeni satır', 'kırp'],
            commasName: 'Virgüller ve tırnaklar',
            commasDesc: 'Kapanan çift tırnağın yanındaki virgülün yeri.',
            commasAliases: ['virgül', 'tırnak', 'alıntı', 'noktalama', 'biçem'],
            commasNone: 'Değişiklik yok',
            commasInside: 'Virgül tırnağın içinde',
            commasOutside: 'Virgül tırnağın dışında',
            commasExampleSource: 'Ona "bitti," dedi ve gitti.',
            commasExampleOutside: 'Ona "bitti", dedi ve gitti.',
            invisibleName: 'Yapay zekâ temizliği: görünmez karakterler',
            invisibleDesc: 'Sıfır genişlikli boşlukları kaldırır ve bölünmez boşlukları normal boşluğa çevirir.',
            invisibleAliases: [
                'yapay zekâ',
                'chatgpt',
                'claude',
                'llm',
                'tire',
                'uzun tire',
                'orta tire',
                'kısa çizgi',
                'unicode',
                'görünmez',
                'nbsp',
                'tipografi',
                'noktalama',
                'boşluk'
            ],
            invisibleExampleStart: 'Sonuç',
            invisibleExampleMiddle: 'gayet',
            invisibleExampleEnd: ' iyiydi.',
            invisibleExampleAfter: 'Sonuç gayet iyiydi.',
            punctuationName: 'Yapay zekâ temizliği: tireler ve tırnaklar',
            punctuationDesc: 'Uzun tireleri kısa çizgiye, kıvrık tırnakları düz tırnağa çevirir.',
            punctuationAliases: [
                'uzun tire',
                'orta tire',
                'kısa çizgi',
                'tırnak',
                'kıvrık tırnak',
                'kesme işareti',
                'noktalama',
                'tipografi'
            ],
            punctuationExampleBefore: '“Sonuç — her şeye rağmen — kusursuzdu.”',
            punctuationExampleAfter: '"Sonuç - her şeye rağmen - kusursuzdu."'
        }
    },

    welcome: {
        title: 'Better Paste’e hoş geldiniz',
        intro: [
            'Better Paste, pano içeriğini bir nota yapıştırılırken değiştirir.',
            'Bağlantılı görselleri kasaya ek olarak kaydeder, bağlantılardan izleme parametrelerini kaldırır, uçbirim çıktısındaki bölünmüş satırları yeniden birleştirir ve kıvrık tırnaklarla görünmez karakterleri yalın karşılıklarıyla değiştirir.',
            'Her kural tek tek kapatılabilir.',
            'Tek bir not "better-paste: false" özelliğiyle kendini tamamen dışarıda bırakabilir. Ayarlara Ayarlar, Better Paste bölümünden ulaşabilirsiniz.'
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
