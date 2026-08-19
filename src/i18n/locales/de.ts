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

/** German. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_DE: TranslationStrings = {
    commands: {
        paste: 'Einfügen',
        pasteRaw: 'Ohne Verarbeitung einfügen',
        cleanSelection: 'Auswahl bereinigen',
        cleanTerminal: 'Terminalausgabe bereinigen',
        cleanPdf: 'PDF-Text bereinigen',
        runSnippet: 'Snippet ausführen',
        commasInside: 'Kommas innerhalb der Anführungszeichen setzen',
        commasOutside: 'Kommas außerhalb der Anführungszeichen setzen',
        toggleCleanup: 'Automatische Bereinigung umschalten'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'automatische Verarbeitung an',
        cleanupOff: 'automatische Verarbeitung aus',
        selectTextFirst: 'zuerst Text auswählen',
        nothingToClean: 'nichts zu bereinigen',
        clipboardFailed: 'Zwischenablage konnte nicht gelesen werden',
        titleFailed: 'Titel konnte nicht abgerufen werden.',
        fetchingTitle: 'Titel wird abgerufen...',
        imagesFailed: {
            one: '{count} Bild konnte nicht gespeichert werden',
            other: '{count} Bilder konnten nicht gespeichert werden'
        },
        imagesFailedLinkKept: '{images}, der ursprüngliche Link wurde behalten',
        imagesFailedNothingPasted: '{images}, daher wurde nichts eingefügt',
        snippetsCopied: 'Snippets kopiert',
        snippetsCopyFailed: 'Snippets konnten nicht kopiert werden'
    },

    settings: {
        exampleFallback: '{description} Beispiel: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Über',
            whatsNewName: 'Neu in Better Paste {version}',
            whatsNewDesc: 'Was sich in den letzten Versionen geändert hat.',
            whatsNewAliases: ['versionshinweise', 'änderungen', 'changelog', 'version', 'aktualisierung', 'verlauf'],
            whatsNewButton: 'Neuerungen ansehen',
            supportName: 'Entwicklung unterstützen',
            supportDesc: 'Wenn dir Better Paste nützlich ist, unterstütze bitte seine Entwicklung.',
            supportAliases: ['sponsor', 'spende', 'kaffee', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Spendier mir einen Kaffee',
            pluginsName: 'Schau dir meine anderen Plugins an',
            pluginsAliases: ['plugins', 'notebook navigator', 'pixel perfect image', 'autor', 'mehr'],
            notebookNavigatorDesc: 'Ein besserer Dateibrowser und Kalender',
            pixelPerfectImageDesc: 'Exakte Bildgrößen und mehr'
        },

        behavior: {
            autoCleanName: 'Jeden Einfügevorgang bereinigen',
            autoCleanDesc:
                'Wendet die Regeln bei jedem Einfügen an. Ist dies aus, greifen die Regeln nur über die Better-Paste-Befehle. Eine einzelne Notiz kann sich mit der Eigenschaft "{property}: false" ausnehmen oder sich mit "{property}: true" immer bereinigen lassen.',
            autoCleanAliases: [
                'automatisch',
                'aktivieren',
                'deaktivieren',
                'notiz',
                'ausschließen',
                'eigenschaft',
                'frontmatter',
                'ausnehmen'
            ],
            notePropertyName: 'Notizeigenschaft',
            notePropertyDesc: 'Eigenschaft, die Better Paste für eine einzelne Notiz ein- oder ausschaltet.',
            notePropertyAliases: ['notiz', 'eigenschaft', 'frontmatter', 'ausnehmen', 'deaktivieren', 'aktivieren', 'bp']
        },

        images: {
            heading: 'Bilder',
            savingName: 'Webbilder im Tresor speichern',
            savingDesc:
                'Speichert Bilder aus dem Web im Anhangordner und verlinkt die lokale Datei statt der Webadresse. Gilt für "Bild kopieren" in Safari, Bilder in kopierten Webinhalten und eingefügte Bildadressen. Standardmäßig stammt der Dateiname aus der Adresse:',
            savingAliases: ['herunterladen', 'url', 'web', 'anhang', 'safari', 'lokal', 'bild', 'ordner'],
            sizeStyleName: 'Größe und Stil',
            sizeStyleDesc: 'Füge eingefügten Bildern eine Breite oder eine CSS-Klasse hinzu, automatisch oder über einen Dialog.',
            sizeStyleAliases: ['größe', 'breite', 'css', 'klasse', 'stil', 'skalieren', 'invert'],
            summarySize: 'Größe: {value}',
            summaryStyle: 'Stil: {value}',
            summaryAsk: 'Fragen',
            sizeChoiceName: 'Größe beim Einfügen anwenden',
            sizeChoiceDesc:
                'Fügt jeder gespeicherten Bildeinbettung eine Breite hinzu, etwa ![[photo.jpg|400]]. Die Breiteneigenschaft einer Notiz hat Vorrang.',
            sizeChoiceAliases: ['größe', 'breite', 'bildgröße', 'skalieren', 'embed', '400'],
            sizeOptionsName: 'Größenoptionen',
            sizeOptionsDesc: 'Die oben und im Einfügedialog angebotenen Breiten, durch Kommas getrennt.',
            classChoiceName: 'CSS-Klasse beim Einfügen anwenden',
            classChoiceDesc:
                'Fügt jeder gespeicherten Bildeinbettung eine Klasse hinzu, etwa ![[photo.jpg#invert]]. Was eine Klasse bewirkt, bestimmen Themes und CSS-Snippets.',
            classChoiceAliases: ['css', 'klasse', 'snippet', 'invert', 'theme', 'filter', 'embed'],
            classOptionsName: 'Klassenoptionen',
            classOptionsDesc: 'Die oben und im Einfügedialog angebotenen Klassen, durch Kommas getrennt.',
            choiceNone: 'Nichts tun',
            choiceAsk: 'Bei jedem Einfügen fragen',
            nameFormatName: 'Dateinamen',
            customDesc:
                'Verwende {{name}} für den Quellnamen, {{noteName}} für den Notiznamen, {{property:xyz}} für eine Frontmatter-Eigenschaft, {{counter}} oder {{counter:2}} für eine fortlaufende Nummer und Moment-Datumsformate wie YYYY-MM-DD.',
            customScreenshotDesc:
                'Ein Screenshot hat keinen Quellnamen, sein {{name}} wird deshalb zu "Pasted image" mit Zeitstempel, wie in Obsidian.',
            customMomentLink: 'Moment-Format',
            customExample: 'Beispiel: {value}',
            customExampleNote: 'Meine Notiz',
            customAliases: [
                'name',
                'dateiname',
                'datum',
                'moment',
                'YYYY',
                '{{name}}',
                'zähler',
                'eigenschaft',
                'notizname',
                'screenshot',
                'umbenennen',
                'zwischenablage',
                'paste image rename'
            ],
            sizePropertyName: 'Eigenschaft für Bildbreite',
            sizePropertyDesc:
                'Frontmatter-Eigenschaft, die die Breite der in eine Notiz eingefügten Bilder festlegt. Mit "{property}: 400" in der Notiz wird ein eingefügtes Bild zu ![[photo.png|400]]. Leer lassen, um keine Breite zu setzen.',
            sizePropertyAliases: ['größe', 'frontmatter', 'eigenschaft', 'skalieren']
        },

        links: {
            heading: 'Links',
            titlesName: 'Titel für eingefügte Links abrufen',
            titlesDesc:
                'Wird eine Webadresse allein eingefügt, entsteht ein Markdown-Link mit dem Seitentitel. Ist Text ausgewählt, wird dieser die Beschriftung und es wird kein Titel abgerufen. Lässt sich der Titel nicht abrufen, bleibt die reine Adresse stehen.',
            titlesAliases: ['titel', 'seite', 'webseite', 'markdown-link', 'herunterladen'],
            cleaningName: 'Eingefügte Links bereinigen',
            cleaningDesc: 'Entfernt Tracking-Parameter aus eingefügten Links:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameter', 'abfrage', 'seite', 'domain', 'youtube', 'ausnahme'],
            removalsName: 'Link-Entfernungen',
            removalsDesc: 'Zusätzliche Parameter zum Entfernen überall oder auf bestimmten Websites.',
            rulesCount: { one: '{count} Eintrag', other: '{count} Einträge' },
            builtInName: 'Integrierte Entfernungen',
            builtInDesc:
                'Aktualisiert am {date}. Globale Tracking-Filter: {trackingCount}. Website-spezifische Regeln: {siteCount}. Kryptografisch signierte Links bleiben unverändert.',
            builtInButton: 'Liste anzeigen',
            listName: 'Deine Entfernungen',
            listDesc:
                'Entferne einen Parameter aus gewöhnlichen Links auf jeder Website, indem du nur seinen Namen in eine eigene Zeile schreibst. "fbclid" entfernt zum Beispiel den Parameter fbclid überall, wo er vorkommt.\n\nEntferne Parameter nur auf einer Website mit "example.com | source, ref". Das entfernt source und ref von example.com und seinen Subdomains, alle anderen Parameter bleiben erhalten. Beginne eine Zeile mit "!", um die integrierten Entfernungen für diese Website abzuschalten. Kryptografisch signierte Links bleiben immer unverändert.',
            listAliases: ['domain', 'parameter', 'filter', 'entfernen', 'youtube'],
            listInvalid: 'Ungültige Entfernungsregel: {values}',
            suggestName: 'Schlage deine Entfernungen vor',
            suggestDesc: 'Hilf mit, die integrierten Entfernungen zu verbessern, indem du zu entfernende Parameter beisteuerst.',
            suggestAliases: ['mitwirken', 'einsenden', 'teilen', 'senden', 'filter'],
            suggestButton: 'Überprüfen und senden',
            testerName: 'Ausprobieren',
            testerDesc: 'Füge einen Link ein, um das bereinigte Ergebnis zu sehen.',
            testerLabel: 'Zu bereinigender Link',
            testerEmpty: 'Der bereinigte Link erscheint hier.'
        },

        text: {
            heading: 'Textverarbeitung',
            trimName: 'Umgebende Leerzeichen entfernen',
            trimDesc: 'Entfernt leere Zeilen und Leerzeichen am Anfang und Ende des eingefügten Textes.',
            trimAliases: ['leerzeichen', 'leerzeile', 'zeilenumbruch', 'kürzen'],
            invisibleName: 'Unsichtbare Zeichen',
            invisibleDesc: 'Entfernt Zeichen der Breite null und wandelt geschützte Leerzeichen in normale Leerzeichen um.',
            invisibleAliases: ['ki', 'chatgpt', 'claude', 'llm', 'unicode', 'unsichtbar', 'nbsp', 'leerzeichen'],
            invisibleExampleStart: 'Das',
            invisibleExampleMiddle: 'Ergebnis',
            invisibleExampleEnd: ' war gut.',
            invisibleExampleAfter: 'Das Ergebnis war gut.',
            quotesName: 'Anführungszeichen',
            quotesDesc: 'Wandelt typografische Anführungszeichen und Apostrophe in gerade um.',
            quotesAliases: [
                'anführungszeichen',
                'gänsefüßchen',
                'typografische anführungszeichen',
                'gerade anführungszeichen',
                'apostroph',
                'zeichensetzung',
                'typografie',
                'ki'
            ],
            quotesExample: '„Gut“, sagte sie.',
            dashesName: 'Gedankenstriche',
            dashesDesc: 'Wandelt Halbgeviert- und Geviertstriche in Bindestriche um.',
            dashesAliases: [
                'strich',
                'gedankenstrich',
                'geviertstrich',
                'halbgeviertstrich',
                'bindestrich',
                'zeichensetzung',
                'typografie',
                'ki'
            ],
            dashesExample: 'Das Ergebnis — allen Widerständen zum Trotz — war gut.'
        },

        custom: {
            heading: 'Eigene Verarbeitung',
            pipelineName: 'Eigene Regex-Snippets auf Text anwenden',
            pastedText: 'Eingefügter Text',
            builtInRules: 'Integrierte Regeln',
            customSnippets: 'Eigene Snippets',
            note: 'Notiz',
            wikiButton: 'Wiki anzeigen',
            regexButton: 'Regex-Testumgebung öffnen',
            snippetsName: 'Snippets',
            snippetsDesc:
                'Füge deine Snippets hinzu und bearbeite sie. Schalte diejenigen ein, die beim Einfügen ausgeführt werden sollen.',
            enabledSnippetsCount: { one: '{count} aktives Snippet', other: '{count} aktive Snippets' },
            snippetRulesCount: { one: '{count} Regel', other: '{count} Regeln' },
            invalidRulesCount: { one: '{count} ungültige Zeile', other: '{count} ungültige Zeilen' },
            unnamedSnippet: 'Unbenanntes Snippet',
            emptyState: 'Du hast noch keine Snippets erstellt.',
            addSnippet: 'Snippet hinzufügen',
            editButton: 'Snippet bearbeiten',
            exportName: 'Snippets exportieren',
            exportDesc: 'Kopiert alle Snippets im Austauschformat des Wikis.',
            exportButton: 'Snippets kopieren',
            importName: 'Snippets importieren',
            importDesc: 'Fügt Snippets aus dem Austauschformat des Wikis hinzu.',
            previewName: 'Ausprobieren',
            previewDesc: 'Gib Beispieltext ein, um das Ergebnis aller aktiven Snippets zu sehen.',
            modalPreviewDesc: 'Gib Beispieltext ein, um das Ergebnis dieses Snippets zu sehen.',
            previewInputLabel: 'Beispieltext',
            previewEmpty: 'Der verarbeitete Text erscheint hier.',
            nameName: 'Name',
            rulesName: 'Regeln',
            rulesDesc: 'Gib pro Zeile eine Ersetzung mit einem regulären JavaScript-Ausdruck ein.',
            wikiPasteHint: 'Kopiere ein fertiges Snippet aus dem Wiki und füge es direkt in das Regelfeld ein.',
            invalidLine: 'Zeile {line}: {value}',
            saveButton: 'Speichern',
            recognizedSnippetsCount: { one: '{count} Snippet erkannt', other: '{count} Snippets erkannt' },
            recognizedRulesCount: { one: '{count} Regel erkannt', other: '{count} Regeln erkannt' },
            unparseableName: 'Nicht erkannte Zeilen',
            importFallbackName: 'Importiertes Snippet'
        }
    },

    imageModal: {
        title: 'Bildoptionen',
        sizeName: 'Größe',
        className: 'CSS-Klasse',
        none: 'Nichts tun',
        apply: 'Anwenden',
        cancel: 'Abbrechen'
    },

    pdfModal: {
        furniture: 'Seitenzahlen entfernen',
        singleParagraph: 'Alles zu einem Absatz verbinden',
        description:
            'Umbrochene Zeilen werden wieder verbunden, getrennte Wörter repariert, Ligaturen in einfache Buchstaben umgewandelt und überflüssige Leerzeichen entfernt.',
        preview: 'Vorschau'
    },

    welcome: {
        title: 'Willkommen bei Better Paste',
        intro: [
            'Kopiere Bilder aus Safari direkt in deinen Tresor, füge Links ohne Tracking-Parameter ein, repariere umbrochene Terminalausgaben und räume KI-Text auf. Einfach einfügen, den Rest erledigt Better Paste.',
            'Ein Tipp vorab: Lege **Ohne Verarbeitung einfügen** auf `Cmd+Shift+V` (`Ctrl+Shift+V` unter Windows). So kannst du jederzeit genau das einfügen, was in der Zwischenablage liegt.',
            'Jede Regel hat ihren eigenen Schalter unter Einstellungen, Better Paste, und mit der Eigenschaft `{property}: false` schaltest du das Plugin für eine einzelne Notiz ab.'
        ],
        startButton: 'Los geht’s'
    },

    overlap: {
        title: 'Better Paste: Plugins mit ähnlicher Funktion',
        thanks: 'Danke, dass du Better Paste installiert hast und nutzt!',
        intro: {
            one: 'Du hast aktuell {count} Plugin installiert, das mehr oder weniger dasselbe tut, also deaktiviere oder deinstalliere Folgendes:',
            other: 'Du hast aktuell {count} Plugins installiert, die mehr oder weniger dasselbe tun, also deaktiviere oder deinstalliere Folgendes:'
        },
        outro: 'Deaktivieren unter Einstellungen > Externe Erweiterungen.',
        dontRemind: 'Nicht mehr anzeigen',
        button: 'Verstanden'
    },

    whatsNew: {
        title: 'Neu in Better Paste',
        scrollLabel: 'Versionshinweise',
        releaseHeading: 'Version {version} ({date})',
        categoryNew: 'Neu',
        categoryImproved: 'Verbessert',
        categoryChanged: 'Geändert',
        categoryFixed: 'Behoben',
        support: 'Wenn dir Better Paste nützlich ist, unterstütze bitte seine Entwicklung.',
        coffeeButton: '☕️ Spendier mir einen Kaffee',
        thanksButton: 'Danke!'
    }
};
