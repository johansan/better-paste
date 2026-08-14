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

/** Dutch. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_NL: TranslationStrings = {
    commands: {
        paste: 'Plakken',
        pasteRaw: 'Plakken zonder bewerking',
        cleanSelection: 'Selectie opschonen',
        toggleCleanup: 'Automatisch opschonen aan- of uitzetten'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        separator: ', ',
        cleanupOn: 'automatische bewerking aan',
        cleanupOff: 'automatische bewerking uit',
        selectTextFirst: 'selecteer eerst tekst',
        nothingToClean: 'niets op te schonen',
        clipboardFailed: 'kon het klembord niet lezen',
        titleFailed: 'kon de titel niet ophalen.',
        fetchingTitle: 'titel ophalen{dots}',
        imagesFailed: {
            one: '{count} afbeelding kon niet worden opgeslagen',
            other: '{count} afbeeldingen konden niet worden opgeslagen'
        },
        imagesFailedLinkKept: '{images}, de oorspronkelijke link is behouden',
        imagesFailedNothingPasted: '{images}, dus er is niets geplakt',
        aiTextCleaned: 'AI-tekst opgeschoond',
        terminalCleaned: 'terminaluitvoer opgeschoond',
        textProcessed: 'tekststijl aangepast',
        urlsCleaned: { one: '{count} URL opgeschoond', other: '{count} URL’s opgeschoond' },
        imagesSaved: { one: '{count} afbeelding opgeslagen', other: '{count} afbeeldingen opgeslagen' }
    },

    settings: {
        exampleFallback: '{description} Voorbeeld: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Nieuw in Better Paste {version}',
            whatsNewDesc: 'Wat er in de meest recente versies is veranderd.',
            whatsNewAliases: ['releaseopmerkingen', 'wijzigingen', 'changelog', 'versie', 'update', 'geschiedenis'],
            whatsNewButton: 'Bekijk wat er nieuw is',
            supportName: 'Ontwikkeling steunen',
            supportDesc: 'Als Better Paste je van pas komt, overweeg dan de ontwikkeling te steunen.',
            supportAliases: ['sponsor', 'doneren', 'koffie', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Trakteer me op koffie'
        },

        behavior: {
            heading: 'Gedrag',
            autoCleanName: 'Elke plakactie opschonen',
            autoCleanDesc:
                'Past de regels toe bij elke plakactie. Staat dit uit, dan werken de regels alleen via de Better Paste-opdrachten. Een losse notitie kan zichzelf uitsluiten met de eigenschap "better-paste: false".',
            autoCleanAliases: ['automatisch', 'inschakelen', 'uitschakelen', 'notitie', 'uitsluiten', 'eigenschap', 'frontmatter'],
            showNoticesName: 'Melding tonen wanneer een plakactie is aangepast',
            showNoticesDesc: 'Een samenvatting van één regel van wat er is veranderd. Fouten worden altijd gemeld.',
            showNoticesAliases: ['melding', 'samenvatting', 'bericht', 'notificatie', 'stil']
        },

        images: {
            heading: 'Afbeeldingen',
            savingName: 'Geplakte afbeeldingen in de kluis opslaan',
            savingDesc:
                'Slaat geplakte afbeeldingen op in je bijlagemap en linkt naar het lokale bestand in plaats van naar het webadres. Geldt voor "Afbeelding kopiëren" in Safari, afbeeldingen in gekopieerde webinhoud en geplakte afbeeldingsadressen. Standaard komt de bestandsnaam uit het adres:',
            savingAliases: [
                'downloaden',
                'bijlage',
                'safari',
                'schermafbeelding',
                'afbeelding',
                'map',
                'bestandsnaam',
                'breedte',
                'grootte'
            ],
            pageName: 'Afbeeldingen verwerken',
            pageDesc: 'Bestandsnamen en afbeeldingsbreedte.',
            nameFormatName: 'Bestandsnamen',
            nameFormatDesc: 'Hoe opgeslagen afbeeldingen worden genoemd.',
            nameFormatSource: 'Naam uit de bron',
            nameFormatCustom: 'Eigen indeling',
            customName: 'Eigen indeling',
            customDesc: 'Gebruik {{name}} voor de bronnaam en Moment-datumnotaties zoals YYYY-MM-DD.',
            customMomentLink: 'Moment-notatie',
            customExample: 'Voorbeeld: {value}',
            customAliases: ['naam', 'bestandsnaam', 'datum', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Eigenschap voor afbeeldingsbreedte',
            sizePropertyDesc:
                'Frontmatter-eigenschap die de breedte bepaalt van afbeeldingen die in een notitie worden geplakt. Met "image-width: 400" in de notitie wordt een geplakte afbeelding ![[photo.png|400]]. Laat leeg om geen breedte toe te voegen.',
            sizePropertyAliases: ['grootte', 'frontmatter', 'eigenschap', 'schalen']
        },

        links: {
            heading: 'Links',
            titlesName: 'Titels ophalen voor geplakte links',
            titlesDesc:
                'Een webadres los plakken levert een Markdown-link met de paginatitel op. Is er tekst geselecteerd, dan wordt die tekst het label en wordt er geen titel opgehaald. Lukt het ophalen niet, dan blijft het adres zelf staan.',
            titlesAliases: ['titel', 'pagina', 'website', 'markdown-link', 'downloaden'],
            cleaningName: 'Geplakte links opschonen',
            cleaningDesc: 'Verwijdert trackingparameters uit geplakte links:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domein', 'youtube', 'uitzondering'],
            stripName: 'Welke parameters worden verwijderd',
            stripDesc: 'Trackingparameters zijn namen als utm_source, fbclid en gclid.',
            stripAliases: ['utm', 'tracking', 'query', 'parameters'],
            stripAll: 'Elke parameter, tenzij een siteregel die behoudt',
            stripTracking: 'Alleen bekende trackingparameters',
            rulesName: 'Siteregels',
            rulesDesc: 'Parameters die op bepaalde sites blijven staan.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Je eigen siteregels',
            listDesc:
                '{sites} worden al door de plugin gedekt. Voeg hier je eigen regels toe, één per regel. "example.com" behoudt elke parameter op die site, "example.com: a, b" behoudt alleen die twee, en "!example.com" verwijdert een regel die met de plugin meekomt. Subdomeinen worden automatisch herkend.',
            listShippedCount: { one: '{count} veelgebruikte site', other: '{count} veelgebruikte sites' },
            listAliases: ['domein', 'uitzondering', 'whitelist', 'youtube'],
            listInvalid: 'Geen sitenaam: {values}',
            testerName: 'Probeer het',
            testerDesc: 'Plak een link om te zien wat de regels behouden.',
            testerLabel: 'Op te schonen link',
            testerEmpty: 'De opgeschoonde link verschijnt hier.'
        },

        terminal: {
            heading: 'Terminaltekst',
            cleanupName: 'Terminaluitvoer opschonen',
            cleanupDesc:
                'Voegt regels die de terminal heeft afgebroken weer samen en verwijdert kleurcodes en inspringing aan het begin. Codeblokken, tabellen en lijsten blijven ongemoeid.',
            cleanupAliases: ['terugloop', 'samenvoegen', 'ansi', 'console', 'shell', 'inspringing', 'opsomming', 'lijst', 'markdown'],
            pageName: 'Terminaltekst verwerken',
            pageDesc: 'Regels samenvoegen en opsommingstekens.',
            rejoinName: 'Wanneer een afgebroken regel wordt samengevoegd',
            rejoinDesc: 'Een regel wordt alleen aan de regel erboven vastgemaakt als die vol lijkt.',
            rejoinAliases: ['inspringing', 'terugloop', 'agressief', 'veilig', 'git log'],
            rejoinIndented: 'Alleen als de regel is ingesprongen',
            rejoinAny: 'Of de regel is ingesprongen of niet',
            rejoinNever: 'Nooit, alleen codes en inspringing verwijderen',
            bulletsName: 'Opsommingstekens',
            bulletsDesc: 'Wat er met opsommingstekens zoals • in terminaluitvoer gebeurt.',
            bulletsAliases: ['lijst', 'markdown', 'streepje'],
            bulletsMarkdown: 'Omzetten naar Markdown-lijstitems',
            bulletsPreserve: 'Laten zoals ze zijn',
            testerName: 'Probeer het',
            testerDesc: 'Plak terminaluitvoer om te zien hoe die wordt opgeschoond.',
            testerLabel: 'Op te schonen terminaltekst',
            testerEmpty: 'De opgeschoonde tekst verschijnt hier.',
            testerSample: [
                '• De extra stap blijft beperkt tot de Enter-afhandeling van de lijst, dus de kernwijziging is overzichtelijk. Bij het doorlopen van naburige stromen vond ik',
                '  twee waarschijnlijke knelpunten die controle verdienen: de selectie kan verspringen na het verversen.'
            ]
        },

        text: {
            heading: 'Tekstverwerking',
            trimName: 'Witruimte eromheen weghalen',
            trimDesc: 'Verwijdert lege regels en spaties aan het begin en einde van geplakte tekst.',
            trimAliases: ['witruimte', 'lege regel', 'spatie', 'nieuwe regel', 'inkorten'],
            commasName: 'Komma’s en aanhalingstekens',
            commasDesc: 'Waar een komma komt naast een sluitend dubbel aanhalingsteken.',
            commasAliases: ['komma', 'aanhalingsteken', 'citaat', 'interpunctie', 'stijl'],
            commasNone: 'Geen wijziging',
            commasInside: 'Komma binnen de aanhalingstekens',
            commasOutside: 'Komma buiten de aanhalingstekens',
            commasExampleSource: 'Hij noemde het "af," daarna vertrok hij.',
            commasExampleOutside: 'Hij noemde het "af", daarna vertrok hij.',
            invisibleName: 'AI-opschoning: onzichtbare tekens',
            invisibleDesc: 'Verwijdert spaties met breedte nul en maakt van vaste spaties gewone spaties.',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'streepje',
                'kastlijntje',
                'gedachtestreepje',
                'unicode',
                'onzichtbaar',
                'nbsp',
                'typografie',
                'interpunctie',
                'witruimte'
            ],
            invisibleExampleStart: 'Het',
            invisibleExampleMiddle: 'resultaat',
            invisibleExampleEnd: ' was goed.',
            invisibleExampleAfter: 'Het resultaat was goed.',
            punctuationName: 'AI-opschoning: streepjes en aanhalingstekens',
            punctuationDesc: 'Zet lange streepjes om in koppeltekens en gekrulde aanhalingstekens in rechte.',
            punctuationAliases: [
                'kastlijntje',
                'gedachtestreepje',
                'koppelteken',
                'aanhalingsteken',
                'gekrulde aanhalingstekens',
                'apostrof',
                'interpunctie',
                'typografie'
            ],
            punctuationExampleBefore: '“Het resultaat — tegen alle verwachting in — was perfect.”',
            punctuationExampleAfter: '"Het resultaat - tegen alle verwachting in - was perfect."'
        }
    },

    welcome: {
        title: 'Welkom bij Better Paste',
        intro: [
            'Better Paste past klembordinhoud aan terwijl die in een notitie wordt geplakt.',
            'Het slaat gelinkte afbeeldingen als bijlagen in de kluis op, verwijdert trackingparameters uit links, voegt afgebroken regels in terminaluitvoer weer samen en vervangt gekrulde aanhalingstekens en onzichtbare tekens door gewone equivalenten.',
            'Elke regel kan afzonderlijk worden uitgezet.',
            'Een losse notitie kan zichzelf volledig uitsluiten met de eigenschap "better-paste: false". De instellingen staan onder Instellingen, Better Paste.'
        ],
        startButton: 'Aan de slag'
    },

    whatsNew: {
        title: 'Nieuw in Better Paste',
        scrollLabel: 'Releaseopmerkingen',
        releaseHeading: 'Versie {version} ({date})',
        categoryNew: 'Nieuw',
        categoryImproved: 'Verbeterd',
        categoryChanged: 'Gewijzigd',
        categoryFixed: 'Opgelost',
        support: 'Als Better Paste je van pas komt, overweeg dan de ontwikkeling te steunen.',
        coffeeButton: '☕️ Trakteer me op koffie',
        thanksButton: 'Bedankt!'
    }
};
