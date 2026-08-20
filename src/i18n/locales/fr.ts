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

/** French. Keys and comments live in src/i18n/locales/en.ts. */
export const STRINGS_FR: TranslationStrings = {
    commands: {
        paste: 'Coller',
        pasteRaw: 'Coller sans traitement',
        cleanSelection: 'Nettoyer la sélection',
        cleanTerminal: 'Nettoyer la sortie de terminal',
        cleanPdf: 'Nettoyer le texte PDF',
        runSnippet: 'Exécuter un extrait',
        commasInside: 'Placer les virgules à l’intérieur des guillemets',
        commasOutside: 'Placer les virgules à l’extérieur des guillemets',
        toggleCleanup: 'Activer ou désactiver le nettoyage automatique'
    },

    notices: {
        prefix: 'Better Paste : {message}',
        cleanupOn: 'traitement automatique activé',
        cleanupOff: 'traitement automatique désactivé',
        selectTextFirst: 'sélectionnez d’abord du texte',
        nothingToClean: 'rien à nettoyer',
        clipboardFailed: 'impossible de lire le presse-papiers',
        titleFailed: 'impossible de récupérer le titre.',
        fetchingTitle: 'récupération du titre...',
        imagesFailed: {
            one: '{count} image n’a pas pu être enregistrée',
            other: '{count} images n’ont pas pu être enregistrées'
        },
        imagesFailedLinkKept: '{images}, le lien d’origine a été conservé',
        imagesFailedNothingPasted: '{images}, donc rien n’a été collé',
        snippetsCopied: 'extraits copiés',
        snippetsCopyFailed: 'impossible de copier les extraits'
    },

    settings: {
        exampleFallback: '{description} Exemple : {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'À propos',
            whatsNewName: 'Nouveautés de Better Paste {version}',
            whatsNewDesc: 'Ce qui a changé dans les versions les plus récentes.',
            whatsNewAliases: ['notes de version', 'changements', 'journal des modifications', 'version', 'mise à jour', 'historique'],
            whatsNewButton: 'Voir les nouveautés',
            showReleaseNotesName: 'Afficher les nouveautés après une mise à jour',
            showReleaseNotesDesc: 'Ouvre la fenêtre des nouveautés une fois après chaque mise à jour.',
            showReleaseNotesAliases: ['notes de version', 'nouveautés', 'mise à jour', 'fenêtre', 'popup', 'notification'],
            supportName: 'Soutenir le développement',
            supportDesc: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
            supportAliases: ['parrainer', 'don', 'café', 'github'],
            sponsorButton: '❤️ Parrainer',
            coffeeButton: '☕️ Offrez-moi un café',
            pluginsName: 'Découvrez mes autres plugins',
            pluginsAliases: ['plugins', 'extensions', 'notebook navigator', 'pixel perfect image', 'auteur'],
            notebookNavigatorDesc: 'Un meilleur explorateur de fichiers et calendrier',
            pixelPerfectImageDesc: 'Redimensionnement exact des images et plus'
        },

        behavior: {
            autoCleanName: 'Nettoyer chaque collage',
            autoCleanDesc:
                'Applique les règles à chaque collage. Si cette option est désactivée, les règles ne s’appliquent que via les commandes Better Paste. Une note peut s’en exclure avec la propriété "{property}: false", ou s’y inclure avec "{property}: true".',
            autoCleanAliases: ['automatique', 'activer', 'désactiver', 'note', 'exclure', 'propriété', 'frontmatter', 'exception'],
            notePropertyName: 'Propriété de note',
            notePropertyDesc: 'Propriété qui active ou désactive Better Paste pour une seule note.',
            notePropertyAliases: ['note', 'propriété', 'frontmatter', 'exclure', 'désactiver', 'activer', 'bp']
        },

        images: {
            heading: 'Images',
            savingName: 'Enregistrer les images du web dans le coffre',
            savingDesc:
                'Enregistre les images du web dans votre dossier de pièces jointes et crée un lien vers le fichier local plutôt que vers l’adresse web. Concerne « Copier l’image » de Safari, les images présentes dans du contenu web copié et les adresses d’image collées. Par défaut, le nom du fichier vient de l’adresse :',
            savingAliases: ['télécharger', 'url', 'web', 'pièce jointe', 'safari', 'local', 'image', 'dossier'],
            sizeStyleName: 'Taille et style',
            sizeStyleDesc: 'Ajoutez une largeur ou une classe CSS aux images collées, automatiquement ou via une boîte de dialogue.',
            sizeStyleAliases: ['taille', 'largeur', 'css', 'classe', 'style', 'redimensionner', 'invert'],
            summarySize: 'Taille : {value}',
            summaryStyle: 'Style : {value}',
            summaryAsk: 'Demander',
            sizeChoiceName: 'Appliquer une taille au collage',
            sizeChoiceDesc:
                'Ajoute une largeur à chaque image enregistrée, par exemple ![[photo.jpg|400]]. La propriété de largeur de la note est prioritaire.',
            sizeChoiceAliases: ['taille', 'largeur', "taille d'image", 'redimensionner', 'intégration', '400'],
            sizeOptionsName: 'Options de taille',
            sizeOptionsDesc: 'Les largeurs proposées ci-dessus et dans la boîte de dialogue au collage, séparées par des virgules.',
            classChoiceName: 'Appliquer une classe CSS au collage',
            classChoiceDesc:
                'Ajoute une classe à chaque image enregistrée, par exemple ![[photo.jpg#invert]]. Les thèmes et les extraits CSS décident de l’effet d’une classe.',
            classChoiceAliases: ['css', 'classe', 'extrait', 'invert', 'thème', 'filtre', 'intégration'],
            classOptionsName: 'Options de classe',
            classOptionsDesc: 'Les classes proposées ci-dessus et dans la boîte de dialogue au collage, séparées par des virgules.',
            choiceNone: 'Ne rien faire',
            choiceAsk: 'Demander à chaque collage',
            nameFormatName: 'Noms de fichiers',
            customDesc:
                'Utilisez {{name}} pour le nom de la source, {{noteName}} pour le nom de la note, {{property:xyz}} pour une propriété du frontmatter, {{counter}} ou {{counter:2}} pour un numéro croissant, et les formats de date Moment comme YYYY-MM-DD.',
            customScreenshotDesc:
                'Une capture d’écran n’a pas de nom de source, son {{name}} devient donc « Pasted image » avec un horodatage, comme dans Obsidian.',
            customMomentLink: 'Format Moment',
            customExample: 'Exemple : {value}',
            customExampleNote: 'Ma note',
            customAliases: [
                'nom',
                'fichier',
                'date',
                'moment',
                'YYYY',
                '{{name}}',
                'compteur',
                'propriété',
                'nom de note',
                'capture d’écran',
                'renommer',
                'presse-papiers',
                'paste image rename'
            ],
            sizePropertyName: 'Propriété de largeur d’image',
            sizePropertyDesc:
                'Propriété du frontmatter qui fixe la largeur des images collées dans une note. Avec "{property}: 400" dans la note, une image collée devient ![[photo.png|400]]. Laissez vide pour n’ajouter aucune largeur.',
            sizePropertyAliases: ['taille', 'frontmatter', 'propriété', 'redimensionner']
        },

        links: {
            heading: 'Liens',
            titlesName: 'Récupérer le titre des liens collés',
            titlesDesc:
                'Coller une adresse web seule insère un lien Markdown portant le titre de la page. Si du texte est sélectionné, ce texte devient le libellé et aucun titre n’est récupéré. L’adresse brute est conservée si le titre ne peut pas être récupéré.',
            titlesAliases: ['titre', 'page', 'site web', 'lien markdown', 'télécharger'],
            cleaningName: 'Nettoyer les liens collés',
            cleaningDesc: 'Supprime les paramètres de suivi des liens collés :',
            cleaningAliases: ['url', 'suivi', 'utm', 'paramètres', 'requête', 'site', 'domaine', 'youtube', 'exception'],
            removalsName: 'Suppressions dans les liens',
            removalsDesc: 'Paramètres supplémentaires à supprimer partout ou sur des sites spécifiques.',
            rulesCount: { one: '{count} entrée', other: '{count} entrées' },
            builtInName: 'Suppressions intégrées',
            builtInDesc:
                'Mise à jour : {date}. Filtres de suivi globaux : {trackingCount}. Règles spécifiques à chaque site : {siteCount}. Les liens signés cryptographiquement restent inchangés.',
            builtInButton: 'Afficher la liste',
            listName: 'Vos suppressions',
            listDesc:
                'Supprimez un paramètre des liens classiques sur n’importe quel site en saisissant son nom seul. Par exemple, « fbclid » supprime le paramètre « fbclid » partout où il apparaît.\n\nSupprimez des paramètres uniquement sur un site avec « example.com | source, ref ». Cela supprime « source » et « ref » de example.com et de ses sous-domaines, tandis que tous les autres paramètres sont conservés. Commencez une ligne par « ! » pour désactiver les suppressions intégrées pour ce site. Les liens signés cryptographiquement restent toujours inchangés.',
            listAliases: ['domaine', 'paramètre', 'filtre', 'supprimer', 'youtube'],
            listInvalid: 'Règle de suppression non valide : {values}',
            suggestName: 'Proposez vos suppressions',
            suggestDesc: 'Contribuez à améliorer les suppressions intégrées en proposant des paramètres à supprimer.',
            suggestAliases: ['contribuer', 'soumettre', 'partager', 'envoyer', 'filtre'],
            suggestButton: 'Vérifier et envoyer',
            testerName: 'Essayer',
            testerDesc: 'Collez un lien pour voir le résultat nettoyé.',
            testerLabel: 'Lien à nettoyer',
            testerEmpty: 'Le lien nettoyé apparaît ici.'
        },

        text: {
            heading: 'Traitement du texte',
            trimName: 'Supprimer les espaces autour',
            trimDesc: 'Supprime les lignes vides et les espaces au début et à la fin du texte collé.',
            trimAliases: ['espace', 'ligne vide', 'saut de ligne', 'rogner'],
            invisibleName: 'Caractères invisibles',
            invisibleDesc: 'Supprime les espaces de largeur nulle et transforme les espaces insécables en espaces normaux.',
            invisibleAliases: ['ia', 'chatgpt', 'claude', 'llm', 'unicode', 'invisible', 'nbsp', 'espace'],
            invisibleExampleStart: 'Le',
            invisibleExampleMiddle: 'résultat',
            invisibleExampleEnd: ' était bon.',
            invisibleExampleAfter: 'Le résultat était bon.',
            quotesName: 'Guillemets',
            quotesDesc: 'Convertit les guillemets courbes et les apostrophes en guillemets droits.',
            quotesAliases: ['guillemet', 'guillemets courbes', 'guillemets droits', 'apostrophe', 'ponctuation', 'typographie', 'ia'],
            quotesExample: '“Bien”, dit-elle.',
            dashesName: 'Tirets',
            dashesDesc: 'Convertit les tirets cadratins et demi-cadratins en traits d’union.',
            dashesAliases: ['tiret', 'tiret cadratin', 'tiret demi-cadratin', "trait d'union", 'ponctuation', 'typographie', 'ia'],
            dashesExample: 'Le résultat — contre toute attente — était bon.'
        },

        structure: {
            heading: 'Structure',
            listNestingName: 'Conserver l’imbrication des listes au collage',
            listNestingDesc: 'Colle une liste copiée avec sa hiérarchie intacte, indentée selon l’élément de liste sur lequel vous collez.',
            listNestingAliases: ['liste', 'imbriquée', 'indentation', 'hiérarchie', 'plan', 'puces', 'case', 'arborescence'],
            quoteContinuationName: 'Continuer les blocs de citation au collage',
            quoteContinuationDesc:
                'Colle un texte multiligne sur une ligne citée en citant chaque ligne, afin que tout le contenu collé reste dans le bloc de citation ou l’encadré.',
            quoteContinuationAliases: ['citation', 'bloc de citation', 'encadré', 'mise en avant', 'source', 'avertissement', 'paragraphe']
        },

        custom: {
            heading: 'Traitement personnalisé',
            pipelineName: 'Appliquer des extraits regex personnalisés au texte',
            pastedText: 'Texte collé',
            builtInRules: 'Règles intégrées',
            customSnippets: 'Extraits personnalisés',
            note: 'Note',
            wikiButton: 'Voir le wiki',
            regexButton: 'Ouvrir le testeur d’expressions régulières',
            snippetsName: 'Extraits',
            snippetsDesc: 'Ajoutez et modifiez vos extraits. Activez ceux qui doivent s’exécuter lors du collage.',
            enabledSnippetsCount: { one: '{count} extrait activé', other: '{count} extraits activés' },
            snippetRulesCount: { one: '{count} règle', other: '{count} règles' },
            invalidRulesCount: { one: '{count} ligne non valide', other: '{count} lignes non valides' },
            unnamedSnippet: 'Extrait sans nom',
            emptyState: 'Vous n’avez encore créé aucun extrait.',
            addSnippet: 'Ajouter un extrait',
            editButton: 'Modifier l’extrait',
            exportName: 'Exporter les extraits',
            exportDesc: 'Copie tous les extraits au format d’échange du wiki.',
            exportButton: 'Copier les extraits',
            importName: 'Importer des extraits',
            importDesc: 'Ajoute des extraits depuis le format d’échange du wiki.',
            previewName: 'Essayer',
            previewDesc: 'Saisissez un exemple de texte pour voir le résultat de tous les extraits activés.',
            modalPreviewDesc: 'Saisissez un exemple de texte pour voir le résultat de cet extrait.',
            previewInputLabel: 'Exemple de texte',
            previewEmpty: 'Le texte traité apparaît ici.',
            nameName: 'Nom',
            rulesName: 'Règles',
            rulesDesc: 'Saisissez un remplacement par expression régulière JavaScript sur chaque ligne.',
            wikiPasteHint: 'Copiez un extrait prêt à l’emploi depuis le wiki et collez-le directement dans le champ des règles.',
            invalidLine: 'Ligne {line} : {value}',
            saveButton: 'Enregistrer',
            recognizedSnippetsCount: { one: '{count} extrait reconnu', other: '{count} extraits reconnus' },
            recognizedRulesCount: { one: '{count} règle reconnue', other: '{count} règles reconnues' },
            unparseableName: 'Lignes non reconnues',
            importFallbackName: 'Extrait importé'
        }
    },

    imageModal: {
        title: 'Options d’image',
        sizeName: 'Taille',
        className: 'Classe CSS',
        none: 'Ne rien faire',
        apply: 'Appliquer',
        cancel: 'Annuler'
    },

    pdfModal: {
        furniture: 'Supprimer les numéros de page',
        singleParagraph: 'Tout regrouper en un seul paragraphe',
        description:
            "Les lignes coupées sont réunies, les mots coupés par un trait d'union réparés, les ligatures converties en lettres simples et les espaces superflus supprimés.",
        preview: 'Aperçu'
    },

    welcome: {
        title: 'Bienvenue dans Better Paste',
        intro: [
            'Copiez des images de Safari directement dans votre coffre, collez des liens sans paramètres de suivi, réparez les sorties de terminal aux lignes coupées et nettoyez le texte d’IA. Collez, Better Paste s’occupe du reste.',
            'Un conseil avant de commencer : associez **Coller sans traitement** à `Cmd+Shift+V` (`Ctrl+Shift+V` sous Windows) pour pouvoir toujours coller exactement le contenu du presse-papiers.',
            'Chaque règle a son propre interrupteur dans Paramètres, Better Paste, et la propriété `{property}: false` désactive le plugin pour cette note.'
        ],
        startButton: 'Commencer'
    },

    overlap: {
        title: 'Better Paste : plugins redondants',
        thanks: 'Merci d’avoir installé Better Paste et de l’utiliser !',
        intro: {
            one: 'Vous avez actuellement {count} plugin installé qui fait plus ou moins la même chose, alors désactivez ou désinstallez :',
            other: 'Vous avez actuellement {count} plugins installés qui font plus ou moins la même chose, alors désactivez ou désinstallez :'
        },
        outro: 'À désactiver dans Paramètres > Modules complémentaires.',
        dontRemind: 'Ne plus afficher ce message',
        button: 'Compris'
    },

    whatsNew: {
        title: 'Nouveautés de Better Paste',
        releaseHeading: 'Version {version} ({date})',
        categoryNew: 'Nouveau',
        categoryImproved: 'Amélioré',
        categoryChanged: 'Modifié',
        categoryFixed: 'Corrigé',
        support: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
        coffeeButton: '☕️ Offrez-moi un café',
        thanksButton: 'Merci !',
        dontShowAgain: 'Ne plus afficher après les mises à jour'
    }
};
