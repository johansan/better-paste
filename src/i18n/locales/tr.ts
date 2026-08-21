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
        cleanPdf: 'PDF metnini temizle',
        runSnippet: 'Parçacık çalıştır',
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
        fetchingTitles: 'başlıklar alınıyor...',
        titlesFailed: {
            one: '{count} başlık alınamadı',
            other: '{count} başlık alınamadı'
        },
        imagesFailed: {
            one: '{count} görsel kaydedilemedi',
            other: '{count} görsel kaydedilemedi'
        },
        imagesFailedLinkKept: '{images}, özgün bağlantı korundu',
        imagesFailedNothingPasted: '{images}, bu yüzden hiçbir şey yapıştırılmadı',
        snippetsCopied: 'parçacıklar kopyalandı',
        snippetsCopyFailed: 'parçacıklar kopyalanamadı'
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
            showReleaseNotesName: 'Güncellemeden sonra yenilikleri göster',
            showReleaseNotesDesc: 'Her güncellemeden sonra yenilikler penceresini bir kez açar.',
            showReleaseNotesAliases: ['sürüm notları', 'yenilikler', 'güncelleme', 'pencere', 'popup', 'bildirim'],
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
                'Kuralları her yapıştırmada uygular. Kapalıyken kurallar yalnızca Better Paste komutlarıyla uygulanır. Tek bir not "{property}: false" özelliğiyle kendini dışarıda bırakabilir, "{property}: true" özelliğiyle de kendini dahil edebilir.',
            autoCleanAliases: ['otomatik', 'etkinleştir', 'devre dışı', 'not', 'hariç tut', 'özellik', 'frontmatter'],
            notePropertyName: 'Not özelliği',
            notePropertyDesc: 'Better Paste’i tek bir not için açan veya kapatan özellik.',
            notePropertyAliases: ['not', 'özellik', 'frontmatter', 'hariç tut', 'devre dışı', 'etkinleştir', 'bp']
        },

        images: {
            heading: 'Görseller',
            savingName: 'Web görselleri',
            savingDesc:
                'Webden görsel bağlantısı yapıştırdığınızda ne olacağını seçin. "Hiçbir şey yapma" yapıştırılanı olduğu gibi bırakır, "Önizlemeyle bağlantı ver" görseli doğrudan webden gösterir, "Önizlemeyle indir" ise kasanıza bir kopya kaydeder.',
            savingDownloadDesc: 'Dosya adı varsayılan olarak adresten gelir:',
            savingChoiceOff: 'Hiçbir şey yapma',
            savingChoiceLink: 'Önizlemeyle bağlantı ver',
            savingChoiceDownload: 'Önizlemeyle indir',
            savingAliases: ['indir', 'bağlantı', 'göm', 'önizleme', 'url', 'web', 'ek', 'safari', 'yerel', 'görsel', 'klasör'],
            sizeStyleName: 'Boyut ve stil',
            sizeStyleDesc: 'Yapıştırılan görsellere bir genişlik veya CSS sınıfı ekleyin, otomatik olarak ya da bir seçiciyle.',
            sizeStyleAliases: ['boyut', 'genişlik', 'css', 'sınıf', 'stil', 'yeniden boyutlandır', 'invert'],
            summarySize: 'Boyut: {value}',
            summaryStyle: 'Stil: {value}',
            summaryAsk: 'Sor',
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
            customDesc:
                'Kaynak adı için {{name}}, not adı için {{noteName}}, bir frontmatter özelliği için {{property:xyz}}, artan bir numara için {{counter}} veya {{counter:2}} ve YYYY-MM-DD gibi Moment tarih biçimlerini kullanın.',
            customScreenshotDesc:
                'Ekran görüntüsünün kaynak adı olmadığından {{name}} değeri, Obsidian’daki gibi zaman damgalı "Pasted image" olur.',
            customMomentLink: 'Moment biçimi',
            customExample: 'Örnek: {value}',
            customExampleNote: 'Notum',
            customAliases: [
                'ad',
                'dosya adı',
                'tarih',
                'moment',
                'YYYY',
                '{{name}}',
                'sayaç',
                'özellik',
                'not adı',
                'ekran görüntüsü',
                'yeniden adlandır',
                'pano',
                'paste image rename'
            ],
            sizePropertyName: 'Görsel genişliği özelliği',
            sizePropertyDesc:
                'Bir nota yapıştırılan görsellerin genişliğini belirleyen frontmatter özelliği. Notta "{property}: 400" varsa, yapıştırılan görsel ![[photo.png|400]] biçimine girer. Genişlik eklenmemesi için boş bırakın.',
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
            removalsName: 'Bağlantılardan parametre kaldırma',
            removalsDesc: 'Her yerde veya belirli sitelerde kaldırılacak ek parametreler.',
            rulesCount: { one: '{count} girdi', other: '{count} girdi' },
            builtInName: 'Yerleşik kaldırma kuralları',
            builtInDesc:
                'Güncelleme: {date}. Genel izleme filtreleri: {trackingCount}. Siteye özgü kurallar: {siteCount}. Kriptografik olarak imzalanmış bağlantılar değişmeden kalır.',
            builtInButton: 'Listeyi görüntüle',
            listName: 'Kaldırma listeniz',
            listDesc:
                'Her sitedeki sıradan bağlantılardan bir parametreyi, adını tek başına girerek kaldırın. Örneğin "fbclid", fbclid parametresini nerede görünürse görünsün kaldırır.\n\nexample.com | source, ref kuralıyla yalnızca bir sitedeki parametreleri kaldırın. Bu, example.com ve alt alan adlarından source ve ref parametrelerini kaldırırken, diğer tüm parametreler kalır. O site için yerleşik kaldırma kurallarını devre dışı bırakmak için satırı ! ile başlatın. Kriptografik olarak imzalanmış bağlantılar her zaman değişmeden kalır.',
            listAliases: ['alan adı', 'parametre', 'filtre', 'kaldır', 'youtube'],
            listInvalid: 'Geçersiz kaldırma kuralı: {values}',
            suggestName: 'Kaldırma önerilerinizi gönderin',
            suggestDesc: 'Kaldırılacak parametreler önererek yerleşik kaldırma kurallarının iyileştirilmesine yardımcı olun.',
            suggestAliases: ['katkıda bulunun', 'gönder', 'paylaş', 'öner', 'filtre'],
            suggestButton: 'İncele ve gönder',
            testerName: 'Deneyin',
            testerDesc: 'Temizlenmiş sonucu görmek için bir bağlantı yapıştırın.',
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
        },

        structure: {
            heading: 'Yapı',
            listNestingName: 'Yapıştırırken liste hiyerarşisini koru',
            listNestingDesc:
                'Kopyalanan listeyi hiyerarşisi bozulmadan yapıştırır, girintiyi üzerine yapıştırdığınız liste ögesine göre ayarlar.',
            listNestingAliases: ['liste', 'iç içe', 'girinti', 'hiyerarşi', 'anahat', 'madde', 'onay kutusu', 'ağaç'],
            quoteContinuationName: 'Yapıştırırken blok alıntıları devam ettir',
            quoteContinuationDesc:
                'Çok satırlı metni alıntılanmış bir satıra yapıştırırken her satırı alıntıya dönüştürür, böylece yapıştırılan metnin tamamı blok alıntının veya bilgi kutusunun içinde kalır.',
            quoteContinuationAliases: ['alıntı', 'blok alıntı', 'bilgi kutusu', 'atıf', 'uyarı', 'paragraf']
        },

        custom: {
            heading: 'Özel işleme',
            pipelineName: 'Özel düzenli ifade parçacıklarını metne uygula',
            pastedText: 'Yapıştırılan metin',
            note: 'Not',
            wikiButton: 'Wiki’yi görüntüle',
            regexButton: 'Düzenli ifade test aracını aç',
            snippetsName: 'Metin parçacıkları',
            snippetsDesc:
                'Yapıştırılan metnin tamamına yerleşik kurallardan sonra uygulanır. Yapıştırma sırasında çalışması gerekenleri açın.',
            urlSnippetsName: 'Bağlantı parçacıkları',
            urlSnippetsDesc:
                'Yapıştırılan her bağlantıya sayfa başlığı alındıktan sonra uygulanır. Kurallar yalnızca tamamlanmış Markdown bağlantısını görür ve bağlantı hedefi değişmeden kalır.',
            enabledSnippetsCount: { one: '{count} etkin parçacık', other: '{count} etkin parçacık' },
            snippetRulesCount: { one: '{count} kural', other: '{count} kural' },
            invalidRulesCount: { one: '{count} geçersiz satır', other: '{count} geçersiz satır' },
            unnamedSnippet: 'Adsız parçacık',
            emptyState: 'Henüz bir parçacık oluşturmadınız.',
            addSnippet: 'Parçacık ekle',
            editButton: 'Parçacığı düzenle',
            exportName: 'Parçacıkları dışa aktar',
            exportDesc: 'Tüm parçacıkları wiki değişim biçiminde kopyalar.',
            exportButton: 'Parçacıkları kopyala',
            importName: 'Parçacıkları içe aktar',
            importDesc: 'Wiki değişim biçiminden parçacıklar ekler.',
            previewName: 'Deneyin',
            previewDesc: 'Tüm etkin parçacıkların sonucunu görmek için örnek metin yazın.',
            modalPreviewDesc: 'Bu parçacığın sonucunu görmek için örnek metin yazın.',
            previewInputLabel: 'Örnek metin',
            previewEmpty: 'İşlenen metin burada görünür.',
            urlPreviewDesc: 'Tüm etkin bağlantı parçacıklarının sonucunu görmek için başlıklı örnek bağlantıyı düzenleyin.',
            urlModalPreviewDesc: 'Bu parçacığın sonucunu görmek için başlıklı örnek bağlantıyı düzenleyin.',
            urlPreviewLabel: 'Başlıklı örnek bağlantı',
            urlPreviewEmpty: 'İşlenen bağlantı burada görünür.',
            nameName: 'Ad',
            rulesName: 'Kurallar',
            rulesDesc: 'Her satıra bir JavaScript düzenli ifade değiştirme kuralı girin.',
            wikiPasteHint: 'Wiki’den hazır bir parçacığı kopyalayıp doğrudan kurallar alanına yapıştırın.',
            invalidLine: 'Satır {line}: {value}',
            saveButton: 'Kaydet',
            recognizedSnippetsCount: { one: '{count} parçacık tanındı', other: '{count} parçacık tanındı' },
            recognizedRulesCount: { one: '{count} kural tanındı', other: '{count} kural tanındı' },
            unparseableName: 'Okunamayan satırlar',
            importFallbackName: 'İçe aktarılan parçacık'
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

    pdfModal: {
        furniture: 'Sayfa numaralarını kaldır',
        singleParagraph: 'Tümünü tek paragrafta birleştir',
        description:
            'Bölünmüş satırlar birleştirilir, tire ile bölünen sözcükler onarılır, ligatürler düz harflere çevrilir ve fazla boşluklar kaldırılır.',
        preview: 'Önizleme'
    },

    welcome: {
        title: 'Better Paste’e hoş geldiniz',
        intro: [
            'Görselleri Safari’den doğrudan kasaya kopyalayın, bağlantıları izleme parametreleri olmadan yapıştırın, terminal çıktısındaki bölünmüş satırları düzeltin ve yapay zekâ metnini temizleyin. Sadece yapıştırın, gerisini Better Paste halleder.',
            'Başlamadan önce bir ipucu: **İşlemeden yapıştır** komutunu `Cmd+Shift+V` (Windows’ta `Ctrl+Shift+V`) kısayoluna atayın; böylece panodakini her zaman olduğu gibi yapıştırabilirsiniz.',
            'Her kuralın Ayarlar, Better Paste altında kendi düğmesi vardır ve `{property}: false` özelliği eklentiyi o not için kapatır.'
        ],
        startButton: 'Başla'
    },

    overlap: {
        title: 'Better Paste: çakışan eklentiler',
        thanks: 'Better Paste’i kurup kullandığınız için teşekkürler!',
        intro: {
            one: 'Şu anda Better Paste ile aşağı yukarı aynı işi yapan {count} eklentiniz kurulu, bu yüzden aşağıdakini devre dışı bırakın veya kaldırın:',
            other: 'Şu anda Better Paste ile aşağı yukarı aynı işi yapan {count} eklentiniz kurulu, bu yüzden aşağıdakileri devre dışı bırakın veya kaldırın:'
        },
        outro: 'Ayarlar > Topluluk eklentileri bölümünden devre dışı bırakabilirsiniz.',
        dontRemind: 'Bir daha hatırlatmayın',
        button: 'Anladım'
    },

    whatsNew: {
        title: 'Better Paste’te yenilikler',
        releaseHeading: 'Sürüm {version} ({date})',
        categoryNew: 'Yeni',
        categoryImproved: 'İyileştirildi',
        categoryChanged: 'Değişti',
        categoryFixed: 'Düzeltildi',
        support: 'Better Paste işinize yarıyorsa geliştirilmesini desteklemeyi düşünün.',
        coffeeButton: '☕️ Bana bir kahve ısmarla',
        thanksButton: 'Teşekkürler!',
        dontShowAgain: 'Güncellemelerden sonra bir daha gösterme'
    }
};
