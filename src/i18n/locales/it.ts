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
        separator: ', ',
        cleanupOn: 'elaborazione automatica attiva',
        cleanupOff: 'elaborazione automatica disattivata',
        selectTextFirst: 'seleziona prima del testo',
        nothingToClean: 'niente da pulire',
        clipboardFailed: 'impossibile leggere gli appunti',
        titleFailed: 'impossibile recuperare il titolo.',
        fetchingTitle: 'recupero del titolo{dots}',
        imagesFailed: {
            one: '{count} immagine non è stata salvata',
            other: '{count} immagini non sono state salvate'
        },
        imagesFailedLinkKept: '{images}, il collegamento originale è stato mantenuto',
        imagesFailedNothingPasted: '{images}, quindi non è stato incollato nulla. Gli appunti lo contengono ancora.',
        aiTextCleaned: 'testo IA ripulito',
        terminalCleaned: 'output del terminale ripulito',
        textProcessed: 'stile del testo corretto',
        urlsCleaned: { one: '{count} URL ripulito', other: '{count} URL ripuliti' },
        imagesSaved: { one: '{count} immagine salvata', other: '{count} immagini salvate' }
    },

    settings: {
        exampleFallback: '{description} Esempio: {example}',
        plainFallback: '{description} {example}',

        start: {
            whatsNewName: 'Novità di Better Paste {version}',
            whatsNewDesc: 'Cosa è cambiato nelle versioni più recenti.',
            whatsNewAliases: ['note di rilascio', 'modifiche', 'changelog', 'versione', 'aggiornamento', 'cronologia'],
            whatsNewButton: 'Vedi le novità',
            supportName: 'Sostieni lo sviluppo',
            supportDesc: 'Se Better Paste ti è utile, valuta di sostenerne lo sviluppo.',
            supportAliases: ['sponsor', 'donazione', 'caffè', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Offrimi un caffè'
        },

        behavior: {
            heading: 'Comportamento',
            autoCleanName: 'Pulisci ogni incollaggio',
            autoCleanDesc:
                'Applica le regole a ogni incollaggio. Disattivalo per usare solo i comandi. Una singola nota può escludersi con la proprietà "better-paste: false".',
            autoCleanAliases: ['automatico', 'attiva', 'disattiva', 'nota', 'escludi', 'proprietà', 'frontmatter', 'eccezione'],
            showNoticesName: 'Mostra un avviso quando un incollaggio viene modificato',
            showNoticesDesc:
                'Un riepilogo su una riga di ciò che è stato pulito. Gli errori sono sempre segnalati, comunque sia impostato.',
            showNoticesAliases: ['avviso', 'riepilogo', 'messaggio', 'notifica', 'silenzioso']
        },

        images: {
            heading: 'Immagini',
            savingName: 'Salva nel vault le immagini incollate',
            savingDesc:
                'Salva le immagini incollate come file locali invece di lasciare collegamenti esterni. Comprende "Copia immagine" di Safari, le immagini dentro contenuti web copiati e i singoli indirizzi di immagine. Le immagini vengono salvate nella cartella allegati del tuo vault. Con "Nome dalla fonte":',
            savingAliases: ['scarica', 'allegato', 'safari', 'schermata', 'immagine', 'cartella', 'nome file', 'larghezza', 'dimensione'],
            pageName: 'Gestione delle immagini',
            pageDesc: 'Nomi dei file e larghezza delle immagini per nota.',
            nameFormatName: 'Nomi dei file',
            nameFormatDesc: 'Scegli come vengono nominati i file immagine salvati.',
            nameFormatSource: 'Nome dalla fonte',
            nameFormatCustom: 'Formato personalizzato',
            customName: 'Formato personalizzato',
            customDesc: 'Usa {{name}} per il nome della fonte e i formati data di Moment come YYYY-MM-DD.',
            customMomentLink: 'Formato Moment',
            customExample: 'Esempio: {value}',
            customAliases: ['nome', 'file', 'data', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Proprietà per la larghezza delle immagini',
            sizePropertyDesc:
                'La proprietà del frontmatter che definisce la larghezza delle immagini incollate in una nota. Una nota che usa questa proprietà gestisce le schermate al posto di Obsidian. Lascia vuoto per disattivare.',
            sizePropertyAliases: ['dimensione', 'frontmatter', 'proprietà', 'ridimensiona']
        },

        links: {
            heading: 'Collegamenti',
            titlesName: 'Recupera il titolo dei collegamenti incollati',
            titlesDesc:
                'Quando gli appunti contengono solo un indirizzo web che non è un’immagine, ne viene recuperato il titolo della pagina e incollato un collegamento Markdown. Altro testo selezionato diventa l’etichetta senza alcuna richiesta. Se il titolo non può essere recuperato, resta l’indirizzo originale.',
            titlesAliases: ['titolo', 'pagina', 'sito web', 'collegamento markdown', 'scarica'],
            cleaningName: 'Pulisci i collegamenti incollati',
            cleaningDesc: 'Rimuove i parametri di tracciamento dai collegamenti incollati. La parte barrata viene rimossa:',
            cleaningAliases: ['url', 'tracciamento', 'utm', 'parametri', 'query', 'sito', 'dominio', 'youtube', 'eccezione'],
            stripName: 'Quali parametri rimuovere',
            stripDesc:
                'Scegli se rimuovere ogni parametro della query o solo quelli di tracciamento noti. Le regole di sito possono conservare parametri in entrambe le modalità.',
            stripAliases: ['utm', 'tracciamento', 'query', 'parametri'],
            stripAll: 'Ogni parametro, tranne dove una regola di sito lo conserva',
            stripTracking: 'Solo i parametri di tracciamento noti',
            rulesName: 'Regole per conservare i parametri',
            rulesDesc: 'Regole di sito per mantenere parametri specifici della query in entrambe le modalità di rimozione.',
            rulesCount: { one: '{count} sito', other: '{count} siti' },
            listName: 'Le tue regole di sito',
            listDesc:
                '{sites} sono già gestiti e restano aggiornati insieme al plugin. Aggiungi qui le tue regole di sito, una per riga. "example.com" conserva ogni parametro di quel sito, "example.com: a, b" conserva solo quei due e "!example.com" elimina una regola inclusa nel plugin. Nella modalità "Solo i parametri di tracciamento noti" una regola recupera solo i parametri di tracciamento corrispondenti, perché gli altri sono già conservati. I sottodomini sono riconosciuti automaticamente.',
            listShippedCount: { one: '{count} sito comune', other: '{count} siti comuni' },
            listAliases: ['dominio', 'eccezione', 'whitelist', 'youtube'],
            listInvalid: 'Non è un nome di sito: {values}',
            testerName: 'Provalo',
            testerDesc: 'Incolla un collegamento per vedere cosa conserverebbero queste regole.',
            testerLabel: 'Collegamento da pulire',
            testerEmpty: 'Il collegamento pulito compare qui.'
        },

        terminal: {
            heading: 'Testo del terminale',
            cleanupName: 'Pulisci l’output del terminale',
            cleanupDesc:
                'Riunisce le righe spezzate nell’output del terminale e rimuove il rientro. I codici colore vengono eliminati. Blocchi di codice, tabelle ed elementi di elenco restano intatti.',
            cleanupAliases: ['a capo', 'riunisci', 'ansi', 'console', 'shell', 'rientro', 'punto elenco', 'elenco', 'markdown'],
            pageName: 'Gestione del testo del terminale',
            pageDesc: 'Condizioni di riunione e caratteri dei punti elenco.',
            rejoinName: 'Quando riunire una riga spezzata',
            rejoinDesc: 'La condizione necessaria per trattare una riga come continuazione della precedente.',
            rejoinAliases: ['rientro', 'a capo', 'aggressivo', 'sicuro', 'git log'],
            rejoinIndented: 'Solo quando la riga successiva è rientrata',
            rejoinAny: 'Ogni volta che la riga sopra sembra piena',
            rejoinNever: 'Non riunire mai, rimuovi solo codici e rientri',
            bulletsName: 'Caratteri dei punti elenco',
            bulletsDesc:
                'Stabilisce se i caratteri dei punti elenco (come •) nell’output del terminale vengono conservati o convertiti in elementi di elenco Markdown.',
            bulletsAliases: ['elenco', 'markdown', 'trattino'],
            bulletsMarkdown: 'Converti in elementi di elenco Markdown',
            bulletsPreserve: 'Lasciali come sono',
            testerName: 'Provalo',
            testerDesc: 'Incolla dell’output del terminale per vedere come verrebbe pulito.',
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
            commasName: 'Virgole e virgolette',
            commasDesc: 'Scegli dove collocare una virgola accanto a una virgoletta doppia di chiusura.',
            commasAliases: ['virgola', 'virgolette', 'citazione', 'punteggiatura', 'stile'],
            commasNone: 'Nessuna modifica',
            commasInside: 'Virgola dentro le virgolette',
            commasOutside: 'Virgola fuori dalle virgolette',
            commasExampleSource: 'Lo definì "finito," poi se ne andò.',
            commasExampleOutside: 'Lo definì "finito", poi se ne andò.',
            invisibleName: 'Pulizia IA: caratteri invisibili',
            invisibleDesc: 'Rimuove gli spazi a larghezza zero e trasforma gli spazi unificatori in spazi normali.',
            invisibleAliases: [
                'ia',
                'chatgpt',
                'claude',
                'llm',
                'trattino',
                'lineetta',
                'trattino lungo',
                'unicode',
                'invisibile',
                'nbsp',
                'tipografia',
                'punteggiatura',
                'spazio'
            ],
            invisibleExampleStart: 'Il',
            invisibleExampleMiddle: 'risultato',
            invisibleExampleEnd: ' andava bene.',
            invisibleExampleAfter: 'Il risultato andava bene.',
            punctuationName: 'Pulizia IA: lineette e virgolette',
            punctuationDesc: 'Converte le lineette lunghe in trattini e le virgolette curve in virgolette dritte.',
            punctuationAliases: [
                'lineetta',
                'trattino lungo',
                'trattino',
                'virgolette',
                'virgolette curve',
                'apostrofo',
                'punteggiatura',
                'tipografia'
            ],
            punctuationExampleBefore: '“Il risultato — contro ogni previsione — era perfetto.”',
            punctuationExampleAfter: '"Il risultato - contro ogni previsione - era perfetto."'
        }
    },

    welcome: {
        title: 'Benvenuto in Better Paste',
        intro: [
            'Better Paste modifica il contenuto degli appunti mentre viene incollato in una nota.',
            'Salva le immagini collegate come allegati nel vault, rimuove i parametri di tracciamento dai collegamenti, riunisce le righe spezzate nell’output del terminale e sostituisce virgolette curve e caratteri invisibili con equivalenti semplici.',
            'Ogni regola può essere disattivata singolarmente.',
            'Una singola nota può escludersi del tutto con la proprietà "better-paste: false". Le impostazioni si trovano in Impostazioni, Better Paste.'
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
