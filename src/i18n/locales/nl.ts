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
        imagesFailedNothingPasted: '{images}, dus er is niets geplakt. Het klembord bevat het nog steeds.',
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
            supportDesc: 'Als Better Paste je van pas komt, overweeg dan de verdere ontwikkeling te steunen.',
            supportAliases: ['sponsor', 'doneren', 'koffie', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Trakteer me op koffie'
        },

        behavior: {
            heading: 'Gedrag',
            autoCleanName: 'Elke plakactie opschonen',
            autoCleanDesc:
                'Past de regels toe bij elke plakactie. Zet dit uit om alleen de opdrachten te gebruiken. Een losse notitie kan zichzelf uitsluiten met de eigenschap "better-paste: false".',
            autoCleanAliases: ['automatisch', 'inschakelen', 'uitschakelen', 'notitie', 'uitsluiten', 'eigenschap', 'frontmatter'],
            showNoticesName: 'Melding tonen wanneer een plakactie is aangepast',
            showNoticesDesc: 'Een samenvatting van één regel van wat er is opgeschoond. Fouten worden altijd gemeld, wat hier ook staat.',
            showNoticesAliases: ['melding', 'samenvatting', 'bericht', 'notificatie', 'stil']
        },

        images: {
            heading: 'Afbeeldingen',
            savingName: 'Geplakte afbeeldingen in de kluis opslaan',
            savingDesc:
                'Slaat geplakte afbeeldingen op als lokale bestanden in plaats van externe afbeeldingslinks te laten staan. Dit geldt voor "Afbeelding kopiëren" in Safari, afbeeldingen in gekopieerde webinhoud en losse afbeeldingsadressen. Afbeeldingen komen in de bijlagemap van je kluis. Met "Naam uit de bron":',
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
            pageDesc: 'Bestandsnamen en afbeeldingsbreedte per notitie.',
            nameFormatName: 'Bestandsnamen',
            nameFormatDesc: 'Kies hoe opgeslagen afbeeldingsbestanden worden genoemd.',
            nameFormatSource: 'Naam uit de bron',
            nameFormatCustom: 'Eigen indeling',
            customName: 'Eigen indeling',
            customDesc: 'Gebruik {{name}} voor de bronnaam en Moment-datumnotaties zoals YYYY-MM-DD.',
            customMomentLink: 'Moment-notatie',
            customExample: 'Voorbeeld: {value}',
            customAliases: ['naam', 'bestandsnaam', 'datum', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Eigenschap voor afbeeldingsbreedte',
            sizePropertyDesc:
                'De frontmatter-eigenschap die de breedte bepaalt van afbeeldingen die in een notitie worden geplakt. Een notitie met deze eigenschap neemt het plakken van schermafbeeldingen over van Obsidian. Laat leeg om dit uit te schakelen.',
            sizePropertyAliases: ['grootte', 'frontmatter', 'eigenschap', 'schalen']
        },

        links: {
            heading: 'Links',
            titlesName: 'Titels ophalen voor geplakte links',
            titlesDesc:
                'Als het klembord alleen een webadres bevat dat geen afbeelding is, wordt de paginatitel opgehaald en een Markdown-link geplakt. Andere geselecteerde tekst wordt het label zonder dat er een verzoek wordt gedaan. Lukt het ophalen niet, dan blijft het oorspronkelijke adres staan.',
            titlesAliases: ['titel', 'pagina', 'website', 'markdown-link', 'downloaden'],
            cleaningName: 'Geplakte links opschonen',
            cleaningDesc: 'Verwijdert trackingparameters uit geplakte links. Het doorgehaalde deel wordt verwijderd:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domein', 'youtube', 'uitzondering'],
            stripName: 'Welke parameters worden verwijderd',
            stripDesc:
                'Kies of elke queryparameter wordt verwijderd of alleen bekende trackingparameters. Siteregels kunnen in beide standen parameters behouden.',
            stripAliases: ['utm', 'tracking', 'query', 'parameters'],
            stripAll: 'Elke parameter, behalve waar een siteregel die behoudt',
            stripTracking: 'Alleen bekende trackingparameters',
            rulesName: 'Regels om parameters te behouden',
            rulesDesc: 'Siteregels om bepaalde queryparameters in beide standen te behouden.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Je eigen siteregels',
            listDesc:
                '{sites} zijn al geregeld en blijven met de plugin actueel. Voeg hier je eigen siteregels toe, één per regel. "example.com" behoudt elke parameter op die site, "example.com: a, b" behoudt alleen die twee, en "!example.com" laat een regel vervallen die met de plugin meekomt. In de stand "Alleen bekende trackingparameters" redt een regel alleen bijpassende trackingparameters, omdat andere parameters toch al blijven staan. Subdomeinen worden automatisch herkend.',
            listShippedCount: { one: '{count} veelgebruikte site', other: '{count} veelgebruikte sites' },
            listAliases: ['domein', 'uitzondering', 'whitelist', 'youtube'],
            listInvalid: 'Geen sitenaam: {values}',
            testerName: 'Probeer het',
            testerDesc: 'Plak een link om te zien wat deze regels zouden behouden.',
            testerLabel: 'Op te schonen link',
            testerEmpty: 'De opgeschoonde link verschijnt hier.'
        },

        terminal: {
            heading: 'Terminaltekst',
            cleanupName: 'Terminaluitvoer opschonen',
            cleanupDesc:
                'Voegt afgebroken regels in terminaluitvoer weer samen en haalt de inspringing weg. Kleurcodes worden verwijderd. Codeblokken, tabellen en lijstitems blijven ongemoeid.',
            cleanupAliases: ['terugloop', 'samenvoegen', 'ansi', 'console', 'shell', 'inspringing', 'opsomming', 'lijst', 'markdown'],
            pageName: 'Terminaltekst verwerken',
            pageDesc: 'Voorwaarden voor samenvoegen en opsommingstekens.',
            rejoinName: 'Wanneer een afgebroken regel wordt samengevoegd',
            rejoinDesc: 'De voorwaarde waaronder een regel geldt als voortzetting van de vorige regel.',
            rejoinAliases: ['inspringing', 'terugloop', 'agressief', 'veilig', 'git log'],
            rejoinIndented: 'Alleen als de volgende regel is ingesprongen',
            rejoinAny: 'Zodra de regel erboven vol lijkt',
            rejoinNever: 'Nooit samenvoegen, alleen codes en inspringing verwijderen',
            bulletsName: 'Opsommingstekens',
            bulletsDesc:
                'Bepaalt of opsommingstekens (zoals •) in terminaluitvoer behouden blijven of worden omgezet naar Markdown-lijstitems.',
            bulletsAliases: ['lijst', 'markdown', 'streepje'],
            bulletsMarkdown: 'Omzetten naar Markdown-lijstitems',
            bulletsPreserve: 'Laten zoals ze zijn',
            testerName: 'Probeer het',
            testerDesc: 'Plak terminaluitvoer om te zien hoe die zou worden opgeschoond.',
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
            commasDesc: 'Kies waar een komma naast een sluitend dubbel aanhalingsteken komt te staan.',
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
