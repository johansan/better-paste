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
        imagesFailedNothingPasted: '{images}, więc nic nie zostało wklejone. Zawartość nadal jest w schowku.',
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
            supportDesc: 'Jeśli Better Paste jest dla ciebie przydatny, rozważ wsparcie jego dalszego rozwoju.',
            supportAliases: ['sponsor', 'darowizna', 'kawa', 'github'],
            sponsorButton: '❤️ Zostań sponsorem',
            coffeeButton: '☕️ Postaw mi kawę'
        },

        behavior: {
            heading: 'Zachowanie',
            autoCleanName: 'Czyść każde wklejenie',
            autoCleanDesc:
                'Stosuje reguły przy każdym wklejeniu. Wyłącz, aby korzystać tylko z poleceń. Pojedyncza notatka może się wyłączyć właściwością "better-paste: false".',
            autoCleanAliases: ['automatycznie', 'włącz', 'wyłącz', 'notatka', 'wyklucz', 'właściwość', 'frontmatter'],
            showNoticesName: 'Pokazuj powiadomienie, gdy wklejenie zostało zmienione',
            showNoticesDesc:
                'Jednowierszowe podsumowanie tego, co wyczyszczono. Błędy są zgłaszane zawsze, niezależnie od tego ustawienia.',
            showNoticesAliases: ['powiadomienie', 'podsumowanie', 'komunikat', 'cicho']
        },

        images: {
            heading: 'Obrazy',
            savingName: 'Zapisuj wklejone obrazy w sejfie',
            savingDesc:
                'Zapisuje wklejone obrazy jako pliki lokalne zamiast pozostawiać zewnętrzne odnośniki. Dotyczy to opcji „Kopiuj obraz” w Safari, obrazów w skopiowanej treści z sieci oraz pojedynczych adresów obrazów. Obrazy trafiają do folderu załączników twojego sejfu. Przy opcji „Nazwa ze źródła”:',
            savingAliases: ['pobieranie', 'załącznik', 'safari', 'zrzut ekranu', 'obraz', 'folder', 'nazwa pliku', 'szerokość', 'rozmiar'],
            pageName: 'Obsługa obrazów',
            pageDesc: 'Nazwy plików i szerokość obrazów dla notatki.',
            nameFormatName: 'Nazwy plików',
            nameFormatDesc: 'Wybierz, jak nazywane są zapisane pliki obrazów.',
            nameFormatSource: 'Nazwa ze źródła',
            nameFormatCustom: 'Własny format',
            customName: 'Własny format',
            customDesc: 'Użyj {{name}} dla nazwy źródła oraz formatów daty Moment, takich jak YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Przykład: {value}',
            customAliases: ['nazwa', 'plik', 'data', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Właściwość szerokości obrazu',
            sizePropertyDesc:
                'Właściwość frontmatter określająca szerokość obrazów wklejanych do notatki. Notatka z tą właściwością przejmuje wklejanie zrzutów ekranu od Obsidiana. Pozostaw puste, aby wyłączyć.',
            sizePropertyAliases: ['rozmiar', 'frontmatter', 'właściwość', 'skalowanie']
        },

        links: {
            heading: 'Odnośniki',
            titlesName: 'Pobieraj tytuły wklejanych odnośników',
            titlesDesc:
                'Gdy schowek zawiera tylko adres internetowy, który nie jest obrazem, pobierany jest tytuł strony i wklejany odnośnik Markdown. Inny zaznaczony tekst staje się etykietą bez wykonywania żądania. Jeśli tytułu nie da się pobrać, zostaje pierwotny adres.',
            titlesAliases: ['tytuł', 'strona', 'witryna', 'odnośnik markdown', 'pobieranie'],
            cleaningName: 'Czyść wklejane odnośniki',
            cleaningDesc: 'Usuwa parametry śledzące z wklejanych odnośników. Przekreślona część zostaje usunięta:',
            cleaningAliases: ['url', 'śledzenie', 'utm', 'parametry', 'zapytanie', 'witryna', 'domena', 'youtube', 'wyjątek'],
            stripName: 'Które parametry usuwać',
            stripDesc:
                'Wybierz, czy usuwać wszystkie parametry zapytania, czy tylko znane parametry śledzące. Reguły witryn mogą zachować parametry w obu trybach.',
            stripAliases: ['utm', 'śledzenie', 'zapytanie', 'parametry'],
            stripAll: 'Każdy parametr, o ile reguła witryny go nie zachowa',
            stripTracking: 'Tylko parametry znane jako śledzące',
            rulesName: 'Reguły zachowywania parametrów',
            rulesDesc: 'Reguły witryn zachowujące określone parametry zapytania w obu trybach usuwania.',
            rulesCount: {
                one: '{count} witryna',
                few: '{count} witryny',
                many: '{count} witryn',
                other: '{count} witryny'
            },
            listName: 'Twoje reguły witryn',
            listDesc:
                'Reguły dla {sites} są już wbudowane i pozostają aktualne wraz z wtyczką. Dodaj tutaj własne reguły, po jednej w wierszu. „example.com” zachowuje wszystkie parametry tej witryny, „example.com: a, b” zachowuje tylko te dwa, a „!example.com” usuwa regułę dostarczaną z wtyczką. W trybie „Tylko parametry znane jako śledzące” reguła ratuje wyłącznie pasujące parametry śledzące, ponieważ pozostałe i tak są zachowywane. Poddomeny są rozpoznawane automatycznie.',
            listShippedCount: {
                one: '{count} popularnej witryny',
                few: '{count} popularnych witryn',
                many: '{count} popularnych witryn',
                other: '{count} popularnej witryny'
            },
            listAliases: ['domena', 'wyjątek', 'biała lista', 'youtube'],
            listInvalid: 'To nie jest nazwa witryny: {values}',
            testerName: 'Wypróbuj',
            testerDesc: 'Wklej odnośnik, aby zobaczyć, co zachowałyby te reguły.',
            testerLabel: 'Odnośnik do wyczyszczenia',
            testerEmpty: 'Wyczyszczony odnośnik pojawi się tutaj.'
        },

        terminal: {
            heading: 'Tekst terminala',
            cleanupName: 'Czyść wynik terminala',
            cleanupDesc:
                'Ponownie łączy zawinięte wiersze wyniku terminala i usuwa wcięcia. Kody kolorów są usuwane. Bloki kodu, tabele i elementy list pozostają nietknięte.',
            cleanupAliases: ['zawijanie', 'łączenie', 'ansi', 'konsola', 'powłoka', 'wcięcie', 'punktor', 'lista', 'markdown'],
            pageName: 'Obsługa tekstu terminala',
            pageDesc: 'Warunki łączenia wierszy i znaki punktorów.',
            rejoinName: 'Kiedy łączyć przerwany wiersz',
            rejoinDesc: 'Warunek, przy którym wiersz jest traktowany jako ciąg dalszy poprzedniego.',
            rejoinAliases: ['wcięcie', 'zawijanie', 'agresywnie', 'bezpiecznie', 'git log'],
            rejoinIndented: 'Tylko gdy następny wiersz ma wcięcie',
            rejoinAny: 'Zawsze, gdy wiersz powyżej wygląda na pełny',
            rejoinNever: 'Nigdy nie łącz, usuwaj tylko kody i wcięcia',
            bulletsName: 'Znaki punktorów',
            bulletsDesc:
                'Określa, czy znaki punktorów (takie jak •) w wyniku terminala są zachowywane, czy zamieniane na elementy listy Markdown.',
            bulletsAliases: ['lista', 'markdown', 'myślnik'],
            bulletsMarkdown: 'Zamień na elementy listy Markdown',
            bulletsPreserve: 'Zostaw bez zmian',
            testerName: 'Wypróbuj',
            testerDesc: 'Wklej wynik terminala, aby zobaczyć, jak zostałby wyczyszczony.',
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
            commasDesc: 'Wybierz, gdzie umieścić przecinek obok zamykającego cudzysłowu.',
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
            'Pojedyncza notatka może wyłączyć się całkowicie właściwością "better-paste: false". Ustawienia znajdują się w Ustawienia, Better Paste.'
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
