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
        toggleCleanup: 'Automatische Bereinigung umschalten'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'automatische Verarbeitung an',
        cleanupOff: 'automatische Verarbeitung aus',
        selectTextFirst: 'zuerst Text auswählen',
        nothingToClean: 'nichts zu bereinigen',
        clipboardFailed: 'Zwischenablage konnte nicht gelesen werden',
        titleFailed: 'Titel konnte nicht abgerufen werden.',
        fetchingTitle: 'Titel wird abgerufen{dots}',
        imagesFailed: {
            one: '{count} Bild konnte nicht gespeichert werden',
            other: '{count} Bilder konnten nicht gespeichert werden'
        },
        imagesFailedLinkKept: '{images}, der ursprüngliche Link wurde behalten',
        imagesFailedNothingPasted: '{images}, daher wurde nichts eingefügt',
        aiTextCleaned: 'KI-Text bereinigt',
        terminalCleaned: 'Terminalausgabe bereinigt',
        textProcessed: 'Textstil angepasst',
        urlsCleaned: { one: '{count} URL bereinigt', other: '{count} URLs bereinigt' },
        imagesSaved: { one: '{count} Bild gespeichert', other: '{count} Bilder gespeichert' }
    },

    settings: {
        exampleFallback: '{description} Beispiel: {example}',
        plainFallback: '{description} {example}',

        start: {
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
            pixelPerfectImageDesc: 'Exakte Bildgrößen und vieles mehr'
        },

        behavior: {
            heading: 'Verhalten',
            autoCleanName: 'Jeden Einfügevorgang bereinigen',
            autoCleanDesc:
                'Wendet die Regeln bei jedem Einfügen an. Ist dies aus, greifen die Regeln nur über die Better-Paste-Befehle. Eine einzelne Notiz kann sich mit der Eigenschaft "bp: false" ausnehmen oder mit "bp: true" einbeziehen.',
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
            showNoticesName: 'Hinweis anzeigen, wenn ein Einfügevorgang geändert wurde',
            showNoticesDesc: 'Eine einzeilige Zusammenfassung der Änderungen. Fehler werden immer gemeldet.',
            showNoticesAliases: ['hinweis', 'zusammenfassung', 'meldung', 'benachrichtigung', 'still']
        },

        images: {
            heading: 'Bilder',
            savingName: 'Eingefügte Bilder im Tresor speichern',
            savingDesc:
                'Speichert eingefügte Bilder im Anhangordner und verlinkt die lokale Datei statt der Webadresse. Gilt für "Bild kopieren" in Safari, Bilder in kopierten Webinhalten und eingefügte Bildadressen. Standardmäßig stammt der Dateiname aus der Adresse:',
            savingAliases: ['herunterladen', 'anhang', 'safari', 'bildschirmfoto', 'bild', 'ordner', 'dateiname', 'breite', 'größe'],
            pageName: 'Bildbehandlung',
            pageDesc: 'Dateinamen und Bildbreite.',
            nameFormatName: 'Dateinamen',
            nameFormatDesc: 'Wie gespeicherte Bilder benannt werden.',
            nameFormatSource: 'Name aus der Quelle',
            nameFormatCustom: 'Eigenes Format',
            customName: 'Eigenes Format',
            customDesc: 'Verwende {{name}} für den Quellnamen und Moment-Datumsformate wie YYYY-MM-DD.',
            customMomentLink: 'Moment-Format',
            customExample: 'Beispiel: {value}',
            customAliases: ['name', 'dateiname', 'datum', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Eigenschaft für Bildbreite',
            sizePropertyDesc:
                'Frontmatter-Eigenschaft, die die Breite der in eine Notiz eingefügten Bilder festlegt. Mit "bp-image-width: 400" in der Notiz wird ein eingefügtes Bild zu ![[photo.png|400]]. Leer lassen, um keine Breite zu setzen.',
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
            stripName: 'Welche Parameter entfernt werden',
            stripDesc: 'Tracking-Parameter sind Namen wie utm_source, fbclid und gclid.',
            stripAliases: ['utm', 'tracking', 'abfrage', 'parameter'],
            stripAll: 'Jeder Parameter, sofern keine Seitenregel ihn behält',
            stripTracking: 'Nur bekannte Tracking-Parameter',
            rulesName: 'Seitenregeln',
            rulesDesc: 'Parameter, die auf bestimmten Seiten behalten werden.',
            rulesCount: { one: '{count} Seite', other: '{count} Seiten' },
            listName: 'Deine Seitenregeln',
            listDesc:
                '{sites} werden bereits vom Plugin abgedeckt. Ergänze hier eigene Regeln, eine pro Zeile. "example.com" behält jeden Parameter dieser Seite, "example.com: a, b" behält nur diese beiden, und "!example.com" entfernt eine Regel, die mit dem Plugin ausgeliefert wird. Subdomains werden automatisch berücksichtigt.',
            listShippedCount: { one: '{count} verbreitete Seite', other: '{count} verbreitete Seiten' },
            listAliases: ['domain', 'ausnahme', 'whitelist', 'youtube'],
            listInvalid: 'Kein Seitenname: {values}',
            testerName: 'Ausprobieren',
            testerDesc: 'Füge einen Link ein, um zu sehen, was die Regeln behalten.',
            testerLabel: 'Zu bereinigender Link',
            testerEmpty: 'Der bereinigte Link erscheint hier.'
        },

        terminal: {
            heading: 'Terminaltext',
            cleanupName: 'Terminalausgabe bereinigen',
            cleanupDesc:
                'Fügt vom Terminal umbrochene Zeilen wieder zusammen und entfernt Farbcodes und führende Einrückungen. Codeblöcke, Tabellen und Listen bleiben unberührt.',
            cleanupAliases: ['umbruch', 'zusammenfügen', 'ansi', 'konsole', 'shell', 'einrückung', 'aufzählung', 'liste', 'markdown'],
            pageName: 'Behandlung von Terminaltext',
            pageDesc: 'Zeilen zusammenfügen und Aufzählungszeichen.',
            rejoinName: 'Wann eine umbrochene Zeile zusammengefügt wird',
            rejoinDesc: 'Eine Zeile wird nur an die darüber angefügt, wenn diese voll wirkt.',
            rejoinAliases: ['einrückung', 'umbruch', 'aggressiv', 'sicher', 'git log'],
            rejoinIndented: 'Nur wenn die Zeile eingerückt ist',
            rejoinAny: 'Ob die Zeile eingerückt ist oder nicht',
            rejoinNever: 'Nie, nur Codes und Einrückungen entfernen',
            bulletsName: 'Aufzählungszeichen',
            bulletsDesc: 'Was mit Aufzählungszeichen wie • in Terminalausgaben passiert.',
            bulletsAliases: ['liste', 'markdown', 'strich'],
            bulletsMarkdown: 'In Markdown-Listeneinträge umwandeln',
            bulletsPreserve: 'Unverändert lassen',
            testerName: 'Ausprobieren',
            testerDesc: 'Füge Terminalausgabe ein, um zu sehen, wie sie bereinigt wird.',
            testerLabel: 'Zu bereinigender Terminaltext',
            testerEmpty: 'Der bereinigte Text erscheint hier.',
            testerSample: [
                '• Der zusätzliche Schritt betrifft nur den Enter-Handler der Liste, daher bleibt die eigentliche Änderung überschaubar. Beim Durchsehen benachbarter Abläufe fand ich',
                '  zwei mögliche Reibungspunkte, die eine Prüfung verdienen: die Auswahl kann nach dem Neuaufbau springen.'
            ]
        },

        text: {
            heading: 'Textverarbeitung',
            trimName: 'Umgebende Leerzeichen entfernen',
            trimDesc: 'Entfernt leere Zeilen und Leerzeichen am Anfang und Ende des eingefügten Textes.',
            trimAliases: ['leerzeichen', 'leerzeile', 'zeilenumbruch', 'kürzen'],
            commasName: 'Kommas und Anführungszeichen',
            commasDesc: 'Wo ein Komma neben einem schließenden Anführungszeichen steht.',
            commasAliases: ['komma', 'anführungszeichen', 'zitat', 'zeichensetzung', 'stil'],
            commasNone: 'Keine Änderung',
            commasInside: 'Komma innerhalb der Anführungszeichen',
            commasOutside: 'Komma außerhalb der Anführungszeichen',
            commasExampleSource: 'Er nannte es "fertig," dann ging er.',
            commasExampleOutside: 'Er nannte es "fertig", dann ging er.',
            invisibleName: 'KI-Bereinigung: unsichtbare Zeichen',
            invisibleDesc: 'Entfernt Zeichen der Breite null und wandelt geschützte Leerzeichen in normale Leerzeichen um.',
            invisibleAliases: [
                'ki',
                'chatgpt',
                'claude',
                'llm',
                'strich',
                'geviertstrich',
                'halbgeviertstrich',
                'bindestrich',
                'unicode',
                'unsichtbar',
                'nbsp',
                'typografie',
                'zeichensetzung',
                'leerzeichen'
            ],
            invisibleExampleStart: 'Das',
            invisibleExampleMiddle: 'Ergebnis',
            invisibleExampleEnd: ' war gut.',
            invisibleExampleAfter: 'Das Ergebnis war gut.',
            punctuationName: 'KI-Bereinigung: Striche und Anführungszeichen',
            punctuationDesc: 'Wandelt lange Striche in Bindestriche und typografische Anführungszeichen in gerade um.',
            punctuationAliases: [
                'geviertstrich',
                'halbgeviertstrich',
                'bindestrich',
                'anführungszeichen',
                'typografische anführungszeichen',
                'apostroph',
                'zeichensetzung',
                'typografie'
            ],
            punctuationExampleBefore: '„Das Ergebnis — allen Widerständen zum Trotz — war perfekt.“',
            punctuationExampleAfter: '"Das Ergebnis - allen Widerständen zum Trotz - war perfekt."'
        }
    },

    welcome: {
        title: 'Willkommen bei Better Paste',
        intro: [
            'Better Paste verändert Inhalte der Zwischenablage, während sie in eine Notiz eingefügt werden.',
            'Es speichert verlinkte Bilder als Anhänge im Tresor, entfernt Tracking-Parameter aus Links, fügt umbrochene Zeilen in Terminalausgaben wieder zusammen und ersetzt typografische Anführungszeichen und unsichtbare Zeichen durch einfache Entsprechungen.',
            'Jede Regel lässt sich einzeln abschalten.',
            'Eine einzelne Notiz kann sich mit der Eigenschaft "bp: false" vollständig ausnehmen. Die Einstellungen findest du unter Einstellungen, Better Paste.'
        ],
        startButton: 'Los geht’s'
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
