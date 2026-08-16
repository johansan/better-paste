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
        cleanTerminal: 'Terminaluitvoer opschonen',
        commasInside: 'Komma’s binnen de aanhalingstekens zetten',
        commasOutside: 'Komma’s buiten de aanhalingstekens zetten',
        toggleCleanup: 'Automatisch opschonen aan- of uitzetten'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'automatische bewerking aan',
        cleanupOff: 'automatische bewerking uit',
        selectTextFirst: 'selecteer eerst tekst',
        nothingToClean: 'niets op te schonen',
        clipboardFailed: 'kon het klembord niet lezen',
        titleFailed: 'kon de titel niet ophalen.',
        fetchingTitle: 'titel ophalen...',
        imagesFailed: {
            one: '{count} afbeelding kon niet worden opgeslagen',
            other: '{count} afbeeldingen konden niet worden opgeslagen'
        },
        imagesFailedLinkKept: '{images}, de oorspronkelijke link is behouden',
        imagesFailedNothingPasted: '{images}, dus er is niets geplakt'
    },

    settings: {
        exampleFallback: '{description} Voorbeeld: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Over',
            whatsNewName: 'Nieuw in Better Paste {version}',
            whatsNewDesc: 'Wat er in de meest recente versies is veranderd.',
            whatsNewAliases: ['releaseopmerkingen', 'wijzigingen', 'changelog', 'versie', 'update', 'geschiedenis'],
            whatsNewButton: 'Bekijk wat er nieuw is',
            supportName: 'Ontwikkeling steunen',
            supportDesc: 'Als Better Paste je van pas komt, overweeg dan de ontwikkeling te steunen.',
            supportAliases: ['sponsor', 'doneren', 'koffie', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Trakteer me op koffie',
            pluginsName: 'Bekijk mijn andere plugins',
            pluginsAliases: ['plugins', 'notebook navigator', 'pixel perfect image', 'auteur', 'meer'],
            notebookNavigatorDesc: 'Een betere bestandsverkenner en agenda',
            pixelPerfectImageDesc: 'Exact afbeeldingen schalen en meer'
        },

        behavior: {
            autoCleanName: 'Elke plakactie opschonen',
            autoCleanDesc:
                'Past de regels toe bij elke plakactie. Staat dit uit, dan werken de regels alleen via de Better Paste-opdrachten. Een losse notitie kan zichzelf uitsluiten met de eigenschap "{property}: false" of zich altijd laten opschonen met "{property}: true".',
            autoCleanAliases: ['automatisch', 'inschakelen', 'uitschakelen', 'notitie', 'uitsluiten', 'eigenschap', 'frontmatter'],
            notePropertyName: 'Notitie-eigenschap',
            notePropertyDesc: 'Eigenschap die Better Paste voor één notitie in- of uitschakelt.',
            notePropertyAliases: ['notitie', 'eigenschap', 'frontmatter', 'uitsluiten', 'uitschakelen', 'inschakelen', 'bp']
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
            sizeChoiceName: 'Grootte toepassen bij plakken',
            sizeChoiceDesc:
                'Geeft elke opgeslagen afbeelding bij het insluiten een breedte mee, zoals ![[photo.jpg|400]]. De breedte-eigenschap van een notitie heeft voorrang.',
            sizeChoiceAliases: ['grootte', 'breedte', 'afbeeldingsgrootte', 'schalen', 'embed', '400'],
            sizeOptionsName: 'Grootteopties',
            sizeOptionsDesc: 'De breedtes die hierboven en in het plakvenster worden aangeboden, gescheiden door komma’s.',
            classChoiceName: 'CSS-klasse toepassen bij plakken',
            classChoiceDesc:
                'Geeft elke opgeslagen afbeelding bij het insluiten een klasse mee, zoals ![[photo.jpg#invert]]. Thema’s en CSS-snippets bepalen wat een klasse doet.',
            classChoiceAliases: ['css', 'klasse', 'snippet', 'invert', 'thema', 'filter', 'embed'],
            classOptionsName: 'Klassenopties',
            classOptionsDesc: 'De klassen die hierboven en in het plakvenster worden aangeboden, gescheiden door komma’s.',
            choiceNone: 'Niets doen',
            choiceAsk: 'Bij elke plakactie vragen',
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
                'Frontmatter-eigenschap die de breedte bepaalt van afbeeldingen die in een notitie worden geplakt. Met "{property}: 400" in de notitie wordt een geplakte afbeelding ![[photo.png|400]]. Laat leeg om geen breedte toe te voegen.',
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

        text: {
            heading: 'Tekstverwerking',
            trimName: 'Witruimte eromheen weghalen',
            trimDesc: 'Verwijdert lege regels en spaties aan het begin en einde van geplakte tekst.',
            trimAliases: ['witruimte', 'lege regel', 'spatie', 'nieuwe regel', 'inkorten'],
            invisibleName: 'Onzichtbare tekens',
            invisibleDesc: 'Verwijdert spaties met breedte nul en maakt van vaste spaties gewone spaties.',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', 'onzichtbaar', 'nbsp', 'witruimte'],
            invisibleExampleStart: 'Het',
            invisibleExampleMiddle: 'resultaat',
            invisibleExampleEnd: ' was goed.',
            invisibleExampleAfter: 'Het resultaat was goed.',
            quotesName: 'Aanhalingstekens',
            quotesDesc: 'Zet gekrulde aanhalingstekens en apostrofs om in rechte.',
            quotesAliases: [
                'aanhalingsteken',
                'gekrulde aanhalingstekens',
                'slimme aanhalingstekens',
                'rechte aanhalingstekens',
                'apostrof',
                'interpunctie',
                'typografie',
                'ai'
            ],
            quotesExample: '“Goed”, zei ze.',
            dashesName: 'Gedachtestreepjes',
            dashesDesc: 'Zet halve en hele kastlijntjes om in koppeltekens.',
            dashesAliases: ['streepje', 'kastlijntje', 'gedachtestreepje', 'koppelteken', 'interpunctie', 'typografie', 'ai'],
            dashesExample: 'Het resultaat — tegen alle verwachtingen in — was goed.'
        }
    },

    imageModal: {
        title: 'Afbeeldingsopties',
        sizeName: 'Grootte',
        className: 'CSS-klasse',
        none: 'Niets doen',
        apply: 'Toepassen',
        cancel: 'Annuleren'
    },

    welcome: {
        title: 'Welkom bij Better Paste',
        intro: [
            'Kopieer afbeeldingen uit Safari rechtstreeks naar je kluis, plak links zonder trackingparameters, herstel afgebroken terminalregels en ruim AI-tekst op. Gewoon plakken, Better Paste doet de rest.',
            'Eén tip vooraf: wijs **Plakken zonder bewerking** toe aan `Cmd+Shift+V` (`Ctrl+Shift+V` op Windows), zodat je altijd precies kunt plakken wat er op het klembord staat.',
            'Elke regel heeft zijn eigen schakelaar onder Instellingen, Better Paste, en met de eigenschap `{property}: false` zet je de plugin voor die notitie uit.'
        ],
        startButton: 'Aan de slag'
    },

    overlap: {
        title: 'Better Paste: overlappende plugins',
        thanks: 'Bedankt dat je Better Paste hebt geïnstalleerd en gebruikt!',
        intro: {
            one: 'Je hebt nu {count} plugin geïnstalleerd die min of meer hetzelfde doet, dus schakel de volgende plugin uit of verwijder die:',
            other: 'Je hebt nu {count} plugins geïnstalleerd die min of meer hetzelfde doen, dus schakel de volgende plugins uit of verwijder ze:'
        },
        outro: 'Uitschakelen kan onder Instellingen > Community-plugins.',
        dontRemind: 'Niet meer tonen',
        button: 'Begrepen'
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
