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

/** Italian. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_IT: TranslationStrings = {
    commands: {
        paste: 'Incolla',
        pasteRaw: 'Incolla senza elaborazione',
        cleanSelection: 'Pulisci la selezione',
        cleanTerminal: 'Pulisci l’output del terminale',
        cleanPdf: 'Pulisci il testo PDF',
        runSnippet: 'Esegui snippet',
        commasInside: 'Sposta le virgole dentro le virgolette',
        commasOutside: 'Sposta le virgole fuori dalle virgolette',
        toggleCleanup: 'Attiva o disattiva la pulizia automatica'
    },

    notices: {
        prefix: 'Better Paste: {message}',
        cleanupOn: 'elaborazione automatica attiva',
        cleanupOff: 'elaborazione automatica disattivata',
        selectTextFirst: 'seleziona prima del testo',
        nothingToClean: 'niente da pulire',
        clipboardFailed: 'impossibile leggere gli appunti',
        titleFailed: 'impossibile recuperare il titolo.',
        fetchingTitle: 'recupero del titolo...',
        imagesFailed: {
            one: '{count} immagine non è stata salvata',
            other: '{count} immagini non sono state salvate'
        },
        imagesFailedLinkKept: '{images}, il collegamento originale è stato mantenuto',
        imagesFailedNothingPasted: '{images}, quindi non è stato incollato nulla',
        snippetsCopied: 'snippet copiati',
        snippetsCopyFailed: 'impossibile copiare gli snippet'
    },

    settings: {
        exampleFallback: '{description} Esempio: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'Informazioni',
            whatsNewName: 'Novità di Better Paste {version}',
            whatsNewDesc: 'Cosa è cambiato nelle versioni più recenti.',
            whatsNewAliases: ['note di rilascio', 'modifiche', 'changelog', 'versione', 'aggiornamento', 'cronologia'],
            whatsNewButton: 'Vedi le novità',
            supportName: 'Sostieni lo sviluppo',
            supportDesc: 'Se Better Paste ti è utile, valuta di sostenerne lo sviluppo.',
            supportAliases: ['sponsor', 'donazione', 'caffè', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Offrimi un caffè',
            pluginsName: 'Scopri i miei altri plugin',
            pluginsAliases: ['plugin', 'estensioni', 'notebook navigator', 'pixel perfect image', 'autore'],
            notebookNavigatorDesc: 'Un browser dei file e un calendario migliori',
            pixelPerfectImageDesc: 'Ridimensionamento esatto delle immagini e altro'
        },

        behavior: {
            autoCleanName: 'Pulisci ogni incollaggio',
            autoCleanDesc:
                'Applica le regole a ogni incollaggio. Se è disattivato, le regole vengono applicate solo tramite i comandi di Better Paste. Una singola nota può essere esclusa con la proprietà "{property}: false" o inclusa con "{property}: true".',
            autoCleanAliases: ['automatico', 'attiva', 'disattiva', 'nota', 'escludi', 'proprietà', 'frontmatter', 'eccezione'],
            notePropertyName: 'Proprietà della nota',
            notePropertyDesc: 'Proprietà che attiva o disattiva Better Paste per una singola nota.',
            notePropertyAliases: ['nota', 'proprietà', 'frontmatter', 'escludi', 'disattiva', 'attiva', 'bp']
        },

        images: {
            heading: 'Immagini',
            savingName: 'Salva nel vault le immagini incollate',
            savingDesc:
                'Salva le immagini incollate nella cartella allegati e collega il file locale invece dell’indirizzo web. Riguarda "Copia immagine" di Safari, le immagini dentro contenuti web copiati e gli indirizzi di immagine incollati. Per impostazione predefinita il nome del file viene dall’indirizzo:',
            savingAliases: ['scarica', 'allegato', 'safari', 'schermata', 'immagine', 'cartella', 'nome file', 'larghezza', 'dimensione'],
            sizeChoiceName: 'Applica dimensione quando incolli',
            sizeChoiceDesc:
                'Aggiunge una larghezza a ogni immagine salvata, ad esempio ![[photo.jpg|400]]. La proprietà di larghezza della nota ha la precedenza.',
            sizeChoiceAliases: ['dimensione', 'larghezza', 'dimensione immagine', 'ridimensiona', 'incorporamento', '400'],
            sizeOptionsName: 'Opzioni di dimensione',
            sizeOptionsDesc: 'Le larghezze offerte qui sopra e nella finestra al momento di incollare, separate da virgole.',
            classChoiceName: 'Applica classe CSS quando incolli',
            classChoiceDesc:
                'Aggiunge una classe a ogni immagine salvata, ad esempio ![[photo.jpg#invert]]. Temi e snippet CSS decidono cosa fa una classe.',
            classChoiceAliases: ['css', 'classe', 'snippet', 'invert', 'tema', 'filtro', 'incorporamento'],
            classOptionsName: 'Opzioni di classe',
            classOptionsDesc: 'Le classi offerte qui sopra e nella finestra al momento di incollare, separate da virgole.',
            choiceNone: 'Non fare nulla',
            choiceAsk: 'Chiedi a ogni incollaggio',
            nameFormatName: 'Nomi dei file',
            customDesc:
                'Usa {{name}} per il nome della fonte, {{noteName}} per il nome della nota, {{property:xyz}} per una proprietà del frontmatter, {{counter}} o {{counter:2}} per un numero crescente e i formati data di Moment come YYYY-MM-DD. Uno screenshot non ha una fonte da cui prendere il nome, quindi il suo {{name}} diventa "Pasted image" con data e ora, come in Obsidian.',
            customMomentLink: 'Formato Moment',
            customExample: 'Esempio: {value}',
            customExampleNote: 'La mia nota',
            customAliases: [
                'nome',
                'file',
                'data',
                'moment',
                'YYYY',
                '{{name}}',
                'contatore',
                'proprietà',
                'nome nota',
                'screenshot',
                'rinomina',
                'appunti',
                'paste image rename'
            ],
            sizePropertyName: 'Proprietà per la larghezza delle immagini',
            sizePropertyDesc:
                'Proprietà del frontmatter che imposta la larghezza delle immagini incollate in una nota. Con "{property}: 400" nella nota, un’immagine incollata diventa ![[photo.png|400]]. Lascia vuoto per non aggiungere alcuna larghezza.',
            sizePropertyAliases: ['dimensione', 'frontmatter', 'proprietà', 'ridimensiona']
        },

        links: {
            heading: 'Collegamenti',
            titlesName: 'Recupera il titolo dei collegamenti incollati',
            titlesDesc:
                'Incollare un indirizzo web da solo inserisce un collegamento Markdown con il titolo della pagina. Se c’è del testo selezionato, quel testo diventa l’etichetta e non viene recuperato alcun titolo. Se il titolo non si può recuperare, resta solo l’indirizzo.',
            titlesAliases: ['titolo', 'pagina', 'sito web', 'collegamento markdown', 'scarica'],
            cleaningName: 'Pulisci i collegamenti incollati',
            cleaningDesc: 'Rimuove i parametri di tracciamento dai collegamenti incollati:',
            cleaningAliases: ['url', 'tracciamento', 'utm', 'parametri', 'query', 'sito', 'dominio', 'youtube', 'eccezione'],
            removalsName: 'Rimozioni nei collegamenti',
            removalsDesc: 'Parametri aggiuntivi da rimuovere ovunque o su siti specifici.',
            rulesCount: { one: '{count} voce', other: '{count} voci' },
            builtInName: 'Rimozioni integrate',
            builtInDesc:
                'Aggiornato il {date}. Filtri di tracciamento globali: {trackingCount}. Regole specifiche per sito: {siteCount}. I collegamenti firmati crittograficamente rimangono invariati.',
            builtInButton: 'Visualizza l’elenco',
            listName: 'Le tue rimozioni',
            listDesc:
                'Rimuovi un parametro dai collegamenti normali su qualsiasi sito inserendone il nome da solo. Ad esempio, "fbclid" rimuove il parametro fbclid ovunque compaia.\n\nRimuovi i parametri solo su un sito con "example.com | source, ref". Questo rimuove source e ref da example.com e dai suoi sottodomini, mentre tutti gli altri parametri rimangono. Inizia una riga con "!" per disattivare le rimozioni integrate per quel sito. I collegamenti firmati crittograficamente rimangono sempre invariati.',
            listAliases: ['dominio', 'parametro', 'filtro', 'rimuovi', 'youtube'],
            listInvalid: 'Regola di rimozione non valida: {values}',
            suggestName: 'Suggerisci le tue rimozioni',
            suggestDesc: 'Aiuta a migliorare le rimozioni integrate suggerendo parametri da rimuovere.',
            suggestAliases: ['contribuisci', 'invia', 'condividi', 'manda', 'filtro'],
            suggestButton: 'Controlla e invia',
            testerName: 'Provalo',
            testerDesc: 'Incolla un collegamento per vedere il risultato ripulito.',
            testerLabel: 'Collegamento da pulire',
            testerEmpty: 'Il collegamento pulito compare qui.'
        },

        text: {
            heading: 'Elaborazione del testo',
            trimName: 'Rimuovi gli spazi circostanti',
            trimDesc: 'Rimuove righe vuote e spazi all’inizio e alla fine del testo incollato.',
            trimAliases: ['spazio', 'riga vuota', 'a capo', 'ritaglia'],
            invisibleName: 'Caratteri invisibili',
            invisibleDesc: 'Rimuove gli spazi a larghezza zero e trasforma gli spazi unificatori in spazi normali.',
            invisibleAliases: ['ia', 'chatgpt', 'claude', 'llm', 'unicode', 'invisibile', 'nbsp', 'spazio'],
            invisibleExampleStart: 'Il',
            invisibleExampleMiddle: 'risultato',
            invisibleExampleEnd: ' andava bene.',
            invisibleExampleAfter: 'Il risultato andava bene.',
            quotesName: 'Virgolette',
            quotesDesc: 'Converte le virgolette curve e gli apostrofi in virgolette dritte.',
            quotesAliases: ['virgolette', 'virgolette curve', 'virgolette dritte', 'apostrofo', 'punteggiatura', 'tipografia', 'ia'],
            quotesExample: '“Bene”, disse.',
            dashesName: 'Trattini',
            dashesDesc: 'Converte i trattini medi e lunghi in trattini brevi.',
            dashesAliases: ['lineetta', 'trattino lungo', 'trattino', 'punteggiatura', 'tipografia', 'ia'],
            dashesExample: 'Il risultato — contro ogni previsione — era buono.'
        },

        custom: {
            heading: 'Elaborazione personalizzata',
            pipelineName: 'Applica snippet regex personalizzati al testo',
            pastedText: 'Testo incollato',
            builtInRules: 'Regole integrate',
            customSnippets: 'Snippet personalizzati',
            note: 'Nota',
            wikiButton: 'Apri la wiki',
            regexButton: 'Apri lo strumento per espressioni regolari',
            snippetsName: 'Snippet',
            snippetsDesc: 'Aggiungi e modifica i tuoi snippet. Attiva quelli da eseguire quando incolli.',
            enabledSnippetsCount: { one: '{count} snippet attivo', other: '{count} snippet attivi' },
            snippetRulesCount: { one: '{count} regola', other: '{count} regole' },
            invalidRulesCount: { one: '{count} riga non valida', other: '{count} righe non valide' },
            unnamedSnippet: 'Snippet senza nome',
            emptyState: 'Non hai ancora creato snippet.',
            addSnippet: 'Aggiungi snippet',
            editButton: 'Modifica snippet',
            exportName: 'Esporta snippet',
            exportDesc: 'Copia tutti gli snippet nel formato di scambio della wiki.',
            exportButton: 'Copia snippet',
            importName: 'Importa snippet',
            importDesc: 'Aggiunge snippet dal formato di scambio della wiki.',
            previewName: 'Provalo',
            previewDesc: 'Digita un testo di esempio per vedere il risultato di tutti gli snippet attivi.',
            modalPreviewDesc: 'Digita un testo di esempio per vedere il risultato di questo snippet.',
            previewInputLabel: 'Testo di esempio',
            previewEmpty: 'Il testo elaborato compare qui.',
            nameName: 'Nome',
            rulesName: 'Regole',
            rulesDesc: 'Inserisci una sostituzione con espressione regolare JavaScript per riga.',
            wikiPasteHint: 'Copia uno snippet pronto dalla wiki e incollalo direttamente nel campo delle regole.',
            invalidLine: 'Riga {line}: {value}',
            saveButton: 'Salva',
            recognizedSnippetsCount: { one: '{count} snippet riconosciuto', other: '{count} snippet riconosciuti' },
            recognizedRulesCount: { one: '{count} regola riconosciuta', other: '{count} regole riconosciute' },
            unparseableName: 'Righe non riconosciute',
            importFallbackName: 'Snippet importato'
        }
    },

    imageModal: {
        title: 'Opzioni immagine',
        sizeName: 'Dimensione',
        className: 'Classe CSS',
        none: 'Non fare nulla',
        apply: 'Applica',
        cancel: 'Annulla'
    },

    pdfModal: {
        furniture: 'Rimuovi i numeri di pagina',
        singleParagraph: 'Unisci tutto in un solo paragrafo',
        description:
            'Le righe spezzate vengono riunite, le parole divise dal trattino riparate, le legature convertite in lettere normali e gli spazi in eccesso rimossi.',
        preview: 'Anteprima'
    },

    welcome: {
        title: 'Benvenuto in Better Paste',
        intro: [
            'Copia le immagini da Safari direttamente nel vault, incolla link senza parametri di tracciamento, sistema l’output del terminale con le righe spezzate e ripulisci il testo dell’IA. Incolla e basta: al resto ci pensa Better Paste.',
            'Un consiglio prima di iniziare: assegna **Incolla senza elaborazione** a `Cmd+Shift+V` (`Ctrl+Shift+V` su Windows), così puoi sempre incollare esattamente ciò che è negli appunti.',
            'Ogni regola ha il suo interruttore in Impostazioni, Better Paste, e la proprietà `{property}: false` disattiva il plugin per quella nota.'
        ],
        startButton: 'Inizia'
    },

    overlap: {
        title: 'Better Paste: plugin che si sovrappongono',
        thanks: 'Grazie per aver installato Better Paste!',
        intro: {
            one: 'Al momento hai {count} plugin installato che fa più o meno la stessa cosa, quindi disattiva o disinstalla:',
            other: 'Al momento hai {count} plugin installati che fanno più o meno la stessa cosa, quindi disattiva o disinstalla:'
        },
        outro: 'Si disattivano in Impostazioni > Plugin di terze parti.',
        dontRemind: 'Non mostrare più questo messaggio',
        button: 'Capito'
    },

    whatsNew: {
        title: 'Novità di Better Paste',
        scrollLabel: 'Note di rilascio',
        releaseHeading: 'Versione {version} ({date})',
        categoryNew: 'Novità',
        categoryImproved: 'Migliorato',
        categoryChanged: 'Modificato',
        categoryFixed: 'Corretto',
        support: 'Se Better Paste ti è utile, valuta di sostenerne lo sviluppo.',
        coffeeButton: '☕️ Offrimi un caffè',
        thanksButton: 'Grazie!'
    }
};
