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
        cleanTerminal: 'Wyczyść tekst z terminala',
        cleanPdf: 'Wyczyść tekst z pliku PDF',
        runSnippet: 'Uruchom fragment',
        commasInside: 'Przenieś przecinki do cudzysłowów',
        commasOutside: 'Przenieś przecinki poza cudzysłowy',
        toggleCleanup: 'Przełącz automatyczne czyszczenie'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'automatyczne przetwarzanie włączone',
        cleanupOff: 'automatyczne przetwarzanie wyłączone',
        selectTextFirst: 'najpierw zaznacz tekst',
        nothingToClean: 'nie ma czego czyścić',
        clipboardFailed: 'nie udało się odczytać schowka',
        titleFailed: 'nie udało się pobrać tytułu.',
        fetchingTitle: 'pobieranie tytułu...',
        fetchingTitles: 'pobieranie tytułów...',
        titlesFailed: {
            one: 'nie udało się pobrać {count} tytułu',
            few: 'nie udało się pobrać {count} tytułów',
            many: 'nie udało się pobrać {count} tytułów',
            other: 'nie udało się pobrać {count} tytułu'
        },
        imagesFailed: {
            one: 'nie udało się zapisać {count} obrazu',
            few: 'nie udało się zapisać {count} obrazów',
            many: 'nie udało się zapisać {count} obrazów',
            other: 'nie udało się zapisać {count} obrazu'
        },
        imagesFailedLinkKept: '{images}, zachowano oryginalny odnośnik',
        imagesFailedNothingPasted: '{images}, więc nic nie zostało wklejone',
        snippetsCopied: 'fragmenty skopiowane',
        snippetsCopyFailed: 'nie udało się skopiować fragmentów'
    },

    settings: {
        exampleFallback: '{description} Przykład: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'O wtyczce',
            whatsNewName: 'Co nowego w Better Paste {version}',
            whatsNewDesc: 'Co zmieniło się w najnowszych wydaniach.',
            whatsNewAliases: ['informacje o wydaniu', 'zmiany', 'lista zmian', 'wersja', 'aktualizacja', 'historia'],
            whatsNewButton: 'Zobacz nowości',
            showReleaseNotesName: 'Pokazuj nowości po aktualizacji',
            showReleaseNotesDesc: 'Otwiera okno z nowościami raz po każdej aktualizacji.',
            showReleaseNotesAliases: ['informacje o wydaniu', 'nowości', 'aktualizacja', 'okno', 'popup', 'powiadomienie'],
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
            autoCleanName: 'Czyść każde wklejenie',
            autoCleanDesc:
                'Stosuje reguły przy każdym wklejeniu. Gdy jest wyłączone, reguły działają tylko po użyciu poleceń Better Paste. Pojedyncza notatka może się wyłączyć właściwością "{property}: false" lub włączyć właściwością "{property}: true".',
            autoCleanAliases: ['automatycznie', 'włącz', 'wyłącz', 'notatka', 'wyklucz', 'właściwość', 'frontmatter'],
            notePropertyName: 'Właściwość notatki',
            notePropertyDesc: 'Właściwość włączająca lub wyłączająca Better Paste dla jednej notatki.',
            notePropertyAliases: ['notatka', 'właściwość', 'frontmatter', 'wyklucz', 'wyłącz', 'włącz', 'bp']
        },

        images: {
            heading: 'Załączniki',
            fileModeName: 'Wklejone pliki',
            fileModeDesc:
                'Wybierz, co się dzieje, gdy wklejasz pliki z urządzenia, na przykład PDF-y i zrzuty ekranu. „Nic nie rób” zostawia wklejanie Obsidianowi, razem z podglądem. „Linkuj bez podglądu” usuwa wykrzyknik.',
            fileModeChoiceOff: 'Nic nie rób',
            fileModeChoiceLink: 'Linkuj bez podglądu',
            fileModeAliases: ['plik', 'załącznik', 'podgląd', 'osadź', 'link', 'pdf', 'zrzut ekranu', 'wykrzyknik'],
            savingName: 'Obrazy z sieci',
            savingDesc:
                'Wybierz, co się dzieje, gdy wklejasz linki do obrazów z sieci. „Nic nie rób” zostawia wklejoną treść bez zmian, „Linkuj z podglądem” pokazuje obraz prosto z sieci, a „Pobierz z podglądem” zapisuje kopię w twoim sejfie.',
            savingDownloadDesc: 'Domyślnie nazwa pliku pochodzi z adresu:',
            savingChoiceOff: 'Nic nie rób',
            savingChoiceLink: 'Linkuj z podglądem',
            savingChoiceDownload: 'Pobierz z podglądem',
            savingAliases: ['pobieranie', 'link', 'osadź', 'podgląd', 'url', 'sieć', 'załącznik', 'safari', 'lokalny', 'obraz', 'folder'],
            sizeStyleName: 'Rozmiar i styl',
            sizeStyleDesc: 'Dodawaj do wklejanych obrazów szerokość lub klasę CSS, automatycznie albo przez okno wyboru.',
            sizeStyleAliases: ['rozmiar', 'szerokość', 'css', 'klasa', 'styl', 'skalowanie', 'invert'],
            summarySize: 'Rozmiar: {value}',
            summaryStyle: 'Styl: {value}',
            summaryAsk: 'Pytaj',
            sizeChoiceName: 'Stosuj rozmiar przy wklejaniu',
            sizeChoiceDesc:
                'Dodaje szerokość do każdego zapisanego osadzenia obrazu, np. ![[photo.jpg|400]]. Właściwość szerokości notatki ma pierwszeństwo.',
            sizeChoiceAliases: ['rozmiar', 'szerokość', 'rozmiar obrazu', 'skalowanie', 'osadzenie', '400'],
            sizeOptionsName: 'Opcje rozmiaru',
            sizeOptionsDesc: 'Szerokości dostępne powyżej i w oknie dialogowym przy wklejaniu, rozdzielone przecinkami.',
            classChoiceName: 'Stosuj klasę CSS przy wklejaniu',
            classChoiceDesc:
                'Dodaje klasę do każdego zapisanego osadzenia obrazu, np. ![[photo.jpg#invert]]. O działaniu klasy decydują motywy i fragmenty CSS.',
            classChoiceAliases: ['css', 'klasa', 'fragment', 'invert', 'motyw', 'filtr', 'osadzenie'],
            classOptionsName: 'Opcje klasy',
            classOptionsDesc: 'Klasy dostępne powyżej i w oknie dialogowym przy wklejaniu, rozdzielone przecinkami.',
            choiceNone: 'Nic nie rób',
            choiceAsk: 'Pytaj przy każdym wklejeniu',
            nameFormatName: 'Nazwy plików',
            customDesc:
                'Użyj {{name}} dla nazwy źródła, {{noteName}} dla nazwy notatki, {{property:xyz}} dla właściwości frontmattera, {{counter}} lub {{counter:2}} dla rosnącego numeru oraz formatów daty Moment, takich jak YYYY-MM-DD.',
            customScreenshotDesc:
                'Zrzut ekranu nie ma nazwy źródła, więc jego {{name}} staje się „Pasted image” ze znacznikiem czasu, jak w Obsidianie.',
            namingInfoTitle: 'Kiedy format nazwy pliku ma zastosowanie',
            namingInfoLead: 'Ważne! Better Paste nie może:',
            namingInfoExplorer: 'Zmienić nazwy pliku, który kopiujesz w Finderze lub Eksploratorze i wklejasz',
            namingInfoDrag: 'Zmienić nazwy pliku, który przeciągasz do notatki',
            namingInfoMobile:
                'Przetworzyć tego, co wklejasz na telefonie własnym poleceniem Obsidiana „Wklej”. Zamiast tego używaj „{command}”.',
            customMomentLink: 'Format Moment',
            customExample: 'Przykład: {value}',
            customExampleNote: 'Moja notatka',
            customAliases: [
                'nazwa',
                'plik',
                'data',
                'moment',
                'YYYY',
                '{{name}}',
                'licznik',
                'właściwość',
                'nazwa notatki',
                'zrzut ekranu',
                'zmiana nazwy',
                'schowek',
                'paste image rename'
            ],
            sizePropertyName: 'Właściwość szerokości obrazu',
            sizePropertyDesc:
                'Właściwość frontmatter określająca szerokość obrazów wklejanych do notatki. Przy "{property}: 400" w notatce wklejony obraz przybiera postać ![[photo.png|400]]. Pozostaw puste, aby nie dodawać szerokości.',
            sizePropertyAliases: ['rozmiar', 'frontmatter', 'właściwość', 'skalowanie']
        },

        links: {
            heading: 'Odnośniki',
            titlesName: 'Pobieraj tytuły wklejanych odnośników',
            titlesDesc:
                'Wklejenie samego adresu internetowego wstawia odnośnik Markdown z tytułem strony. Wklejenie adresu URL Obsidiana wstawia odnośnik z nazwą notatki. Jeśli tekst jest zaznaczony, staje się on etykietą i tytuł nie jest pobierany. Gdy tytułu nie da się pobrać, zostaje sam adres.',
            titlesAliases: ['tytuł', 'strona', 'witryna', 'odnośnik markdown', 'pobieranie'],
            cleaningName: 'Czyść wklejane odnośniki',
            cleaningDesc: 'Usuwa parametry śledzące z wklejanych odnośników:',
            cleaningAliases: ['url', 'śledzenie', 'utm', 'parametry', 'zapytanie', 'witryna', 'domena', 'youtube', 'wyjątek'],
            removalsName: 'Usuwanie parametrów z odnośników',
            removalsDesc: 'Dodatkowe parametry do usuwania wszędzie lub w wybranych witrynach.',
            rulesCount: {
                one: '{count} wpis',
                few: '{count} wpisy',
                many: '{count} wpisów',
                other: '{count} wpisu'
            },
            builtInName: 'Wbudowane reguły usuwania',
            builtInDesc:
                'Zaktualizowano {date}. Globalne filtry śledzenia: {trackingCount}. Reguły specyficzne dla witryn: {siteCount}. Linki podpisane kryptograficznie pozostają niezmienione.',
            builtInButton: 'Wyświetl listę',
            listName: 'Twoje reguły usuwania',
            listDesc:
                'Aby usunąć parametr ze zwykłych linków na każdej witrynie, wystarczy wpisać samą nazwę tego parametru. Na przykład wpisanie „fbclid” spowoduje usunięcie parametru „fbclid” wszędzie tam, gdzie się pojawia.\n\nAby usunąć parametry tylko z jednej witryny, użyj formatu example.com | source, ref. Spowoduje to usunięcie parametrów „source” i „ref” z witryny example.com i jej subdomen, podczas gdy wszystkie pozostałe parametry pozostaną niezmienione. Aby wyłączyć wbudowane reguły usuwania dla danej witryny, rozpocznij wiersz od znaku „!”. Linki podpisane kryptograficznie pozostają zawsze niezmienione.',
            listAliases: ['domena', 'parametr', 'filtr', 'usuń', 'youtube'],
            listInvalid: 'Nieprawidłowa reguła usuwania: {values}',
            suggestName: 'Zaproponuj swoje reguły usuwania',
            suggestDesc: 'Pomóż ulepszyć wbudowane reguły usuwania, zgłaszając parametry do usunięcia.',
            suggestAliases: ['wesprzyj projekt', 'prześlij', 'udostępnij', 'wyślij', 'filtr'],
            suggestButton: 'Sprawdź i wyślij',
            testerName: 'Wypróbuj',
            testerDesc: 'Wklej odnośnik, aby zobaczyć oczyszczony wynik.',
            testerLabel: 'Odnośnik do wyczyszczenia',
            testerEmpty: 'Wyczyszczony odnośnik pojawi się tutaj.'
        },

        text: {
            heading: 'Przetwarzanie tekstu',
            trimName: 'Usuwaj otaczające odstępy',
            trimDesc: 'Usuwa puste wiersze i spacje z początku i końca wklejanego tekstu.',
            trimAliases: ['odstęp', 'pusty wiersz', 'spacja', 'nowy wiersz', 'przycinanie'],
            invisibleName: 'Niewidoczne znaki',
            invisibleDesc: 'Usuwa spacje o zerowej szerokości i zamienia spacje nierozdzielające na zwykłe.',
            invisibleAliases: ['si', 'ai', 'chatgpt', 'claude', 'llm', 'unicode', 'niewidoczne', 'nbsp', 'odstęp'],
            invisibleExampleStart: 'Ten',
            invisibleExampleMiddle: 'wynik',
            invisibleExampleEnd: ' był dobry.',
            invisibleExampleAfter: 'Ten wynik był dobry.',
            quotesName: 'Cudzysłowy',
            quotesDesc: 'Zamienia cudzysłowy drukarskie i apostrofy na proste.',
            quotesAliases: ['cudzysłów', 'cudzysłowy drukarskie', 'cudzysłowy proste', 'apostrof', 'interpunkcja', 'typografia', 'ai'],
            quotesExample: 'Powiedziała: „Dobrze”.',
            dashesName: 'Myślniki',
            dashesDesc: 'Zamienia półpauzy i pauzy na łączniki.',
            dashesAliases: ['myślnik', 'pauza', 'półpauza', 'łącznik', 'dywiz', 'interpunkcja', 'typografia', 'ai'],
            dashesExample: 'Wynik — wbrew wszystkiemu — był dobry.'
        },

        structure: {
            heading: 'Struktura',
            listNestingName: 'Zachowuj zagnieżdżenie list przy wklejaniu',
            listNestingDesc:
                'Wkleja skopiowaną listę z zachowaną hierarchią, z wcięciem dopasowanym do elementu listy, na którym wklejasz.',
            listNestingAliases: ['lista', 'zagnieżdżona', 'wcięcie', 'hierarchia', 'konspekt', 'punktory', 'pole wyboru', 'drzewo'],
            quoteContinuationName: 'Kontynuuj cytaty blokowe przy wklejaniu',
            quoteContinuationDesc:
                'Wkleja tekst wielowierszowy w cytowanym wierszu i oznacza każdy wiersz jako cytat, dzięki czemu cała wklejona treść pozostaje w cytacie blokowym lub objaśnieniu.',
            quoteContinuationAliases: ['cytat', 'cytat blokowy', 'objaśnienie', 'przytoczenie', 'uwaga', 'akapit']
        },

        custom: {
            heading: 'Przetwarzanie niestandardowe',
            pipelineName: 'Stosuj niestandardowe fragmenty wyrażeń regularnych do tekstu',
            pastedText: 'Wklejony tekst',
            note: 'Notatka',
            wikiButton: 'Otwórz wiki',
            regexButton: 'Otwórz tester wyrażeń regularnych',
            snippetsName: 'Fragmenty tekstu',
            snippetsDesc: 'Stosowane do całego wklejonego tekstu po wbudowanych regułach. Włącz te, które mają działać przy wklejaniu.',
            urlSnippetsName: 'Fragmenty odnośników',
            urlSnippetsDesc:
                'Stosowane do każdego wklejonego odnośnika po pobraniu tytułu strony. Reguły widzą tylko gotowy odnośnik Markdown, a sam adres pozostaje bez zmian.',
            enabledSnippetsCount: {
                one: '{count} włączony fragment',
                few: '{count} włączone fragmenty',
                many: '{count} włączonych fragmentów',
                other: '{count} włączonego fragmentu'
            },
            snippetRulesCount: {
                one: '{count} reguła',
                few: '{count} reguły',
                many: '{count} reguł',
                other: '{count} reguły'
            },
            invalidRulesCount: {
                one: '{count} nieprawidłowy wiersz',
                few: '{count} nieprawidłowe wiersze',
                many: '{count} nieprawidłowych wierszy',
                other: '{count} nieprawidłowego wiersza'
            },
            unnamedSnippet: 'Fragment bez nazwy',
            emptyState: 'Nie masz jeszcze żadnych fragmentów.',
            addSnippet: 'Dodaj fragment',
            editButton: 'Edytuj fragment',
            exportName: 'Eksportuj fragmenty',
            exportDesc: 'Kopiuje wszystkie fragmenty w formacie wymiany z wiki.',
            exportButton: 'Kopiuj fragmenty',
            importName: 'Importuj fragmenty',
            importDesc: 'Dodaje fragmenty z formatu wymiany z wiki.',
            previewName: 'Wypróbuj',
            previewDesc: 'Wpisz przykładowy tekst, aby zobaczyć wynik wszystkich włączonych fragmentów.',
            modalPreviewDesc: 'Wpisz przykładowy tekst, aby zobaczyć wynik tego fragmentu.',
            previewInputLabel: 'Przykładowy tekst',
            previewEmpty: 'Przetworzony tekst pojawi się tutaj.',
            urlPreviewDesc: 'Wklej odnośnik Markdown, aby zobaczyć wynik wszystkich włączonych fragmentów odnośników.',
            urlModalPreviewDesc: 'Wklej odnośnik Markdown, aby zobaczyć wynik tego fragmentu.',
            urlPreviewLabel: 'Przykładowy odnośnik z tytułem',
            urlPreviewEmpty: 'Przetworzony odnośnik pojawi się tutaj.',
            nameName: 'Nazwa',
            rulesName: 'Reguły',
            rulesDesc: 'Wpisz w każdym wierszu jedną regułę zamiany z wyrażeniem regularnym JavaScript.',
            wikiPasteHint: 'Skopiuj gotowy fragment z wiki i wklej go bezpośrednio w pole reguł.',
            invalidLine: 'Wiersz {line}: {value}',
            saveButton: 'Zapisz',
            recognizedSnippetsCount: {
                one: 'Rozpoznano {count} fragment',
                few: 'Rozpoznano {count} fragmenty',
                many: 'Rozpoznano {count} fragmentów',
                other: 'Rozpoznano {count} fragmentu'
            },
            recognizedRulesCount: {
                one: 'rozpoznano {count} regułę',
                few: 'rozpoznano {count} reguły',
                many: 'rozpoznano {count} reguł',
                other: 'rozpoznano {count} reguły'
            },
            unparseableName: 'Nierozpoznane wiersze',
            importFallbackName: 'Zaimportowany fragment',
            defaultSnippetBoldHeadings: 'Usuń pogrubienie z nagłówków',
            defaultSnippetBlankLines: 'Scal puste wiersze',
            defaultSnippetSiteSuffixes: 'Usuń nazwy witryn z tytułów'
        }
    },

    imageModal: {
        title: 'Opcje obrazu',
        sizeName: 'Rozmiar',
        className: 'Klasa CSS',
        none: 'Nic nie rób',
        apply: 'Zastosuj',
        cancel: 'Anuluj'
    },

    pdfModal: {
        furniture: 'Usuń numery stron',
        singleParagraph: 'Połącz wszystko w jeden akapit',
        description:
            'Zawinięte wiersze są łączone, wyrazy przedzielone łącznikiem naprawiane, ligatury zamieniane na zwykłe litery, a zbędne spacje usuwane.',
        preview: 'Podgląd'
    },

    welcome: {
        title: 'Witamy w Better Paste',
        intro: [
            'Kopiuj obrazy z Safari prosto do sejfu, wklejaj odnośniki bez parametrów śledzących, naprawiaj połamane wiersze z terminala i porządkuj tekst z AI. Po prostu wklej, resztą zajmie się Better Paste.',
            'Jedna wskazówka na start: przypisz **Wklej bez przetwarzania** do `Cmd+Shift+V` (`Ctrl+Shift+V` w Windows), aby zawsze móc wkleić dokładnie to, co jest w schowku.',
            'Każda reguła ma własny przełącznik w Ustawienia, Better Paste, a właściwość `{property}: false` wyłącza wtyczkę w danej notatce.'
        ],
        startButton: 'Zaczynajmy'
    },

    overlap: {
        title: 'Better Paste: dublujące się wtyczki',
        thanks: 'Dziękujemy za zainstalowanie i używanie Better Paste!',
        intro: {
            one: 'Masz teraz {count} wtyczkę, która robi mniej więcej to samo co Better Paste, więc wyłącz lub odinstaluj:',
            few: 'Masz teraz {count} wtyczki, które robią mniej więcej to samo co Better Paste, więc wyłącz lub odinstaluj:',
            many: 'Masz teraz {count} wtyczek, które robią mniej więcej to samo co Better Paste, więc wyłącz lub odinstaluj:',
            other: 'Masz teraz {count} wtyczki, które robią mniej więcej to samo co Better Paste, więc wyłącz lub odinstaluj:'
        },
        outro: 'Wyłączysz je w sekcji Ustawienia > Wtyczki społeczności.',
        dontRemind: 'Nie przypominaj mi więcej',
        button: 'Rozumiem'
    },

    whatsNew: {
        title: 'Co nowego w Better Paste',
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
