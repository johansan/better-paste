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
        imagesFailedNothingPasted: '{images}, quindi non è stato incollato nulla'
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
                'Applica le regole a ogni incollaggio. Se è disattivato, le regole vengono applicate solo tramite i comandi di Better Paste. Una singola nota può essere esclusa con la proprietà "bp: false" o inclusa con "bp: true".',
            autoCleanAliases: ['automatico', 'attiva', 'disattiva', 'nota', 'escludi', 'proprietà', 'frontmatter', 'eccezione']
        },

        images: {
            heading: 'Immagini',
            savingName: 'Salva nel vault le immagini incollate',
            savingDesc:
                'Salva le immagini incollate nella cartella allegati e collega il file locale invece dell’indirizzo web. Riguarda "Copia immagine" di Safari, le immagini dentro contenuti web copiati e gli indirizzi di immagine incollati. Per impostazione predefinita il nome del file viene dall’indirizzo:',
            savingAliases: ['scarica', 'allegato', 'safari', 'schermata', 'immagine', 'cartella', 'nome file', 'larghezza', 'dimensione'],
            nameFormatName: 'Nomi dei file',
            nameFormatDesc: 'Come vengono nominate le immagini salvate.',
            nameFormatSource: 'Nome dalla fonte',
            nameFormatCustom: 'Formato personalizzato',
            customName: 'Formato personalizzato',
            customDesc: 'Usa {{name}} per il nome della fonte e i formati data di Moment come YYYY-MM-DD.',
            customMomentLink: 'Formato Moment',
            customExample: 'Esempio: {value}',
            customAliases: ['nome', 'file', 'data', 'moment', 'YYYY', '{{name}}']
        },

        frontmatter: {
            heading: 'Frontmatter',
            notePropertyName: 'Proprietà della nota',
            notePropertyDesc:
                'Proprietà che attiva o disattiva Better Paste per una singola nota. Con "bp: false" la nota resta invariata, e con "bp: true" viene pulita anche quando "Pulisci ogni incollaggio" è disattivato. Lascia vuoto per ignorare la proprietà.',
            notePropertyAliases: ['nota', 'proprietà', 'frontmatter', 'escludi', 'disattiva', 'attiva', 'bp'],
            sizePropertyName: 'Proprietà per la larghezza delle immagini',
            sizePropertyDesc:
                'Proprietà del frontmatter che imposta la larghezza delle immagini incollate in una nota. Con "image-width: 400" nella nota, un’immagine incollata diventa ![[photo.png|400]]. Lascia vuoto per non aggiungere alcuna larghezza.',
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
            stripName: 'Quali parametri rimuovere',
            stripDesc: 'I parametri di tracciamento sono nomi come utm_source, fbclid e gclid.',
            stripAliases: ['utm', 'tracciamento', 'query', 'parametri'],
            stripAll: 'Ogni parametro, a meno che una regola di sito lo conservi',
            stripTracking: 'Solo i parametri di tracciamento noti',
            rulesName: 'Regole di sito',
            rulesDesc: 'Parametri da conservare su siti specifici.',
            rulesCount: { one: '{count} sito', other: '{count} siti' },
            listName: 'Le tue regole di sito',
            listDesc:
                '{sites} sono già coperti dal plugin. Aggiungi qui le tue regole, una per riga. "example.com" conserva ogni parametro di quel sito, "example.com: a, b" conserva solo quei due e "!example.com" rimuove una regola inclusa nel plugin. I sottodomini sono riconosciuti automaticamente.',
            listShippedCount: { one: '{count} sito comune', other: '{count} siti comuni' },
            listAliases: ['dominio', 'eccezione', 'whitelist', 'youtube'],
            listInvalid: 'Non è un nome di sito: {values}',
            testerName: 'Provalo',
            testerDesc: 'Incolla un collegamento per vedere cosa conservano le regole.',
            testerLabel: 'Collegamento da pulire',
            testerEmpty: 'Il collegamento pulito compare qui.'
        },

        terminal: {
            heading: 'Testo del terminale',
            cleanupName: 'Pulisci l’output del terminale',
            cleanupDesc:
                'Riunisce le righe spezzate dal terminale e rimuove i codici colore e il rientro iniziale. Blocchi di codice, tabelle ed elenchi restano intatti.',
            cleanupAliases: ['a capo', 'riunisci', 'ansi', 'console', 'shell', 'rientro', 'punto elenco', 'elenco', 'markdown'],
            pageName: 'Gestione del testo del terminale',
            pageDesc: 'Riunione delle righe e caratteri dei punti elenco.',
            rejoinName: 'Quando riunire una riga spezzata',
            rejoinDesc: 'Una riga viene unita a quella sopra solo quando la riga superiore sembra piena.',
            rejoinAliases: ['rientro', 'a capo', 'aggressivo', 'sicuro', 'git log'],
            rejoinIndented: 'Solo quando la riga è rientrata',
            rejoinAny: 'Che la riga sia rientrata o no',
            rejoinNever: 'Mai, rimuovi solo codici e rientri',
            bulletsName: 'Caratteri dei punti elenco',
            bulletsDesc: 'Cosa fare con i caratteri dei punti elenco come • nell’output del terminale.',
            bulletsAliases: ['elenco', 'markdown', 'trattino'],
            bulletsMarkdown: 'Converti in elementi di elenco Markdown',
            bulletsPreserve: 'Lasciali come sono',
            testerName: 'Provalo',
            testerDesc: 'Incolla dell’output del terminale per vedere come viene pulito.',
            testerLabel: 'Testo del terminale da pulire',
            testerEmpty: 'Il testo pulito compare qui.',
            testerSample: [
                '• Il passaggio aggiuntivo riguarda solo il gestore Invio dell’elenco, quindi la modifica principale resta semplice. Scorrendo i flussi vicini ho trovato',
                '  due probabili punti critici da verificare: la selezione può spostarsi dopo l’aggiornamento.'
            ]
        },

        text: {
            heading: 'Elaborazione del testo',
            trimName: 'Rimuovi gli spazi circostanti',
            trimDesc: 'Rimuove righe vuote e spazi all’inizio e alla fine del testo incollato.',
            trimAliases: ['spazio', 'riga vuota', 'a capo', 'ritaglia'],
            commasName: 'Virgole',
            commasDesc: 'Dove va una virgola accanto a una virgoletta doppia di chiusura.',
            commasAliases: ['virgola', 'virgolette', 'citazione', 'punteggiatura', 'stile'],
            commasNone: 'Nessuna modifica',
            commasInside: 'Virgola dentro le virgolette',
            commasOutside: 'Virgola fuori dalle virgolette',
            commasExampleSource: 'Lo definì "finito," poi se ne andò.',
            commasExampleOutside: 'Lo definì "finito", poi se ne andò.',
            invisibleName: 'Caratteri invisibili',
            invisibleDesc: 'Rimuove gli spazi a larghezza zero e trasforma gli spazi unificatori in spazi normali.',
            invisibleAliases: ['ia', 'chatgpt', 'claude', 'llm', 'unicode', 'invisibile', 'nbsp', 'spazio'],
            invisibleExampleStart: 'Il',
            invisibleExampleMiddle: 'risultato',
            invisibleExampleEnd: ' andava bene.',
            invisibleExampleAfter: 'Il risultato andava bene.',
            quotesName: 'Virgolette',
            quotesDesc: 'Converte le virgolette e gli apostrofi in questo stile.',
            quotesAliases: ['virgolette', 'virgolette curve', 'virgolette dritte', 'apostrofo', 'punteggiatura', 'tipografia', 'ia'],
            quotesNone: 'Nessuna modifica',
            quotesStraight: 'Virgolette dritte',
            quotesCurly: 'Virgolette curve',
            quotesExample: '“Bene”, disse. L\'idea è "pronta".',
            dashesName: 'Trattini',
            dashesDesc: 'Converte i trattini e le lineette tra le parole in questo stile.',
            dashesAliases: ['lineetta', 'trattino lungo', 'trattino', 'punteggiatura', 'tipografia', 'ia'],
            dashesNone: 'Nessuna modifica',
            dashesHyphen: 'Trattini brevi',
            dashesEn: 'Trattini medi',
            dashesEm: 'Trattini lunghi',
            dashesEmSpaced: 'Trattini lunghi con spazi',
            dashesExample: 'Il risultato - contro ogni previsione — era buono.'
        }
    },

    welcome: {
        title: 'Benvenuto in Better Paste',
        intro: [
            'Copia le immagini da Safari direttamente nel vault, incolla link senza parametri di tracciamento, sistema l’output del terminale con le righe spezzate e ripulisci il testo dell’IA. Incolla e basta: al resto ci pensa Better Paste.',
            'Un consiglio prima di iniziare: assegna **Incolla senza elaborazione** a `Cmd+Shift+V` (`Ctrl+Shift+V` su Windows), così puoi sempre incollare esattamente ciò che è negli appunti.',
            'Ogni regola ha il suo interruttore in Impostazioni, Better Paste, e la proprietà `bp: false` disattiva il plugin per quella nota.'
        ],
        startButton: 'Inizia'
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
