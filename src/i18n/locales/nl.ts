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
        cleanPdf: 'PDF-tekst opschonen',
        runSnippet: 'Snippet uitvoeren',
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
        fetchingTitles: 'titels ophalen...',
        titlesFailed: {
            one: 'kon {count} titel niet ophalen',
            other: 'kon {count} titels niet ophalen'
        },
        imagesFailed: {
            one: '{count} afbeelding kon niet worden opgeslagen',
            other: '{count} afbeeldingen konden niet worden opgeslagen'
        },
        imagesFailedLinkKept: '{images}, de oorspronkelijke link is behouden',
        imagesFailedNothingPasted: '{images}, dus er is niets geplakt',
        snippetsCopied: 'snippets gekopieerd',
        snippetsCopyFailed: 'snippets konden niet worden gekopieerd'
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
            showReleaseNotesName: 'Releasenotes tonen na een update',
            showReleaseNotesDesc: 'Opent na elke update één keer het dialoogvenster met wat er nieuw is.',
            showReleaseNotesAliases: ['release notes', 'nieuw', 'update', 'dialoogvenster', 'popup', 'melding'],
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
            heading: 'Bijlagen',
            fileModeName: 'Geplakte bestanden',
            fileModeDesc:
                'Kies wat er gebeurt wanneer je bestanden vanaf je apparaat plakt, zoals PDF\'s en schermafbeeldingen. "Niets doen" laat het plakken aan Obsidian over, inclusief de voorvertoning. "Linken zonder voorvertoning" verwijdert het uitroepteken.',
            fileModeChoiceOff: 'Niets doen',
            fileModeChoiceLink: 'Linken zonder voorvertoning',
            fileModeAliases: ['bestand', 'bijlage', 'voorvertoning', 'insluiten', 'link', 'pdf', 'schermafbeelding', 'uitroepteken'],
            savingName: 'Webafbeeldingen',
            savingDesc:
                'Kies wat er gebeurt wanneer je links naar afbeeldingen van het web plakt. "Niets doen" laat het geplakte zoals het is, "Linken met voorvertoning" toont de afbeelding rechtstreeks vanaf het web, en "Downloaden met voorvertoning" slaat een kopie op in je kluis.',
            savingDownloadDesc: 'Standaard komt de bestandsnaam uit het adres:',
            savingChoiceOff: 'Niets doen',
            savingChoiceLink: 'Linken met voorvertoning',
            savingChoiceDownload: 'Downloaden met voorvertoning',
            savingAliases: [
                'downloaden',
                'linken',
                'insluiten',
                'voorvertoning',
                'url',
                'web',
                'bijlage',
                'safari',
                'lokaal',
                'afbeelding',
                'map'
            ],
            sizeStyleName: 'Grootte en stijl',
            sizeStyleDesc: 'Geef geplakte afbeeldingen een breedte of een CSS-klasse mee, automatisch of via een keuzevenster.',
            sizeStyleAliases: ['grootte', 'breedte', 'css', 'klasse', 'stijl', 'schalen', 'invert'],
            summarySize: 'Grootte: {value}',
            summaryStyle: 'Stijl: {value}',
            summaryAsk: 'Vragen',
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
            customDesc:
                'Gebruik {{name}} voor de bronnaam, {{noteName}} voor de notitienaam, {{property:xyz}} voor een frontmatter-eigenschap, {{counter}} of {{counter:2}} voor een oplopend nummer en Moment-datumnotaties zoals YYYY-MM-DD.',
            customScreenshotDesc:
                'Een schermafbeelding heeft geen bronnaam, dus wordt {{name}} "Pasted image" met een tijdstempel, net als in Obsidian.',
            namingInfoTitle: 'Wanneer de bestandsnaamnotatie geldt',
            namingInfoLead: 'Belangrijk! Dit kan Better Paste niet:',
            namingInfoExplorer: 'Een bestand hernoemen dat je in de Finder of Verkenner kopieert en plakt',
            namingInfoDrag: 'Een bestand hernoemen dat je in een notitie sleept',
            namingInfoMobile: 'Verwerken wat je op mobiel met Obsidians eigen plakopdracht plakt. Gebruik in plaats daarvan "{command}".',
            customMomentLink: 'Moment-notatie',
            customExample: 'Voorbeeld: {value}',
            customExampleNote: 'Mijn notitie',
            customAliases: [
                'naam',
                'bestandsnaam',
                'datum',
                'moment',
                'YYYY',
                '{{name}}',
                'teller',
                'eigenschap',
                'notitienaam',
                'schermafbeelding',
                'hernoemen',
                'klembord',
                'paste image rename'
            ],
            sizePropertyName: 'Eigenschap voor afbeeldingsbreedte',
            sizePropertyDesc:
                'Frontmatter-eigenschap die de breedte bepaalt van afbeeldingen die in een notitie worden geplakt. Met "{property}: 400" in de notitie wordt een geplakte afbeelding ![[photo.png|400]]. Laat leeg om geen breedte toe te voegen.',
            sizePropertyAliases: ['grootte', 'frontmatter', 'eigenschap', 'schalen']
        },

        links: {
            heading: 'Links',
            titlesName: 'Titels ophalen voor geplakte links',
            titlesDesc:
                'Een webadres los plakken levert een Markdown-link met de paginatitel op. Een Obsidian-URL plakken levert een link met de naam van de notitie op. Is er tekst geselecteerd, dan wordt die tekst het label en wordt er geen titel opgehaald. Lukt het ophalen niet, dan blijft het adres zelf staan.',
            titlesAliases: ['titel', 'pagina', 'website', 'markdown-link', 'downloaden'],
            cleaningName: 'Geplakte links opschonen',
            cleaningDesc: 'Verwijdert trackingparameters uit geplakte links:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domein', 'youtube', 'uitzondering'],
            removalsName: 'Linkverwijderingen',
            removalsDesc: 'Extra parameters om overal of op specifieke sites te verwijderen.',
            rulesCount: { one: '{count} vermelding', other: '{count} vermeldingen' },
            builtInName: 'Ingebouwde verwijderingen',
            builtInDesc:
                'Bijgewerkt op {date}. Algemene trackingfilters: {trackingCount}. Sitespecifieke regels: {siteCount}. Cryptografisch ondertekende links blijven ongewijzigd.',
            builtInButton: 'Lijst bekijken',
            listName: 'Je verwijderingen',
            listDesc:
                'Verwijder een parameter uit gewone links op elke site door alleen de naam op een eigen regel in te voeren. "fbclid" verwijdert bijvoorbeeld de parameter fbclid overal waar deze voorkomt.\n\nVerwijder parameters alleen op één site met "example.com | source, ref". Dit verwijdert source en ref van example.com en zijn subdomeinen, terwijl alle andere parameters behouden blijven. Begin een regel met "!" om de ingebouwde verwijderingen voor die site uit te schakelen. Cryptografisch ondertekende links blijven altijd ongewijzigd.',
            listAliases: ['domein', 'parameter', 'filter', 'verwijderen', 'youtube'],
            listInvalid: 'Ongeldige verwijderingsregel: {values}',
            suggestName: 'Stel je verwijderingen voor',
            suggestDesc: 'Help de ingebouwde verwijderingen te verbeteren door parameters aan te dragen die verwijderd moeten worden.',
            suggestAliases: ['bijdragen', 'indienen', 'delen', 'verzenden', 'filter'],
            suggestButton: 'Controleer en verstuur',
            testerName: 'Probeer het',
            testerDesc: 'Plak een link om het opgeschoonde resultaat te zien.',
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
        },

        structure: {
            heading: 'Structuur',
            listNestingName: 'Geneste lijsten behouden bij plakken',
            listNestingDesc:
                'Plakt een gekopieerde lijst met de hiërarchie intact, ingesprongen op het niveau van het lijstitem waarop je plakt.',
            listNestingAliases: ['lijst', 'genest', 'inspringen', 'hiërarchie', 'structuur', 'opsomming', 'selectievakje', 'boom'],
            quoteContinuationName: 'Blokcitaten voortzetten bij plakken',
            quoteContinuationDesc:
                'Plakt tekst met meerdere regels op een geciteerde regel en citeert elke regel, zodat alle geplakte tekst binnen het blokcitaat of de callout blijft.',
            quoteContinuationAliases: ['citaat', 'blokcitaat', 'callout', 'kader', 'bronvermelding', 'waarschuwing', 'alinea']
        },

        custom: {
            heading: 'Aangepaste verwerking',
            pipelineName: 'Aangepaste regex-snippets op tekst toepassen',
            pastedText: 'Geplakte tekst',
            note: 'Notitie',
            wikiButton: 'Wiki bekijken',
            regexButton: 'Regex-testomgeving openen',
            snippetsName: 'Tekstsnippets',
            snippetsDesc:
                'Worden na de ingebouwde regels op de hele geplakte tekst toegepast. Schakel de snippets in die bij het plakken moeten worden uitgevoerd.',
            urlSnippetsName: 'Linksnippets',
            urlSnippetsDesc:
                'Worden op elke geplakte link toegepast nadat de paginatitel is opgehaald. De regels zien alleen de uiteindelijke Markdown-link, en de bestemming blijft ongewijzigd.',
            enabledSnippetsCount: { one: '{count} actieve snippet', other: '{count} actieve snippets' },
            snippetRulesCount: { one: '{count} regel', other: '{count} regels' },
            invalidRulesCount: { one: '{count} ongeldige regel', other: '{count} ongeldige regels' },
            unnamedSnippet: 'Naamloze snippet',
            emptyState: 'Je hebt nog geen snippets gemaakt.',
            addSnippet: 'Snippet toevoegen',
            editButton: 'Snippet bewerken',
            exportName: 'Snippets exporteren',
            exportDesc: 'Kopieert alle snippets in de uitwisselingsindeling van de wiki.',
            exportButton: 'Snippets kopiëren',
            importName: 'Snippets importeren',
            importDesc: 'Voegt snippets uit de uitwisselingsindeling van de wiki toe.',
            previewName: 'Probeer het',
            previewDesc: 'Typ voorbeeldtekst om het resultaat van alle actieve snippets te zien.',
            modalPreviewDesc: 'Typ voorbeeldtekst om het resultaat van deze snippet te zien.',
            previewInputLabel: 'Voorbeeldtekst',
            previewEmpty: 'De verwerkte tekst verschijnt hier.',
            urlPreviewDesc: 'Plak een Markdown-link om het resultaat van alle actieve linksnippets te zien.',
            urlModalPreviewDesc: 'Plak een Markdown-link om het resultaat van deze snippet te zien.',
            urlPreviewLabel: 'Voorbeeldlink met titel',
            urlPreviewEmpty: 'De verwerkte link verschijnt hier.',
            nameName: 'Naam',
            rulesName: 'Regels',
            rulesDesc: 'Voer per regel één vervanging met een reguliere JavaScript-expressie in.',
            wikiPasteHint: 'Kopieer een kant-en-klare snippet uit de wiki en plak die direct in het regelveld.',
            invalidLine: 'Regel {line}: {value}',
            saveButton: 'Opslaan',
            recognizedSnippetsCount: { one: '{count} snippet herkend', other: '{count} snippets herkend' },
            recognizedRulesCount: { one: '{count} regel herkend', other: '{count} regels herkend' },
            unparseableName: 'Niet-herkende regels',
            importFallbackName: 'Geïmporteerde snippet',
            defaultSnippetBoldHeadings: 'Vette opmaak uit koppen verwijderen',
            defaultSnippetBlankLines: 'Lege regels samenvoegen',
            defaultSnippetSiteSuffixes: 'Sitenamen uit titels verwijderen'
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

    pdfModal: {
        furniture: 'Paginanummers verwijderen',
        singleParagraph: 'Alles samenvoegen tot één alinea',
        description:
            'Afgebroken regels worden samengevoegd, afgebroken woorden hersteld, ligaturen omgezet in gewone letters en overtollige spaties verwijderd.',
        preview: 'Voorvertoning'
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
            one: 'Je hebt nu {count} plugin geïnstalleerd die min of meer hetzelfde doet als Better Paste, dus schakel de volgende plugin uit of verwijder die:',
            other: 'Je hebt nu {count} plugins geïnstalleerd die min of meer hetzelfde doen als Better Paste, dus schakel de volgende plugins uit of verwijder ze:'
        },
        outro: 'Uitschakelen kan onder Instellingen > Community-plugins.',
        dontRemind: 'Niet meer tonen',
        button: 'Begrepen'
    },

    whatsNew: {
        title: 'Nieuw in Better Paste',
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
