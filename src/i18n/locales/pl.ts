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

/** Polish. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_PL: TranslationStrings = {
    commands: {
        paste: 'Wklej',
        pasteRaw: 'Wklej bez przetwarzania',
        cleanSelection: 'Wyczyść zaznaczenie',
        toggleCleanup: 'Przełącz automatyczne czyszczenie'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'automatyczne przetwarzanie włączone',
        cleanupOff: 'automatyczne przetwarzanie wyłączone',
        selectTextFirst: 'najpierw zaznacz tekst',
        nothingToClean: 'nie ma czego czyścić',
        clipboardFailed: 'nie udało się odczytać schowka',
        titleFailed: 'nie udało się pobrać tytułu.',
        fetchingTitle: 'pobieranie tytułu{dots}',
        imagesFailed: {
            one: 'nie udało się zapisać {count} obrazu',
            few: 'nie udało się zapisać {count} obrazów',
            many: 'nie udało się zapisać {count} obrazów',
            other: 'nie udało się zapisać {count} obrazu'
        },
        imagesFailedLinkKept: '{images}, zachowano oryginalny odnośnik',
        imagesFailedNothingPasted: '{images}, więc nic nie zostało wklejone',
        aiTextCleaned: 'uporządkowano tekst AI',
        terminalCleaned: 'wyczyszczono wynik terminala',
        textProcessed: 'poprawiono styl tekstu',
        urlsCleaned: {
            one: 'wyczyszczono {count} adres URL',
            few: 'wyczyszczono {count} adresy URL',
            many: 'wyczyszczono {count} adresów URL',
            other: 'wyczyszczono {count} adresu URL'
        },
        imagesSaved: {
            one: 'zapisano {count} obraz',
            few: 'zapisano {count} obrazy',
            many: 'zapisano {count} obrazów',
            other: 'zapisano {count} obrazu'
        }
    },

    settings: {
        exampleFallback: '{description} Przykład: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Co nowego w Better Paste {version}',
            whatsNewDesc: 'Co zmieniło się w najnowszych wydaniach.',
            whatsNewAliases: ['informacje o wydaniu', 'zmiany', 'lista zmian', 'wersja', 'aktualizacja', 'historia'],
            whatsNewButton: 'Zobacz nowości',
            supportName: 'Wesprzyj rozwój',
            supportDesc: 'Jeśli Better Paste jest dla ciebie przydatny, rozważ wsparcie jego rozwoju.',
            supportAliases: ['sponsor', 'darowizna', 'kawa', 'github'],
            sponsorButton: '❤️ Zostań sponsorem',
            coffeeButton: '☕️ Postaw mi kawę',
            pluginsName: 'Zobacz moje inne wtyczki',
            pluginsAliases: ['wtyczki', 'notebook navigator', 'pixel perfect image', 'autor', 'więcej'],
            notebookNavigatorDesc: 'Lepsza przeglądarka plików i kalendarz',
            pixelPerfectImageDesc: 'Dokładna zmiana rozmiaru obrazów i więcej'
        },

        behavior: {
            heading: 'Zachowanie',
            autoCleanName: 'Czyść każde wklejenie',
            autoCleanDesc:
                'Stosuje reguły przy każdym wklejeniu. Gdy jest wyłączone, reguły działają tylko po użyciu poleceń Better Paste. Pojedyncza notatka może się wyłączyć właściwością "bp: false" lub włączyć właściwością "bp: true".',
            autoCleanAliases: ['automatycznie', 'włącz', 'wyłącz', 'notatka', 'wyklucz', 'właściwość', 'frontmatter'],
            showNoticesName: 'Pokazuj powiadomienie, gdy wklejenie zostało zmienione',
            showNoticesDesc: 'Jednowierszowe podsumowanie zmian. Błędy są zgłaszane zawsze.',
            showNoticesAliases: ['powiadomienie', 'podsumowanie', 'komunikat', 'cicho']
        },

        images: {
            heading: 'Obrazy',
            savingName: 'Zapisuj wklejone obrazy w sejfie',
            savingDesc:
                'Zapisuje wklejone obrazy w folderze załączników i wstawia odnośnik do pliku lokalnego zamiast adresu internetowego. Dotyczy opcji „Kopiuj obraz” w Safari, obrazów w skopiowanej treści z sieci oraz wklejanych adresów obrazów. Domyślnie nazwa pliku pochodzi z adresu:',
            savingAliases: ['pobieranie', 'załącznik', 'safari', 'zrzut ekranu', 'obraz', 'folder', 'nazwa pliku', 'szerokość', 'rozmiar'],
            pageName: 'Obsługa obrazów',
            pageDesc: 'Nazwy plików i szerokość obrazów.',
            nameFormatName: 'Nazwy plików',
            nameFormatDesc: 'Jak nazywane są zapisane obrazy.',
            nameFormatSource: 'Nazwa ze źródła',
            nameFormatCustom: 'Własny format',
            customName: 'Własny format',
            customDesc: 'Użyj {{name}} dla nazwy źródła oraz formatów daty Moment, takich jak YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Przykład: {value}',
            customAliases: ['nazwa', 'plik', 'data', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Właściwość notatki',
            notePropertyDesc:
                'Właściwość włączająca lub wyłączająca Better Paste dla jednej notatki. Przy "bp: false" notatka pozostaje bez zmian, a przy "bp: true" jest czyszczona nawet wtedy, gdy „Czyść każde wklejenie” jest wyłączone. Pozostaw puste, aby zignorować tę właściwość.',
            notePropertyAliases: ['notatka', 'właściwość', 'frontmatter', 'wyklucz', 'wyłącz', 'włącz', 'bp'],
            sizePropertyName: 'Właściwość szerokości obrazu',
            sizePropertyDesc:
                'Właściwość frontmatter określająca szerokość obrazów wklejanych do notatki. Przy "bp-image-width: 400" w notatce wklejony obraz przybiera postać ![[photo.png|400]]. Pozostaw puste, aby nie dodawać szerokości.',
            sizePropertyAliases: ['rozmiar', 'frontmatter', 'właściwość', 'skalowanie']
        },

        links: {
            heading: 'Odnośniki',
            titlesName: 'Pobieraj tytuły wklejanych odnośników',
            titlesDesc:
                'Wklejenie samego adresu internetowego wstawia odnośnik Markdown z tytułem strony. Jeśli tekst jest zaznaczony, staje się on etykietą i tytuł nie jest pobierany. Gdy tytułu nie da się pobrać, zostaje sam adres.',
            titlesAliases: ['tytuł', 'strona', 'witryna', 'odnośnik markdown', 'pobieranie'],
            cleaningName: 'Czyść wklejane odnośniki',
            cleaningDesc: 'Usuwa parametry śledzące z wklejanych odnośników:',
            cleaningAliases: ['url', 'śledzenie', 'utm', 'parametry', 'zapytanie', 'witryna', 'domena', 'youtube', 'wyjątek'],
            stripName: 'Które parametry usuwać',
            stripDesc: 'Parametry śledzące to nazwy takie jak utm_source, fbclid i gclid.',
            stripAliases: ['utm', 'śledzenie', 'zapytanie', 'parametry'],
            stripAll: 'Każdy parametr, o ile reguła witryny go nie zachowa',
            stripTracking: 'Tylko znane parametry śledzące',
            rulesName: 'Reguły witryn',
            rulesDesc: 'Parametry zachowywane w wybranych witrynach.',
            rulesCount: {
                one: '{count} witryna',
                few: '{count} witryny',
                many: '{count} witryn',
                other: '{count} witryny'
            },
            listName: 'Twoje reguły witryn',
            listDesc:
                'Reguły dla {sites} są już częścią wtyczki. Dodaj tutaj własne reguły, po jednej w wierszu. „example.com” zachowuje wszystkie parametry tej witryny, „example.com: a, b” zachowuje tylko te dwa, a „!example.com” usuwa regułę dostarczaną z wtyczką. Poddomeny są rozpoznawane automatycznie.',
            listShippedCount: {
                one: '{count} popularnej witryny',
                few: '{count} popularnych witryn',
                many: '{count} popularnych witryn',
                other: '{count} popularnej witryny'
            },
            listAliases: ['domena', 'wyjątek', 'biała lista', 'youtube'],
            listInvalid: 'To nie jest nazwa witryny: {values}',
            testerName: 'Wypróbuj',
            testerDesc: 'Wklej odnośnik, aby zobaczyć, co zachowują reguły.',
            testerLabel: 'Odnośnik do wyczyszczenia',
            testerEmpty: 'Wyczyszczony odnośnik pojawi się tutaj.'
        },

        terminal: {
            heading: 'Tekst terminala',
            cleanupName: 'Czyść wynik terminala',
            cleanupDesc:
                'Ponownie łączy wiersze zawinięte przez terminal oraz usuwa kody kolorów i początkowe wcięcia. Bloki kodu, tabele i listy pozostają nietknięte.',
            cleanupAliases: ['zawijanie', 'łączenie', 'ansi', 'konsola', 'powłoka', 'wcięcie', 'punktor', 'lista', 'markdown'],
            pageName: 'Obsługa tekstu terminala',
            pageDesc: 'Łączenie wierszy i znaki punktorów.',
            rejoinName: 'Kiedy łączyć przerwany wiersz',
            rejoinDesc: 'Wiersz jest dołączany do poprzedniego tylko wtedy, gdy tamten wygląda na pełny.',
            rejoinAliases: ['wcięcie', 'zawijanie', 'agresywnie', 'bezpiecznie', 'git log'],
            rejoinIndented: 'Tylko gdy wiersz ma wcięcie',
            rejoinAny: 'Niezależnie od wcięcia',
            rejoinNever: 'Nigdy, usuwaj tylko kody i wcięcia',
            bulletsName: 'Znaki punktorów',
            bulletsDesc: 'Co robić ze znakami punktorów, takimi jak •, w wyniku terminala.',
            bulletsAliases: ['lista', 'markdown', 'myślnik'],
            bulletsMarkdown: 'Zamień na elementy listy Markdown',
            bulletsPreserve: 'Zostaw bez zmian',
            testerName: 'Wypróbuj',
            testerDesc: 'Wklej wynik terminala, aby zobaczyć, jak zostaje wyczyszczony.',
            testerLabel: 'Tekst terminala do wyczyszczenia',
            testerEmpty: 'Wyczyszczony tekst pojawi się tutaj.',
            testerSample: [
                '• Dodatkowy krok dotyczy wyłącznie obsługi Enter na liście, więc główna zmiana jest prosta. Przeglądając sąsiednie przepływy, znalazłem',
                '  dwa prawdopodobne punkty tarcia warte sprawdzenia: zaznaczenie może przeskoczyć po odświeżeniu.'
            ]
        },

        text: {
            heading: 'Przetwarzanie tekstu',
            trimName: 'Usuwaj otaczające odstępy',
            trimDesc: 'Usuwa puste wiersze i spacje z początku i końca wklejanego tekstu.',
            trimAliases: ['odstęp', 'pusty wiersz', 'spacja', 'nowy wiersz', 'przycinanie'],
            commasName: 'Przecinki i cudzysłowy',
            commasDesc: 'Gdzie stoi przecinek obok zamykającego cudzysłowu.',
            commasAliases: ['przecinek', 'cudzysłów', 'cytat', 'interpunkcja', 'styl'],
            commasNone: 'Bez zmian',
            commasInside: 'Przecinek wewnątrz cudzysłowu',
            commasOutside: 'Przecinek poza cudzysłowem',
            commasExampleSource: 'Nazwał to "skończonym," po czym wyszedł.',
            commasExampleOutside: 'Nazwał to "skończonym", po czym wyszedł.',
            invisibleName: 'Czyszczenie AI: niewidoczne znaki',
            invisibleDesc: 'Usuwa spacje o zerowej szerokości i zamienia spacje nierozdzielające na zwykłe.',
            invisibleAliases: [
                'si',
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'myślnik',
                'pauza',
                'półpauza',
                'łącznik',
                'unicode',
                'niewidoczne',
                'nbsp',
                'typografia',
                'interpunkcja',
                'odstęp'
            ],
            invisibleExampleStart: 'Ten',
            invisibleExampleMiddle: 'wynik',
            invisibleExampleEnd: ' był dobry.',
            invisibleExampleAfter: 'Ten wynik był dobry.',
            punctuationName: 'Czyszczenie AI: myślniki i cudzysłowy',
            punctuationDesc: 'Zamienia długie myślniki na łączniki, a cudzysłowy drukarskie na proste.',
            punctuationAliases: [
                'pauza',
                'półpauza',
                'łącznik',
                'cudzysłów',
                'cudzysłowy drukarskie',
                'apostrof',
                'interpunkcja',
                'typografia'
            ],
            punctuationExampleBefore: '„Wynik — wbrew wszystkiemu — był doskonały.”',
            punctuationExampleAfter: '"Wynik - wbrew wszystkiemu - był doskonały."'
        }
    },

    welcome: {
        title: 'Witamy w Better Paste',
        intro: [
            'Better Paste zmienia zawartość schowka w chwili wklejania jej do notatki.',
            'Zapisuje powiązane obrazy jako załączniki sejfu, usuwa parametry śledzące z odnośników, ponownie łączy zawinięte wiersze wyniku terminala oraz zamienia cudzysłowy drukarskie i niewidoczne znaki na proste odpowiedniki.',
            'Każdą regułę można wyłączyć osobno.',
            'Pojedyncza notatka może wyłączyć się całkowicie właściwością "bp: false". Ustawienia znajdują się w Ustawienia, Better Paste.'
        ],
        startButton: 'Zaczynajmy'
    },

    whatsNew: {
        title: 'Co nowego w Better Paste',
        scrollLabel: 'Informacje o wydaniu',
        releaseHeading: 'Wersja {version} ({date})',
        categoryNew: 'Nowe',
        categoryImproved: 'Ulepszone',
        categoryChanged: 'Zmienione',
        categoryFixed: 'Poprawione',
        support: 'Jeśli Better Paste jest dla ciebie przydatny, rozważ wsparcie jego rozwoju.',
        coffeeButton: '☕️ Postaw mi kawę',
        thanksButton: 'Dzięki!'
    }
};
