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
        imagesFailedNothingPasted: '{images}, donc rien n’a été collé'
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
            savingName: 'Enregistrer les images collées dans le coffre',
            savingDesc:
                'Enregistre les images collées dans votre dossier de pièces jointes et crée un lien vers le fichier local plutôt que vers l’adresse web. Concerne « Copier l’image » de Safari, les images contenues dans du contenu web copié et les adresses d’image collées. Par défaut, le nom du fichier vient de l’adresse :',
            savingAliases: [
                'télécharger',
                'pièce jointe',
                'safari',
                'capture d’écran',
                'image',
                'dossier',
                'nom de fichier',
                'largeur',
                'taille'
            ],
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
            nameFormatDesc: 'Comment les images enregistrées sont nommées.',
            nameFormatSource: 'Nom d’après la source',
            nameFormatCustom: 'Format personnalisé',
            customName: 'Format personnalisé',
            customDesc: 'Utilisez {{name}} pour le nom de la source et les formats de date Moment comme YYYY-MM-DD.',
            customMomentLink: 'Format Moment',
            customExample: 'Exemple : {value}',
            customAliases: ['nom', 'fichier', 'date', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Propriété de largeur d’image',
            sizePropertyDesc:
                'Propriété du frontmatter qui fixe la largeur des images collées dans une note. Avec "image-width: 400" dans la note, une image collée devient ![[photo.png|400]]. Laissez vide pour n’ajouter aucune largeur.',
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
            stripName: 'Quels paramètres supprimer',
            stripDesc: 'Les paramètres de suivi sont des noms comme utm_source, fbclid et gclid.',
            stripAliases: ['utm', 'suivi', 'requête', 'paramètres'],
            stripAll: 'Tous les paramètres, sauf si une règle de site les conserve',
            stripTracking: 'Uniquement les paramètres de suivi connus',
            rulesName: 'Règles de site',
            rulesDesc: 'Paramètres à conserver sur certains sites.',
            rulesCount: { one: '{count} site', other: '{count} sites' },
            listName: 'Vos règles de site',
            listDesc:
                '{sites} sont déjà pris en charge par le module. Ajoutez ici vos propres règles, une par ligne. « example.com » conserve tous les paramètres de ce site, « example.com: a, b » n’en conserve que deux, et « !example.com » retire une règle livrée avec le module. Les sous-domaines sont reconnus automatiquement.',
            listShippedCount: { one: '{count} site courant', other: '{count} sites courants' },
            listAliases: ['domaine', 'exception', 'liste blanche', 'youtube'],
            listInvalid: 'Ce n’est pas un nom de site : {values}',
            testerName: 'Essayer',
            testerDesc: 'Collez un lien pour voir ce que les règles conservent.',
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
        button: 'Compris'
    },

    whatsNew: {
        title: 'Nouveautés de Better Paste',
        scrollLabel: 'Notes de version',
        releaseHeading: 'Version {version} ({date})',
        categoryNew: 'Nouveau',
        categoryImproved: 'Amélioré',
        categoryChanged: 'Modifié',
        categoryFixed: 'Corrigé',
        support: 'Si Better Paste vous est utile, envisagez de soutenir son développement.',
        coffeeButton: '☕️ Offrez-moi un café',
        thanksButton: 'Merci !'
    }
};
